/**
 * AI 操作助手服务：把自然语言变成实际操作。
 *
 * 省 token 三层策略（用户硬要求）：
 *  1. 本地正则解析（parseLocal）——零 LLM 调用；
 *  2. 解析结果缓存——同一句话不重复调 LLM；
 *  3. LLM 只做「意图路由」——极短 system（仅当前 scope 动作表）+ 截断 200 字输入 + 紧凑 JSON 输出，
 *     且**不把聊天历史发给 LLM**（无状态分类），回复文案一律本地模板，不让模型写长文。
 */
import { createUserMessage } from "@deepseek-ai/dsh-llm";
import type { ScriptGenLlm } from "../schedule/script-gen.js";
import type { BotRuntimeManager } from "../bots.js";
import type { ModerationService } from "../moderation/service.js";
import type { JoinApprovalService } from "../join-approval/service.js";
import type { GuildModerationService } from "../guild-moderation/service.js";
import type { GuildReplyService } from "../guild-reply/service.js";
import {
  ACTION_LABELS, actionsForScope, parseLocal, parseRouterJson, resolveEntity,
  routerSystemPrompt, suggestActions,
  type AiAction, type AiChatRequest, type AiResolveContext,
} from "./catalog.js";
import { loadAiOpsLogs, saveAiOpsLogs, type AiOpsLogEntry, type AiOpsScope } from "./store.js";

export type { AiOpsLogEntry, AiOpsScope } from "./store.js";
export { aiOpsLogPath } from "./store.js";

export interface AiOpsDeps {
  getLlm: () => ScriptGenLlm | undefined;
  resolveModel: (appId?: string) => { provider: string; model: string } | undefined;
  /** 延迟取机器人管理器（装配顺序上它在本服务之后创建）。 */
  getBots: () => BotRuntimeManager;
  moderation?: ModerationService;
  joinApproval?: JoinApprovalService;
  guildModeration?: GuildModerationService;
  guildReply?: GuildReplyService;
  logger: Pick<Console, "info" | "warn" | "error">;
}

export interface AiOpsResult {
  ok: boolean;
  action?: AiAction;
  source: "local" | "llm" | "cache" | "none";
  /** 面向用户的短回复（本地模板生成，零 token）。 */
  reply: string;
  data?: unknown;
  error?: string;
  /** 本次是否调用了 LLM（前端据此显示用量提示）。 */
  usedLlm: boolean;
}

export interface AiOpsStats {
  /** 本地解析命中次数（零 token）。 */
  local: number;
  /** 缓存命中次数（零 token）。 */
  cache: number;
  /** LLM 路由调用次数（有 token）。 */
  llm: number;
  /** 解析失败次数。 */
  failed: number;
  /** 估算累计节省的 prompt token（按每次 LLM 调用约 320 token 估算）。 */
  savedTokens: number;
}

export interface AiOpsLogFilter {
  appId?: string;
  scope?: AiOpsScope;
  groupOpenid?: string;
  guildId?: string;
  limit?: number;
}

const EST_TOKENS_PER_LLM = 320;
/** 每个场景最多保留 200 条，落盘文件同样按此裁剪。 */
const LOG_CAP = 200;

const emptyStats = (): AiOpsStats => ({ local: 0, cache: 0, llm: 0, failed: 0, savedTokens: 0 });

export class AiOpsService {
  readonly #deps: AiOpsDeps;
  /** scope + 归一化文本 → 解析结果（成功才缓存），避免重复调用 LLM。 */
  readonly #parseCache = new Map<string, AiAction | null>();
  /** 用量按场景独立统计，避免群聊 / 频道面板显示同一份数字。 */
  readonly #stats: Record<AiOpsScope, AiOpsStats> = { group: emptyStats(), guild: emptyStats() };
  /** 执行记录按场景独立存放，分别对应 ai-ops-group.json / ai-ops-guild.json。 */
  readonly #logs: Record<AiOpsScope, AiOpsLogEntry[]> = { group: [], guild: [] };
  #logSeq = 0;
  #ready: Promise<void> | null = null;
  /** 落盘串行链：避免两次操作并发写同一份 JSON 互相覆盖。 */
  #writeChain: Promise<void> = Promise.resolve();

