export interface GuildReplyConfig {
    /** 总开关。 */
    enabled: boolean;
    /** 新主题 / 新帖子 / 私域频道普通消息触发一次 AI 回帖。 */
    onPost: boolean;
    /** 评论 / 消息 @机器人时回复（论坛事件为 FORUM_REPLY_CREATE）。 */
    onMention: boolean;
    /** 同一主题 / 帖子只回一次（默认开）。@回复按单条评论单独计数。 */
    once: boolean;
    /** 频道自定义回帖要求（追加到系统提示词）。 */
    prompt: string;
    /** 免回帖成员 id。 */
    whitelist: string[];
    /** 只在这些子频道回帖；空 = 该频道全部子频道。 */
    channelIds: string[];
}
export interface GuildReplyLog {
    at: string;
    appId: string;
    guildId: string;
    channelId: string;
    /** post = 新帖；mention = @/评论。 */
    trigger: "post" | "mention";
    /** message / forum_thread / forum_post / forum_reply。 */
    source: string;
    key: string;
    sender: string;
    senderName: string;
    content: string;
    reply: string;
    messageId: string;
    ok: boolean;
    error: string;
}
export declare function guildReplyKey(appId: string, guildId: string): string;
export declare function defaultGuildReplyConfig(): GuildReplyConfig;
export declare class GuildReplyStore {
    #private;
    getConfig(appId: string, guildId: string): Promise<GuildReplyConfig>;
    setConfig(appId: string, guildId: string, raw: unknown): Promise<GuildReplyConfig>;
    /** 是否已经回过（30 天内有效）。 */
    wasReplied(key: string): Promise<boolean>;
    markReplied(key: string, messageId: string): Promise<void>;
    appendLog(log: GuildReplyLog): Promise<void>;
    listLogs(filter?: {
        appId?: string;
        guildId?: string;
        limit?: number;
    }): Promise<GuildReplyLog[]>;
}
