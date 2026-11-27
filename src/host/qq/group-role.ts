/**
 * 机器人在某个群内的角色（`bot_state.member_role`）带缓存查询。
 *
 * 用途：官方 20261117 起，机器人开发者（机器人账号的管理员）为该群群主/管理员时，
 * 该群每条消息的被动回复上限由 5 次提升到 50 次（见 shared/passive-reply.ts）。
 * 判定依据取 `GET /v2/groups/{group_openid}/bot_state` 的 `member_role`：
 * 机器人账号本身在该群是 admin/owner，即认为其开发者满足该条件（最接近的平台可查信号）。
 *
 * 保守原则（重要）：
 *  - 探测失败 / 无权限 / 非法 openid 一律按 `member` 处理 → 平台上限按 5 次算，
 *    宁可少发几条也不去撞平台的 40034128（被动回复次数超限）；
 *  - **失败结果同样进缓存**，避免在回复热路径上每条消息都打一次注定失败的请求；
 *  - 本模块任何情况下都不向调用方抛错。
 */
import type { QqApiClient } from "./api.js";

/** 角色缓存有效期：群内角色变动极少，10 分钟足够新。 */
export const GROUP_ROLE_TTL_MS = 10 * 60 * 1000;

/** 探测失败 / 未知时的回落角色（保守：群被动回复上限仍为 5 次）。 */
export const FALLBACK_GROUP_ROLE = "member";

/** 角色探测超时（毫秒）：超时按探测失败处理，避免把回复链路一起拖住。 */
export const GROUP_ROLE_TIMEOUT_MS = 1_500;

/** 给探测请求加超时；超时以 reject 结束，交由调用方统一的 catch 处理。 */
function withTimeout<T>(task: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`群角色探测超时（${ms}ms）`)), ms);
    task.then(
      (value) => { clearTimeout(timer); resolve(value); },
      (error) => { clearTimeout(timer); reject(error); },
    );
  });
}

interface GroupRoleCacheEntry {
  role: string;
  at: number;
}

/** 缓存键 `appId:groupOpenid`——多机器人同群时互不串味。 */
const cache = new Map<string, GroupRoleCacheEntry>();

/** 清空角色缓存（测试 / 需要强制重新探测时调用）。 */
export function clearGroupRoleCache(): void {
  cache.clear();
}

/**
 * 取机器人在该群的角色（owner / admin / member）。永不抛错；
 * 任何失败都回落 {@link FALLBACK_GROUP_ROLE} 并缓存，调用方无需 try/catch。
 */
export async function botRoleInGroup(
  client: Pick<QqApiClient, "getBotGroupState">,
  appId: string,
  groupOpenid: string,
  logger?: Pick<Console, "warn">,
): Promise<string> {
  const openid = String(groupOpenid ?? "").trim();
  if (!openid) return FALLBACK_GROUP_ROLE;
  const key = `${appId}:${openid}`;
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && now - hit.at < GROUP_ROLE_TTL_MS) return hit.role;
  try {
    const state = await withTimeout(client.getBotGroupState(openid), GROUP_ROLE_TIMEOUT_MS);
    const role = typeof state?.member_role === "string" && state.member_role
      ? state.member_role
      : FALLBACK_GROUP_ROLE;
    cache.set(key, { role, at: Date.now() });
    return role;
  } catch (error) {
    // 失败也缓存：角色探测接口需要权限，缺权限时不该每条回复都重试一次。
    cache.set(key, { role: FALLBACK_GROUP_ROLE, at: Date.now() });
    // 告警本身出问题也不能破坏「绝不抛错」的承诺（日志实现是可注入的）。
    try {
      logger?.warn?.(
        `[dsh-qqbot] 群角色探测失败，按普通成员处理（群被动回复上限 5 次）chat=group:${openid}:`,
        error instanceof Error ? error.message : error,
      );
    } catch { /* 忽略日志异常 */ }
    return FALLBACK_GROUP_ROLE;
  }
}