  constructor(deps: AiOpsDeps) {
    this.#deps = deps;
    void this.ready();
  }

  /** 等待两份场景日志从磁盘加载完成（构造时已启动，RPC / 记录前再 await 一次即可）。 */
  ready(): Promise<void> {
    if (!this.#ready) {
      this.#ready = Promise.all([loadAiOpsLogs("group"), loadAiOpsLogs("guild")])
        .then(([group, guild]) => {
          this.#logs.group = group;
          this.#logs.guild = guild;
          for (const row of [...group, ...guild]) this.#logSeq = Math.max(this.#logSeq, row.id || 0);
        })
        .catch((error) => {
          this.#deps.logger.warn("[dsh-qqbot] 执行记录加载失败，按空记录处理:", error instanceof Error ? error.message : error);
        });
    }
    return this.#ready;
  }

  /** 不传 scope 时返回两场景合计（兼容旧调用点）。 */
  stats(scope?: AiOpsScope): AiOpsStats {
    if (scope) return { ...this.#stats[scope] };
    const out = emptyStats();
    for (const s of Object.values(this.#stats)) {
      out.local += s.local; out.cache += s.cache; out.llm += s.llm;
      out.failed += s.failed; out.savedTokens += s.savedTokens;
    }
    return out;
  }

  /** 执行记录：只取指定场景的文件；默认最新在前，按机器人 / 群 / 频道过滤。 */
  logs(filter: AiOpsLogFilter = {}): AiOpsLogEntry[] {
    const limit = Math.max(1, Math.min(filter.limit ?? 50, LOG_CAP));
    const scopes: AiOpsScope[] = filter.scope ? [filter.scope] : ["group", "guild"];
    const rows = scopes.flatMap((scope) => this.#logs[scope]).filter((row) =>
      (!filter.appId || row.appId === filter.appId)
      && (!filter.groupOpenid || row.groupOpenid === filter.groupOpenid)
      && (!filter.guildId || row.guildId === filter.guildId));
    rows.sort((a, b) => b.id - a.id);
    return rows.slice(0, limit);
  }

  /** 智能建议：纯本地、零 token、零 RPC。 */
  suggest(ctx: AiResolveContext): string[] { return suggestActions(ctx); }

  /** 能力清单（本地模板，help 动作与兜底都用它）。 */
  private helpText(scope: AiResolveContext["scope"]): string {
    const lines = actionsForScope(scope).map(([code, desc]) => `· ${code} — ${desc}`);
    return [`我能做这些（直接说人话即可）：`, ...lines, "· help — 列出我能做的操作"].join("\n");
  }

  async chat(req: AiChatRequest): Promise<AiOpsResult> {
    await this.ready();
    const out = await this.#chat(req);
    await this.#record(req, out);
    return out;
  }

  /** 每一次调用都留痕：聊天原话 + 解析来源 + 执行动作 + 结果，写入该场景专属 JSON。 */
  async #record(req: AiChatRequest, out: AiOpsResult): Promise<void> {
    const scope: AiOpsScope = req.scope === "guild" ? "guild" : "group";
    const rows = this.#logs[scope];
    rows.push({
      id: ++this.#logSeq,
      at: new Date().toISOString(),
      appId: req.appId,
      scope,
      ...(req.groupOpenid ? { groupOpenid: req.groupOpenid } : {}),
      ...(req.guildId ? { guildId: req.guildId } : {}),
      ...(req.channelId ? { channelId: req.channelId } : {}),
      text: req.text,
      ...(out.action ? { action: out.action.a, actionLabel: ACTION_LABELS[out.action.a] ?? out.action.a } : {}),
      ok: out.ok,
      source: out.source,
      reply: out.reply,
      ...(out.error ? { error: out.error } : {}),
      usedLlm: out.usedLlm,
    });
    if (rows.length > LOG_CAP) rows.splice(0, rows.length - LOG_CAP);
    const snapshot = [...rows];
    this.#writeChain = this.#writeChain
      .then(() => saveAiOpsLogs(scope, snapshot))
      .catch((error) => {
        this.#deps.logger.warn("[dsh-qqbot] 执行记录落盘失败:", error instanceof Error ? error.message : error);
      });
    await this.#writeChain;
  }

  async #chat(req: AiChatRequest): Promise<AiOpsResult> {
    const text = String(req.text ?? "").trim();
    if (!text) return { ok: false, source: "none", reply: "请先输入指令。", usedLlm: false };

    // ── 第 1 层：本地解析 ────────────────────────────────────────────────────
    let action = parseLocal(text, req.scope);
    let source: AiOpsResult["source"] = "local";

    // ── 第 2 层：缓存 ────────────────────────────────────────────────────────
    const cacheKey = `${req.scope}\u0000${text.toLowerCase().replace(/\s+/g, "")}`;
    if (!action && this.#parseCache.has(cacheKey)) {
      action = this.#parseCache.get(cacheKey) ?? null;
      source = "cache";
    }

    // ── 第 3 层：LLM 路由（唯一一次模型调用） ─────────────────────────────────
    if (!action) {
      const routed = await this.#routeByLlm(req.appId, req.scope, text);
      action = routed;
      source = routed ? "llm" : "none";
      this.#parseCache.set(cacheKey, action);
      if (this.#parseCache.size > 300) this.#parseCache.delete(this.#parseCache.keys().next().value!);
    }

    // 统计（按群聊 / 频道分开计，面板各自显示自己的用量）
    const stats = this.#stats[req.scope === "guild" ? "guild" : "group"];
    if (source === "local") stats.local += 1;
    else if (source === "cache") { stats.cache += 1; stats.savedTokens += EST_TOKENS_PER_LLM; }
    else if (source === "llm") stats.llm += 1;
    if (!action) stats.failed += 1;

    if (!action) return {
      ok: false, source, usedLlm: source === "llm",
      reply: `没理解「${text.slice(0, 40)}」。\n${this.helpText(req.scope)}`,
    };
    if (action.a === "help") {
      return { ok: true, action, source, usedLlm: source === "llm", reply: this.helpText(req.scope) };
    }

    try {
      const out = await this.#execute(req, action);
      return { ok: out.ok, action, source, usedLlm: source === "llm", reply: out.reply, data: out.data, error: out.error };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.#deps.logger.warn("[dsh-qqbot] AI 操作执行失败:", msg);
      return {
        ok: false, action, source, usedLlm: source === "llm",
        reply: `执行「${ACTION_LABELS[action.a] ?? action.a}」失败：${friendlyError(msg)}`,
        error: msg,
      };
    }
  }

  /** 唯一的 LLM 调用：无状态、短 system、短输入、紧凑 JSON。失败返回 null 走本地兜底。 */
  async #routeByLlm(appId: string, scope: AiResolveContext["scope"], text: string): Promise<AiAction | null> {
    const llm = this.#deps.getLlm();
    if (!llm || typeof llm.stream !== "function") return null;
    const sel = this.#deps.resolveModel(appId);
    if (!sel) return null;
    try {
      const stream = llm.stream({
        provider: sel.provider,
        model: sel.model,
        system: routerSystemPrompt(scope),
        messages: [createUserMessage({
          content: [{ type: "text", text: text.slice(0, 200) }],
          source: { kind: "user" },
        })],
        temperature: 0,
      });
      let out = "";
      for await (const chunk of stream) {
        if (chunk.type === "text-delta") out += chunk.text ?? "";
        if (out.length > 500) break; // 防御：路由输出不该很长
      }
      return parseRouterJson(out, scope);
    } catch (error) {
      this.#deps.logger.warn("[dsh-qqbot] AI 意图路由失败，回退本地提示:", error instanceof Error ? error.message : error);
      return null;
    }
  }

