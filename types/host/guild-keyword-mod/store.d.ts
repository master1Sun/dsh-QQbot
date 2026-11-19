/** 单频道违规词自动处置配置。 */
export interface GuildKeywordConfig {
    /** 总开关。 */
    enabled: boolean;
    /** 违规词表：命中任意一个（子串匹配，忽略大小写）即处置。 */
    words: string[];
    /** 命中后禁言违规者的时长（分钟），0 = 不禁言只删除。 */
    muteMinutes: number;
    /** 是否删除违规内容（普通消息撤回 / 论坛帖子删除）。 */
    deleteContent: boolean;
    /**
     * 评论/回复命中时是否删除其所在的整个主题帖。
     * 官方无「删单条评论」接口，只能删整帖——会连带他人回复，默认关闭。
     */
    deleteThreadOnReply: boolean;
    /** 免处置成员 user id（白名单）。 */
    whitelist: string[];
    /** 只在这些子频道生效；空 = 全部。 */
    channelIds: string[];
}
/** 处置日志。 */
export interface GuildKeywordLog {
    at: string;
    appId: string;
    guildId: string;
    channelId: string;
    /** 平台消息 id（普通消息）或 thread_id（论坛）。 */
    targetId: string;
    /** 事件来源：message / forum_thread / forum_post / forum_reply。 */
    source: string;
    sender: string;
    senderName: string;
    content: string;
    /** 命中的违规词（可能多个）。 */
    matched: string[];
    /** 已执行的动作：mute / delete / delete_thread。 */
    actions: string[];
    /** 动作失败原因。 */
    errors: string[];
    muteMinutes: number;
}
export declare function guildKeywordKey(appId: string, guildId: string): string;
export declare function defaultGuildKeywordConfig(): GuildKeywordConfig;
export declare class GuildKeywordStore {
    #private;
    getConfig(appId: string, guildId: string): Promise<GuildKeywordConfig>;
    setConfig(appId: string, guildId: string, raw: unknown): Promise<GuildKeywordConfig>;
    appendLog(log: GuildKeywordLog): Promise<void>;
    listLogs(filter?: {
        appId?: string;
        guildId?: string;
        limit?: number;
    }): Promise<GuildKeywordLog[]>;
}
