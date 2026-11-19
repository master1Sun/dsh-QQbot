/**
 * 群资料共享缓存（GET /v2/groups/{group_openid}/info）。
 * 归档弹窗与平台能力群选择器共用，避免打开不同弹窗时重复打接口（官方限频 30 QPM）。
 * 拉取失败也写入空对象占位，防止反复重试；群资料只是展示增强，失败一律静默。
 */
import * as React from "react";
import type { RpcCall } from "./types.js";
import { val } from "./ui.js";

export interface GroupInfo {
  group_openid?: string;
  group_name?: string;
  group_finger_memo?: string;
  group_class_text?: string;
  group_tags?: string[];
  group_member_num?: number;
}

/** key = `${appId}:${openid}`，不同机器人下同一群的资料互不覆盖。 */
export const GROUP_INFO_CACHE = new Map<string, GroupInfo>();
export const groupInfoCacheKey = (appId: string, openid: string) => `${appId}:${openid}`;

/** 批量补齐群资料：命中缓存直接用，未命中的并发拉取（最多 limit 个）。 */
export function useGroupInfos(rpcCall: RpcCall, appId: string, ids: string[], limit = 30): Record<string, GroupInfo> {
  const [map, setMap] = React.useState<Record<string, GroupInfo>>({});
  const idsKey = ids.join("\u0000");
  React.useEffect(() => {
    let alive = true;
    const collect = () => {
      const next: Record<string, GroupInfo> = {};
      for (const id of ids) {
        const info = GROUP_INFO_CACHE.get(groupInfoCacheKey(appId, id));
        if (info) next[id] = info;
      }
      if (alive) setMap(next);
    };
    const missing = ids.filter((id) => !GROUP_INFO_CACHE.has(groupInfoCacheKey(appId, id)));
    if (!missing.length) {
      if (ids.length) collect();
      else setMap({});
      return;
    }
    void Promise.all(missing.slice(0, limit).map(async (id) => {
      const key = groupInfoCacheKey(appId, id);
      try {
        const res = await rpcCall("platform.group.info", { ...(appId ? { appId } : {}), groupOpenid: id });
        if (res.ok) GROUP_INFO_CACHE.set(key, (val(res) ?? {}) as GroupInfo);
      } catch { /* 群资料只是展示增强，失败静默 */ }
      if (!GROUP_INFO_CACHE.has(key)) GROUP_INFO_CACHE.set(key, {});
    })).then(collect);
    return () => { alive = false; };
  }, [idsKey, rpcCall, appId, limit]);
  return map;
}
