import type { QqMessagePayload } from "../../shared/types.js";
export interface RefIndexEntry {
    /** QQ 引用索引键（REFIDX_*）。 */
    idx: string;
    /** 聊天键 `scope:openid`。 */
    chat: string;
    /** 消息 id（被动回复凭证，不保证存在）。 */
    msgId?: string;
    /** 发送者 openid。 */
    sender: string;
    /** 发送者昵称（群名片/用户名，可能为空）。 */
    senderName: string;
    /** 消息文本（已截断到 ENTRY_CONTENT_LIMIT）。 */
    content: string;
    /** 事件里的 RFC3339 时间戳原文。 */
    timestamp: string;
    /** 是否机器人自己发出的消息。 */
    fromBot: boolean;
    /** 入库时间（epoch ms），用于容量淘汰。 */
    at: number;
}
export interface RefIndexOptions {
    logger: Pick<Console, "info" | "warn" | "error">;
    /** 机器人 AppID（决定落盘文件名）。 */
    appId: string;
    max?: number;
}
/**
 * 解析消息事件里的引用索引键。
 * 返回 selfIdx（本条消息）与 refIdx（本条消息引用的那条），都可能是空。
 */
export declare function parseRefIdx(payload: QqMessagePayload): {
    selfIdx: string;
    refIdx: string;
};
/** 压缩成单行文本：换行折叠、空白收敛，便于放在引用行里。 */
export declare function oneLine(text: string, limit?: number): string;
export declare class RefIndex {
    #private;
    constructor({ logger, appId, max }: RefIndexOptions);
    /** 落盘路径（设置界面展示用）。 */
    get path(): string;
    /** 异步加载历史索引；失败只告警（索引是缓存，缺了不影响主流程）。 */
    load(): Promise<void>;
    /** 登记一条消息；排入异步落盘队列，调用方不必等待。 */
    record(entry: RefIndexEntry): void;
    /** 按索引键取回原文；不存在返回 null。 */
    resolve(idx: string): RefIndexEntry | null;
    /** 当前索引条数（状态展示）。 */
    get size(): number;
}
/** 构造一条入站消息的索引条目（无 idx 时返回 null）。 */
export declare function inboundRefEntry(idx: string, chat: string, payload: QqMessagePayload, sender: string, content: string): RefIndexEntry | null;
