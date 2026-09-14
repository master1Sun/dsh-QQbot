/**
 * 共享运行状态与辅助操作（去重、群全量消息缓冲、被动回复记录绑定）。
 */
import type { BotState, GroupBufferEntry, PassiveReplyRecord } from "../../shared/types.js";
export declare function createBotState(): BotState;
/**
 * 跨事件指纹去重：群开启全量后，同一条 @ 消息可能同时收到
 * GROUP_MESSAGE_CREATE 与 GROUP_AT_MESSAGE_CREATE（事件 id 不同）。
 * 15 秒窗口内同 (群, 发送者, 内容) 只处理一次；首次出现返回 true。
 */
export declare function markIncoming(state: BotState, group: string, sender: string, content: string, now?: number): boolean;
/** 事件去重：首次出现返回 true；超容量时淘汰最旧的一半。 */
export declare function markSeen(state: BotState, eventId: string): boolean;
/** 记录机器人自己发出的消息 id（每聊天环形缓冲），供表情撤回 / /撤回 命令使用。 */
export declare function rememberSent(state: BotState, chatKey: string, messageId: string): void;
/** 判断某条消息 id 是否为本机器人在该聊天发出的。 */
export declare function isOwnSent(state: BotState, chatKey: string, messageId: string): boolean;
/** 取本机器人在该聊天最近发出的消息 id（last=1 最近一条）。 */
export declare function lastSent(state: BotState, chatKey: string, back?: number): string | null;
/** 追加一条群全量消息到环形缓冲。 */
export declare function addGroupMessage(state: BotState, groupOpenid: string, entry: GroupBufferEntry, max: number): void;
/** 取某个群的最近 count 条群消息（旧 → 新）。 */
export declare function recentGroupMessages(state: BotState, groupOpenid: string, count: number): GroupBufferEntry[];
/**
 * 记录入队：同一会话按入站顺序排队，turn/end 时按序出队，保证每条回复
 * 用回「触发它的那条消息」的引用门控字段（@ 消息不被后到消息覆盖）。
 */
export declare function enqueueRecord(state: BotState, sessionId: string, record: PassiveReplyRecord): void;
/** 记录出队：取最早入队、尚未回复的记录；队列空返回 null。 */
export declare function dequeueRecord(state: BotState, sessionId: string): PassiveReplyRecord | null;
/** 清空某会话的待回复记录队列（/new 解绑等场景）。 */
export declare function clearRecordQueue(state: BotState, sessionId: string): void;
/** 绑定 deliveryId 与会话：此后该会话的助手回复发回 QQ。 */
export declare function bindSession(state: BotState, deliveryId: string, sessionId: string): PassiveReplyRecord | null;
/** 记录一条助手文本到 (sessionId, turn)；返回是否为该 turn 的首个分片。 */
export declare function appendAssistantText(state: BotState, sessionId: string, turn: number, text: string): boolean;
/** 取并清理某会话某 turn 的文本；若无文本返回 null。 */
export declare function takeTurnText(state: BotState, sessionId: string, turn: number): string | null;
/** 把回复文本切成不超过 maxChars 的分片（优先按空行/换行断开），最多 maxChunks 片。 */
export declare function chunkReply(text: string, maxChars: number, maxChunks: number): string[];
/** 会话 id 的防御式读取（Session.id 为主，header.id 兜底）。 */
export declare function sessionIdOf(session: unknown): string;
/** 从 UserMessage 里读 webhook 来源的 deliveryId；非 webhook 来源返回 null。 */
export declare function webhookDeliveryIdOf(data: unknown): string | null;
/** 从 AssistantMessage 的内容块里提取纯文本。 */
export declare function assistantTextOf(data: unknown): string;
