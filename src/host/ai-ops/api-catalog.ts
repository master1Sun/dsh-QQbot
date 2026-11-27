/**
 * Agent 可用的 QQ 频道 OpenAPI 精简目录。
 *
 * 与设置页「事件说明」展示的 48 条接口一致，但描述压成一行，
 * 只在 agent 明确需要时由 qqbot_api_help 工具返回，平时不占 prompt。
 * qqbot_api_call 也用这份目录做白名单，避免模型拼出任意路径。
 */

export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/** [方法, 路径模板, 用途, 限制标记(逗号分隔)] —— 标记仅用于提示，不影响调用。 */
export type ApiEntry = readonly [ApiMethod, string, string, string?];

export const GUILD_API_CATALOG: ReadonlyArray<ApiEntry> = [
  // 频道与子频道
  ["GET", "/users/@me/guilds", "拉取机器人已加入的频道列表"],
  ["GET", "/guilds/{guild_id}", "频道资料（名称、创建者、成员数等）"],
  ["GET", "/guilds/{guild_id}/channels", "全部子频道列表"],
  ["GET", "/channels/{channel_id}", "单个子频道资料"],
  ["POST", "/guilds/{guild_id}/channels", "新建子频道；body: name,type,position?,parent_id?,private_type?,speak_permission?", "admin"],
  ["PATCH", "/channels/{channel_id}", "修改子频道；body 同上可用字段", "admin"],
  ["DELETE", "/channels/{channel_id}", "删除子频道", "admin"],
  ["GET", "/channels/{channel_id}/online_nums", "子频道在线人数"],
  // 频道成员
  ["GET", "/guilds/{guild_id}/members", "成员列表（分页）；query: limit,after,before", "private"],
  ["GET", "/guilds/{guild_id}/members/{user_id}", "单个成员资料", "private"],
  ["DELETE", "/guilds/{guild_id}/members/{user_id}", "移出成员", "admin"],
  ["PATCH", "/guilds/{guild_id}/mute", "全员禁言/解除；body: mute_seconds(0=解除),user_ids?", "admin"],
  ["PATCH", "/guilds/{guild_id}/members/{user_id}/mute", "指定成员禁言；body: mute_seconds(0=解除)", "admin"],
  ["GET", "/guilds/{guild_id}/members/{user_id}/roles", "成员的身份组列表"],
  ["PUT", "/guilds/{guild_id}/members/{user_id}/roles/{role_id}", "给成员加身份组；身份组 5 需 body: channel.id", "admin"],
  ["DELETE", "/guilds/{guild_id}/members/{user_id}/roles/{role_id}", "移除成员身份组", "admin"],
  ["GET", "/guilds/{guild_id}/roles/{role_id}/members", "指定身份组的成员列表", "private"],
  // 身份组与子频道权限
  ["GET", "/guilds/{guild_id}/roles", "身份组列表"],
  ["POST", "/guilds/{guild_id}/roles", "新建身份组；body: name,color?,hoist?", "admin"],
  ["PATCH", "/guilds/{guild_id}/roles/{role_id}", "修改身份组", "admin"],
  ["DELETE", "/guilds/{guild_id}/roles/{role_id}", "删除自定义身份组（内置 1/2/4/5 不可删）", "admin"],
  ["GET", "/channels/{channel_id}/roles/{role_id}", "身份组在该子频道的权限位"],
  ["PATCH", "/channels/{channel_id}/roles/{role_id}", "修改身份组在该子频道的权限位", "admin"],
  // 消息与发言
  ["POST", "/channels/{channel_id}/messages", "发消息；body: content,msg_type?,msg_id?（带 msg_id 为被动回复）", "quota"],
  ["GET", "/channels/{channel_id}/messages", "消息列表；query: limit,before,after（取真实 message_id）", "msgId"],
  ["DELETE", "/channels/{channel_id}/messages/{message_id}", "撤回消息；query: hide_tip?（message_id 必须真实）", "admin,msgId"],
  ["GET", "/guilds/{guild_id}/message/setting", "机器人消息频率设置"],
  ["PUT", "/guilds/{guild_id}/message/setting", "修改消息频率设置", "admin"],
  // 内容管理
  ["GET", "/guilds/{guild_id}/announces", "官方无公告列表接口，禁止调用", "unsupported"],
  ["POST", "/guilds/{guild_id}/announces", "发布公告；body: message_id,channel_id,announces_type", "admin,msgId"],
  ["DELETE", "/guilds/{guild_id}/announces/{message_id}", "删除公告（message_id=all 删全部）", "admin"],
  ["GET", "/channels/{channel_id}/pins", "精华消息列表"],
  ["PUT", "/channels/{channel_id}/pins/{message_id}", "添加精华消息（每子频道最多 20 条）", "admin,msgId"],
  ["DELETE", "/channels/{channel_id}/pins/{message_id}", "移除精华消息", "admin,msgId"],
  ["GET", "/channels/{channel_id}/schedules", "日程列表"],
  ["GET", "/channels/{channel_id}/schedules/{schedule_id}", "单个日程详情"],
  ["POST", "/channels/{channel_id}/schedules", "创建日程；body: name,start_timestamp,end_timestamp,remind_type（毫秒字符串，≤7天）", "admin,schedule"],
  ["PATCH", "/channels/{channel_id}/schedules/{schedule_id}", "修改日程", "admin,schedule"],
  ["DELETE", "/channels/{channel_id}/schedules/{schedule_id}", "删除日程", "admin"],
  ["POST", "/channels/{channel_id}/audio", "音频控制（上麦/下麦等）", "audio"],
  ["GET", "/channels/{channel_id}/threads", "论坛帖子列表（无需 forum_id）", "forum"],
  ["GET", "/channels/{channel_id}/threads/{thread_id}", "帖子详情", "forum"],
  ["PUT", "/channels/{channel_id}/threads", "发表帖子；body: title,content", "forum"],
  ["DELETE", "/channels/{channel_id}/threads/{thread_id}", "删除帖子", "forum"],
  // 接口权限
  ["GET", "/channels/{channel_id}/permissions", "子频道权限设置"],
  ["PUT", "/channels/{channel_id}/permissions/all", "修改全员权限", "admin"],
  ["GET", "/guilds/{guild_id}/api_permission", "各接口授权状态（auth_status=1 才是已授权）"],
  ["POST", "/guilds/{guild_id}/api_permission", "申请接口授权，返回授权链接"],
];

