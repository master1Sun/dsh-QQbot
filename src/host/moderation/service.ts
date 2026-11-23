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
import { ModerationStore, modKey, type ModerationConfig, type ModerationLog } from "./store.js";
import {
  CATEGORY_DEFS, CATEGORY_LABELS, moderateMessage, minutesForLevel,
  type ModerateDeps, type ModerationVerdict, type ModerationContext,
} from "./moderate.js";
import { escalateDuration } from "../../shared/moderation-escalation.js";

const ADMIN_ROLES = new Set(["admin", "owner"]);
const ADMIN_CACHE_MS = 5 * 60_000;
// ADMIN_ROLES 仅用于判断机器人自身是否群管理员（禁言接口权限）；不区分违规发送者角色。
/** 刷屏窗口：10 秒内 ≥ 6 条视为高频刷屏；30 秒内同内容 ≥ 4 条视为重复刷屏。 */
const FLOOD_WINDOW_MS = 60_000;
const FLOOD_FAST_MS = 10_000;
const FLOOD_FAST_COUNT = 6;
const FLOOD_REPEAT_MS = 30_000;
const FLOOD_REPEAT_COUNT = 4;
/** 同一成员刷屏被处置后的冷却期：期间持续阻断回复，但不重复 @/禁言/累计计数。 */
const FLOOD_PUNISH_COOLDOWN_MS = 60_000;

/** 把分钟数写成人类可读的时长。 */
function durationText(minutes: number): string {
  if (minutes < 60) return `${minutes} 分钟`;
  if (minutes < 1440) return `${Math.round((minutes / 60) * 10) / 10} 小时`;
  return `${Math.round((minutes / 1440) * 10) / 10} 天`;
}

/**
 * 处置成功后的群内 @ 通知。QQ v2 群聊「@指定成员」只支持 Markdown 消息，
 * 格式来自官方文本交互文档：<qqbot-at-user id="member_openid" />。
 *
 * 采用带标签的回执格式（违反类别 / 判定理由 / 依据群规 / 违规次数 / 处罚计算），
 * 每一项都写「判断结果」，不写审核原则、判定尺度、等级定义这类「判断方式」：
 *  - 违反类别：命中的分类名；
 *  - 判定理由：这条消息具体哪里不合适（模型输出，已约束就事论事）；
 *  - 依据群规：命中的那一条约定原文——绝不能是审核原则（parseVerdict 已做白名单校验）；
 *  - 违规次数：窗口期内第几次；
 *  - 处罚计算：本次时长与是否加重，不罗列基础/上限等内部系数。
 * 语气平静笃定、按群规一视同仁，立住管理权威；不自曝弱点、不当众道歉。
 * 理由/群规来自模型与用户输入，统一去掉尖括号与换行，防止注入其它交互标签。
 */
