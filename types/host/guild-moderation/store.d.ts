/** 违规分类（id 稳定，文案在客户端 dict）。 */
export declare const GUILD_MOD_CATEGORIES: readonly ["illegal", "porn_gamble", "abuse", "ad_spam", "flood"];
export type GuildModCategory = (typeof GUILD_MOD_CATEGORIES)[number];
export type GuildMuteLevel = "none" | "light" | "medium" | "severe";
/** 命中违规后要执行的动作（可多选）。 */
export interface GuildActions {
    mute: boolean;
    recall: boolean;
    warn: boolean;
}
/** 单频道 AI 接管配置。 */
export interface GuildModConfig {
    enabled: boolean;
    categories: string[];
    rules: string[];
    /** 三级禁言时长（分钟），严重级封顶 30 天。 */
    durations: {
        light: number;
        medium: number;
        severe: number;
    };
    actions: GuildActions;
    /** 免审成员 user id。 */
    whitelist: string[];
    /** 只审核这些子频道；空 = 全部。 */
    channelIds: string[];
}
/** 处置日志。 */
export interface GuildModLog {
    at: string;
    appId: string;
    guildId: string;
    channelId: string;
    messageId: string;
    sender: string;
    senderName: string;
    content: string;
    level: GuildMuteLevel;
    reason: string;
    category: string;
    minutes: number;
    actions: string[];
    errors: string[];
    strikeCount: number;
    baseMinutes: number;
}
/** 单成员累进违规记录（机器人 + 频道 + 成员）。 */
export interface GuildStrike {
    count: number;
    totalMinutes: number;
    lastAt: string;
    lastLevel: string;
}
export declare const GUILD_MUTE_CAP_MINUTES: number;
/** 配置键：机器人 + 频道。 */
export declare function guildModKey(appId: string, guildId: string): string;
export declare function defaultGuildModConfig(): GuildModConfig;
export declare class GuildModStore {
    #private;
    getConfig(appId: string, guildId: string): Promise<GuildModConfig>;
    setConfig(appId: string, guildId: string, raw: unknown): Promise<GuildModConfig>;
    removeConfig(appId: string, guildId: string): Promise<void>;
    listConfigs(): Promise<Array<{
        key: string;
        appId: string;
        guildId: string;
        config: GuildModConfig;
    }>>;
    appendLog(log: GuildModLog): Promise<void>;
    listLogs(filter?: {
        appId?: string;
        guildId?: string;
        limit?: number;
    }): Promise<GuildModLog[]>;
    getStrike(appId: string, guildId: string, sender: string): Promise<GuildStrike>;
    recordStrike(appId: string, guildId: string, sender: string, minutes: number, level: string): Promise<GuildStrike>;
}
