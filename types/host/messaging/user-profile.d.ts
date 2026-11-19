export type UserProfile = {
    name: string;
    avatar: string;
};
export declare class UserProfileStore {
    #private;
    constructor(logger: Pick<Console, "warn" | "error">);
    /** 读某机器人已学习的资料；文件缺失 / 损坏返回空表。 */
    load(appId: string): Promise<Map<string, UserProfile>>;
    /** 防抖写回；同一机器人短时间内多次学习只落盘一次。 */
    scheduleSave(appId: string, map: Map<string, UserProfile>): void;
    /** 立即落盘；超过上限时淘汰最早插入的条目。 */
    save(appId: string, map: Map<string, UserProfile>): Promise<void>;
}
