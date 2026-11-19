/**
 * AI 操作助手：动作码表 + 零 token 的本地意图解析。
 *
 * 设计目标（用户硬要求）：「尽量控制减少 AI 接口调用请求和用量，用最少的 token 解决最大的智能化需求」。
 * 因此绝大多数指令在本地用正则解析完成，**完全不调用 LLM**；只有本地无法理解的指令
 * 才走一次极小的 LLM 路由调用（见 service.ts）。所有面向用户的回复都是本地模板生成，
 * 绝不让 LLM 生成长篇文字——这是省 token 的关键。
 */

export type AiScope = "group" | "guild";
export type AiEntityKind = "member" | "channel" | "role";

/** 客户端把已加载的成员/子频道/身份组以极简 {id,name} 传来，用于本地把昵称解析成 ID。 */
export interface AiEntity {
  id: string;
  name: string;
  kind: AiEntityKind;
}

/** 归一化后的操作意图。short key 是为 LLM 输出省 token。 */
export interface AiAction {
  a: string;                       // 动作码
  who?: string;                    // 目标昵称 / openid / userid（原始文本，service 再解析）
  min?: number;                    // 分钟
  text?: string;                   // 消息正文 / 子频道名
  id?: string;                     // 消息 ID 等
  pass?: boolean;                  // 审批结果
  type?: number;                   // 子频道类型
}

export interface AiResolveContext {
  scope: AiScope;
  groupOpenid?: string;
  guildId?: string;
  channelId?: string;
  entities: AiEntity[];
}

export interface AiChatRequest extends AiResolveContext {
  appId: string;
  text: string;
}

/** {code, desc} —— LLM 兜底时按 scope 只发这一小段，避免全量表。 */
export const GROUP_ACTIONS: ReadonlyArray<readonly [string, string]> = [
  ["g.info", "查看群资料"],
  ["g.members", "查看群成员"],
  ["g.mute", "禁言成员(who,min分钟)"],
  ["g.unmute", "解除成员禁言(who)"],
  ["g.muteAll", "全员禁言(min分钟，0解除)"],
  ["g.kick", "移出群(who)"],
  ["g.black", "加入群黑名单(who)"],
  ["g.unblack", "从黑名单移除(who)"],
  ["g.join", "查看入群申请"],
  ["g.approve", "审批入群(who,pass=true通过/false拒绝)"],
  ["g.send", "发送群消息(text)"],
  ["g.modOn", "开启AI群规审核"],
  ["g.modOff", "关闭AI群规审核"],
  ["g.autoOn", "开启入群自动审批"],
  ["g.autoOff", "关闭入群自动审批"],
  ["g.logs", "查看审核/审批记录"],
];

export const GUILD_ACTIONS: ReadonlyArray<readonly [string, string]> = [
  ["c.info", "查看频道详情"],
  ["c.channels", "查看子频道列表"],
  ["c.members", "查看频道成员"],
  ["c.roles", "查看身份组"],
  ["c.createCh", "创建子频道(text=名字)"],
  ["c.delCh", "删除子频道(who=名字或ID)"],
  ["c.send", "发送频道消息(text)"],
  ["c.muteAll", "全员禁言(min分钟，0解除)"],
  ["c.mute", "禁言成员(who,min分钟)"],
  ["c.unmute", "解除成员禁言(who)"],
  ["c.kick", "移出频道成员(who)"],
  ["c.recall", "撤回消息(id=消息ID)"],
  ["c.modOn", "开启频道AI接管"],
  ["c.modOff", "关闭频道AI接管"],
  ["c.replyOn", "开启AI自动回帖"],
  ["c.replyOff", "关闭AI自动回帖"],
  ["c.logs", "查看AI记录"],
];

export const COMMON_ACTIONS: ReadonlyArray<readonly [string, string]> = [
  ["help", "列出我能做的操作"],
];