  /** 执行意图：全部复用 QqApiClient / AI 服务 store，不新增 OpenAPI 逻辑。 */
  async #execute(req: AiChatRequest, action: AiAction): Promise<{ ok: boolean; reply: string; data?: unknown; error?: string }> {
    const { getBots, moderation, joinApproval, guildModeration, guildReply } = this.#deps;
    const bots = getBots();
    const bot = (req.appId ? bots.get(req.appId) : undefined) ?? bots.primary();
    if (!bot) return { ok: false, reply: "没有可用的机器人，请先在「连接与移除」里添加。" };
    const client = bot.client;
    const label = ACTION_LABELS[action.a] ?? action.a;

    // ── 群聊管理 ────────────────────────────────────────────────────────────
    if (action.a === "g.info") {
      if (!req.groupOpenid) return this.#needTarget();
      const info = await client.getGroupInfo(req.groupOpenid) as unknown as Record<string, unknown>;
      const name = str(info.group_name ?? info.name);
      const count = info.group_member_num ?? info.member_num ?? info.memberNum;
      return { ok: true, reply: name ? `群「${name}」${count != null ? `，成员 ${count} 人` : ""}。` : "已读取群资料，但未返回群名。", data: info };
    }
    if (action.a === "g.members") {
      if (!req.groupOpenid) return this.#needTarget();
      const { members } = await client.listGroupMembers(req.groupOpenid, "");
      const preview = members.slice(0, 12).map((m) => str((m as any).username ?? (m as any).nickname)).filter(Boolean).join("、");
      return { ok: true, reply: `本群共 ${members.length} 名成员${preview ? `：${preview}${members.length > 12 ? "…" : ""}` : ""}。`, data: { members } };
    }
    if (action.a === "g.mute" || action.a === "g.unmute") {
      if (!req.groupOpenid) return this.#needTarget();
      const target = resolveEntity(action.who, req.entities, ["member"]);
      if (!target) return this.#needResolve("成员");
      const minutes = action.a === "g.unmute" ? 0 : (action.min ?? 10);
      await client.setMemberMute(req.groupOpenid, [target.id], minutes);
      return { ok: true, reply: minutes > 0
        ? `已禁言「${target.name}」${minutes} 分钟。` : `已解除「${target.name}」的禁言。` };
    }
    if (action.a === "g.muteAll") {
      if (!req.groupOpenid) return this.#needTarget();
      const minutes = Math.max(0, action.min ?? 10);
      const { affected } = await client.setGlobalMute(req.groupOpenid, minutes);
      return { ok: true, reply: minutes > 0
        ? `已对全群 ${affected} 名成员禁言 ${minutes} 分钟。`
        : `已解除全群 ${affected} 名成员的禁言。` };
    }
    if (action.a === "g.kick") {
      if (!req.groupOpenid) return this.#needTarget();
      const target = resolveEntity(action.who, req.entities, ["member"]);
      if (!target) return this.#needResolve("成员");
      await client.batchRemoveMembers(req.groupOpenid, [target.id]);
      return { ok: true, reply: `已移出「${target.name}」。` };
    }
    if (action.a === "g.black" || action.a === "g.unblack") {
      if (!req.groupOpenid) return this.#needTarget();
      const target = resolveEntity(action.who, req.entities, ["member"]);
      if (!target) return this.#needResolve("成员");
      const op = action.a === "g.black" ? "add" : "del";
      const fail = await client.modifyBlacklist(req.groupOpenid, op, [target.id]);
      const bad = Array.isArray(fail) && fail.length > 0;
      return { ok: !bad, reply: bad ? `黑名单操作未完全成功（${fail.length} 项失败），请检查管理员权限。` : `已${op === "add" ? "加入" : "移出"}黑名单：${target.name}。` };
    }
    if (action.a === "g.join") {
      if (!req.groupOpenid) return this.#needTarget();
      const res = await client.listJoinRequests(req.groupOpenid, { limit: 20 });
      const list = res.list;
      return { ok: true, reply: `当前有 ${(list as unknown[]).length} 条待审批的入群申请。`, data: res };
    }
    if (action.a === "g.approve") {
      if (!req.groupOpenid) return this.#needTarget();
      const target = resolveEntity(action.who, req.entities, ["member"]);
      if (!target) return this.#needResolve("申请成员");
      await client.approveJoinRequest(req.groupOpenid, target.id, { approve: action.pass === true });
      return { ok: true, reply: `已${action.pass === true ? "通过" : "拒绝"}「${target.name}」的入群申请。` };
    }
    if (action.a === "g.send") {
      if (!req.groupOpenid) return this.#needTarget();
      if (!action.text) return { ok: false, reply: "请告诉我消息内容，例如：发消息 大家好" };
      await client.sendText({ scope: "group", openid: req.groupOpenid }, action.text);
      return { ok: true, reply: `已发送到本群：${action.text.slice(0, 40)}${action.text.length > 40 ? "…" : ""}` };
    }
    if (action.a === "g.modOn" || action.a === "g.modOff") {
      if (!req.groupOpenid || !moderation) return this.#needService("AI 群规审核");
      const cfg = await moderation.store.getConfig(bot.appId, req.groupOpenid);
      const enabled = action.a === "g.modOn";
      await moderation.store.setConfig(bot.appId, req.groupOpenid, { ...cfg, enabled });
      moderation.invalidateAdmin(bot.appId, req.groupOpenid);
      return { ok: true, reply: `已${enabled ? "开启" : "关闭"}本群 AI 群规审核。` };
    }
    if (action.a === "g.autoOn" || action.a === "g.autoOff") {
      if (!req.groupOpenid || !joinApproval) return this.#needService("入群自动审批");
      const cfg = await joinApproval.getConfig(bot.appId, req.groupOpenid);
      const enabled = action.a === "g.autoOn";
      await joinApproval.saveConfig(bot.appId, req.groupOpenid, { ...cfg, enabled });
      return { ok: true, reply: `已${enabled ? "开启" : "关闭"}本群入群自动审批。` };
    }
    if (action.a === "g.logs") {
      if (!moderation) return this.#needService("AI 群规审核");
      // 与其它 g.* 一致要求明确群上下文：否则 listLogs 不过滤 groupId，会跨群汇总处罚记录。
      if (!req.groupOpenid) return this.#needTarget();
      const logs = await moderation.store.listLogs({ appId: bot.appId, groupId: req.groupOpenid, limit: 30 });
      return { ok: true, reply: `本群最近有 ${logs.length} 条审核/处罚记录。`, data: { logs } };
    }

