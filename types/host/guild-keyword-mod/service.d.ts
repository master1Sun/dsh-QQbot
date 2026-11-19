/**
 * 频道违规词自动处置服务：新帖 / 发言 → 本地违规词子串匹配 → 禁言违规者本人 + 删除违规内容 → 日志。
 *
 * 与「频道 AI 接管」（LLM 语义判定）独立：这里零模型调用、命中即处置，适合明确的违规违法字样。
 * 所有动作失败都被吞掉并记进日志，绝不影响消息链路其它部分。
 *
 * 事件来源（index.ts 接入）：
 *  - onGuildMessage（SDK 归一化的 AT_MESSAGE_CREATE / MESSAGE_CREATE）→ reviewMessage
 *  - onRawEvent MESSAGE_CREATE → reviewMessage（私域全量消息）
 *  - onRawEvent FORUM_THREAD_CREATE / FORUM_POST_CREATE / FORUM_REPLY_CREATE → reviewForum
 *
 * 删除能力边界（QQ 官方）：
 *  - 普通子频道消息：DELETE /channels/{channel_id}/messages/{message_id}（撤回）
 *  - 论坛主题帖：DELETE /channels/{channel_id}/threads/{thread_id}（仅私域；无需 forum_id）
 *  - 单条评论/回复：官方无删除接口，只能删整个主题帖（默认关闭，避免误删他人回复）
 */
import type { BotRuntime } from "../bots.js";
import { GuildKeywordStore } from "./store.js";
export interface KeywordReviewParams {
    bot: BotRuntime;
    guildId: string;
    channelId: string;
    /** 普通消息=messageId；论坛=thread_id（用于删帖）。 */
    targetId: string;
    /** message / forum_thread / forum_post / forum_reply。 */
    source: string;
    sender: string;
    senderName: string;
    content: string;
    /** 论坛回复命中时，其所在主题帖 id（删整帖用）。 */
    threadId?: string;
}
export declare class GuildKeywordService {
    #private;
    readonly store: GuildKeywordStore;
    static readonly SEEN_TTL = 10000;
    constructor(logger: Pick<Console, "info" | "warn" | "error">);
    /** 统一处置入口。命中返回 true，未命中/未开启/去重返回 false。 */
    review(params: KeywordReviewParams): Promise<boolean>;
    /** SDK 归一化的频道消息（AT_MESSAGE_CREATE 等）。 */
    reviewMessage(bot: BotRuntime, message: {
        guildId?: string;
        channelId?: string;
        messageId?: string;
        senderId?: string;
        senderName?: string;
        content?: string;
        raw?: unknown;
    }): Promise<void>;
    /** 私域 MESSAGE_CREATE 原始事件。 */
    reviewChannelMessage(bot: BotRuntime, data: unknown): Promise<void>;
    /** 论坛事件：新帖 / 评论 / 回复。 */
    reviewForum(bot: BotRuntime, eventType: string, data: unknown): Promise<void>;
    /** 事件类型是否由本服务处理（论坛三类）。 */
    static handlesForum(eventType: string): boolean;
}
