export declare class QuotaTracker {
    #private;
    constructor(logger: Pick<Console, "warn" | "error">, limit: (appId?: string) => number);
    /** 读当前用量（指定机器人）。 */
    usage(appId?: string): Promise<{
        used: number;
        limit: number;
        remaining: number | null;
    }>;
    /** 消耗 n 次主动消息额度；超限返回 false（调用方应放弃发送）。 */
    tryConsume(n?: number, appId?: string): Promise<boolean>;
    /**
     * 归还 n 次主动消息额度（指定机器人）。
     * 调用方先在发送前预扣（避免并发超发），事后发现「其实没投递」时归还：
     * 例如定时任务被发送门控拦下、或 AI 判定本次没有值得发送的内容（静默）。
     * 归还不设上限校验，且不会低于 0。
     */
    refund(n?: number, appId?: string): Promise<void>;
}
