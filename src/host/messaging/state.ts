/**
 * 共享运行状态与辅助操作（去重、群全量消息缓冲、被动回复记录绑定）。
 */
import type {
  BotState,
  GroupBufferEntry,
  PassiveReplyRecord,
} from "../../shared/types.js";
import { tr, type ReplyLocale } from "../../shared/reply-i18n.js";

export function createBotState(): BotState {
  return {
    pending: new Map(),
    sessionByDelivery: new Map(),
    recordBySession: new Map(),
    recordQueue: new Map(),
    chatSession: new Map(),
    turnText: new Map(),
    groupBuffer: new Map(),
    incomingFingerprints: new Map(),
    mergeRecords: new Map(),
    seenEvents: new Map(),
    errorNoticeAt: new Map(),
    sentByChat: new Map(),
    counters: { received: 0, sessions: 0, replies: 0, proactive: 0, errors: 0 },
  };
}

const INCOMING_FINGERPRINT_WINDOW_MS = 15_000;
const INCOMING_FINGERPRINT_CAP = 512;

/**
 * 跨事件指纹去重：群开启全量后，同一条 @ 消息可能同时收到
 * GROUP_MESSAGE_CREATE 与 GROUP_AT_MESSAGE_CREATE（事件 id 不同）。
 * 15 秒窗口内同 (群, 发送者, 内容) 只处理一次；首次出现返回 true。
 */
let lastFingerprintSweep = 0;
const INCOMING_FINGERPRINT_SWEEP_MS = 60_000;

/** 惰性清理过期指纹：避免指纹表长期只增不减（窗口外的旧记录被持续保留）。 */
function sweepIncomingFingerprints(state: BotState, now: number): void {
  if (
    now - lastFingerprintSweep < INCOMING_FINGERPRINT_SWEEP_MS &&
    state.incomingFingerprints.size <= INCOMING_FINGERPRINT_CAP
  ) {
    return;
  }
  lastFingerprintSweep = now;
  for (const [k, at] of state.incomingFingerprints) {
    if (now - at > INCOMING_FINGERPRINT_WINDOW_MS) state.incomingFingerprints.delete(k);
  }
}

export function markIncoming(state: BotState, group: string, sender: string, content: string, now = Date.now()): boolean {
  const key = `${group}:${sender}:${content.replace(/\s+/g, "").slice(0, 120)}`;
  if (!group || !content) return true;
  const seenAt = state.incomingFingerprints.get(key);
  if (seenAt !== undefined) {
    // 命中：窗口内重复 → 拦截；窗口外过期 → 视为新消息（先清掉旧指纹再写入）
    if (now - seenAt <= INCOMING_FINGERPRINT_WINDOW_MS) return false;
    state.incomingFingerprints.delete(key);
  }
  state.incomingFingerprints.set(key, now);
  sweepIncomingFingerprints(state, now);
  return true;
}

const SEEN_EVENT_CAP = 512;

/** 事件去重：首次出现返回 true；超容量时淘汰最旧的一半。 */
export function markSeen(state: BotState, eventId: string): boolean {
  if (!eventId) return true;
  if (state.seenEvents.has(eventId)) return false;
  state.seenEvents.set(eventId, Date.now());
  if (state.seenEvents.size > SEEN_EVENT_CAP) {
    const keys = [...state.seenEvents.entries()].sort((a, b) => a[1] - b[1]);
    for (const [key] of keys.slice(0, SEEN_EVENT_CAP / 2)) state.seenEvents.delete(key);
  }
  return true;
}

const SENT_RING_CAP = 30;

/** 记录机器人自己发出的消息 id（每聊天环形缓冲），供表情撤回 / /撤回 命令使用。 */
export function rememberSent(state: BotState, chatKey: string, messageId: string): void {
  if (!chatKey || !messageId) return;
  const list = state.sentByChat.get(chatKey) ?? [];
  list.push(messageId);
  if (list.length > SENT_RING_CAP) list.splice(0, list.length - SENT_RING_CAP);
  state.sentByChat.set(chatKey, list);
}

/** 判断某条消息 id 是否为本机器人在该聊天发出的。 */
export function isOwnSent(state: BotState, chatKey: string, messageId: string): boolean {
  return Boolean(messageId) && (state.sentByChat.get(chatKey) ?? []).includes(messageId);
}

/** 取本机器人在该聊天最近发出的消息 id（last=1 最近一条）。 */
export function lastSent(state: BotState, chatKey: string, back = 1): string | null {
  const list = state.sentByChat.get(chatKey);
  if (!list || list.length === 0) return null;
  return list[list.length - Math.min(back, list.length)] ?? null;
}

/** 追加一条群全量消息到环形缓冲。 */
export function addGroupMessage(
  state: BotState,
  groupOpenid: string,
  entry: GroupBufferEntry,
  max: number,
): void {
  if (!groupOpenid || max <= 0) return;
  const list = state.groupBuffer.get(groupOpenid) ?? [];
  list.push(entry);
  if (list.length > max) list.splice(0, list.length - max);
  state.groupBuffer.set(groupOpenid, list);
}

