export interface OutboxItem {
    id: string;
    /** 归属机器人 AppID（由它重投）。 */
    appId: string;
    scope: "group" | "c2c";
    openid: string;
    content: string;
    createdAt: string;
    attempts: number;
    lastError?: string;
}
export declare class Outbox {
    #private;
    constructor(logger: Pick<Console, "warn" | "error">);
    load(): Promise<OutboxItem[]>;
    /** 入箱一条待重投内容。 */
    push(item: {
        appId: string;
        scope: "group" | "c2c";
        openid: string;
        content: string;
    }): Promise<void>;
    size(): number;
    /**
     * 重投一轮。sender 由调用方提供（消耗主动消息配额后实际发送）。
     * 发送成功或超过重试上限的条目移出队列。
     */
    flush(sender: (item: OutboxItem) => Promise<void>): Promise<{
        sent: number;
        dropped: number;
    }>;
}
