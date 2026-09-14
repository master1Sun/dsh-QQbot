export declare class SelfOpenidStore {
    #private;
    constructor(logger: Pick<Console, "warn" | "error">);
    /** 读某机器人已学习的 { 群openid → 自身openid }；文件缺失/损坏返回空表。 */
    load(appId: string): Promise<Map<string, string>>;
    /** 落盘某机器人的学习结果。 */
    save(appId: string, map: Map<string, string>): Promise<void>;
}