/**
 * 取某个群的最近 count 条群消息（旧 → 新）。
 *
 * maxChars > 0 时对上下文总量做字符预算：按「新 → 旧」累加，超出预算就丢弃更早的
 * 消息，单条过长则截取尾部（更接近当前话题）并标注省略。这样「条数越多越耗 token」
 * 是有界的——有人刷一大段或贴长日志时不会把整个 prompt 撑爆。
 */
export function recentGroupMessages(
  state: BotState,
  groupOpenid: string,
  count: number,
  maxChars = 0,
): GroupBufferEntry[] {
  if (count <= 0) return [];
  const list = state.groupBuffer.get(groupOpenid);
  if (!list || list.length === 0) return [];
  const tail = list.slice(-count).filter((e) => typeof e.content === "string" && e.content.trim().length > 0);
  if (maxChars <= 0) return tail;
  const out: GroupBufferEntry[] = [];
  let used = 0;
  for (let i = tail.length - 1; i >= 0; i--) {
    const entry = tail[i]!;
    const remain = maxChars - used;
    if (remain <= 0) break;
    if (entry.content.length > remain) {
      out.push({ ...entry, content: `…${entry.content.slice(-Math.max(1, remain - 1))}` });
      break;
    }
    out.push(entry);
    used += entry.content.length;
  }
  return out.reverse();
}

const RECORD_QUEUE_CAP = 32;

/**
 * 记录入队：同一会话按入站顺序排队，turn/end 时按序出队，保证每条回复
 * 用回「触发它的那条消息」的引用门控字段（@ 消息不被后到消息覆盖）。
 */
export function enqueueRecord(state: BotState, sessionId: string, record: PassiveReplyRecord): void {
  const q = state.recordQueue.get(sessionId) ?? [];
  q.push(record);
  if (q.length > RECORD_QUEUE_CAP) q.splice(0, q.length - RECORD_QUEUE_CAP);
  state.recordQueue.set(sessionId, q);
}

/** 记录出队：取最早入队、尚未回复的记录；队列空返回 null。 */
export function dequeueRecord(state: BotState, sessionId: string): PassiveReplyRecord | null {
  const q = state.recordQueue.get(sessionId);
  if (!q || q.length === 0) return null;
  const record = q.shift()!;
  if (q.length === 0) state.recordQueue.delete(sessionId);
  return record;
}

/** 清空某会话的待回复记录队列（/new 解绑等场景）。 */
export function clearRecordQueue(state: BotState, sessionId: string): void {
  state.recordQueue.delete(sessionId);
}

/** 绑定 deliveryId 与会话：此后该会话的助手回复发回 QQ。 */
export function bindSession(state: BotState, deliveryId: string, sessionId: string): PassiveReplyRecord | null {
  const pending = state.pending.get(deliveryId);
  if (!pending) return null;
  state.pending.delete(deliveryId);
  state.sessionByDelivery.set(deliveryId, sessionId);
  state.recordBySession.set(sessionId, pending);
  enqueueRecord(state, sessionId, pending);
  // 聊天键 → 会话映射：同群/同单聊的下一条消息复用该会话（/new 解绑）。
  state.chatSession.set(pending.chatKey, sessionId);
  return pending;
}

/** 记录一条助手文本到 (sessionId, turn)；返回是否为该 turn 的首个分片。 */
export function appendAssistantText(state: BotState, sessionId: string, turn: number, text: string): boolean {
  if (!text) return false;
  let turns = state.turnText.get(sessionId);
  if (!turns) {
    turns = new Map();
    state.turnText.set(sessionId, turns);
  }
  const existing = turns.get(turn);
  turns.set(turn, existing ? `${existing}\n${text}` : text);
  return !existing;
}

/** 取并清理某会话某 turn 的文本；若无文本返回 null。 */
export function takeTurnText(state: BotState, sessionId: string, turn: number): string | null {
  const turns = state.turnText.get(sessionId);
  const text = turns?.get(turn) ?? null;
  if (turns) {
    turns.delete(turn);
    if (turns.size === 0) state.turnText.delete(sessionId);
  }
  return text && text.trim() ? text : null;
}

/** 把回复文本切成不超过 maxChars 的分片（优先按空行/换行断开），最多 maxChunks 片。 */
/** 单条消息字符硬上限：与 replyChunkChars 的 clamp 上界一致，更长会被平台截断。 */
const CHUNK_HARD_CAP = 4000;

/** 文本末尾是否停在打开的代码块里；返回语言标记（无标记为空串），未打开返回 null。 */
function openFenceLang(text: string): string | null {
  let open: string | null = null;
  for (const m of text.matchAll(/^```([^\n`]*)$/gm)) {
    open = open === null ? (m[1] ?? "").trim() : null;
  }
  return open;
}

