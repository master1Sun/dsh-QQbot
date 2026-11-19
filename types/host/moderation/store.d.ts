/** 内置违规分类（id 稳定，文案在客户端 dict）。 */
export declare const MODERATION_CATEGORIES: readonly ["illegal", "porn_gamble", "abuse", "ad_spam", "flood"];
export type ModerationCategory = (typeof MODERATION_CATEGORIES)[number];
export type MuteLevel = "none" | "light" | "medium" | "severe";
/** 单群审核配置。缺省字段在 normalize 时补齐。 */
export interface ModerationConfig {
    enabled: boolean;
    /** 启用的内置分类 id（空 = 不启用内置分类，只看自定义群规）。 */
    categories: string[];
    /** 用户自定义群规（自然语言，逐条）。 */
    rules: string[];
    /** 三级禁言时长（分钟）；严重级上限 43200（30 天，平台限制）。 */
    durations: {
        light: number;
        medium: number;
        severe: number;
    };
    /** 免审成员 openid（命中直接跳过，不调模型）。 */
    whitelist: string[];
}
/** 处罚/审核日志。 */
export interface ModerationLog {
    at: string;
    appId: string;
    groupId: string;
    sender: string;
    senderName: string;
    content: string;
    level: MuteLevel;
    reason: string;
    category: string;
    /** 实际执行的禁言分钟数（0 = 未禁言）。 */
    minutes: number;
    /** 执行失败原因（禁言未成功但命中违规时记录）。 */
    error?: string;
    /** 群内 @ 通知发送失败原因（不影响禁言执行）。 */
    noticeError?: string;
    /** 该成员在本群的第几次违规（累进处罚）。 */
    strikeCount?: number;
    /** 累进前的等级基础时长（分钟），方便看出加重了多少。 */
    baseMinutes?: number;
}
/** 单个成员的累进违规记录（按 机器人 + 群 + 成员 独立计数）。 */
export interface ModerationStrike {
    count: number;
    totalMinutes: number;
    lastAt: string;
    lastLevel: string;
}
/** 单次禁言封顶：30 天（QQ 平台上限），分钟。 */
export declare const MUTE_CAP_MINUTES: number;
/** 配置键：机器人 + 群。 */
export declare function modKey(appId: string, groupId: string): string;
/** 累进违规键：机器人 + 群 + 成员，成员之间互不影响。 */
export declare function strikeKey(appId: string, groupId: string, sender: string): string;
/** 默认配置：全部关闭、启用全部内置分类、三级时长 10 分钟 / 1 天 / 30 天。 */
export declare function defaultConfig(): ModerationConfig;
/** 归一化单群配置（容错：非法字段回退默认）。导出供「规则自测」复用草稿配置。 */
export declare function normalizeConfig(raw: unknown): ModerationConfig;
export declare class ModerationStore {
    #private;
    /** 读取单群配置（未配置时返回全默认副本）。 */
    getConfig(appId: string, groupId: string): Promise<ModerationConfig>;
    /** 保存单群配置（归一化后写入）。 */
    setConfig(appId: string, groupId: string, raw: unknown): Promise<ModerationConfig>;
    /** 删除单群配置（恢复默认/关闭）。 */
    removeConfig(appId: string, groupId: string): Promise<void>;
    /** 列出所有已配置的群（供设置页展示/批量管理）。 */
    listConfigs(): Promise<Array<{
        key: string;
        appId: string;
        groupId: string;
        config: ModerationConfig;
    }>>;
    /** 追加一条处罚日志到对应月份文件（每月保留最近 LOG_CAP 条）。 */
    appendLog(log: ModerationLog): Promise<void>;
    /** 查询日志（跨月份合并，可按 appId / 群过滤，按时间倒序）。 */
    listLogs(filter?: {
        appId?: string;
        groupId?: string;
        limit?: number;
    }): Promise<ModerationLog[]>;
    /** 读取某成员在本群的累进违规记录（无记录 / 超过 30 天窗口返回全零）。 */
    getStrike(appId: string, groupId: string, sender: string): Promise<ModerationStrike>;
    /**
     * 记录一次违规：窗口内次数 +1、累计禁言分钟相加（封顶 30 天）；
     * 超过 30 天窗口则视为新周期，从 count=1 重新计，不再无限叠加。
     * 保留最近 STRIKE_CAP 个成员。
     */
    recordStrike(appId: string, groupId: string, sender: string, minutes: number, level: string): Promise<ModerationStrike>;
}