/**
 * Agent 可用的 QQ 群官方 OpenAPI 精简目录（与频道目录并列）。
 * 群 OpenID 由 qqbot_api_call 从当前会话自动填充 {group_openid}。
 */
export const GROUP_API_CATALOG: ReadonlyArray<ApiEntry> = [
  // 机器人 / 群信息
  ["GET", "/users/@me", "机器人自身详情（昵称/头像/分享链接）"],
  ["GET", "/v2/groups/{group_openid}/info", "群资料（名称/成员数/标签等）"],
  ["GET", "/v2/groups/{group_openid}/bot_state", "机器人在群内的状态（是否管理员/能否主动发消息）"],
  // 群成员
  ["GET", "/v2/groups/{group_openid}/members", "群成员列表（分页）；query: cursor", "whitelist"],
  ["GET", "/v2/groups/{group_openid}/members/{member_openid}", "单个群成员资料", "whitelist"],
  ["POST", "/v2/groups/{group_openid}/batch_remove_members", "批量移出成员；body: member_openids[]", "admin"],
  // 禁言（官方无全员写接口，全员禁言请遍历成员 add）
  ["GET", "/v2/groups/{group_openid}/restrict_chat_setting", "禁言状态（global_rule + members）", "admin"],
  ["POST", "/v2/groups/{group_openid}/restrict_chat_setting", "成员禁言/解除；body: members[{op:add|update|del,member_openid,mute_expire_at}]（RFC3339，≤20人）", "admin"],
  // 入群申请 / 自动审批
  ["GET", "/v2/groups/{group_openid}/join_request_list", "入群申请列表；query: cursor,limit", "admin"],
  ["POST", "/v2/groups/{group_openid}/approval_join_request/{member_openid}", "审批入群；body: {approve:true/false,...}", "admin"],
  ["GET", "/v2/groups/join_approval_strategy", "入群自动审批策略列表", "admin"],
  ["POST", "/v2/groups/join_approval_strategy", "创建自动审批策略；body: group_openids[],remark?", "admin"],
  ["PATCH", "/v2/groups/join_approval_strategy/{strategy_id}", "修改自动审批策略", "admin"],
  ["DELETE", "/v2/groups/join_approval_strategy/{strategy_id}", "删除自动审批策略", "admin"],
  ["POST", "/v2/groups/join_approval_strategy/{strategy_id}/execute", "执行自动审批策略", "admin"],
  ["POST", "/v2/groups/join_approval_strategy/{strategy_id}/whitelist_users", "改策略白名单号码；body 见官方文档", "admin"],
  // 黑名单
  ["GET", "/v2/groups/{group_openid}/member_blacklist", "群黑名单列表；query: cursor,limit", "admin,whitelist"],
  ["POST", "/v2/groups/{group_openid}/member_blacklist", "黑名单增删；body: {op:add|del,member_openids[]}", "admin,whitelist"],
  // 消息
  ["POST", "/v2/groups/{group_openid}/messages", "发群消息；body: {msg_type:0|2|7|8,content|markdown|media|card,msg_id?,msg_seq?,event_id?,keyboard?,message_reference?}；被动回复 60 分钟内有效、默认 5 次，机器人为该群群主/管理员时 50 次", "quota"],
  ["DELETE", "/v2/groups/{group_openid}/messages/{message_id}", "撤回群消息（发送 2 分钟内；管理员可撤他人消息）", "admin"],
  ["POST", "/v2/groups/{group_openid}/files", "富媒体上传；body: {file_type,url|file_data|upload_id,file_name?,srv_send_msg?},返回 file_info", "media"],
  // 互动 / 面板
  ["GET", "/v2/menu", "全局自定义菜单"],
  ["PUT", "/v2/menu", "修改全局菜单；body: {menu:{items[]}}"],
  ["GET", "/v2/panels", "指令面板列表；query: scope(c2c|group|channel|dm),cursor,limit"],
  ["POST", "/v2/panels", "创建指令面板；body: {scope,target_type,panel:{items[]},group_openids?}"],
  ["GET", "/v2/panels/{panel_id}", "指令面板详情"],
  ["PUT", "/v2/panels/{panel_id}", "修改指令面板；body: {panel:{items,remark,version?}}"],
  ["DELETE", "/v2/panels/{panel_id}", "删除指令面板"],
  ["PUT", "/v2/panels/{panel_id}/target", "改面板关联对象；body: {op:add|del,group_openids?|user_openids?}", "specific"],
  ["PUT", "/interactions/{interaction_id}", "互动回调 ACK（按钮点击，通常自动处理）"],
  // 其它
  ["POST", "/v2/generate_url_link", "生成机器人分享链接；body: {callback_data?}"],
  ["GET", "/v2/users/{user_openid}/info", "用户基本信息（昵称/头像）"],
];