/**
 * 在 budget 内挑切点，优先级：段落 → 换行 → 句末标点 → 空格词边界 → 硬切。
 * 额外避开 URL 内部，避免把链接劈成两半。
 */
function findCut(rest: string, budget: number): number {
  const window = rest.slice(0, budget);
  const openUrl = /(?:https?:\/\/|www\.)\S*$/i.exec(window);
  if (openUrl && openUrl.index >= budget * 0.3) return openUrl.index;
  const para = window.lastIndexOf("\n\n");
  if (para >= budget * 0.4) return para;
  const nl = window.lastIndexOf("\n");
  if (nl >= budget * 0.5) return nl;
  let sentence = -1;
  for (const m of window.matchAll(/[。！？!?；;]/g)) sentence = m.index! + m[0].length;
  if (sentence >= budget * 0.6) return sentence;
  const space = window.lastIndexOf(" ");
  if (space >= budget * 0.75) return space + 1;
  return budget;
}

/**
 * 把长回复切成不超过 maxChars 的多片。
 *
 * 旧实现只有「段落 / 换行 / 硬切」三级，且会在超片数时把截断提示直接拼在最后一片
 * 尾部（可能超出 maxChars 被平台再截一次）。新版：
 *  - 四级边界 + URL 保护 + 代码块跨片自动补 fence，Markdown 不会被切坏；
 *  - 任意片（含补齐的 fence 与截断提示）严格不超过 maxChars；
 *  - 剩余内容给出「还有约 N 字未发送」的明确提示，并按回复语言国际化。
 */
export function chunkReply(
  text: string,
  maxChars: number,
  maxChunks: number,
  locale: ReplyLocale = "zh",
): string[] {
  const clean = text.replace(/\r\n/g, "\n").trim();
  if (!clean) return [];
  const size = Math.max(1, Math.min(CHUNK_HARD_CAP, Math.floor(maxChars) || 1000));
  const cap = Math.max(1, Math.floor(maxChunks) || 1);
  if (clean.length <= size) return [clean];

  const chunks: string[] = [];
  let rest = clean;
  let pendingFence: string | null = null;
  while (rest.length > 0 && chunks.length < cap) {
    const lead = pendingFence !== null ? `\`\`\`${pendingFence}\n` : "";
    if (rest.length + lead.length <= size) {
      chunks.push(lead + rest);
      rest = "";
      break;
    }
    // 预留片尾闭合 fence 的 4 个字符，保证任意片都不超过 size。
    const budget = Math.max(1, size - lead.length - 4);
    const cut = Math.max(1, findCut(rest, budget));
    let head = rest.slice(0, cut).replace(/^\s+/, "").trimEnd();
    rest = rest.slice(cut).replace(/^[\r\n]+/, "");
    if (!head) {
      head = rest.slice(0, budget).trimEnd();
      rest = rest.slice(budget).replace(/^[\r\n]+/, "");
    }
    const stillOpen = openFenceLang(lead + head);
    if (stillOpen !== null) {
      head = `${head}\n\`\`\``;
      pendingFence = stillOpen;
    } else {
      pendingFence = null;
    }
    chunks.push(lead + head);
  }
  if (rest.length > 0 && chunks.length > 0) {
    const note = tr(locale, "reply.chunkTruncated", rest.length);
    const last = chunks[chunks.length - 1]!;
    if (last.length + note.length + 1 <= size) {
      chunks[chunks.length - 1] = `${last}\n${note}`;
    } else {
      const keep = Math.max(0, size - note.length - 1);
      chunks[chunks.length - 1] = `${last.slice(0, keep).trimEnd()}\n${note}`;
    }
  }
  return chunks.filter((c) => c.trim().length > 0);
}

/** 会话 id 的防御式读取（Session.id 为主，header.id 兜底）。 */
export function sessionIdOf(session: unknown): string {
  const s = session as { id?: unknown; header?: { id?: unknown } } | null | undefined;
  if (typeof s?.id === "string" && s.id) return s.id;
  if (typeof s?.header?.id === "string" && s.header.id) return s.header.id;
  return "";
}

/** 从 UserMessage 里读 webhook 来源的 deliveryId；非 webhook 来源返回 null。 */
export function webhookDeliveryIdOf(data: unknown): string | null {
  const source = (data as { source?: { kind?: unknown; deliveryId?: unknown } } | null | undefined)?.source;
  if (!source || source.kind !== "webhook") return null;
  const deliveryId = source.deliveryId;
  return typeof deliveryId === "string" && deliveryId ? deliveryId : null;
}

/** 从 AssistantMessage 的内容块里提取纯文本。 */
export function assistantTextOf(data: unknown): string {
  const message = (data as { message?: { content?: unknown } } | null | undefined)?.message;
  const content = message?.content;
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .map((block) => {
      const b = block as { type?: unknown; text?: unknown } | null;
      return b?.type === "text" && typeof b.text === "string" ? b.text : "";
    })
    .filter(Boolean)
    .join("\n")
    .trim();
}