export const actionsForScope = (scope: AiScope): ReadonlyArray<readonly [string, string]> =>
  scope === "group" ? GROUP_ACTIONS : GUILD_ACTIONS;

/** 给 LLM 的极简路由提示词：只列当前 scope 的动作，短 key，要求单行 JSON。 */
export function routerSystemPrompt(scope: AiScope): string {
  const table = [...actionsForScope(scope), ...COMMON_ACTIONS]
    .map(([code, desc]) => `${code}=${desc}`).join(" ");
  return [
    "你是操作路由器，把用户指令转成一行JSON，不要解释、不要代码围栏。",
    `可用动作：${table}`,
    "字段：a=动作码，who=成员/子频道名字或ID，min=分钟(整数)，text=消息正文或子频道名，id=消息ID，pass=true/false。",
    `输出示例：{"a":"${scope === "group" ? "g.mute" : "c.mute"}","who":"张三","min":10}`,
    "理解不了就输出：{\"a\":\"help\"}",
  ].join("\n");
}

// ── 数字 / 时长解析 ────────────────────────────────────────────────────────
const CN_DIGITS: Record<string, number> = {
  零: 0, 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10,
};
function cnNumber(s: string): number | null {
  if (/^\d+$/.test(s)) return Number.parseInt(s, 10);
  if (s === "十") return 10;
  if (s.startsWith("十") && CN_DIGITS[s[1]!] != null) return 10 + CN_DIGITS[s[1]!]!;
  if (s.endsWith("十") && CN_DIGITS[s[0]!] != null) return CN_DIGITS[s[0]!]! * 10;
  if (/^[一二两三四五六九]$/.test(s)) return CN_DIGITS[s]!;
  return null;
}

/** 把「10分钟 / 半小时 / 1小时 / 1天 / 永久 / 十分钟」解析为分钟，QQ 上限 7 天。 */
export function parseMinutes(input: string): number | null {
  if (!input) return null;
  if (/永久| indefinitely|forever/i.test(input)) return 10080;
  const day = /(\d+|[一二两三四五六七八九十]+)\s*天/.exec(input);
  if (day) { const n = cnNumber(day[1]!); return n == null ? null : Math.min(10080, n * 1440); }
  const hour = /(\d+|[一二两三四五六七八九十]+)\s*(小时|个小时|h)/i.exec(input);
  if (hour) { const n = cnNumber(hour[1]!); return n == null ? null : Math.min(10080, n * 60); }
  if (/半小时/.test(input)) return 30;
  const min = /(\d+|[一二两三四五六七八九十]+)\s*(分钟|分|min|m)\b/i.exec(input);
  if (min) { const n = cnNumber(min[1]!); return n == null ? null : Math.min(10080, n); }
  return null;
}

