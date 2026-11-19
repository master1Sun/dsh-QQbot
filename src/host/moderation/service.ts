/**
 * AI 群规审核服务：把「消息 → 判定 → 禁言 → 日志」串起来，供消息管线与 RPC 共用。
 *
 * 触发前提（全部满足才审）：
 *  1. 该「机器人 + 群」在 moderation.json 里显式开启了 enabled；
 *  2. 发送者不在白名单、不是机器人自己、消息有文本内容；
 *  3. 机器人在该群是管理员（member_role=admin/owner）——禁言接口要求，也避免无权限群白烧模型 token。
 *
 * 管理员状态做 5 分钟内存缓存（按 appId::groupId），避免每条消息都调 bot_state 接口。
 */
import type { BotRuntime } from "../bots.js";
import { ModerationStore, MUTE_CAP_MINUTES, modKey, type ModerationConfig, type ModerationLog } from "./store.js";
import { CATEGORY_LABELS, moderateMessage, minutesForLevel, type ModerateDeps } from "./moderate.js";

const ADMIN_ROLES = new Set(["admin", "owner"]);
const ADMIN_CACHE_MS = 5 * 60_000;

/** 把分钟数写成人类可读的时长。 */
function durationText(minutes: number): string {
  if (minutes < 60) return `${minutes} 分钟`;
  if (minutes < 1440) return `${Math.round((minutes / 60) * 10) / 10} 小时`;
  return `${Math.round((minutes / 1440) * 10) / 10} 天`;
}

/**
 * 处罚前的群内 @ 通知。QQ v2 群聊「@指定成员」只支持 Markdown 消息，
 * 格式来自官方文本交互文档：<qqbot-at-user id="member_openid" />。
 * 理由/群规来自模型与用户输入，统一去掉尖括号与换行，防止注入其它交互标签。
 */
