export type ArchiveKind = "inbound" | "reply" | "proactive" | "session";
export interface ArchiveRecord {
    kind: ArchiveKind;
    /** 聊天键 `scope:openid` 或会话键。 */
    chat: string;
    /** 来源机器人 AppID（多机器人并存时区分归属）。 */
    bot?: string;
    /** QQ 事件类型（inbound 时）。 */
    event?: string;
    group?: string;
    sender?: string;
    senderName?: string;
    content: string;
    sessionId?: string;
    /** 附加说明（过滤判定、错误等）。 */
    note?: string;
}
/** chat 键 -> 安全且稳定的目录名。 */
export declare function chatDirName(chat: string): string;
type Logger = Pick<Console, "warn" | "error">;
export declare class Archiver {
    #private;
    constructor(enabled: () => boolean, logger: Logger, bot?: string);
    append(record: ArchiveRecord): Promise<void>;
}
export interface ArchivedEntry extends ArchiveRecord {
    ts: string;
    bot?: string;
}
export interface ArchiveReadResult {
    /** 最近记录（时间倒序：最新在前）。 */
    records: ArchivedEntry[];
    /** 归档里还有更早的记录未包含在本次结果中。 */
    moreAvailable: boolean;
    /** 读取涉及的文件数（历史字段名，供 UI 提示覆盖范围）。 */
    daysRead: number;
}
/**
 * 读取归档最近记录（设置页「消息归档」弹窗用）：
 * 汇总各会话月份文件的记录，按 ts 倒序取 limit 条；bot 非空时只返回该机器人的记录。
 * 单条 JSON 解析失败跳过，不影响整体（归档为只读操作，绝不写回）。
 */
export declare function readArchiveRecords(opts?: {
    bot?: string;
    limit?: number;
}): Promise<ArchiveReadResult>;
/** 会话下的月份归档项（左栏「会话 → 月份」二级分组用，倒序：最新月份在前）。 */
export interface ArchivedMonth {
    /** 月份键 `YYYY-MM`。 */
    month: string;
    /** 该月记录条数。 */
    count: number;
    /** 该月最近一条记录的时间（ISO 字符串）。 */
    lastTs: string;
    /** 该月最近一条记录的正文（供月节点预览）。 */
    lastContent: string;
}
/** 归档中的会话聚合项（供设置页「接收方 openid」下拉候选，以及归档弹窗左栏列表）。 */
export interface ArchivedChat {
    scope: "group" | "c2c";
    openid: string;
    /** 最近一次已知的展示名：单聊=用户昵称；群聊平台不下发群名，恒为空。 */
    name: string;
    /** 群聊场景：该群最近一次发言者的昵称（帮助辨认是哪个群）。 */
    lastSenderName: string;
    /** 该会话最近一次出现的时间（ISO 字符串）。 */
    lastTs: string;
    /** 该会话最近一条记录的正文（供左栏预览）。 */
    lastContent: string;
    /** 扫描范围内该会话出现的记录条数。 */
    count: number;
    /** 该会话按月份分组的归档（倒序：最新月份在前），每会话最多保留 60 个月。 */
    months: ArchivedMonth[];
}
/**
 * 聚合归档中出现过的群/单聊会话（设置页 openid 下拉候选 + 归档弹窗左栏）：
 * 遍历各会话的月份文件，按 chat 键聚合，月份直接取文件名；session 事件跳过。
 */
export declare function listArchiveChats(opts?: {
    bot?: string;
    limit?: number;
}): Promise<{
    chats: ArchivedChat[];
    moreAvailable: boolean;
}>;
/**
 * 列举每个归档天的记录条数（按机器人过滤），供设置页日期列表展示。
 * 新结构按会话+月份存文件，这里从记录 ts 重新按天聚合，UI 的日期列表语义保持不变。
 */
export declare function listArchiveDays(bot?: string, logger?: Logger): Promise<Array<{
    day: string;
    count: number;
}>>;
/**
 * 读取指定一天的归档（跨所有会话的该月文件，时间倒序取最新 limit 条）。
 */
export declare function readArchiveDay(opts?: {
    day?: string;
    bot?: string;
    limit?: number;
}): Promise<ArchiveReadResult>;
/**
 * 读取指定会话（group:<openid> / c2c:<openid>）的归档记录，支持按月份过滤、倒序/升序、分页。
 * 新结构下按月份可直接定位单个文件，无需全库扫描。
 *  - order 默认 "desc"：最新记录在前（右栏时间倒序展示）；
 *  - month 形如 "2026-11" 时只读该会话对应月份文件；
 *  - limit + offset 实现「限制 300 条 / 加载更多 / 显示全部」；total 返回命中总数。
 * bot 非空时只返回该机器人的记录。
 */
export declare function readArchiveChat(opts?: {
    bot?: string;
    chat?: string;
    month?: string;
    limit?: number;
    offset?: number;
    order?: "desc" | "asc";
}): Promise<ArchiveReadResult & {
    total: number;
}>;
/**
 * 删除某会话的归档记录：指定 month 时只删该会话该月文件（UI 的「删除当前月份」）；
 * 未指定 month 时删除该会话所有月份。按 bot 过滤，其它机器人的记录保留。
 */
export declare function removeArchiveChat(opts?: {
    bot?: string;
    chat?: string;
    month?: string;
}): Promise<{
    removed: number;
    filesDeleted: string[];
}>;
/** 删除某天的归档记录（跨所有会话；按机器人过滤；bot 为空清空全天）。 */
export declare function removeArchiveDay(opts?: {
    day?: string;
    bot?: string;
}): Promise<{
    removed: number;
    fileDeleted: boolean;
}>;
export {};
