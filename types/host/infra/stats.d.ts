import type { BotCounters } from "../../shared/types.js";
export declare const ZERO_COUNTERS: BotCounters;
export declare class StatsStore {
    #private;
    constructor(logger: Pick<Console, "warn" | "error">);
    /** 读某机器人的持久计数；文件缺失/损坏返回全零。 */
    load(appId: string): Promise<BotCounters>;
    /** 落盘某机器人的计数（附带更新时间）。 */
    save(appId: string, counters: BotCounters): Promise<void>;
}
