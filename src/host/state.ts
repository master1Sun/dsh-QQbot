/**
 * 共享运行状态与辅助操作（去重、群全量消息缓冲、被动回复记录绑定）。
 */
import type {
  BotState,
  GroupBufferEntry,
  PassiveReplyRecord,
} from "../shared/types.js";

export function createBotState(): BotState {
  return {
    pending: new Map(),
    sessionByDelivery: new Map(),
    recordBySession: new Map(),
    chatSession: new Map(),
    turnText: new Map(),
    groupBuffer: new Map(),
    incomingFingerprints: new Map(),
    seenEvents: new Map(),
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
export function markIncoming(state: BotState, group: string, sender: string, content: string, now = Date.now()): boolean {
  const key = `${group}:${sender}:${content.replace(/\s+/g, "").slice(0, 120)}`;
  if (!group || !content) return true;
  if (state.incomingFingerprints.has(key)) return false;
  state.incomingFingerprints.set(key, now);
  if (state.incomingFingerprints.size > INCOMING_FINGERPRINT_CAP) {
    for (const [k, at] of state.incomingFingerprints) {
      if (now - at > INCOMING_FINGERPRINT_WINDOW_MS) state.incomingFingerprints.delete(k);
    }
  }
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

/** 取某个群的最近 count 条群消息（旧 → 新）。 */
export function recentGroupMessages(
  state: BotState,
  groupOpenid: string,
  count: number,
): GroupBufferEntry[] {
  if (count <= 0) return [];
  const list = state.groupBuffer.get(groupOpenid);
  if (!list || list.length === 0) return [];
  return list.slice(-count);
}

/** 绑定 deliveryId 与会话：此后该会话的助手回复发回 QQ。 */
export function bindSession(state: BotState, deliveryId: string, sessionId: string): PassiveReplyRecord | null {
  const pending = state.pending.get(deliveryId);
  if (!pending) return null;
  state.pending.delete(deliveryId);
  state.sessionByDelivery.set(deliveryId, sessionId);
  state.recordBySession.set(sessionId, pending);
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
export function chunkReply(text: string, maxChars: number, maxChunks: number): string[] {
  const clean = text.replace(/\r\n/g, "\n").trim();
  if (!clean) return [];
  if (clean.length <= maxChars) return [clean];
  const chunks: string[] = [];
  let rest = clean;
  while (rest.length > 0 && chunks.length < maxChunks) {
    if (rest.length <= maxChars) {
      chunks.push(rest);
      rest = "";
      break;
    }
    let cut = rest.lastIndexOf("\n\n", maxChars);
    if (cut < maxChars * 0.3) cut = rest.lastIndexOf("\n", maxChars);
    if (cut < maxChars * 0.3) cut = maxChars;
    chunks.push(rest.slice(0, cut).trim());
    rest = rest.slice(cut).trim();
  }
  if (rest.length > 0 && chunks.length > 0) {
    const last = chunks[chunks.length - 1]!;
    chunks[chunks.length - 1] = `${last}\n…（内容过长已截断，请在 DSH 会话中查看完整回复）`;
  }
  return chunks.filter((c) => c.length > 0);
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