function noticeMarkdown(params: {
  sender: string;
  category: string;
  reason: string;
  /** 命中的那一条约定（模型给出或行为检测给出，已做白名单校验）；只显示这一条。 */
  rule: string;
  minutes: number;
  strikeCount: number;
  windowDays: number;
  escalateOn: boolean;
  /** 近窗口内的历史违规记录（不含本次）；有多条时公示最近 5 条。 */
  history?: ModerationLog[];
}): string {
  const { sender, category, reason, rule, minutes, strikeCount, windowDays, escalateOn, history = [] } = params;
  const clean = (value: string, max = 160) =>
    String(value ?? "").replace(/[\r\n<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, max) || "—";
  const categoryName = CATEGORY_LABELS[category] ?? "本群公约";
  const ruleText = clean(rule || categoryName, 120);
  const penalty = minutes > 0
    ? `本次禁言 ${durationText(minutes)}${escalateOn && strikeCount > 1 ? "，重复违规已加重" : ""}`
    : "本次仅提醒，暂不禁言";
  const at = `<qqbot-at-user id="${sender.replace(/["<>]/g, "")}" />`;
  const lines = [
    `${at} 这条消息不符合群公约，${minutes > 0 ? `按群规禁言 ${durationText(minutes)}，冷静一下再接着聊` : "这次先提醒一下，请留意"}。`,
    "",
    `> 违反类别：${categoryName}`,
    `> 判定理由：${clean(reason)}`,
    `> 依据群规：${ruleText}`,
    `> 违规次数：近 ${windowDays} 天第 ${strikeCount} 次`,
    `> 处罚计算：${penalty}`,
  ];
  // 多次违规：把最近 5 条历史记录一并公示，反复提醒。
  if (history.length) {
    lines.push("", `这是近 ${windowDays} 天第 ${strikeCount} 次违规，近期记录一并公示：`, ...historyLines(history));
  }
  lines.push(
    "",
    escalateOn
      ? "本群对违反公约的消息一律按群规处理，反复违反会逐次加重。请大家遵守约定，一起维护群聊氛围。"
      : "本群对违反公约的消息一律按群规处理。请大家遵守约定，一起维护群聊氛围。",
  );
  return lines.join("\n");
}

/** 处罚日志的 at 是 UTC ISO，转成北京时间 MM-DD HH:mm 给群里看。 */
function logStamp(at: string): string {
  const t = Date.parse(at);
  if (!Number.isFinite(t)) return "—";
  const d = new Date(t + 8 * 3600_000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}

/** 违规历史公示行：最近 5 条，最多 5 条（本次日志在通知后才落盘，不含本次）。 */
function historyLines(history: ModerationLog[]): string[] {
  const clean = (value: string, max = 40) =>
    String(value ?? "").replace(/[\r\n<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, max) || "不符合群公约";
  return history.slice(0, 5).map((item) => {
    const category = CATEGORY_LABELS[item.category] ?? "本群公约";
    const duration = item.minutes > 0 ? `禁言 ${durationText(item.minutes)}` : "提醒";
    return `> ${logStamp(item.at)} · ${category} · ${duration} · ${clean(item.reason)}`;
  });
}

/**
 * 禁言未成功时的群内回执：平台不允许禁言管理员/群主/机器人，
 * 就把该成员近 30 天的违规记录公示给群里，反复提醒以身作则——
 * 对管理者的要求应当高于普通成员。具体报错仍只写后台日志。
 */
function warningMarkdown(params: {
  sender: string;
  strikeCount: number;
  windowDays: number;
  history: ModerationLog[];
}): string {
  const { sender, strikeCount, windowDays, history } = params;
  const at = `<qqbot-at-user id="${sender.replace(/["<>]/g, "")}" />`;
  const lines = [
    `${at} 群规对所有人一视同仁，管理员更应以身作则，不要知法犯法。`,
    history.length
      ? `这是你近 ${windowDays} 天第 ${strikeCount} 次违规，过往记录一并公示：`
      : `这是你近 ${windowDays} 天第 ${strikeCount} 次违规，请以此为戒：`,
    "",
  ];
  if (history.length) {
    lines.push(...historyLines(history));
  } else {
    lines.push(`> 本次是近 ${windowDays} 天的第 1 次记录。`);
  }
  lines.push("", "请以身作则，给群里做个好样子。");
  return lines.join("\n");
}

export class ModerationService {
  readonly store = new ModerationStore();
  readonly #deps: ModerateDeps;
  readonly #logger: Pick<Console, "info" | "warn" | "error">;
  /** appId::groupId → { admin: boolean; at: number }（机器人自身是否管理员） */
  readonly #adminCache = new Map<string, { admin: boolean; at: number }>();
  /** appId::groupId::sender → 最近消息（刷屏行为检测，纯内存滑动窗口）。 */
  readonly #floodWindows = new Map<string, Array<{ at: number; id: string; norm: string }>>();
  /** appId::groupId::sender → 上次刷屏处置时间（冷却期内只阻断回复，不重复处罚）。 */
  readonly #floodPunished = new Map<string, number>();

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
   * 本地预筛：只对「本地能 100% 确定、绝不会误伤」的违规直接出判定，跳过模型调用省 token。
   * 目前只覆盖一类：自定义规则里的极短精确词（如「1」「+1」「皮皮涛」）——整条消息
   * 归一化后正好等于该词才命中。单条看像正常内容的短词，模型最容易判 none，本地整条
   * 匹配反而又准又省；不做到处的子串匹配（避免「1楼」「版本1」误伤）。
   * 语义类违规（辱骂/广告/色情/违法）本地判不准，一律返回 null 走 AI（带上下文）。
   */
  #localVerdict(content: string, cfg: ModerationConfig): ModerationVerdict | null {
    const norm = (s: string) => s.replace(/\s+/g, "").toLowerCase();
    const msg = norm(content);
    if (!msg) return null;
    // ① 自定义规则里的极短精确词：整条消息 == 规则词才命中（不做到处的子串匹配，避免「1楼」误伤）。
    for (const raw of cfg.rules) {
      const word = norm(raw);
      if (!word || word.length > 12) continue; // 长规则是自然语言，交给模型按语境判断
      if (msg === word) {
        // 精确整条命中禁词，情节最轻：取该等级范围的下限。
        return { level: "light", category: "custom", reason: `消息内容命中本群禁止词「${raw}」`, rule: raw, systemSeverity: 0 };
      }
    }
    return null;
  }

  /**
   * 刷屏/骚扰行为检测：模型只看单条消息，识别不出「短时间内连发/重复灌水」，
   * 这里在消息进审核前按滑动窗口做本地判定，命中直接走统一处置链路。
   * 返回 true 表示已处置或处于冷却期（调用方应阻断后续回复）。
   */
  async observe(params: {
    bot: BotRuntime;
    groupId: string;
    sender: string;
    senderName: string;
    content: string;
    messageId?: string;
  }): Promise<boolean> {
    const { bot, groupId, sender, senderName, content, messageId } = params;
    // sender 为空时不判刷屏：无法禁言、且会把不同人归到同一窗口 key 互相连累。
    if (!groupId || !sender || !content.trim()) return false;
    let cfg: ModerationConfig;
    try {
      cfg = await this.store.getConfig(bot.appId, groupId);
    } catch {
      return false;
    }
    // 只有显式开启审核、且启用了「刷屏骚扰」分类时才做行为检测；白名单/机器人自己/无管理员权限同样跳过。
    if (!cfg.enabled || !cfg.categories.includes("flood")) return false;
    if (cfg.whitelist.includes(sender)) return false;
    if (bot.selfOpenids.get(groupId) === sender) return false;
    if (!await this.#isAdmin(bot, groupId)) return false;

    // #floodCheck 是同步的；命中后「检查冷却 → 占位 → await 处置」必须一气呵成，
    // 两个并发的孪生事件才会有一个真正处置，另一个直接复用冷却占位（JS 单线程下无竞态）。
    const verdict = this.#floodCheck(bot.appId, groupId, sender, content, messageId);
    if (!verdict) return false;
    const punishKey = `${modKey(bot.appId, groupId)}::${sender}`;
    const lastPunished = this.#floodPunished.get(punishKey) ?? 0;
    if (Date.now() - lastPunished < FLOOD_PUNISH_COOLDOWN_MS) return true; // 冷却期内仍阻断回复，但不再重复处罚
    this.#floodPunished.set(punishKey, Date.now()); // 同步占位，先于任何 await
    if (this.#floodPunished.size > 3000) {
      const cutoff = Date.now() - FLOOD_PUNISH_COOLDOWN_MS;
      for (const [k, v] of this.#floodPunished) if (v < cutoff) this.#floodPunished.delete(k);
    }
    try {
      await this.#dispose({ bot, groupId, sender, senderName, content, messageId, cfg, verdict, source: "behavior" });
    } catch (error) {
      this.#logger.warn("[dsh-qqbot] AI 审核刷屏处置异常:", error instanceof Error ? error.message : error);
    }
    return true;
  }

  /** 纯同步滑动窗口：高频连发或短时间重复同一内容即判刷屏，命中返回可直接处置的判定。 */
  #floodCheck(appId: string, groupId: string, sender: string, content: string, messageId?: string): ModerationVerdict | null {
    const key = `${modKey(appId, groupId)}::${sender || "?"}`;
    const now = Date.now();
    const norm = content.replace(/\s+/g, "").toLowerCase();
    // 窗口里记 (时间, 去重键)：消息 id 缺失时用「发送者+规范化内容+时间」近似，避免孪生事件重复计数。
    const id = messageId || `${sender}:${norm.slice(0, 80)}:${now}`;
    const arr = this.#floodWindows.get(key) ?? [];
    const cutoff = now - FLOOD_WINDOW_MS;
    const recent = arr.filter((x) => x.at >= cutoff);
    // 重推的同一条消息：只保留原记录，不再追加（否则孪生事件会被算成两条刷屏）。
    if (!recent.some((x) => x.id === id)) recent.push({ at: now, id, norm });
    this.#floodWindows.set(key, recent);
    // 容量淘汰：先删已过期的，仍超限则按 last.at 从旧到新淘汰（活跃群也能回收）。
    if (this.#floodWindows.size > 3000) {
      for (const [k, v] of this.#floodWindows) if (!v.length || v[v.length - 1]!.at < cutoff) this.#floodWindows.delete(k);
      if (this.#floodWindows.size > 3000) {
        const byAge = [...this.#floodWindows.entries()]
          .sort((a, b) => (a[1][a[1].length - 1]?.at ?? 0) - (b[1][b[1].length - 1]?.at ?? 0));
        for (const [k] of byAge.slice(0, this.#floodWindows.size - 3000)) this.#floodWindows.delete(k);
      }
    }

    const fast = recent.filter((x) => x.at >= now - FLOOD_FAST_MS).length;
    if (fast >= FLOOD_FAST_COUNT) {
      return {
        level: "light", category: "flood",
        reason: `${FLOOD_FAST_MS / 1000} 秒内连续发送 ${fast} 条消息，构成刷屏`,
        rule: CATEGORY_DEFS.flood || "刷屏骚扰",
        // 刷得越多越靠近范围上限：6 条=下限，12 条及以上=上限。
        systemSeverity: Math.min(1, (fast - FLOOD_FAST_COUNT) / 6),
      };
    }
    const repeats = norm ? recent.filter((x) => x.at >= now - FLOOD_REPEAT_MS && x.norm === norm).length : 0;
    if (norm && repeats >= FLOOD_REPEAT_COUNT) {
      return {
        level: "light", category: "flood",
        reason: `${FLOOD_REPEAT_MS / 1000} 秒内重复发送「${norm.slice(0, 20)}」${repeats} 次，构成灌水`,
        rule: CATEGORY_DEFS.flood || "刷屏骚扰",
        systemSeverity: Math.min(1, (repeats - FLOOD_REPEAT_COUNT) / 6),
      };
    }
    return null;
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
    /** 违规消息的 msg_id；提供时命中违规会先撤回原消息再处置。 */
    messageId?: string;
    /** 对话语境（前文群聊 + 被引用的原话），帮模型分辨玩笑/互怼/引用与真违规。 */
    context?: ModerationContext;
  }): Promise<{ actioned: boolean; level: string; reason: string }> {
    const { bot, groupId, sender, senderName, content, messageId, context } = params;
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

    // 本地能确定的违规直接处置，不调模型（省 token）；拿不准的才走下面的 AI 审核。
    const local = this.#localVerdict(content, cfg);
    if (local) {
      return this.#dispose({ bot, groupId, sender, senderName, content, messageId, cfg, verdict: local, source: "local" });
    }

    let verdict;
    try {
      verdict = await moderateMessage(this.#deps, bot.appId, content, cfg, context);
    } catch (error) {
      this.#logger.warn("[dsh-qqbot] AI 审核模型调用失败:", error instanceof Error ? error.message : error);
      return noop;
    }
    if (verdict.level === "none") return noop;
    return this.#dispose({ bot, groupId, sender, senderName, content, messageId, cfg, verdict, source: "llm" });
  }

  /**
   * 命中后的统一处置：撤回 → 禁言 → 按禁言结果发群回执 → 累计违规与落日志。
   * 所有违规成员一视同仁：不区分管理员/群主/普通成员，命中即走完整处置。
   * 平台禁止禁言某角色（管理员/群主/机器人）时，群里只发警告，具体报错仅记后台日志。
   */
  async #dispose(params: {
    bot: BotRuntime;
    groupId: string;
    sender: string;
    senderName: string;
    content: string;
    messageId?: string;
    cfg: ModerationConfig;
    verdict: ModerationVerdict;
    source: "llm" | "behavior" | "local";
  }): Promise<{ actioned: boolean; level: string; reason: string }> {
    const { bot, groupId, sender, senderName, content, messageId, cfg, verdict, source } = params;
    // 叠加惩罚：按「机器人 + 群 + 成员」独立计数，算法/系数/阶梯/封顶全部取自本群配置。
    // 关掉叠加时每次只按等级基础时长；窗口天数也可配（连续 N 天无违规从 0 重计）。
    const baseMinutes = minutesForLevel(cfg, verdict.level, verdict, source);
    const prev = sender ? await this.store.getStrike(bot.appId, groupId, sender, cfg.strikeWindowDays) : undefined;
    const strikeCount = (prev?.count ?? 0) + 1;
    const minutes = escalateDuration(baseMinutes, cfg, strikeCount);
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
      escalated: cfg.escalateEnabled && strikeCount > 1 && minutes > baseMinutes,
      source,
    };
    // 先撤回违规原消息（需要机器人管理员权限，上方已校验）。
    if (messageId) {
      try {
        await bot.client.recall({ scope: "group", openid: groupId }, messageId);
        log.recalled = true;
      } catch (error) {
        log.recallError = error instanceof Error ? error.message : String(error);
        this.#logger.warn("[dsh-qqbot] AI 审核撤回违规消息失败:", log.recallError);
      }
    }

    // 先执行禁言，再按结果决定群内回执：
    // 成功才发完整的五标签处置回执；失败只发警告，具体报错仅落后台日志。
    let muteError: string | undefined;
    if (minutes > 0 && sender) {
      try {
        await bot.client.setMemberMute(groupId, [sender], minutes);
      } catch (error) {
        muteError = error instanceof Error ? error.message : String(error);
        log.error = muteError;
        this.#logger.warn(`[dsh-qqbot] AI 审核命中但禁言失败（${verdict.level} ${minutes}分钟）:`, muteError);
      }
    }

    // 多次违规时翻出该成员近窗口内的违规记录公示：普通成员附在处置回执后，
    // 平台拒绝禁言（多为管理员/群主）则走警告回执公示。两者都只列最近 5 条。
    let history: ModerationLog[] = [];
    if (sender && strikeCount > 1) {
      try {
        const cutoff = Date.now() - Math.max(1, cfg.strikeWindowDays) * 86_400_000;
        history = (await this.store.listLogs({ appId: bot.appId, groupId, limit: 300 }))
          .filter((l) => l.sender === sender && Date.parse(l.at) >= cutoff);
      } catch (error) {
        this.#logger.warn("[dsh-qqbot] AI 审核查询历史违规记录失败:", error instanceof Error ? error.message : error);
      }
    }

    if (sender) {
      const notice = muteError
        ? warningMarkdown({ sender, strikeCount, windowDays: cfg.strikeWindowDays, history })
        : noticeMarkdown({
            sender,
            category: verdict.category,
            reason: verdict.reason,
            rule: verdict.rule || "",
            minutes,
            strikeCount,
            windowDays: cfg.strikeWindowDays,
            escalateOn: cfg.escalateEnabled,
            history,
          });
      try {
        await bot.client.sendMarkdown({ scope: "group", openid: groupId }, notice);
      } catch (error) {
        log.noticeError = error instanceof Error ? error.message : String(error);
        this.#logger.warn("[dsh-qqbot] AI 审核 @ 通知发送失败:", log.noticeError);
      }
    }
    if (sender) {
      try {
        await this.store.recordStrike(bot.appId, groupId, sender, minutes, verdict.level, cfg.strikeWindowDays);
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
      + (log.recalled ? " 已撤回" : "") + (log.noticeError ? "（@ 通知失败）" : ""),
    );
    // 命中违规 → actioned=true：上层据此阻断该条消息的正常回复链路（违规内容不再让机器人接话）。
    return { actioned: true, level: verdict.level, reason: verdict.reason };
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
  }): Promise<{ level: string; category: string; reason: string; minutes: number; rules: string[]; rule: string }> {
    const { appId, groupId, content } = params;
    if (!content.trim()) throw new Error("测试内容不能为空");
    const cfg = params.config ?? await this.store.getConfig(appId, groupId);
    const verdict = await moderateMessage(this.#deps, appId, content, cfg);
    return {
      level: verdict.level,
      category: verdict.category,
      reason: verdict.reason,
      // 自测按「首犯」演示：直接套用当前叠加配置，自定义阶梯模式下显示第 1 档时长。
      minutes: escalateDuration(minutesForLevel(cfg, verdict.level, verdict, "llm"), cfg, 1),
      rules: cfg.rules,
      // 命中的那一条规则（内置分类名或自定义规则原文），供自测结果精确展示。
      rule: verdict.rule || "",
    };
  }
}
