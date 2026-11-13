/**
 * 群全量消息价值过滤：不是每条消息都值得回复。
 *
 * 评分（0–10）采用「意图分（互斥取最强）+ 内容分（累加封顶）+ 噪声惩罚」的分层结构，
 * 而不是把所有命中关键词无脑相加：后者会让一句普通技术闲聊轻易顶到 10 分，
 * 阈值 5 形同虚设。分层后 10 分只留给「明确点名机器人求助 + 内容充实」的消息。
 *
 * 另外叠加两层冷却（每群 / 每发送者）与两层刷屏拦截（重复内容 / 同人连发）。
 * 阈值设为 0 时这一切全部跳过（不评分也不限频），见 evaluateGroupMessage 开头的早退。
 * 所有状态带 TTL 与容量淘汰，长时间运行不会随群/用户数量无限增长。
 *
 * 直接 @机器人（GROUP_AT_MESSAGE_CREATE）与单聊不经过此过滤，始终回复；
 * 因此这里不再用「内容里出现 AI/机器人 等词」来猜测用户是否在找机器人——
 * 那种近似会让普通闲聊绕过全部冷却，且与界面说明不符。
 */
import type { GroupBufferEntry, QqMessagePayload } from "../../shared/types.js";

export interface ValueFilterConfig {
  /** 是否启用群全量回复（rule.ts 已提前判定，这里保留供将来扩展）。 */
  enabled: boolean;
  /** 评分达到该值才回复（0–10）。0 = 完全不设限：不评分、不冷却、不拦重复/刷屏。 */
  threshold: number;
  /** 同一群两次「全量模式回复」的最小间隔（毫秒）。 */
  groupCooldownMs: number;
  /** 同一发送者两次被回复的最小间隔（毫秒）。 */
  senderCooldownMs: number;
}

export interface RecentText {
  /** 最近一次出现时间。 */
  at: number;
  /** 时间窗内累计出现次数（含本次）。 */
  hits: number;
}

export interface ValueFilterState {
  /** groupOpenid → 上次全量回复时间。 */
  lastGroupReplyAt: Map<string, number>;
  /** `${group}:${sender}` → 上次回复时间。 */
  lastSenderReplyAt: Map<string, number>;
  /** groupOpenid → 归一化内容指纹 → 最近出现信息（重复消息识别）。 */
  recentTexts: Map<string, Map<string, RecentText>>;
  /** `${group}:${sender}` → 60 秒窗口内的发送时刻（同人连发识别）。 */
  senderTimes: Map<string, number[]>;
  /** 上次状态清扫时间（节流，避免每条消息都全表扫描）。 */
  lastSweepAt: number;
}

export function createValueFilterState(): ValueFilterState {
  return {
    lastGroupReplyAt: new Map(),
    lastSenderReplyAt: new Map(),
    recentTexts: new Map(),
    senderTimes: new Map(),
    lastSweepAt: 0,
  };
}

export interface ValueVerdict {
  reply: boolean;
  score: number;
  reasons: string[];
  blockedBy?: "cooldown-group" | "cooldown-sender" | "duplicate" | "flood" | "below-threshold";
}

