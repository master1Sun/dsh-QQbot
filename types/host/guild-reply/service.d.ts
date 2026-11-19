/**
 * 频道 AI 自动回帖服务：
 *  - 新主题 / 新帖子 / 私域频道普通消息 → 在对应子频道 AI 回帖一次；
 *  - 评论 / 消息 @机器人 → 再回复一次。
 *
 * 事件来源：SDK 归一化的 AT_MESSAGE_CREATE 走 handleMessage；
 * MESSAGE_CREATE / FORUM_* 走 rawEvent → handleChannelMessage / handleForumEvent。
 * 所有失败吞掉并写日志，绝不影响消息链路。
 */
import type { BotRuntime } from "../bots.js";
import { type GuildReplyDeps } from "./engine.js";
import { GuildReplyStore, type GuildReplyLog } from "./store.js";
export interface GuildInboundLike {
    guildId?: string;
    channelId?: string;
    messageId?: string;
    sender?: string;
    senderName?: string;
    content?: string;
    rawEventType?: string;
    isBot?: boolean;
    raw?: unknown;
}
export declare class GuildReplyService {
    #private;
    readonly store: GuildReplyStore;
    constructor(deps: GuildReplyDeps, logger: Pick<Console, "info" | "warn" | "error">);
    setBotUser(appId: string, userId: unknown): void;
    /** 事件是否由本服务处理（index.ts 用来决定要不要走通用 rawEvent 管线）。 */
    static handles(eventType: string): boolean;
    /** SDK 归一化的频道消息（AT_MESSAGE_CREATE / MESSAGE_CREATE 经 rawEvent 转换后复用）。 */
    handleMessage(bot: BotRuntime, message: GuildInboundLike): Promise<void>;
    /** 私域 MESSAGE_CREATE 原始事件（SDK 未归一化为 message）。 */
    handleChannelMessage(bot: BotRuntime, data: unknown): Promise<void>;
    /** 论坛事件：新主题/新帖回帖一次，评论 @机器人再回复。 */
    handleForumEvent(bot: BotRuntime, eventType: string, data: unknown): Promise<void>;
}
/** 日志展示用：把任意值安全转字符串（客户端不依赖）。 */
export declare const guildReplyLogText: (log: GuildReplyLog) => string;
