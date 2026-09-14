/** 给定 epoch（毫秒）与目标时区，返回「墙钟 = epoch + offset」所用的偏移毫秒。 */
export declare function tzOffsetMs(epochMs: number, tz: string): number;
/**
 * 把「目标时区的一个墙钟时刻」(y/mo/d/h/mi) 转换为真实 epoch 毫秒。
 * 同一自然日（tz 内）的偏移恒定，故按日缓存，避免每分钟都调用 Intl。
 */
export declare function wallToEpoch(y: number, mo: number, d: number, h: number, mi: number, tz: string): number;
export interface CronMatcher {
    minute: number[];
    hour: number[];
    dom: number[];
    month: number[];
    dow: number[];
    /** 原始字段是否为 *（用于 dom/dow 的 OR 语义判断）。 */
    domStar: boolean;
    dowStar: boolean;
}
/** 解析标准 5 段 cron 表达式；非法返回 null。 */
export declare function parseCron(expr: string): CronMatcher | null;
/** 仅校验语法是否合法。 */
export declare function isValidCron(expr: string): boolean;
/**
 * 计算自 now 之后下一次满足 cron 的真实瞬时（epoch 毫秒）。
 * 在目标时区的「墙钟」空间按分钟步进，对每条候选调用 matches。
 * 找不到（如 2 月 30 日这种不可能组合）返回 null。
 */
export declare function nextCronRun(expr: string, tz: string | undefined, now: Date): Date | null;
