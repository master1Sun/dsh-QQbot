/**
 * 统一时区：本项目所有「人类可读日期」都以上海时间（Asia/Shanghai, UTC+8）为准，
 * 与运行服务器所在时区无关。
 *
 * 约定：
 *  - 序列化（日志 / 存档 / 定时记录）统一用 toShanghaiISO()，产出带 +08:00 偏移的
 *    ISO 字符串，可被 new Date(...) 正确往返解析，不会因服务器时区而错位。
 *  - 仅内部使用的单调时间戳（Date.now()、expiresAt、token 过期、receivedAt 等）
 *    保持 UTC epoch 毫秒，与时区无关，保持不变。
 *  - 上海时间不实行夏令时，全年固定 UTC+8，故可安全使用固定偏移。
 */
export declare const SHANGHAI_TZ = "Asia/Shanghai";
export declare const SHANGHAI_OFFSET_MS: number;
/** 返回「上海墙钟」对应的 Date：其 UTC 字段等于上海本地年月日时分秒。 */
export declare function shanghaiWallClock(date?: Date): Date;
/** 取上海时间的年月（用于归档文件按月滚动），形如 2026-09。 */
export declare function shanghaiMonth(date?: Date): string;
/** 取上海时间的年月日（用于归档文件按天滚动），形如 2026-09-09。 */
export declare function shanghaiDay(date?: Date): string;
/** 序列化为上海时间 ISO 字符串（含 +08:00 偏移，可被 new Date() 往返解析）。 */
export declare function toShanghaiISO(date?: Date): string;
/** 安全地把可能为 null/undefined 的 Date 转为上海时间 ISO 字符串。 */
export declare function toShanghaiISOOrNull(d: Date | null | undefined): string | undefined;