    // ── 频道管理 ────────────────────────────────────────────────────────────
    if (action.a === "c.info") {
      if (!req.guildId) return this.#needTarget();
      const info = await client.getGuild(req.guildId);
      return { ok: true, reply: info?.name ? `频道「${str(info.name)}」，成员 ${str(info.member_count ?? "?")} 人。` : "已读取频道详情。", data: info };
    }
    if (action.a === "c.channels") {
      if (!req.guildId) return this.#needTarget();
      const list = await client.listGuildChannels(req.guildId);
      const arr = Array.isArray(list) ? list : [];
      const preview = arr.slice(0, 12).map((c: any) => str(c.name)).filter(Boolean).join("、");
      return { ok: true, reply: `该频道有 ${arr.length} 个子频道${preview ? `：${preview}${arr.length > 12 ? "…" : ""}` : ""}。`, data: { channels: arr } };
    }
    if (action.a === "c.members") {
      if (!req.guildId) return this.#needTarget();
      const { members } = await client.listGuildMembers(req.guildId, { limit: 100 });
      return { ok: true, reply: `已读取 ${members.length} 名频道成员。`, data: { members } };
    }
    if (action.a === "c.roles") {
      if (!req.guildId) return this.#needTarget();
      const roles = await client.listGuildRoles(req.guildId);
      return { ok: true, reply: `该频道有 ${roles.length} 个身份组。`, data: { roles } };
    }
    if (action.a === "c.createCh") {
      if (!req.guildId) return this.#needTarget();
      if (!action.text) return { ok: false, reply: "请告诉我子频道名字，例如：创建子频道 公告" };
      await client.createGuildChannel(req.guildId, { name: action.text, type: action.type ?? 0 } as any);
      return { ok: true, reply: `已创建子频道「${action.text}」。` };
    }
    if (action.a === "c.delCh") {
      if (!action.who) return { ok: false, reply: "请告诉要删除的子频道名字或 ID。" };
      const target = resolveEntity(action.who, req.entities, ["channel"]) ?? { id: action.who, name: action.who };
      await client.deleteGuildChannel(target.id);
      return { ok: true, reply: `已删除子频道「${target.name}」。` };
    }
    if (action.a === "c.send") {
      const channelId = action.id || req.channelId || req.entities.find((e) => e.kind === "channel")?.id;
      if (!channelId) return { ok: false, reply: "请先在「发消息」里选择子频道，或告诉我子频道名字。" };
      if (!action.text) return { ok: false, reply: "请告诉我消息内容，例如：发送频道消息 大家好" };
      await client.sendChannelMessage(channelId, action.text);
      return { ok: true, reply: `已发送到子频道：${action.text.slice(0, 40)}${action.text.length > 40 ? "…" : ""}` };
    }
    if (action.a === "c.muteAll") {
      if (!req.guildId) return this.#needTarget();
      const minutes = Math.max(0, action.min ?? 10);
      await client.muteGuildAll(req.guildId, minutes);
      return { ok: true, reply: minutes > 0 ? `已对全频道禁言 ${minutes} 分钟。` : "已解除全频道禁言。" };
    }
    if (action.a === "c.mute" || action.a === "c.unmute") {
      if (!req.guildId) return this.#needTarget();
      const target = resolveEntity(action.who, req.entities, ["member"]);
      if (!target) return this.#needResolve("频道成员");
      const minutes = action.a === "c.unmute" ? 0 : (action.min ?? 10);
      await client.muteGuildMember(req.guildId, target.id, minutes);
      return { ok: true, reply: minutes > 0 ? `已禁言「${target.name}」${minutes} 分钟。` : `已解除「${target.name}」的禁言。` };
    }
    if (action.a === "c.kick") {
      if (!req.guildId) return this.#needTarget();
      const target = resolveEntity(action.who, req.entities, ["member"]);
      if (!target) return this.#needResolve("频道成员");
      await client.deleteGuildMember(req.guildId, target.id);
      return { ok: true, reply: `已移出「${target.name}」。` };
    }
    if (action.a === "c.recall") {
      const id = action.id ?? action.who;
      if (!id || !req.channelId) return { ok: false, reply: "请先在「内容管理」里选择子频道，并提供消息 ID。" };
      await client.deleteGuildMessage(req.channelId, id);
      return { ok: true, reply: `已撤回消息 ${id.slice(0, 12)}…` };
    }
    if (action.a === "c.modOn" || action.a === "c.modOff") {
      if (!req.guildId || !guildModeration) return this.#needService("频道 AI 接管");
      const cfg = await guildModeration.store.getConfig(bot.appId, req.guildId);
      const enabled = action.a === "c.modOn";
      await guildModeration.store.setConfig(bot.appId, req.guildId, { ...cfg, enabled });
      return { ok: true, reply: `已${enabled ? "开启" : "关闭"}该频道 AI 接管。` };
    }
    if (action.a === "c.replyOn" || action.a === "c.replyOff") {
      if (!req.guildId || !guildReply) return this.#needService("频道 AI 自动回帖");
      const cfg = await guildReply.store.getConfig(bot.appId, req.guildId);
      const enabled = action.a === "c.replyOn";
      await guildReply.store.setConfig(bot.appId, req.guildId, { ...cfg, enabled });
      return { ok: true, reply: `已${enabled ? "开启" : "关闭"}该频道 AI 自动回帖。` };
    }
    if (action.a === "c.logs") {
      if (!guildModeration) return this.#needService("频道 AI 接管");
      const logs = await guildModeration.store.listLogs({ appId: bot.appId, guildId: req.guildId, limit: 30 });
      return { ok: true, reply: `最近有 ${logs.length} 条频道 AI 记录。`, data: { logs } };
    }

    return { ok: false, reply: `动作「${label}」暂未实现。输入 help 查看可用操作。` };
  }

  // 本地模板提示（零 token）
  #needTarget(): { ok: false; reply: string } {
    return { ok: false, reply: "请先在对应标签里选择群 / 频道，我才知道操作哪一个。" };
  }
  #needResolve(kind: string): { ok: false; reply: string } {
    return { ok: false, reply: `没找到这位${kind}。请先在对应标签点「加载成员」，再说出TA的名字或 openid。` };
  }
  #needService(name: string): { ok: false; reply: string } {
    return { ok: false, reply: `${name}服务不可用，请确认已配置模型并重启 dsh web。` };
  }
}

const str = (v: unknown): string => (typeof v === "string" ? v : typeof v === "number" ? String(v) : "");

function friendlyError(msg: string): string {
  if (/11253|40012010|no.?permission|权限/i.test(msg)) return "机器人没有该操作的接口权限，请在 QQ 开发者中心开通或检查管理员身份。";
  if (/network|timeout|ETIMEDOUT|ECONN/i.test(msg)) return "网络请求失败或超时，请稍后重试。";
  return msg.slice(0, 160);
}