function noticeMarkdown(params: {
  sender: string;
  category: string;
  reason: string;
  rules: string[];
  minutes: number;
  baseMinutes: number;
  strikeCount: number;
  nextMinutes: number;
}): string {
  const { sender, category, reason, rules, minutes, baseMinutes, strikeCount, nextMinutes } = params;
  const clean = (value: string, max = 160) =>
    String(value ?? "").replace(/[\r\n<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, max) || "—";
  const categoryName = CATEGORY_LABELS[category] ?? "本群公约";
  const ruleText = rules.filter(Boolean).slice(0, 5)
    .map((r, i) => `${i + 1}. ${clean(r, 60)}`)
    .join(" / ") || "本群已启用的内置分类与平台公共规范";
  const at = `<qqbot-at-user id="${sender.replace(/["<>]/g, "")}" />`;
  return [
    `${at} 你刚发的消息违反了本群公约，按群规${minutes > 0 ? `将禁言 ${durationText(minutes)}` : "将收到警告"}。`,
    "",
    `> 违反类别：${categoryName}`,
    `> 判定理由：${clean(reason)}`,
    `> 依据群规：${ruleText}`,
    `> 违规次数：近 30 天第 ${strikeCount} 次（按成员独立累计，连续 30 天不违规自动清零）`,
    `> 处罚计算：${durationText(baseMinutes)} × 第 ${strikeCount} 次 = 本次 ${durationText(minutes)}（封顶 30 天）`,
    "",
    minutes > 0
      ? "禁言是为了让你暂停发言、冷静后继续参与，请及时停止违规行为。请遵守公约后再发言。"
      : "请立即停止违规行为，遵守公约后再发言。",
    "",
    nextMinutes >= MUTE_CAP_MINUTES && minutes >= MUTE_CAP_MINUTES
      ? `处罚已达上限 30 天，再犯仍按 30 天处理（连续 30 天不违规可清零重计）。请遵守公约，也请其他成员引以为戒。`
      : strikeCount > 1
        ? `因多次违规，处罚已逐次加重；再犯将升至 ${durationText(nextMinutes)}。请遵守公约，也请其他成员引以为戒。`
        : "也请其他成员注意：本群已开启 AI 自动审核，违反公约会先 @ 提醒并按情节禁言，请大家共同维护群聊环境。",
  ].join("\n");
}

export class ModerationService {
  readonly store = new ModerationStore();
  readonly #deps: ModerateDeps;
  readonly #logger: Pick<Console, "info" | "warn" | "error">;
  /** appId::groupId → { admin: boolean; at: number } */
  readonly #adminCache = new Map<string, { admin: boolean; at: number }>();

  constructor(deps: ModerateDeps, logger: Pick<Console, "info" | "warn" | "error">) {
    this.#deps = deps;
    this.#logger = logger;
  }

  /** 清缓存（设置页改了权限/切群后可调）。 */
  invalidateAdmin(appId: string, groupId: string): void {
    this.#adminCache.delete(modKey(appId, groupId));
  }

  async #isAdmin(bot: BotRuntime, groupId: string): Promise<boolean> {
    const key = modKey(bot.appId, groupId);
    const cached = this.#adminCache.get(key);
    if (cached && Date.now() - cached.at < ADMIN_CACHE_MS) return cached.admin;
    let admin = false;
    try {
      const state = await bot.client.getBotGroupState(groupId);
      admin = ADMIN_ROLES.has(state.member_role);
    } catch (error) {
      this.#logger.warn(`[dsh-qqbot] AI 审核查群管理员状态失败（${groupId.slice(0, 8)}…）:`, error instanceof Error ? error.message : error);
    }
    this.#adminCache.set(key, { admin, at: Date.now() });
    return admin;
  }

  /**
   * 审核一条群消息。返回是否「已处置」（调用方可据此决定是否继续正常回复链路）。
   * 任何异常都被吞掉并记日志——审核绝不能阻断正常消息处理。
   */
  async review(params: {
    bot: BotRuntime;
    groupId: string;
    sender: string;
    senderName: string;
    content: string;
  }): Promise<{ actioned: boolean; level: string; reason: string }> {
    const { bot, groupId, sender, senderName, content } = params;
    const noop = { actioned: false, level: "none", reason: "" };
    if (!groupId || !content.trim()) return noop;

    let cfg: ModerationConfig;
    try {
      cfg = await this.store.getConfig(bot.appId, groupId);
    } catch {
      return noop;
    }
    if (!cfg.enabled) return noop;
    if (sender && cfg.whitelist.includes(sender)) return noop;
    if (bot.selfOpenids.get(groupId) === sender) return noop; // 机器人自己发的

    // 管理员权限：没权限直接跳过（也省模型调用）。
    if (!await this.#isAdmin(bot, groupId)) return noop;

    let verdict;
    try {
      verdict = await moderateMessage(this.#deps, bot.appId, content, cfg);
    } catch (error) {
      this.#logger.warn("[dsh-qqbot] AI 审核模型调用失败:", error instanceof Error ? error.message : error);
      return noop;
    }
    if (verdict.level === "none") return noop;

    // 累进处罚：按「机器人 + 群 + 成员」独立计数，本次 = 等级基础时长 × 近 30 天第 N 次违规，
    // 封顶 30 天（平台限制）。记录按 30 天滑动窗口清零（连续 30 天无违规从 0 重计），不会无限叠加；
    // 达到封顶后继续违规仍按 30 天执行。
    const baseMinutes = minutesForLevel(cfg, verdict.level);
    const prev = sender ? await this.store.getStrike(bot.appId, groupId, sender) : undefined;
    const strikeCount = (prev?.count ?? 0) + 1;
    const minutes = Math.min(MUTE_CAP_MINUTES, baseMinutes * strikeCount);
    const nextMinutes = Math.min(MUTE_CAP_MINUTES, baseMinutes * (strikeCount + 1));
    const log: ModerationLog = {
      at: new Date().toISOString(),
      appId: bot.appId,
      groupId,
      sender,
      senderName,
      content: content.slice(0, 500),
      level: verdict.level,
      reason: verdict.reason,
      category: verdict.category,
      minutes,
      baseMinutes,
      strikeCount,
    };
    // 禁言前先在群里 @ 本人说明违规原因与处置依据，同时公开提醒其他成员。
    // 通知失败不能阻断禁言（例如机器人没开主动消息权限）。
    if (sender) {
      try {
        await bot.client.sendMarkdown({ scope: "group", openid: groupId }, noticeMarkdown({
          sender,
          category: verdict.category,
          reason: verdict.reason,
          rules: cfg.rules,
          minutes,
          baseMinutes,
          strikeCount,
          nextMinutes,
        }));
      } catch (error) {
        log.noticeError = error instanceof Error ? error.message : String(error);
        this.#logger.warn("[dsh-qqbot] AI 审核 @ 通知发送失败:", log.noticeError);
      }
    }

    if (minutes > 0 && sender) {
      try {
        await bot.client.setMemberMute(groupId, [sender], minutes);
      } catch (error) {
        log.error = error instanceof Error ? error.message : String(error);
        this.#logger.warn(`[dsh-qqbot] AI 审核命中但禁言失败（${verdict.level} ${minutes}分钟）:`, log.error);
      }
    }
    if (sender) {
      try {
        await this.store.recordStrike(bot.appId, groupId, sender, minutes, verdict.level);
      } catch (error) {
        this.#logger.warn("[dsh-qqbot] AI 审核违规次数落盘失败:", error instanceof Error ? error.message : error);
      }
    }
    try {
      await this.store.appendLog(log);
    } catch (error) {
      this.#logger.warn("[dsh-qqbot] AI 审核日志落盘失败:", error instanceof Error ? error.message : error);
    }
    this.#logger.info(
      `[dsh-qqbot] AI 审核命中：群 ${groupId.slice(0, 8)}… ${senderName || sender.slice(0, 8)} → ${verdict.level}（${verdict.category}）`
      + ` 第 ${strikeCount} 次违规`
      + (log.error ? " 禁言失败" : ` 禁言 ${minutes} 分钟`)
      + (log.noticeError ? "（@ 通知失败）" : ""),
    );
    // 不阻断正常回复链路：即使命中也返回 actioned=false，让消息照常进入会话（审核与回复解耦）。
    return { actioned: false, level: verdict.level, reason: verdict.reason };
  }

  /**
   * 规则自测：用指定配置（或已保存配置）对一段文本做一次纯判定。
   * 只调模型，不 @ 通知、不禁言、不写处罚日志与违规计数——供设置页验证自定义规则写法。
   */
  async testMessage(params: {
    appId: string;
    groupId: string;
    content: string;
    config?: ModerationConfig;
  }): Promise<{ level: string; category: string; reason: string; minutes: number; rules: string[] }> {
    const { appId, groupId, content } = params;
    if (!content.trim()) throw new Error("测试内容不能为空");
    const cfg = params.config ?? await this.store.getConfig(appId, groupId);
    const verdict = await moderateMessage(this.#deps, appId, content, cfg);
    return {
      level: verdict.level,
      category: verdict.category,
      reason: verdict.reason,
      minutes: minutesForLevel(cfg, verdict.level),
      rules: cfg.rules,
    };
  }
}
