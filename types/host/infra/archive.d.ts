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
export declare class Archiver {
    #private;
    constructor(enabled: () => boolean, logger: Pick<Console, "warn" | "error">, bot?: string);
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
    /** 读取涉及的天数（供 UI 提示覆盖范围）。 */
    daysRead: number;
}
/**
 * 读取归档最近记录（设置页「消息归档」弹窗用）：
 *  - 按天文件从最新往旧读，凑满 limit 即止；
 *  - bot 非空时只返回该机器人的记录；
 *  - 单条 JSON 解析失败跳过，不影响整体（归档为只读操作，绝不写回）。
 */
export declare function readArchiveRecords(opts?: {
    bot?: string;
    limit?: number;
}): Promise<ArchiveReadResult>;
/** 归档中的会话聚合项（供设置页「接收方 openid」下拉候选）。 */
export interface ArchivedChat {
    scope: "group" | "c2c";
    openid: string;
    /** 最近一次已知的展示名：单聊=用户昵称；群聊平台不下发群名，恒为空。 */
    name: string;
    /** 群聊场景：该群最近一次发言者的昵称（帮助辨认是哪个群）。 */
    lastSenderName: string;
    /** 该会话最近一次出现的时间（ISO 字符串）。 */
    lastTs: string;
    /** 扫描范围内该会话出现的记录条数。 */
    count: number;
}
/**
 * 聚合归档中出现过的群/单聊会话（设置页 openid 下拉候选）：
 *  - 按天文件从最新往旧读，凑满 limit 条记录即止；
 *  - 群会话取 chat 前缀 group:，单聊取 c2c:；session 事件与无法解析的键跳过；
 *  - 名称取该会话最近一次的 senderName（QQ 平台不下发群名，群聊用最近发言者辅助辨认）。
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
 * 传入 logger 时先把旧月文件拆分为天文件；条数结果带 stat 指纹缓存。
 */
export declare function listArchiveDays(bot?: string, logger?: Pick<Console, "warn" | "error">): Promise<Array<{
    day: string;
    count: number;
}>>;
/**
 * 读取指定一天的归档（取尾部 limit 条，时间倒序）。
 * 文件超过 READ_TAIL_BYTES 时只读尾部，moreAvailable 提示头部还有更早记录。
 */
export declare function readArchiveDay(opts?: {
    day?: string;
    bot?: string;
    limit?: number;
}): Promise<ArchiveReadResult>;
/** 删除某天的归档记录（按机器人过滤；bot 为空清空全天）。 */
export declare function removeArchiveDay(opts?: {
    day?: string;
    bot?: string;
}): Promise<{
    removed: number;
    fileDeleted: boolean;
}>;
