import type { BotCounters } from "../../shared/types.js";
export declare const ZERO_COUNTERS: BotCounters;
export declare class StatsStore {
    #private;
    constructor(logger: Pick<Console, "warn" | "error">);
    /** 读某机器人的持久计数；文件缺失/损坏返回全零。 */
    load(appId: string): Promise<BotCounters>;
    /** 落盘某机器人的计数（附带更新时间）。 */
    save(appId: string, counters: BotCounters): Promise<void>;
    /** 读某机器人的按天收到消息数；文件缺失/损坏返回空表。 */
    loadDaily(appId: string): Promise<Record<string, number>>;
    /** 落盘某机器人的按天收到消息数（只保留最近 DAILY_KEEP_DAYS 天）。 */
    saveDaily(appId: string, daily: Record<string, number>): Promise<void>;
}
