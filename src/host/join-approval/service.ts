/**
 * 入群 AI 自动审批服务：把「读取申请 → AI 判定 → 通过的自动审批 → 日志」串起来，供 RPC 调用。
 *
 * 启用配置后由后台定时器定期自动执行（默认 5 分钟一轮），无需手动点击；
 * 默认只自动通过明显符合要求的申请，不符合 / 信息不足 / 判定失败的一律保留给人工处理，
 * 绝不自动拒绝真实用户。已处理的申请会记 ID，避免定时轮询对同一批 pending 反复审核、重复烧 token。
 */
import type { BotRuntime } from "../bots.js";
import { JoinApprovalStore, joinKey, type JoinApprovalConfig, type JoinApprovalLog } from "./store.js";
import { reviewJoinRequest, type JoinReviewDeps } from "./review.js";

export interface JoinApprovalRunResult {
  /** 本次检查的申请总数。 */
  total: number;
  /** AI 自动通过数。 */
  passed: number;
  /** 保留人工数（不符合 / 信息不足 / 风险提示 / 判定失败）。 */
  kept: number;
  /** 审批接口调用失败数。 */
  failed: number;
  /** 逐条结果明细（含昵称、理由，供界面展示；最多 30 条）。 */
  details: Array<{ username: string; action: JoinApprovalLog["action"]; reason: string }>;
}

export class JoinApprovalService {
  readonly store = new JoinApprovalStore();
  readonly #deps: JoinReviewDeps;
  readonly #logger: Pick<Console, "info" | "warn" | "error">;
  /** 防止上一轮未跑完时下一轮并发进入（LLM 调用较慢）。 */
  #autoRunning = false;

  constructor(deps: JoinReviewDeps, logger: Pick<Console, "info" | "warn" | "error">) {
    this.#deps = deps;
    this.#logger = logger;
  }

  /**
   * 启动后台定时审批：每隔 intervalMs 扫描所有已启用配置的「机器人 + 群」各跑一轮。
   * 启动 20 秒后先跑一轮（等机器人连接建立），避免刚配好要等满一个周期。
   * 返回停止函数，供插件卸载时清理定时器。
   */
  startAuto(bots: { get(appId: string): BotRuntime | undefined }, intervalMs = 5 * 60_000): () => void {
    const tick = () => {
      if (this.#autoRunning) return;
      this.#autoRunning = true;
      void (async () => {
        try {
          const groups = await this.store.listEnabledGroups();
          for (const { appId, groupId } of groups) {
            const bot = bots.get(appId);
            if (!bot || !bot.enabled) continue;
            try {
              await this.run(bot, groupId, 50);
            } catch (error) {
              this.#logger.warn(
                `[dsh-qqbot] 定时入群审批失败 ${appId.slice(0, 8)}…/${groupId.slice(0, 8)}…:`,
                error instanceof Error ? error.message : String(error),
              );
            }
          }
        } catch (error) {
          this.#logger.warn("[dsh-qqbot] 定时入群审批扫描失败:", error instanceof Error ? error.message : String(error));
        } finally {
          this.#autoRunning = false;
        }
      })();
    };
    const first = setTimeout(tick, 20_000);
    first.unref?.();
    const timer = setInterval(tick, intervalMs);
    timer.unref?.();
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }

  async getConfig(appId: string, groupId: string): Promise<JoinApprovalConfig> {
    return this.store.getConfig(appId, groupId);
  }

  async saveConfig(appId: string, groupId: string, raw: unknown): Promise<JoinApprovalConfig> {
    return this.store.setConfig(appId, groupId, raw);
  }

  /** 从申请里提取可审核的介绍文本（入群回答 + 验证问答）。 */
  static extractIntro(req: {
    verify_info?: { verify_message?: string; review_qa_list?: Array<{ question?: string; answer?: string }> };
  }): string {
    const parts: string[] = [];
    if (req.verify_info?.verify_message?.trim()) parts.push(req.verify_info.verify_message.trim());
    for (const qa of req.verify_info?.review_qa_list ?? []) {
      const q = typeof qa?.question === "string" ? qa.question.trim() : "";
      const a = typeof qa?.answer === "string" ? qa.answer.trim() : "";
      if (q || a) parts.push(`${q ? `问：${q}；` : ""}${a ? `答：${a}` : ""}`);
    }
    return parts.join(" / ").slice(0, 2000);
  }