// ── 信号词 ────────────────────────────────────────────────────────────────
/** 疑问句：问号，或句末语气词，或以疑问词开头。 */
const QUESTION_RE = /[?？]|(吗|呢|么|嘛)[。！!~…\s]*$|^(怎么|为啥|为什么|为何|如何|什么|哪些|哪个|啥|多少|几点|几号|什么时候|哪里|哪儿|咋|谁|是否|能不能|能否|可不可以|有没有|是不是|要不要|该咋|该怎么办)/;
/** 明确求助/请求：比疑问句更强的「希望有人动手」信号。 */
const ASK_RE = /(帮我|帮忙|求助|求教|请教|请问|带一下|看看|翻译|总结|解释|写一个|写个|改一下|改改|推荐|有什么建议|怎么办|如何解决|怎么处理|麻烦|劳驾|能不能给|能不能帮)/;
const AI_RE = /(机器人|人工智能|\bai\b|bot|robot|豆包|deepseek|助手|小助手)/i;
const TECH_RE = /(代码|报错|错误|bug|error|异常|程序|部署|安装|配置|编译|运行|服务器|接口|api|数据库|git|python|javascript|typescript|java|golang|rust|sql|linux|docker)/i;
const CODE_URL_RE = /(https?:\/\/|www\.|```|function |def |const |let |var |class |import |#include)/;
/** 纯表情/标点/数字、或同一字符重复三次以上（哈哈哈 / 666 / ？？？）。 */
const NOISE_RE = /^[\s\p{Extended_Pictographic}\p{Emoji_Presentation}\p{P}\p{S}]+$|^\d{1,6}$|^(.)\1{2,}$/u;

// ── 窗口与容量 ────────────────────────────────────────────────────────────
const REPEAT_WINDOW_MS = 60_000;
const TEXT_TTL_MS = 120_000;
const FLOOD_WINDOW_MS = 60_000;
const STATE_TTL_MS = 30 * 60_000;
const SWEEP_INTERVAL_MS = 30_000;
const MAX_TRACKED_KEYS = 2048;
const MAX_GROUPS = 256;
/** 60 秒内同人连发到这个条数直接判定为刷屏。 */
const FLOOD_HARD_LIMIT = 6;
/** 60 秒内同人连发到这个条数开始扣分。 */
const FLOOD_SOFT_LIMIT = 3;

/**
 * 归一化指纹：NFKC 全角转半角、去空白/标点/表情、小写、截前 80 字。
 * 旧实现只去空白，「有人吗？」与「有人吗！！」判为两条不同消息，重复刷屏识别不出来。
 */
function fingerprint(text: string): string {
  return text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\s\p{P}\p{S}\p{Extended_Pictographic}\p{Emoji_Presentation}]/gu, "")
    .slice(0, 80);
}

/** 删除 Map 中最旧的若干项，保持容量上限（Map 迭代顺序即插入顺序）。 */
function trimKeys<K>(map: Map<K, unknown>, cap: number): void {
  if (map.size <= cap) return;
  const excess = map.size - cap;
  let i = 0;
  for (const key of map.keys()) {
    if (i++ >= excess) break;
    map.delete(key);
  }
}

/** 定期清扫过期状态：冷却记录、内容指纹、发送时刻，防止长期运行内存无界增长。 */
function sweep(state: ValueFilterState, now: number, config: ValueFilterConfig): void {
  if (now - state.lastSweepAt < SWEEP_INTERVAL_MS) return;
  state.lastSweepAt = now;
  const ttl = Math.max(STATE_TTL_MS, config.groupCooldownMs, config.senderCooldownMs);
  for (const [key, at] of state.lastGroupReplyAt) if (now - at > ttl) state.lastGroupReplyAt.delete(key);
  for (const [key, at] of state.lastSenderReplyAt) if (now - at > ttl) state.lastSenderReplyAt.delete(key);
  for (const [group, texts] of state.recentTexts) {
    for (const [fp, rec] of texts) if (now - rec.at > TEXT_TTL_MS) texts.delete(fp);
    if (texts.size === 0) state.recentTexts.delete(group);
  }
  for (const [key, times] of state.senderTimes) {
    const live = times.filter((t) => now - t < FLOOD_WINDOW_MS);
    if (live.length === 0) state.senderTimes.delete(key);
    else state.senderTimes.set(key, live);
  }
  trimKeys(state.lastGroupReplyAt, MAX_TRACKED_KEYS);
  trimKeys(state.lastSenderReplyAt, MAX_TRACKED_KEYS);
  trimKeys(state.recentTexts, MAX_GROUPS);
  trimKeys(state.senderTimes, MAX_TRACKED_KEYS);
}

/** 群消息价值评估：返回是否回复与评分依据。 */
export function evaluateGroupMessage(
  payload: QqMessagePayload,
  filter: ValueFilterConfig,
  state: ValueFilterState,
  now = Date.now(),
): ValueVerdict {
  const content = (payload.content ?? "").trim();
  const sender = payload.author?.id || payload.author?.member_openid || "";
  const group = payload.group_openid ?? "";
  const reasons: string[] = [];
  const senderKey = `${group}:${sender}`;

  // 阈值 0 = 完全不设限：不评分、不冷却、不拦重复/刷屏，收到群消息就回复。
  // 这是用户显式选择的语义（设置页提示「0（完全不设限）」），所以在这里就早退，
  // 连窗口状态都不记录——既不会误挡后续消息，也避免长期无意义地增长内存。
  if (filter.threshold <= 0) {
    return { reply: true, score: 10, reasons: ["阈值 0：完全不设限"] };
  }

  // —— 窗口状态（无论最终结果如何都更新，保证滑动窗口准确） ——
  const fp = fingerprint(content);
  let texts = state.recentTexts.get(group);
  if (!texts) {
    texts = new Map();
    if (group) state.recentTexts.set(group, texts);
  }
  const prior = fp ? texts.get(fp) : undefined;
  const repeated = Boolean(prior && now - prior.at < REPEAT_WINDOW_MS);
  const repeatHits = repeated ? (prior!.hits + 1) : 1;
  if (fp) texts.set(fp, { at: now, hits: repeatHits });
  for (const [key, rec] of texts) if (now - rec.at > TEXT_TTL_MS) texts.delete(key);
  // 容量控制：只淘汰最旧项，不再用 clear() 把刚写入的指纹一起抹掉（旧实现会让去重短暂失效）。
  trimKeys(texts, 64);

  const times = (state.senderTimes.get(senderKey) ?? []).filter((t) => now - t < FLOOD_WINDOW_MS);
  times.push(now);
  state.senderTimes.set(senderKey, times);
  sweep(state, now, filter);

  // —— 硬拦截：重复刷屏 / 同人连发 ——
  // 旧实现重复消息只扣 3 分，仍能过阈值；刷屏场景应当直接不回复。
  // 短句（归一化后 < 5 字）容易与正常寒暄撞指纹，要求累计 3 次才拦。
  if (repeated && (fp.length >= 5 || repeatHits >= 3)) {
    return { reply: false, score: 0, reasons: [`60 秒内重复消息（第 ${repeatHits} 次）`], blockedBy: "duplicate" };
  }
  if (times.length >= FLOOD_HARD_LIMIT) {
    return { reply: false, score: 0, reasons: [`同人 60 秒内连发 ${times.length} 条`], blockedBy: "flood" };
  }

  // —— 评分：意图分（互斥）+ 内容分（封顶）+ 噪声惩罚 ——
  let score = 0;
  const asks = ASK_RE.test(content);
  const asksBot = asks && AI_RE.test(content);
  if (asks) { score += 4.5; reasons.push("明确求助/请求 +4.5"); }
  else if (QUESTION_RE.test(content)) { score += 3.5; reasons.push("疑问句 +3.5"); }

  let substance = 0;
  if (AI_RE.test(content)) { substance += 1.5; reasons.push("指向机器人/AI +1.5"); }
  if (TECH_RE.test(content)) { substance += 1.5; reasons.push("技术内容 +1.5"); }
  if (CODE_URL_RE.test(content)) { substance += 1; reasons.push("链接/代码痕迹 +1"); }
  if (content.length >= 30) { substance += 1.5; reasons.push("内容充实 +1.5"); }
  else if (content.length >= 12) { substance += 0.8; reasons.push("内容完整 +0.8"); }
  substance = Math.min(4, substance);
  score += substance;
  if (asksBot) { score += 1.5; reasons.push("点名机器人求助 +1.5"); }

  if (NOISE_RE.test(content)) { score -= 5; reasons.push("纯表情/标点/数字 -5"); }
  else if (content.length <= 3 && !asks && !QUESTION_RE.test(content)) {
    score -= 2; reasons.push("无意图短句 -2");
  }
  if (repeated) { score -= 3; reasons.push("60 秒内重复 -3"); }
  if (times.length >= FLOOD_SOFT_LIMIT) { score -= 2; reasons.push(`同人 60 秒内 ${times.length} 条 -2`); }
  score = Math.max(0, Math.min(10, Math.round(score)));

  // 先判内容，再判冷却：低分消息不占用冷却判定的日志，也让「为什么没回」更可解释。
  if (score < filter.threshold) {
    return { reply: false, score, reasons, blockedBy: "below-threshold" };
  }
  if (group) {
    const lastGroup = state.lastGroupReplyAt.get(group) ?? 0;
    // 必须判断 > 0：0 表示「从未回复过」，不能直接拿 now - 0 去比冷却
    // （时钟回拨 / 注入时间时会被误判成刚回复过，第一条消息就发不出去）。
    if (lastGroup > 0 && now - lastGroup < filter.groupCooldownMs) {
      return { reply: false, score, reasons, blockedBy: "cooldown-group" };
    }
  }
  const lastSender = state.lastSenderReplyAt.get(senderKey) ?? 0;
  if (lastSender > 0 && now - lastSender < filter.senderCooldownMs) {
    return { reply: false, score, reasons, blockedBy: "cooldown-sender" };
  }

  if (group) state.lastGroupReplyAt.set(group, now);
  state.lastSenderReplyAt.set(senderKey, now);
  // sweep 有 30s 节流，而这两张表在 sweep 之后才写入；这里再做一次 O(1) 早退的
  // 容量兜底，保证「任意时刻都不超过 cap」而不是「下次清扫后才回落」。
  trimKeys(state.lastGroupReplyAt, MAX_TRACKED_KEYS);
  trimKeys(state.lastSenderReplyAt, MAX_TRACKED_KEYS);
  return { reply: true, score, reasons };
}

/**
 * 全量模式回复使用的提示词：不做任何指令包装，群里收到什么就原样交给模型——
 * 最近群聊记录（含发言者与时间）+ 触发消息本身，最后一行即最新收到的消息。
 *
 * 触发消息在构造前已入群缓冲，因此这里必须识别并复用缓冲的最后一条，
 * 不能无条件再追加一遍（旧实现用「带 - [HH:mm] 前缀的行」与「裸的 name: content」
 * 做全等比较，永远不相等，导致触发消息被重复注入两次）。
 */
export function buildGroupFullPrompt(trigger: QqMessagePayload, context: GroupBufferEntry[]): string {
  const triggerSender = trigger.author?.id || trigger.author?.member_openid || "";
  const triggerName = trigger.author?.username || triggerSender || "群成员";
  const triggerContent = (trigger.content ?? "").trim();
  const last = context[context.length - 1];
  // 触发消息可能被上下文字符预算截成「…尾部」，也按同一条处理，避免又追加一遍。
  const lastBody = (last?.content ?? "").trim().replace(/^…/, "");
  const sameContent = Boolean(lastBody) && (
    lastBody === triggerContent
    || (lastBody.length >= 20 && triggerContent.endsWith(lastBody))
  );
  const lastIsTrigger = Boolean(last
    && sameContent
    && (last.senderId === triggerSender
      || (Boolean(trigger.author?.username) && last.senderName === trigger.author?.username)));

  const baseDay = trigger.timestamp?.slice(0, 10) ?? "";
  const lines = context.map((e, index) => {
    const day = e.timestamp?.slice(0, 10) ?? "";
    const time = /^\d{4}-\d{2}-\d{2}T(\d{2}:\d{2})/.exec(e.timestamp ?? "")?.[1] ?? "";
    const stamp = day && baseDay && day !== baseDay ? `${day.slice(5)} ${time}`.trim() : time;
    const name = e.senderName || e.senderId;
    // 触发消息那一行不加列表前缀：它是「当前要回答的问题」，不是历史上下文。
    const prefix = lastIsTrigger && index === context.length - 1 ? "" : "- ";
    return `${prefix}${stamp ? `[${stamp}] ` : ""}${name}: ${e.content}`;
  });
  if (lastIsTrigger) return lines.join("\n");
  return [...lines, `${triggerName}: ${triggerContent}`].join("\n");
}