const norm = (s: string): string => s.toLowerCase()
  .replace(/[＠@]/g, "").replace(/[\s"'“”‘’《》<>（）()\[\]【】,，。.!！?？:：;；—_-]/g, "");

/** 从剩余文本里把昵称解析成实体 ID；要求唯一命中，避免误伤。 */
export function resolveEntity(raw: string | undefined, entities: AiEntity[], kinds?: AiEntityKind[]):
  { id: string; name: string } | null {
  const r = norm(raw ?? "");
  if (!r) return null;
  const pool = entities.filter((e) => !kinds || kinds.includes(e.kind));
  // 直接给 ID（≥6 位且看起来像 ID）
  const direct = pool.find((e) => e.id && (e.id === raw?.trim() || (e.id.length >= 6 && r.includes(e.id.toLowerCase()))));
  if (direct) return { id: direct.id, name: direct.name };
  // ID 裸串（QQ openid / guild userid 通常很长）
  const idMatch = /[a-z0-9]{12,}/i.exec(r);
  if (idMatch && pool.some((e) => e.id.toLowerCase() === idMatch[0])) {
    const hit = pool.find((e) => e.id.toLowerCase() === idMatch[0])!;
    return { id: hit.id, name: hit.name };
  }
  // 名字包含匹配，取最长、唯一
  const hits = pool.filter((e) => {
    const n = norm(e.name);
    return n.length >= 1 && (r.includes(n) || n.includes(r));
  }).sort((a, b) => b.name.length - a.name.length);
  if (hits.length === 1) return { id: hits[0]!.id, name: hits[0]!.name };
  if (hits.length > 1 && hits[0]!.name.length > (hits[1]!.name.length || 0)) {
    return { id: hits[0]!.id, name: hits[0]!.name };
  }
  return null;
}

/** 去掉命令词与时长词，剩下的当作目标昵称 / 正文。 */
function remainder(text: string, patterns: RegExp[], withMinutes = false): string {
  let s = text;
  for (const p of patterns) s = s.replace(p, " ");
  if (withMinutes) {
    s = s.replace(/(\d+|[一二两三四五六七八九十]+)\s*(分钟|分|小时|个小时|天|min|h|m)\b/gi, " ");
    s = s.replace(/永久|forever|indefinitely/gi, " ");
  }
  return s.replace(/[＠@"“”‘’《》<>（）()\[\]【】,，。.!！?？:：;；—_-]/g, " ").replace(/\s+/g, " ").trim();
}

// ── 本地意图解析（零 token） ───────────────────────────────────────────────
/**
 * 尝试用纯本地规则理解指令。返回 null 表示需要 LLM 兜底。
 * 顺序很重要：更具体的模式放前面（如「解除禁言」要先于「禁言」）。
 */
export function parseLocal(text: string, scope: AiScope): AiAction | null {
  const s = text.trim();
  if (!s) return null;
  const low = s.toLowerCase();
  const isGroup = scope === "group";
  const P = isGroup ? "g" : "c";

  // 帮助 / 能力
  if (/^(help|帮助|能做什么|你会什么|功能|菜单|\?|？)$/i.test(s)) return { a: "help" };

  // 查看类（只读，最安全）
  if (/群资料|群信息|群详情/.test(s) && isGroup) return { a: "g.info" };
  if (/频道资料|频道信息|频道详情/.test(s) && !isGroup) return { a: "c.info" };
  if (/子频道|频道列表|频道有哪些/.test(s) && !isGroup) return { a: "c.channels" };
  if (/身份组|角色列表/.test(s) && !isGroup) return { a: "c.roles" };
  if (/(查看|列出|拉一下|显示|看|获取)?\s*(群|本群)?成员(列表)?/.test(s) && isGroup && !/频道/.test(s)) return { a: "g.members" };
  if (/(查看|列出|显示|看|获取)?\s*频道成员/.test(s) && !isGroup) return { a: "c.members" };
  if (/入群申请|加群申请|入群请求|待审批/.test(s) && isGroup) return { a: "g.join" };
  if (/审核记录|违规记录|处罚记录|审批记录|操作记录|日志|logs?/.test(low)) return { a: `${P}.logs` };

  // 开关配置
  if (/(开启|打开|启用|on)\s*(ai\s*)?(群规|群审核|群聊审核|内容审核)/i.test(low) && isGroup) return { a: "g.modOn" };
  if (/(关闭|停用|禁用|off)\s*(ai\s*)?(群规|群审核|群聊审核|内容审核)/i.test(low) && isGroup) return { a: "g.modOff" };
  if (/(开启|打开|启用|on)\s*(入群)?自动审批/i.test(low) && isGroup) return { a: "g.autoOn" };
  if (/(关闭|停用|禁用|off)\s*(入群)?自动审批/i.test(low) && isGroup) return { a: "g.autoOff" };
  if (/(开启|打开|启用|on)\s*(频道)?(ai\s*)?(接管|自动审核|内容审核)/i.test(low) && !isGroup) return { a: "c.modOn" };
  if (/(关闭|停用|禁用|off)\s*(频道)?(ai\s*)?(接管|自动审核|内容审核)/i.test(low) && !isGroup) return { a: "c.modOff" };
  if (/(开启|打开|启用|on)\s*(ai\s*)?自动回帖/i.test(low) && !isGroup) return { a: "c.replyOn" };
  if (/(关闭|停用|禁用|off)\s*(ai\s*)?自动回帖/i.test(low) && !isGroup) return { a: "c.replyOff" };

  // 解除禁言（必须在禁言之前）
  if (/(解除|取消|Removing|remove)\s*(成员)?\s*禁言/i.test(low)) {
    const who = remainder(s, [/(解除|取消)\s*(成员)?\s*禁言/i]);
    return { a: `${P}.unmute`, who: who || undefined };
  }
  // 全员禁言 / 解除全员（群聊与频道都支持）
  if (/全员|全体|所有人|所有人禁言|全员 mute/.test(low)) {
    if (/解除|取消|off/i.test(low)) return { a: `${P}.muteAll`, min: 0 };
    const min = parseMinutes(s) ?? 10;
    return { a: `${P}.muteAll`, min };
  }

  // 审批（通过/拒绝）
  if (isGroup && /(通过|同意|批准|拒绝|驳回)\s*(入群|加群)?\s*(申请|请求)?/.test(s)) {
    const pass = /通过|同意|批准/.test(s);
    const who = remainder(s, [/(通过|同意|批准|拒绝|驳回)\s*(入群|加群)?\s*(申请|请求)?/]);
    return { a: "g.approve", who: who || undefined, pass };
  }

  // 拉黑 / 移出黑名单
  if (isGroup && /(拉黑|加入黑名单|黑名单.*添加|添加.*黑名单)/.test(s)) {
    return { a: "g.black", who: remainder(s, [/(拉黑|加入黑名单|添加.*黑名单|黑名单.*添加)/]) || undefined };
  }
  if (isGroup && /(解除黑名单|移出黑名单|取消拉黑|从黑名单|移除黑名单)/.test(s)) {
    return { a: "g.unblack", who: remainder(s, [/(解除黑名单|移出黑名单|取消拉黑|从黑名单|移除黑名单)/]) || undefined };
  }

  // 禁言成员（群 / 频道）
  if (/禁言|mute(?!\s*all)/i.test(low) && !/全员|全体/.test(low)) {
    const min = parseMinutes(s) ?? 10;
    const who = remainder(s, [/(禁言|mute)/i], true);
    return { a: `${P}.mute`, who: who || undefined, min };
  }

  // 移出 / 踢
  if (/(移出|踢出|踢掉|踢|remove\s*(from)?)/i.test(low)) {
    const who = remainder(s, [/(移出|踢出|踢掉|踢|从(群|频道)?|remove\s*(from)?)/i]);
    return { a: `${P}.kick`, who: who || undefined };
  }

  // 撤回消息（频道）
  if (!isGroup && /(撤回|删除消息|delete\s*message)/i.test(low)) {
    const id = /[a-z0-9]{10,}/i.exec(s)?.[0];
    return { a: "c.recall", id };
  }

  // 创建 / 删除子频道
  if (!isGroup && /(创建|新建|建一个|添加)\s*(子频道|频道)/.test(s)) {
    const text = remainder(s, [/(创建|新建|建一个|添加)\s*(子频道|频道)?/]);
    return { a: "c.createCh", text: text || undefined };
  }
  if (!isGroup && /(删除|删掉|移除)\s*(子频道|频道)/.test(s)) {
    const who = remainder(s, [/(删除|删掉|移除)\s*(子频道|频道)?/]);
    return { a: "c.delCh", who: who || undefined };
  }

  // 发消息（放最后，避免吃掉上面的动词）
  if (/(发送|发一条|发个|发\s*消息|说一句|说|send|reply)/i.test(low)) {
    const text = remainder(s, [/(发送|发一条|发个|发消息|发|说一句|说一下|说|send|reply|消息)/i]);
    return { a: `${P}.send`, text: text || undefined };
  }

  return null;
}

/** 解析 LLM 返回的紧凑 JSON（容错：去代码围栏、抓第一个 {}、字段白名单）。 */
export function parseRouterJson(raw: string, scope: AiScope): AiAction | null {
  if (!raw || typeof raw !== "string") return null;
  const cleaned = raw.replace(/```(?:json)?/gi, "").trim();
  const m = /\{[\s\S]*?\}/.exec(cleaned);
  if (!m) return null;
  let obj: Record<string, unknown>;
  try { obj = JSON.parse(m[0]) as Record<string, unknown>; } catch { return null; }
  const a = typeof obj.a === "string" ? obj.a.trim() : "";
  const allowed = new Set([...actionsForScope(scope).map(([c]) => c), "help"]);
  if (!a || !allowed.has(a)) return null;
  const action: AiAction = { a };
  if (typeof obj.who === "string") action.who = obj.who.trim().slice(0, 120) || undefined;
  if (typeof obj.text === "string") action.text = obj.text.trim().slice(0, 1000) || undefined;
  if (typeof obj.id === "string") action.id = obj.id.trim().slice(0, 120) || undefined;
  if (typeof obj.pass === "boolean") action.pass = obj.pass;
  if (typeof obj.type === "number") action.type = obj.type;
  const min = typeof obj.min === "number" ? obj.min : Number.parseInt(String(obj.min ?? ""), 10);
  if (Number.isFinite(min)) action.min = Math.max(0, Math.min(10080, min));
  return action;
}

/** 智能建议：完全本地生成（零 token、零 RPC），基于 scope 与已加载实体。 */
export function suggestActions(ctx: AiResolveContext): string[] {
  if (ctx.scope === "group") {
    const out = ["查看群资料", "查看群成员", "查看入群申请", "全员禁言 10分钟", "开启AI群规审核"];
    if (ctx.entities.some((e) => e.kind === "member")) out.push("禁言成员 10分钟");
    return out;
  }
  const out = ["查看频道详情", "查看子频道列表", "查看频道成员", "查看身份组"];
  if (ctx.entities.some((e) => e.kind === "member")) out.push("全员禁言 10分钟");
  if (ctx.entities.some((e) => e.kind === "channel")) out.push("发送频道消息 大家好");
  return out;
}

/** 动作的可读名称（本地模板，不耗 token）。 */
export const ACTION_LABELS: Readonly<Record<string, string>> = Object.freeze({
  "help": "可用操作",
  "g.info": "查看群资料", "g.members": "查看群成员", "g.mute": "禁言成员", "g.unmute": "解除禁言", "g.muteAll": "全员禁言",
  "g.kick": "移出群", "g.black": "加入黑名单", "g.unblack": "移出黑名单", "g.join": "查看入群申请",
  "g.approve": "审批入群", "g.send": "发送群消息", "g.modOn": "开启AI群规审核", "g.modOff": "关闭AI群规审核",
  "g.autoOn": "开启自动审批", "g.autoOff": "关闭自动审批", "g.logs": "查看记录",
  "c.info": "查看频道详情", "c.channels": "查看子频道", "c.members": "查看频道成员", "c.roles": "查看身份组",
  "c.createCh": "创建子频道", "c.delCh": "删除子频道", "c.send": "发送频道消息", "c.muteAll": "全员禁言",
  "c.mute": "禁言成员", "c.unmute": "解除禁言", "c.kick": "移出频道", "c.recall": "撤回消息",
  "c.modOn": "开启频道AI接管", "c.modOff": "关闭频道AI接管", "c.replyOn": "开启AI自动回帖",
  "c.replyOff": "关闭AI自动回帖", "c.logs": "查看记录",
});