  /** 对某个群执行一轮自动审批。 */
  async run(bot: BotRuntime, groupId: string, limit: number): Promise<JoinApprovalRunResult> {
    const result: JoinApprovalRunResult = { total: 0, passed: 0, kept: 0, failed: 0, details: [] };
    const config = await this.store.getConfig(bot.appId, groupId);
    if (!config.enabled) return result;

    const { list } = await bot.client.listJoinRequests(groupId, { cursor: "", limit });
    // 定时轮询下「保留人工」的申请会一直留在 pending 列表；跳过已处理过的，避免重复审核、重复烧 token。
    const seen = await this.store.listSeenIds(bot.appId, groupId);
    const pending = list.filter((req) => !req.join_request_id || !seen.has(req.join_request_id));
    result.total = pending.length;
    const handledIds: string[] = [];

    // 免审批名单：昵称精确命中即直接放行，跳过 AI 判断（名单在配置合并后与 AI 审批共用一份）。
    const whitelist = new Set(config.whitelist.map((w) => w.trim()).filter(Boolean));

    for (const req of pending) {
      if (req.join_request_id) handledIds.push(req.join_request_id);
      const username = typeof req.username === "string" && req.username.trim() ? req.username.trim() : req.member_openid.slice(0, 10);
      const intro = JoinApprovalService.extractIntro(req);
      const riskTips = typeof req.risk_tips === "string" ? req.risk_tips.trim() : "";
      const base = { at: new Date().toISOString(), appId: bot.appId, groupId, memberOpenid: req.member_openid, username, intro: intro.slice(0, 300) };

      // 免审批名单命中 → 直接调用官方审批接口放行，不烧模型 token。
      if (whitelist.has(username) || whitelist.has(req.member_openid)) {
        try {
          await bot.client.approveJoinRequest(groupId, req.member_openid, {
            approve: true, joinRequestId: req.join_request_id, rejectReason: "", addToBlacklist: false,
          });
          const log: JoinApprovalLog = { ...base, action: "pass", reason: "免审批名单成员，直接通过" };
          await this.store.appendLog(log);
          result.passed++;
          if (result.details.length < 30) result.details.push({ username, action: "pass", reason: log.reason });
        } catch (error) {
          const err = error instanceof Error ? error.message : String(error);
          const log: JoinApprovalLog = { ...base, action: "error", reason: "免审批名单成员，直接通过", error: err };
          await this.store.appendLog(log);
          result.failed++;
          if (result.details.length < 30) result.details.push({ username, action: "error", reason: `审批接口失败：${err}` });
        }
        continue;
      }

      // 介绍为空且未允许空介绍时，直接保留人工（不烧模型 token）。
      if (!intro && !config.allowEmpty) {
        const log: JoinApprovalLog = { ...base, action: "keep", reason: "入群介绍为空，保留人工审核" };
        await this.store.appendLog(log);
        result.kept++;
        if (result.details.length < 30) result.details.push({ username, action: "keep", reason: log.reason });
        continue;
      }

      let pass = false;
      let reason = "";
      try {
        const verdict = await reviewJoinRequest(this.#deps, bot.appId, { username, intro, riskTips, config });
        pass = verdict.pass;
        reason = verdict.reason;
      } catch (error) {
        reason = `AI 审核失败：${error instanceof Error ? error.message : String(error)}`;
        this.#logger.warn(`[dsh-qqbot] 入群 AI 审核失败（${groupId.slice(0, 8)}… ${username}）:`, reason);
      }

      if (!pass) {
        const log: JoinApprovalLog = { ...base, action: "keep", reason: reason || "不满足入群要求，保留人工审核" };
        await this.store.appendLog(log);
        result.kept++;
        if (result.details.length < 30) result.details.push({ username, action: "keep", reason: log.reason });
        continue;
      }

      // AI 判定通过 → 调用官方审批接口放行。
      try {
        await bot.client.approveJoinRequest(groupId, req.member_openid, {
          approve: true,
          joinRequestId: req.join_request_id,
          rejectReason: "",
          addToBlacklist: false,
        });
        const log: JoinApprovalLog = { ...base, action: "pass", reason: reason || "符合入群要求，AI 自动通过" };
        await this.store.appendLog(log);
        result.passed++;
        if (result.details.length < 30) result.details.push({ username, action: "pass", reason: log.reason });
      } catch (error) {
        const err = error instanceof Error ? error.message : String(error);
        const log: JoinApprovalLog = { ...base, action: "error", reason: reason || "符合入群要求", error: err };
        await this.store.appendLog(log);
        result.failed++;
        if (result.details.length < 30) result.details.push({ username, action: "error", reason: `审批接口失败：${err}` });
      }
    }

    await this.store.markSeenIds(bot.appId, groupId, handledIds);
    if (result.total > 0) {
      this.#logger.info(`[dsh-qqbot] 群 ${joinKey(bot.appId, groupId).slice(0, 20)}… 入群 AI 自动审批完成：检查 ${result.total}，通过 ${result.passed}，保留 ${result.kept}，失败 ${result.failed}`);
    }
    return result;
  }
}
