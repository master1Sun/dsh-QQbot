import type { RpcCall } from "./types.js";
export interface GroupInfo {
    group_openid?: string;
    group_name?: string;
    group_finger_memo?: string;
    group_class_text?: string;
    group_tags?: string[];
    group_member_num?: number;
}
/** key = `${appId}:${openid}`，不同机器人下同一群的资料互不覆盖。 */
export declare const GROUP_INFO_CACHE: Map<string, GroupInfo>;
export declare const groupInfoCacheKey: (appId: string, openid: string) => string;
/** 批量补齐群资料：命中缓存直接用，未命中的并发拉取（最多 limit 个）。 */
export declare function useGroupInfos(rpcCall: RpcCall, appId: string, ids: string[], limit?: number): Record<string, GroupInfo>;
