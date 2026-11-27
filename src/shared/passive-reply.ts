/**
 * 被动回复「窗口 + 次数上限」的唯一事实来源。
 *
 * 官方 20261117 变更（群消息接口）：
 *  - **窗口**：群被动回复有效期由 5 分钟延长至 60 分钟（单聊本就 60 分钟）；
 *  - **次数**：群每条消息被动回复上限 5 次；机器人开发者（机器人账号的管理员）
 *    为该群群主/管理员时提升至 50 次；
 *  - 群消息的 msg_id 还可用单聊接口 `POST /v2/users/{user_openid}/messages` 私聊回复
 *    该群消息发送者（需好友关系），有效时间与次数按群规则计算，且与群内回复**共用**
 *    同一个 msg_id 的次数上限——本项目暂未接入该能力，接入时次数预算须与本模块共用。
 *
 * 单聊（C2C）未变：60 分钟 / 每条消息 4 次。
 *
 * 群内角色如何取：`GET /v2/groups/{group_openid}/bot_state` 的 `member_role`
 * （owner/admin/member），见 `host/qq/group-role.ts` 的带缓存封装。
 * 客户端界面（配置项上下限、文案）也从本模块取数，避免多处硬编码漂移。
 */
import type { ReplyTarget } from "./types.js";

/** 回复场景（与 ReplyTarget["scope"] 同源）。 */
export type ReplyScope = ReplyTarget["scope"];

/** 被动回复有效窗口（毫秒）。 */
export const PASSIVE_REPLY_WINDOW_MS: Readonly<Record<ReplyScope, number>> = Object.freeze({
  c2c: 60 * 60 * 1000,
  /** 20261117 起由 5 分钟延长为 60 分钟。 */
  group: 60 * 60 * 1000,
});

/** 每条用户消息的被动回复次数上限（默认场景）。 */
export const PASSIVE_REPLY_LIMIT: Readonly<Record<ReplyScope, number>> = Object.freeze({
  c2c: 4,
  group: 5,
});

/** 机器人为该群群主/管理员时的群被动回复次数上限（20261117 新增）。 */
export const PASSIVE_REPLY_LIMIT_GROUP_ADMIN = 50;

/** 配置项 maxRepliesPerMessage 的默认值（沿用历史默认 5，不改变既有机器人行为）。 */
export const MAX_REPLIES_DEFAULT = PASSIVE_REPLY_LIMIT.group;

/** 配置项 maxRepliesPerMessage 的取值上限（必须 ≥ 平台群上限）。 */
export const MAX_REPLIES_CAP = PASSIVE_REPLY_LIMIT_GROUP_ADMIN;

/** 群内「群主/管理员」角色取值（bot_state.member_role）。 */
export const GROUP_ADMIN_ROLES: readonly string[] = Object.freeze(["owner", "admin"]);

/** 该群内角色是否属于群主/管理员。 */
export function isGroupAdminRole(role: string | null | undefined): boolean {
  return typeof role === "string" && GROUP_ADMIN_ROLES.includes(role);
}

/**
 * 平台允许的被动回复次数上限。
 * groupRole 缺省（未探测到 / 探测失败）时按保守值 5 处理，避免触发平台 40034128。
 */
export function passiveReplyLimitFor(scope: ReplyScope, groupRole?: string | null): number {
  if (scope !== "group") return PASSIVE_REPLY_LIMIT[scope];
  return isGroupAdminRole(groupRole)
    ? PASSIVE_REPLY_LIMIT_GROUP_ADMIN
    : PASSIVE_REPLY_LIMIT.group;
}

/** 被动回复窗口：chat 键形如 `group:<openid>` / `c2c:<openid>`。 */
export function passiveWindowMsForChat(chat: string): number {
  return chat.startsWith("c2c:") ? PASSIVE_REPLY_WINDOW_MS.c2c : PASSIVE_REPLY_WINDOW_MS.group;
}

/** 被动回复窗口（秒），用于界面倒计时。 */
export function passiveWindowSecForChat(chat: string): number {
  return Math.floor(passiveWindowMsForChat(chat) / 1000);
}

/**
 * 生效的被动回复次数上限 = min(配置值, 平台上限)。
 * 配置值非法（NaN/≤0）时回落默认值；角色未知时平台上限为保守的 5。
 */
export function effectiveReplyLimit(
  configured: number,
  scope: ReplyScope,
  groupRole?: string | null,
): number {
  const cap = passiveReplyLimitFor(scope, groupRole);
  const value = Math.floor(Number(configured));
  const want = Number.isFinite(value) && value > 0 ? value : MAX_REPLIES_DEFAULT;
  return Math.max(1, Math.min(want, cap));
}

/**
 * 「边生成边发」所需的最小回复预算：有效上限低于该值时不提前分段发送，
 * 整条回退到 turn/end 一次性发送。理由是提前发送会把预算切碎——
 * 群默认 5 次（非管理员）时一个多步 turn 很容易中途耗尽，后半段只能转主动消息或入出箱；
 * 机器人为群主/管理员（平台 50 次）时才有余量。单聊固定 4 次，一律不提前发送。
 */
export const INCREMENTAL_MIN_BUDGET = 10;

/**
 * 「边生成边发」的攒字阈值：助手文本累计到该字数才尝试提前发出。
 * 阈值存在的意义是避免把「好的，我看一下」这类短句单独刷成一条群消息。
 */
export const INCREMENTAL_FLUSH_CHARS = 300;