const NOTE_TEXT: Readonly<Record<string, string>> = Object.freeze({
  admin: "需群/频道管理员",
  private: "仅私域机器人且已开通权限",
  whitelist: "需接口白名单权限（内邀）",
  msgId: "必须用真实消息 ID，不能用子频道 ID",
  quota: "主动消息有每日额度",
  forum: "仅论坛子频道，无需 forum_id",
  schedule: "需日程子频道，时间戳为毫秒字符串",
  audio: "仅语音/直播子频道",
  media: "富媒体上传，返回 file_info 供 msg_type=7",
  specific: "仅 target_type=specific 的面板可用",
  unsupported: "官方无此接口，禁止调用",
});

/** 展示给 agent 的一行说明（限制标记压成短括号，避免长篇）。 */
export function describeApi(entry: ApiEntry): string {
  const [method, path, desc, notes] = entry;
  if (!notes) return `${method} ${path} — ${desc}`;
  const text = notes.split(",").map((n) => NOTE_TEXT[n] ?? n).join("；");
  return `${method} ${path} — ${desc}（${text}）`;
}

/** 按场景取目录（默认频道，保持旧调用兼容）。 */
export function catalogForScope(scope?: string): ReadonlyArray<ApiEntry> {
  return scope === "group" ? GROUP_API_CATALOG : GUILD_API_CATALOG;
}

/** 关键词匹配方法/路径/用途；limit 控制返回条数，避免长 prompt。 */
export function findApiEntries(keyword?: string, limit = 12, scope?: string): ApiEntry[] {
  const k = (keyword ?? "").trim().toLowerCase();
  const catalog = catalogForScope(scope);
  const rows = k
    ? catalog.filter(([method, path, desc, notes]) =>
        `${method} ${path} ${desc} ${notes ?? ""}`.toLowerCase().includes(k))
    : catalog.filter(([, , , notes]) => !notes?.includes("unsupported"));
  return rows.slice(0, Math.max(1, Math.min(limit, 48)));
}

/** 仅允许白名单内、且非「禁止调用」的接口；接受路径模板或已填好的真实路径。 */
export function matchExecutableApi(method: string, input: string, scope?: string): { entry: ApiEntry; values: Record<string, string> } | null {
  const m = method.toUpperCase();
  for (const entry of catalogForScope(scope)) {
    const [em, template, , notes] = entry;
    if (em !== m || notes?.includes("unsupported")) continue;
    if (template === input) return { entry, values: {} };
    const hit = pathTemplateRegex(template).exec(input);
    if (!hit) continue;
    const values: Record<string, string> = {};
    let i = 0;
    for (const match of template.matchAll(/\{([a-z_]+)\}/g)) {
      values[match[1]!] = hit[++i]!;
    }
    return { entry, values };
  }
  return null;
}

/** 把路径模板编译成只接受安全 ID 的正则，防止模型拼出路径穿越。 */
export function pathTemplateRegex(template: string): RegExp {
  let source = "";
  let last = 0;
  for (const match of template.matchAll(/\{([a-z_]+)\}/g)) {
    source += template.slice(last, match.index).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "([A-Za-z0-9_-]{1,128})";
    last = (match.index ?? 0) + match[0].length;
  }
  source += template.slice(last).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${source}$`);
}
