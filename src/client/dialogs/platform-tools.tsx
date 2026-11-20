/**
 * 平台能力（QQ OpenAPI 群管理 + 20260810~20261116 新增接口的设置页入口）：
 *
 * 【分类一 · 群聊管理】从「选择群」开始（步骤 1），选群后自动检测机器人群内权限（GET /bot_state）：
 *  - 子标签：群资料（GET /info）/ 群成员（列表/详情/禁言/解除/移除）/ 群黑名单 /
 *            入群审批（拉取/通过/拒绝）/ 审批策略（创建/启停/增删群/执行/白名单/删除）
 *  未选群时群能力区显示引导空态；无管理员权限时，所有需权限的操作禁用并提示。
 *
 * 【分类二 · 通用能力】与群无关：分享链接 / 自定义菜单 / 素材上传 / 图文卡片，
 *  同样以子标签切换，避免所有卡片平铺造成界面错乱。
 * 两大分类以顶层 tab 切换；AI 操作在 agent 聊天里触发，这里只保留执行记录 Tab。
 *
 * 所有 openid/群 id 都通过 GroupPicker 选择或搜索，避免手抄错。
 */
import * as React from "react";
import { createPortal } from "react-dom";
import { DEFAULT_ESCALATION, escalateDuration, type EscalateMode } from "../../shared/moderation-escalation.js";
import { useGroupInfos } from "../group-info.js";
import { fmt, h, t, useLocale } from "../i18n/index.js";
import type { RpcCall } from "../types.js";
import { errText, formatTime, val } from "../ui.js";
import { AiChatPanel } from "./ai-chat-panel.js";

/** 把已知平台错误码翻译成可操作的中文/英文提示，其余原样返回。 */
function friendlyError(message: string): string {
  if (/40034105|主动消息失败|proactive message.*denied/i.test(message)) return t("pt.errProactiveDenied");
  if (/40034141|40034004|图片转存失败|富媒体信息转存失败/i.test(message)) return t("pt.errImageTransfer");
  if (/unknown endpoint/i.test(message)) return t("pt.errHostRestart");
  return message;
}

/** 审核命中但禁言失败时，把平台错误翻译成可操作说明。 */
function modErrorText(error?: string): string {
  if (!error) return "";
  if (/40103004|不允许被禁言/.test(error)) return t("pt.modErrAdminTarget");
  return error;
}

/** 把 ISO 时间串格式化为 "2027-11-19 09:46"，解析失败时原样返回。 */
function fmtExpire(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

/** 需要管理员权限的 member_role。 */
const ADMIN_ROLES = new Set(["admin", "owner"]);

const COMMAND_MENU_ITEMS = [
  { cmd: "/help", name: "帮助" },
  { cmd: "/status", name: "运行状态" },
  { cmd: "/new", name: "新会话" },
  { cmd: "/session", name: "会话信息" },
  { cmd: "/schedule", name: "定时消息" },
  { cmd: "/memory", name: "长期记忆" },
];

/**
 * 指令面板命令按钮的单一数据源：下拉选项、保存校验、回显规范化都从这里取。
 * 平台 PanelItem.name 只是「点击后填入输入框的文本」（官方示例可为任意文案），
 * 我们约定用它承载项目支持的命令，因此统一带前导 /。
 */
const PANEL_CMD_LABELS: Record<string, string> = {
  "/help": "pt.cmdHelp",
  "/status": "pt.cmdStatus",
  "/new": "pt.cmdNew",
  "/session": "pt.cmdSession",
  "/memory": "pt.cmdMemory",
  "/forget": "pt.cmdForget",
  "/recall": "pt.cmdRecall",
  "/broadcast": "pt.cmdBroadcast",
  "/schedule": "pt.cmdSchedule",
  "/stop": "pt.cmdStop",
  "/steer": "pt.cmdSteer",
  "/perm": "pt.cmdPerm",
};
const PANEL_COMMANDS = Object.keys(PANEL_CMD_LABELS);

/**
 * 把面板元素名规范化为合法命令：旧数据/历史保存可能丢了前导 /（如 "status"），
 * 回显与再次保存前都补回，避免查看时被判无效、编辑下拉回显为空。
 * 非命令元素（link）或不属于已知命令的自定义文案原样保留。
 */
function normalizePanelCmd(raw: unknown): string {
  const name = typeof raw === "string" ? raw.trim() : "";
  if (PANEL_COMMANDS.includes(name)) return name;
  const withSlash = name.startsWith("/") ? name : `/${name}`;
  return PANEL_COMMANDS.includes(withSlash) ? withSlash : name;
}

type Perm = "idle" | "checking" | "admin" | "member" | "error";

interface GroupOption {
  value: string;
  label: string;
  source: "config" | "archive";
  hint?: string;
  /** 官方群资料里的真实人数（有值时在下拉里显示人数徽标）。 */
  memberNum?: number;
}

interface MemberRow {
  member_openid: string;
  username: string;
  member_role: string;
  bot?: boolean;
  joined_at?: string;
}

interface BlackRow {
  member_openid: string;
  username: string;
  banned_at: string;
  bot?: boolean;
}

interface JoinRequestRow {
  join_request_id: string;
  member_openid: string;
  username: string;
  apply_at: string;
  apply_source?: string;
  verify_info?: { method?: string; verify_message?: string };
  risk_tips?: string;
}

interface JoinApprovalConfig {
  enabled: boolean;
  requirements: string[];
  allowEmpty: boolean;
  /** 免审批名单：昵称/openid 命中即直接通过，不走 AI。 */
  whitelist: string[];
}

interface JoinAutoLog {
  at: string; username: string; action: "pass" | "keep" | "decline" | "error"; reason: string; intro: string; error?: string;
}

/** 由外层控制台单棵导航树驱动的焦点：指定二级导航项及其三级子 Tab。 */
export interface PlatformFocus {
  nav: string;
  joinTab?: "auto" | "manual" | "records";
  modTab?: "config" | "logs" | "muted";
}

export function PlatformTools({ rpcCall, appId, groups, onNotify, focus, embedded, group: groupProp, onGroupChange }: {
  rpcCall: RpcCall;
  appId: string;
  groups: string[];
  /** 只有报错与「操作成功」这类需要用户知道的结果才上报，由详情页在顶部吸顶展示。 */
  onNotify?: (text: string, tone: "error" | "success") => void;
  /** 由外层控制台单棵导航树驱动的焦点；传入后隐藏本组件自带导航。 */
  focus?: PlatformFocus;
  /** 嵌入控制台内容区：隐藏左侧导航与面板内二级 Tab 条。 */
  embedded?: boolean;
  /** 控制台持有的选中群：切换菜单后仍保留，避免每次重新选群。 */
  group?: string;
  onGroupChange?: (g: string) => void;
}) {
  useLocale(); // 跟随宿主语言
  const [busy, setBusy] = React.useState("");

  /** 统一动作包装：busy / 错误 / 成功提示（后两者上报给详情页）。 */
  const run = React.useCallback(async (key: string, fn: () => Promise<string | void>) => {
    if (!appId) return;
    setBusy(key);
    try {
      const ok = await fn();
      if (typeof ok === "string" && ok) onNotify?.(ok, "success");
    } catch (e) {
      onNotify?.(friendlyError(errText(e)), "error");
    } finally {
      setBusy("");
    }
  }, [appId, onNotify]);

  const btn = (key: string, label: string, onClick: () => void, primary = false, extra: Record<string, unknown> = {}) =>
    h("button", {
      className: `qbot-btn${primary ? " qbot-btnPrimary" : ""}`,
      type: "button",
      disabled: busy === key || extra.disabled === true,
      onClick,
      ...extra,
    }, busy === key ? t("common.loading") : label);

  // ── 群候选：配置白名单 + 归档出现过的群 ──────────────────────────────────
  const [groupOptions, setGroupOptions] = React.useState<GroupOption[]>([]);
  const groupsKey = groups.join("\u0000");
  React.useEffect(() => {
    let alive = true;
    // allowGroups 缺省是 ["*"]（表示不限群），不是真实群号，别塞进选择器。
    const opts: GroupOption[] = groups
      .filter((g) => g && g.trim() !== "*")
      .map((g) => ({ value: g, label: g, source: "config" as const }));
    setGroupOptions(opts);
    if (appId) {
      void rpcCall("platform.archiveChats", { appId }).then((res) => {
        if (!alive || !res.ok) return;
        const chats = (val(res)?.chats ?? []) as Array<{
          scope: string; openid: string; lastSenderName: string; lastTs: string; count: number;
        }>;
        const extras: GroupOption[] = [];
        const seen = new Set(opts.map((o) => o.value));
        for (const c of chats) {
          if (c.scope !== "group" || !c.openid || seen.has(c.openid)) continue;
          seen.add(c.openid);
          const when = c.lastTs ? formatTime(c.lastTs) : "";
          extras.push({
            value: c.openid,
            label: c.lastSenderName ? `${c.lastSenderName} · ${c.openid.slice(0, 12)}…` : c.openid,
            source: "archive",
            hint: fmt("pt.groupArchiveHint", when || "—", String(c.count ?? 0)),
          });
        }
        setGroupOptions([...opts, ...extras]);
      }).catch(() => undefined);
    }
    return () => { alive = false; };
  }, [rpcCall, appId, groupsKey]);

  // 与归档弹窗共用群资料缓存：下拉里显示真实群名 + 人数徽标，失败时回退原标签。
  const groupInfoMap = useGroupInfos(rpcCall, appId, groupOptions.map((o) => o.value));
  const displayOptions = React.useMemo(() => groupOptions.map((o) => {
    const info = groupInfoMap[o.value];
    return {
      ...o,
      label: info?.group_name || o.label,
      memberNum: info?.group_member_num && info.group_member_num > 0 ? info.group_member_num : undefined,
    };
  }), [groupOptions, groupInfoMap]);

  // ── 当前群 + 权限状态 ────────────────────────────────────────────────────
  // 控制台持有选中群（props.group），切到别的菜单再回来仍在；独立弹窗沿用内部 state。
  const [groupLocal, setGroupLocal] = React.useState("");
  const group = groupProp !== undefined ? groupProp : groupLocal;
  const setGroup = React.useCallback((g: string) => {
    setGroupLocal(g);
    onGroupChange?.(g);
  }, [onGroupChange]);
  const [perm, setPerm] = React.useState<Perm>("idle");
  const [permMsg, setPermMsg] = React.useState("");
  const canAdmin = perm === "admin";

  const checkPerm = React.useCallback((g: string) => {
    if (!g) { setPerm("idle"); setPermMsg(""); return; }
    setPerm("checking");
    setPermMsg("");
    void rpcCall("platform.bot.state", { appId, groupOpenid: g }).then((res) => {
      if (!res.ok) {
        setPerm("error");
        setPermMsg(errText(res.error));
        return;
      }
      const role = String(val(res)?.member_role ?? "member");
      if (role === "owner") { setPerm("admin"); setPermMsg(t("pt.permOwner")); }
      else if (ADMIN_ROLES.has(role)) { setPerm("admin"); setPermMsg(t("pt.permAdmin")); }
      else { setPerm("member"); setPermMsg(t("pt.permMember")); }
    }).catch((e) => { setPerm("error"); setPermMsg(errText(e)); });
  }, [rpcCall, appId]);

  // ── AI 群规审核（按群配置；仅管理员群可启用） ──────────────────────────────
  interface ModConfig {
    enabled: boolean;
    categories: string[];
    rules: string[];
    durations: { light: number; medium: number; severe: number };
    whitelist: string[];
    escalateEnabled: boolean;
    escalateMode: EscalateMode;
    escalateFactor: number;
    escalateSteps: number[];
    escalateCap: number;
    strikeWindowDays: number;
    strictness: "lenient" | "normal" | "strict";
  }
  interface ModLog {
    at: string; appId: string; groupId: string; sender: string; senderName: string;
    content: string; level: string; reason: string; category: string; minutes: number; error?: string; noticeError?: string;
    strikeCount?: number; baseMinutes?: number; escalated?: boolean;
  }
  /** 群内当前被禁言的成员（platform.mute.get）。 */
  interface MutedMember {
    member_openid: string;
    mute_expire_at: string;
    username?: string;
  }
  const MOD_CATS = ["illegal", "porn_gamble", "abuse", "ad_spam", "flood"];
  const emptyModConfig = (): ModConfig => ({
    enabled: false, categories: [...MOD_CATS], rules: [],
    durations: { light: 10, medium: 1440, severe: 43200 }, whitelist: [],
    ...DEFAULT_ESCALATION, escalateSteps: [], strikeWindowDays: 30, strictness: "lenient",
  });
  /** 自定义阶梯输入（每行/逗号一个数），保存前归一为数字数组。 */
  const stepsText = (steps: number[]) => (steps ?? []).join(", ");
  const [modCfg, setModCfg] = React.useState<ModConfig>(emptyModConfig());
  const [modCfgLoaded, setModCfgLoaded] = React.useState(false);
  const [modRulesText, setModRulesText] = React.useState("");
  const [modWhiteText, setModWhiteText] = React.useState("");
  const [modStepsText, setModStepsText] = React.useState("");
  /** 自定义规则自测：输入一段文本，用当前草稿规则跑一次纯判定（不处罚、不记日志）。 */
  const [modTestText, setModTestText] = React.useState("");
  const [modTestResult, setModTestResult] = React.useState<{
    level: string; category: string; reason: string; minutes: number;
  } | null>(null);
  const [modLogs, setModLogs] = React.useState<ModLog[]>([]);
  const [modLogsLoaded, setModLogsLoaded] = React.useState(false);
  /** AI 审核面板内层 tab：审核配置 / 处罚记录 / 禁言成员。 */
  const [modInnerTab, setModInnerTab] = React.useState<NonNullable<PlatformFocus["modTab"]>>(focus?.modTab ?? "config");
  const loadModeration = () => void run("mod.get", async () => {
    if (!group) throw new Error(t("pt.groupNoSelect"));
    const res = await rpcCall("moderation.config.get", { appId, groupOpenid: group });
    if (!res.ok) throw new Error(errText(res));
    const cfg = { ...emptyModConfig(), ...(val(res)?.config ?? {}) } as ModConfig;
    setModCfg(cfg);
    setModRulesText((cfg.rules ?? []).join("\n"));
    setModWhiteText((cfg.whitelist ?? []).join("\n"));
    setModStepsText(stepsText(cfg.escalateSteps));
    setModCfgLoaded(true);
  });
  /** 当前草稿配置（保存 / 自测共用，改完规则无需先保存即可测）。 */
  const modDraft = (): ModConfig => ({
    enabled: modCfg.enabled,
    categories: modCfg.categories,
    rules: modRulesText.split(/[\n，,]+/).map((s) => s.trim()).filter(Boolean),
    whitelist: modWhiteText.split(/[\n，,\s]+/).map((s) => s.trim()).filter(Boolean),
    durations: {
      light: Math.max(1, Math.min(43200, Number(modCfg.durations.light) || 10)),
      medium: Math.max(1, Math.min(43200, Number(modCfg.durations.medium) || 1440)),
      severe: Math.max(1, Math.min(43200, Number(modCfg.durations.severe) || 43200)),
    },
    escalateEnabled: modCfg.escalateEnabled,
    escalateMode: modCfg.escalateMode,
    escalateFactor: Math.max(0.1, Math.min(10, Number(modCfg.escalateFactor) || 1)),
    escalateSteps: modStepsText.split(/[\n，,、\s]+/)
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n) && n >= 1)
      .map((n) => Math.min(43200, Math.round(n))).slice(0, 20),
    escalateCap: Math.max(1, Math.min(43200, Math.round(Number(modCfg.escalateCap) || 43200))),
    strikeWindowDays: Math.max(1, Math.min(3650, Math.round(Number(modCfg.strikeWindowDays) || 30))),
    strictness: modCfg.strictness === "strict" || modCfg.strictness === "normal" ? modCfg.strictness : "lenient",
  });
  const saveModeration = () => void run("mod.save", async () => {
    if (!group) throw new Error(t("pt.groupNoSelect"));
    const draft = modDraft();
    const res = await rpcCall("moderation.config.save", { appId, groupOpenid: group, config: draft });
    if (!res.ok) throw new Error(errText(res));
    const saved = (val(res)?.config ?? draft) as ModConfig;
    setModCfg(saved);
    setModStepsText(stepsText(saved.escalateSteps));
    return t("pt.modSaved");
  });
  /** 规则自测：用草稿配置判定一段文本，结果就地渲染（查询类不弹提示）。 */
  const testModeration = () => void run("mod.test", async () => {
    if (!group) throw new Error(t("pt.groupNoSelect"));
    if (!modTestText.trim()) throw new Error(t("pt.modTestEmpty"));
    const res = await rpcCall("moderation.test", {
      appId, groupOpenid: group, content: modTestText, config: modDraft(),
    });
    if (!res.ok) throw new Error(errText(res));
    setModTestResult(val(res) as { level: string; category: string; reason: string; minutes: number });
  });
  const loadModLogs = () => void run("mod.logs", async () => {
    const res = await rpcCall("moderation.logs", { appId, groupOpenid: group, limit: 100 });
    if (!res.ok) throw new Error(errText(res));
    setModLogs(Array.isArray(val(res)?.logs) ? val(res).logs : []);
    setModLogsLoaded(true);
  });
  const resetModDraft = () => {
    setModCfg(emptyModConfig());
    setModRulesText("");
    setModWhiteText("");
    setModStepsText("");
    setModTestText("");
    setModTestResult(null);
    setModCfgLoaded(false);
    setModLogs([]);
    setModLogsLoaded(false);
    setModInnerTab("config");
  };
  /** 把分钟数格式化为易读时长：分钟 / 小时 / 天。 */
  const fmtDuration = (mins: number) => {
    const m = Math.max(0, Math.round(Number(mins) || 0));
    if (m < 60) return fmt("pt.modDurMin", String(m));
    if (m < 1440) return fmt("pt.modDurHour", String(Math.round((m / 60) * 10) / 10));
    return fmt("pt.modDurDay", String(Math.round((m / 1440) * 10) / 10));
  };

  // ── AI 审核 · 禁言成员（续费 / 减轻 / 解除） ──────────────────────────────
  const [muted, setMuted] = React.useState<MutedMember[]>([]);
  const [mutedLoaded, setMutedLoaded] = React.useState(false);
  const [mutedChecked, setMutedChecked] = React.useState<Set<string>>(new Set());
  const [muteAdjustMinutes, setMuteAdjustMinutes] = React.useState(30);
  /** 拉取禁言成员列表（纯数据，不弹提示）；成功返回条数。 */
  const fetchMuted = async (): Promise<number> => {
    if (!group) throw new Error(t("pt.groupNoSelect"));
    const res = await rpcCall("platform.mute.get", { appId, groupOpenid: group });
    if (!res.ok) throw new Error(errText(res));
    const list = (val(res)?.members ?? []) as MutedMember[];
    setMuted(list);
    setMutedLoaded(true);
    setMutedChecked(new Set());
    return list.length;
  };
  const loadMuted = () => void run("mod.muted", async () => { await fetchMuted(); });
  const toggleMutedCheck = (openid: string) => setMutedChecked((prev) => {
    const next = new Set(prev);
    if (next.has(openid)) next.delete(openid); else next.add(openid);
    return next;
  });
  /** 续费（delta>0）/ 减轻（delta<0）选中成员的禁言时间；解除走 platform.mute.set(minutes=0)。 */
  const adjustMuted = (deltaMinutes: number) => void run("mod.muteAdj", async () => {
    const ids = [...mutedChecked];
    if (!ids.length) throw new Error(t("pt.needSelectMember"));
    const res = await rpcCall("platform.mute.adjust", { appId, groupOpenid: group, memberOpenids: ids, deltaMinutes });
    if (!res.ok) throw new Error(errText(res));
    const verb = deltaMinutes > 0 ? t("pt.mutedRenewed") : t("pt.mutedReduced");
    await fetchMuted().catch(() => undefined); // 静默刷新到期时间，失败不影响成功提示
    return `${fmt(verb, String(ids.length))} · ${fmtDuration(Math.abs(deltaMinutes))}`;
  });
  const unmuteMuted = () => void run("mod.muteUn", async () => {
    const ids = [...mutedChecked];
    if (!ids.length) throw new Error(t("pt.needSelectMember"));
    const res = await rpcCall("platform.mute.set", { appId, groupOpenid: group, memberOpenids: ids, minutes: 0 });
    if (!res.ok) throw new Error(errText(res));
    setMuted((prev) => prev.filter((m) => !mutedChecked.has(m.member_openid)));
    setMutedChecked(new Set());
    return fmt("pt.unmuteDone", String(ids.length));
  });

  const pickGroup = (g: string) => {
    setGroup(g);
    // 切换群时清空群相关数据，避免看到上一个群的数据。
    setProfile(null);
    setMembers([]);
    setMemberDetail(null);
    setBlacklist([]);
    setRequests([]);
    setChecked(new Set());
    resetModDraft();
    setModLogs([]);
    setModLogsLoaded(false);
    setJaCfg(defaultJaCfg());
    setJaReqText("");
    setJaWhiteText("");
    setJaCfgLoaded(false);
    setJaLogs([]);
    setJaLogsLoaded(false);
    setJaInnerTab("auto");
    setMuted([]);
    setMutedLoaded(false);
    setMutedChecked(new Set());
  };

  // ── 群资料 ───────────────────────────────────────────────────────────────
  const [profile, setProfile] = React.useState<Record<string, any> | null>(null);
  const loadProfile = () => void run("info", async () => {
    if (!group) throw new Error(t("pt.groupNoSelect"));
    const res = await rpcCall("platform.group.info", { appId, groupOpenid: group });
    if (!res.ok) throw new Error(errText(res));
    setProfile(val(res) as Record<string, any> ?? {});
  });

  // ── 群成员 ───────────────────────────────────────────────────────────────
  const [members, setMembers] = React.useState<MemberRow[]>([]);
  const [memberCursor, setMemberCursor] = React.useState("");
  /** 单个成员详情：查询结果内联展示，不再通过 toast 弹字数有限的摘要。 */
  const [memberDetail, setMemberDetail] = React.useState<Record<string, unknown> | null>(null);
  const [checked, setChecked] = React.useState<Set<string>>(new Set());
  const [memberSearch, setMemberSearch] = React.useState("");
  const [muteMinutes, setMuteMinutes] = React.useState(10);
  const loadMembers = (nextCursor = "") => void run("adm.members", async () => {
    if (!group) throw new Error(t("pt.groupNoSelect"));
    const res = await rpcCall("platform.group.members", { appId, groupOpenid: group, cursor: nextCursor });
    if (!res.ok) throw new Error(errText(res));
    const list = (val(res)?.members ?? []) as MemberRow[];
    setMemberCursor(String(val(res)?.nextCursor ?? ""));
    setMembers((prev) => nextCursor ? [...prev, ...list] : list);
    if (!nextCursor) { setChecked(new Set()); setMemberDetail(null); }
  });
  const toggleCheck = (openid: string) => setChecked((prev) => {
    const next = new Set(prev);
    if (next.has(openid)) next.delete(openid); else next.add(openid);
    return next;
  });
  const shownMembers = members.filter((m) => {
    const q = memberSearch.trim().toLowerCase();
    return !q || (m.username || "").toLowerCase().includes(q) || m.member_openid.toLowerCase().includes(q);
  });
  const checkedList = [...checked];
  const muteSelected = (minutes: number) => void run("adm.mute", async () => {
    if (!checkedList.length) throw new Error(t("pt.needSelectMember"));
    const res = await rpcCall("platform.mute.set", { appId, groupOpenid: group, memberOpenids: checkedList, minutes });
    if (!res.ok) throw new Error(errText(res));
    return minutes > 0 ? fmt("pt.muteDone", checkedList.length) : fmt("pt.unmuteDone", checkedList.length);
  });
  const removeSelected = () => void run("adm.remove", async () => {
    const res = await rpcCall("platform.group.removeMembers", { appId, groupOpenid: group, memberOpenids: checkedList });
    if (!res.ok) throw new Error(errText(res));
    setMembers((prev) => prev.filter((m) => !checked.has(m.member_openid)));
    setChecked(new Set());
    return fmt("pt.removeDone", checkedList.length);
  });
  const showMemberDetail = (m: MemberRow) => void run(`adm.detail:${m.member_openid}`, async () => {
    const res = await rpcCall("platform.group.member", { appId, groupOpenid: group, memberOpenid: m.member_openid });
    if (!res.ok) throw new Error(errText(res));
    const info = (val(res) as Record<string, unknown> | undefined) ?? {};
    setMemberDetail({
      member_openid: m.member_openid,
      username: info.username ?? m.username,
      member_role: info.member_role ?? m.member_role,
      ...info,
    });
  });

  // ── 群黑名单 ─────────────────────────────────────────────────────────────
  const [blacklist, setBlacklist] = React.useState<BlackRow[]>([]);
  const [blackPick, setBlackPick] = React.useState("");
  const loadBlacklist = () => void run("black.list", async () => {
    if (!group) throw new Error(t("pt.groupNoSelect"));
    const res = await rpcCall("platform.blacklist.list", { appId, groupOpenid: group, limit: 100 });
    if (!res.ok) throw new Error(errText(res));
    const list = (val(res)?.users ?? []) as BlackRow[];
    setBlacklist(list);
  });
  const changeBlacklist = (op: "add" | "del", openids: string[]) => void run(`black.${op}`, async () => {
    if (!openids.length) throw new Error(t("pt.groupNoSelect"));
    const res = await rpcCall("platform.blacklist.set", { appId, groupOpenid: group, op, memberOpenids: openids });
    if (!res.ok) throw new Error(errText(res));
    const fail = (val(res)?.failOpenids ?? []) as string[];
    if (op === "add") {
      setBlacklist((prev) => [...prev, ...openids.filter((o) => !fail.includes(o)).map((o) => ({
        member_openid: o, username: o, banned_at: "",
      }))]);
      setBlackPick("");
      return fmt("pt.blackAdded", fail.length);
    }
    setBlacklist((prev) => prev.filter((b) => !openids.includes(b.member_openid)));
    return fmt("pt.blackRemoved", fail.length);
  });
  // 拉黑候选：群成员里未在黑名单中的。
  const blackCandidates: GroupOption[] = members
    .filter((m) => !blacklist.some((b) => b.member_openid === m.member_openid))
    .map((m) => ({ value: m.member_openid, label: `${m.username || m.member_openid.slice(0, 10)} · ${m.member_openid.slice(0, 10)}…`, source: "archive" as const }));

  // ── 入群审批 ─────────────────────────────────────────────────────────────
  const [requests, setRequests] = React.useState<JoinRequestRow[]>([]);
  const loadRequests = () => void run("join.list", async () => {
    if (!group) throw new Error(t("pt.groupNoSelect"));
    const res = await rpcCall("platform.join.requests", { appId, groupOpenid: group, limit: 50 });
    if (!res.ok) throw new Error(errText(res));
    setRequests((val(res)?.list ?? []) as JoinRequestRow[]);
  });
  const approveJoin = (row: JoinRequestRow, approve: boolean) => void run(
    `join.${approve ? "ok" : "no"}:${row.member_openid}`, async () => {
      const res = await rpcCall("platform.join.approve", {
        appId, groupOpenid: group, memberOpenid: row.member_openid,
        approve, joinRequestId: row.join_request_id,
        rejectReason: approve ? "" : t("pt.joinDefaultReason"),
      });
      if (!res.ok) throw new Error(errText(res));
      setRequests((prev) => prev.filter((r) => r.member_openid !== row.member_openid));
      return approve ? fmt("pt.joinApproved", row.username) : fmt("pt.joinDeclined", row.username);
    },
  );

  // ── 入群审批（自动审批 + 免审批名单，合一配置） ───────────────────────────
  /** 入群审批统一配置；免审批名单已并入，不再有独立的官方策略配置。 */
  const defaultJaCfg = (): JoinApprovalConfig => ({ enabled: false, requirements: [], allowEmpty: false, whitelist: [] });
  const [jaCfg, setJaCfg] = React.useState<JoinApprovalConfig>(defaultJaCfg());
  const [jaCfgLoaded, setJaCfgLoaded] = React.useState(false);
  const [jaReqText, setJaReqText] = React.useState("");
  const [jaWhiteText, setJaWhiteText] = React.useState("");
  const [jaLogs, setJaLogs] = React.useState<JoinAutoLog[]>([]);
  const [jaLogsLoaded, setJaLogsLoaded] = React.useState(false);
  /** 入群审批面板内层 tab：AI 自动审批 / 手动审批 / 审批记录。 */
  const [jaInnerTab, setJaInnerTab] = React.useState<NonNullable<PlatformFocus["joinTab"]>>(focus?.joinTab ?? "auto");
  const loadJoinAuto = () => void run("ja.get", async () => {
    if (!group) throw new Error(t("pt.groupNoSelect"));
    const res = await rpcCall("join.auto.config.get", { appId, groupOpenid: group });
    if (!res.ok) throw new Error(errText(res));
    const cfg = (val(res)?.config ?? defaultJaCfg()) as JoinApprovalConfig;
    setJaCfg(cfg);
    setJaReqText((cfg.requirements ?? []).join("\n"));
    setJaWhiteText((cfg.whitelist ?? []).join("\n"));
    setJaCfgLoaded(true);
  });
  const saveJoinAuto = () => void run("ja.save", async () => {
    if (!group) throw new Error(t("pt.groupNoSelect"));
    const draft: JoinApprovalConfig = {
      enabled: jaCfg.enabled,
      allowEmpty: jaCfg.allowEmpty,
      requirements: jaReqText.split(/[\n，,]+/).map((s) => s.trim()).filter(Boolean),
      whitelist: jaWhiteText.split(/[\n，,]+/).map((s) => s.trim()).filter(Boolean),
    };
    const res = await rpcCall("join.auto.config.save", { appId, groupOpenid: group, config: draft });
    if (!res.ok) throw new Error(errText(res));
    setJaCfg((val(res)?.config ?? draft) as JoinApprovalConfig);
    return t("pt.jaSaved");
  });
  const loadJoinAutoLogs = () => void run("ja.logs", async () => {
    const res = await rpcCall("join.auto.logs", { appId, groupOpenid: group, limit: 30 });
    if (!res.ok) throw new Error(errText(res));
    setJaLogs(Array.isArray(val(res)?.logs) ? val(res).logs : []);
    setJaLogsLoaded(true);
  });
  const pickJoinTab = (k: "auto" | "manual" | "records") => setJaInnerTab(k);

  // ── 独立能力（不依赖群） ──────────────────────────────────────────────────
  const [shareUrl, setShareUrl] = React.useState("");
  const genShareLink = () => void run("share", async () => {
    const res = await rpcCall("platform.shareLink", { appId });
    if (!res.ok) throw new Error(errText(res));
    setShareUrl(String(val(res)?.url ?? ""));
    return t("pt.shareDone");
  });
  type SelfInfo = { id?: string; username?: string; avatar?: string; bot?: boolean; shareUrl?: string; welcomeMsg?: string };
  const [selfInfo, setSelfInfo] = React.useState<SelfInfo | null>(null);
  const loadSelfInfo = () => void run("self", async () => {
    const res = await rpcCall("platform.selfInfo", { appId });
    if (!res.ok) throw new Error(errText(res));
    setSelfInfo((val(res) as SelfInfo) ?? {});
  });
  const [menuJson, setMenuJson] = React.useState("");
  const [menuDirty, setMenuDirty] = React.useState(false);
  const loadMenu = () => void run("menu.load", async () => {
    const res = await rpcCall("platform.menu.get", { appId });
    if (!res.ok) throw new Error(errText(res));
    const items = Array.isArray(val(res)?.items) ? val(res).items : [];
    setMenuJson(JSON.stringify(items, null, 2));
    setMenuDirty(false);
  });
  const saveMenu = () => void run("menu.save", async () => {
    let items: unknown[];
    try { items = JSON.parse(menuJson); } catch { throw new Error(t("pt.menuBadJson")); }
    if (!Array.isArray(items)) throw new Error(t("pt.menuBadJson"));
    const res = await rpcCall("platform.menu.put", { appId, items });
    if (!res.ok) throw new Error(errText(res));
    setMenuDirty(false);
    return fmt("pt.menuSaved", String(val(res)?.version ?? "?"));
  });
  const genMenu = () => {
    setMenuJson(JSON.stringify(COMMAND_MENU_ITEMS.map((c) => ({
      type: "send_message", name: c.name, send_message: c.cmd,
    })), null, 2));
    setMenuDirty(true);
  };
  // ── 指令面板（群聊能力）：列表 + 按需展开的表单（新增/编辑/查看） ──────────
  // 仅支持群聊场景（scope 固定 "group"），面板在 QQ 客户端「群」的设置里展示。
  type PanelItem = { type: "command" | "link"; name: string; desc: string; only_admin: boolean; link: string };
  type PanelRecord = {
    panel_id?: string; scope?: string; target_type?: string; version?: number;
    panel?: { items?: Array<Record<string, unknown>>; remark?: string };
  };
  const PANEL_ITEM_MAX = 20;
  const emptyPanelItem = (): PanelItem => ({ type: "command", name: "/help", desc: "", only_admin: false, link: "" });
  const normalizePanelItems = (raw: unknown): PanelItem[] => {
    const rows = Array.isArray(raw) ? raw : [];
    return rows.slice(0, PANEL_ITEM_MAX).map((r: any) => {
      const type = r?.type === "link" ? "link" : "command";
      return {
        type,
        // 命令按钮回显时补回丢失的前导 /（如 status -> /status），查看/编辑都能正确还原。
        name: type === "command" ? normalizePanelCmd(r?.name) : String(r?.name ?? ""),
        desc: String(r?.desc ?? ""),
        only_admin: r?.only_admin === true,
        link: String(r?.link ?? ""),
      };
    });
  };
  const [panels, setPanels] = React.useState<PanelRecord[]>([]);
  const [panelsLoaded, setPanelsLoaded] = React.useState(false);
  const [panelFormMode, setPanelFormMode] = React.useState(""); // ""=收起；create/edit/view
  const [panelEditId, setPanelEditId] = React.useState(""); // 空=新建
  const [panelItems, setPanelItems] = React.useState<PanelItem[]>([]);
  const [panelRemark, setPanelRemark] = React.useState("");
  const panelReadonly = panelFormMode === "view";

  // command 类型按钮的「名称」即点击后填入输入框的命令文本（官方限制最多 14 字符）。
  // 用函数而非模块常量构造，避免 t() 在模块加载时冻结语言。
  const panelCmdChoices = (): Array<{ cmd: string; labelKey: string }> =>
    PANEL_COMMANDS.map((cmd) => ({ cmd, labelKey: PANEL_CMD_LABELS[cmd]! }));
  const panelCmdCmds = PANEL_COMMANDS;

  const loadPanels = () => void run("panels.load", async () => {
    const res = await rpcCall("platform.panels.list", { appId, scope: "group" });
    if (!res.ok) throw new Error(errText(res));
    const list = Array.isArray(val(res)?.panels) ? val(res).panels : [];
    setPanels(list);
    setPanelsLoaded(true);
    setPanelFormMode("");
  });
  const startNewPanel = () => {
    setPanelFormMode("create");
    setPanelEditId("");
    setPanelItems([{ type: "command", name: "/help", desc: "", only_admin: false, link: "" }]);
    setPanelRemark("");
  };
  const openPanel = (p: PanelRecord, mode: "edit" | "view") => {
    setPanelFormMode(mode);
    setPanelEditId(p.panel_id ?? "");
    setPanelItems(normalizePanelItems(p.panel?.items));
    setPanelRemark(p.panel?.remark ?? "");
  };
  const closePanelForm = () => { setPanelFormMode(""); setPanelEditId(""); };
  const updatePanelItem = (idx: number, patch: Partial<PanelItem>) =>
    setPanelItems((prev) => prev.map((it, i) => i === idx ? { ...it, ...patch } : it));
  const addPanelItem = () => setPanelItems((prev) => prev.length >= PANEL_ITEM_MAX ? prev : [...prev, emptyPanelItem()]);
  const removePanelItem = (idx: number) => setPanelItems((prev) => prev.filter((_, i) => i !== idx));
  const savePanel = () => void run("panels.save", async () => {
    if (!panelItems.length) throw new Error(t("pt.panelNeedItem"));
    if (panelItems.some((it) => !it.name.trim())) throw new Error(t("pt.panelItemNeedName"));
    // 命令按钮必须选一个合法命令；缺前导 / 的旧值（如 status）按已知命令补回再校验/保存，
    // 避免「回显时斜杠没了」被当成无效命令、也无法再次保存。
    if (panelItems.some((it) => it.type === "command" && !panelCmdCmds.includes(normalizePanelCmd(it.name)))) {
      throw new Error(t("pt.panelCmdNeedSelect"));
    }
    if (panelItems.some((it) => it.type === "link" && !/^https:\/\//i.test(it.link.trim()))) throw new Error(t("pt.panelItemBadLink"));
    const items = panelItems.map((it) => ({
      type: it.type,
      name: it.type === "command" ? normalizePanelCmd(it.name) : it.name.trim(),
      desc: it.desc.trim(),
      ...(it.only_admin ? { only_admin: true } : {}),
      ...(it.type === "link" ? { link: it.link.trim() } : {}),
    }));
    const panel = { items, ...(panelRemark.trim() ? { remark: panelRemark.trim().slice(0, 255) } : {}) };
    if (panelEditId) {
      const res = await rpcCall("platform.panel.update", { appId, panelId: panelEditId, panel });
      if (!res.ok) throw new Error(errText(res));
      closePanelForm();
      // 必须重新拉列表：否则列表/再次打开读的还是旧 state，看起来像「编辑没效果」。
      loadPanels();
      return t("pt.panelUpdated");
    }
    const body: Record<string, unknown> = { scope: "group", target_type: "all", panel };
    const res = await rpcCall("platform.panel.create", { appId, body });
    if (!res.ok) throw new Error(errText(res));
    closePanelForm();
    loadPanels();
    return t("pt.panelCreated");
  });
  const deletePanel = (panelId: string) => void run(`panels.del:${panelId}`, async () => {
    const res = await rpcCall("platform.panel.delete", { appId, panelId });
    if (!res.ok) throw new Error(errText(res));
    setPanels((prev) => prev.filter((p) => p.panel_id !== panelId));
    if (panelEditId === panelId) closePanelForm();
    return t("pt.panelDeleted");
  });

  const [materialUrl, setMaterialUrl] = React.useState("");
  const [materialRef, setMaterialRef] = React.useState("");
  const uploadMaterial = () => void run("material", async () => {
    const res = await rpcCall("platform.uploadMaterial", { appId, url: materialUrl.trim() });
    if (!res.ok) throw new Error(errText(res));
    const ref = String(val(res)?.url ?? "");
    setMaterialRef(ref);
    if (ref) void navigator.clipboard?.writeText(ref).catch(() => undefined);
    return t("pt.materialDone");
  });
  const [cardScope, setCardScope] = React.useState("group");
  const [cardOpenid, setCardOpenid] = React.useState("");
  const [cardTitle, setCardTitle] = React.useState("");
  const [cardDesc, setCardDesc] = React.useState("");
  const [cardUrl, setCardUrl] = React.useState("");
  const [cardPic, setCardPic] = React.useState("");
  // 被动回复：目标聊天最近 5 分钟内可回复的消息（msgId 有时效）。
  const [replyMsgs, setReplyMsgs] = React.useState<Array<{
    msgId: string; senderName: string; sender: string; content: string; leftSec: number;
  }>>([]);
  const [replyMsgId, setReplyMsgId] = React.useState("");
  const loadReplyMsgs = () => void run("card.replies", async () => {
    if (!cardOpenid.trim()) throw new Error(t("pt.cardOpenidPlaceholder"));
    const res = await rpcCall("platform.recentMessages", {
      appId, scope: cardScope, openid: cardOpenid.trim(),
    });
    if (!res.ok) throw new Error(errText(res));
    const list = (val(res)?.messages ?? []) as typeof replyMsgs;
    setReplyMsgs(list);
    setReplyMsgId(list.length ? list[0]!.msgId : "");
  });
  // 切换目标类型 / openid 时，清空上一目标的候选，避免用错 msgId。
  const pickCardScope = (v: string) => { setCardScope(v); setReplyMsgs([]); setReplyMsgId(""); };
  const pickCardOpenid = (v: string) => { setCardOpenid(v); setReplyMsgs([]); setReplyMsgId(""); };
  const sendCard = () => void run("card", async () => {
    const res = await rpcCall("platform.sendCard", {
      appId, scope: cardScope, openid: cardOpenid.trim(),
      msgId: replyMsgId || undefined,
      title: cardTitle, description: cardDesc, url: cardUrl, picUrl: cardPic,
    });
    if (!res.ok) throw new Error(errText(res));
    return t("pt.cardSent");
  });

  /** 卡片分区：标题 + 说明 + 内容（子标签面板内不再重复大标题层级）。 */
  const block = (title: string, hint: string, ...children: React.ReactNode[]) =>
    h("section", { className: "qbot-ptBlock" },
      h("div", { className: "qbot-ptBlockHead" },
        h("span", { className: "qbot-ptBlockTitle" }, title),
        h("span", { className: "qbot-ptBlockDesc" }, hint)),
      ...children);

  /** 需要管理员权限的按钮：无权限时禁用，原生 title 说明原因。 */
  const adminBtn = (key: string, label: string, onClick: () => void, primary = false) =>
    btn(key, label, onClick, primary, { disabled: !canAdmin, title: canAdmin ? undefined : t("pt.permNeedAdmin") });

  const permBanner = group
    ? h("div", { className: `qbot-ptPerm is-${perm}`, role: "status" },
        perm === "checking"
          ? h("span", { className: "qbot-ptPermText" }, t("pt.permChecking"))
          : h(React.Fragment, null,
              h("span", { className: "qbot-ptPermBadge" },
                perm === "admin" ? t("pt.roleAdmin") : perm === "member" ? t("archive.member") : "!"),
              h("span", { className: "qbot-ptPermText" },
                perm === "error" ? fmt("pt.permUnknown", permMsg) : permMsg),
              h("button", { type: "button", className: "qbot-btn qbot-ptPermRetry",
                onClick: () => checkPerm(group) }, t("pt.permRefresh"))))
    : null;

  // ── 左侧分组导航：与频道管理一致，分「群聊 / 通用」两大组，组内再列细项 ────
  // 统一 navKey："g:<群聊细项>" / "g:assistant"（执行记录）/ "u:<通用细项>"。
  const [navKey, setNavKey] = React.useState(focus?.nav ?? "g:info");

  /** pane 内二级标签导航条（审核配置 / 入群审批各自内部切换用）。 */
  const subNav = (
    tabs: Array<{ key: string; label: string }>,
    active: string,
    onPick: (key: string) => void,
  ) => h("div", { className: "qbot-ptSubNav", role: "tablist" },
    tabs.map((tab) => h("button", {
      key: tab.key, type: "button", role: "tab",
      "aria-selected": active === tab.key,
      className: `qbot-ptSubTab${active === tab.key ? " is-active" : ""}`,
      onClick: () => onPick(tab.key),
    }, tab.label)));

  // ── 群聊管理：各子标签内容 ────────────────────────────────────────────────
  /** 审核配置：分组头（色条 + 标题 + 副标题）。 */
  const modGroupHead = (title: string, desc: string) =>
    h("div", { className: "qbot-ptModGroupHead" },
      h("span", { className: "qbot-ptModGroupBar", "aria-hidden": "true" }),
      h("div", { className: "qbot-ptModGroupText" },
        h("strong", null, title),
        h("span", null, desc)));

  /** 审核配置：单个表单项（左 label = 序号 + 标题 + 说明，右控件区）。 */
  const modStep = (no: string, title: string, desc: string, ...content: React.ReactNode[]) =>
    h("div", { className: "qbot-ptModStep" },
      h("div", { className: "qbot-ptModStepHead" },
        h("span", { className: "qbot-ptModStepNo" }, no),
        h("div", { className: "qbot-ptModStepText" },
          h("strong", null, title),
          desc ? h("span", null, desc) : null)),
      h("div", { className: "qbot-ptModStepBody" }, ...content));

  /** 叠加效果预览：按当前草稿、以「轻微」基础时长演示前 3 次违规各禁言多久。 */
  const modEscPreview = () => {
    const draft = modDraft();
    const base = Number(draft.durations.light) || 10;
    return [1, 2, 3]
      .map((n) => fmt("pt.modEscPrevItem", String(n), fmtDuration(escalateDuration(base, draft, n))))
      .join(" / ");
  };

  /** 第 5 步：违规叠加惩罚开关 + 算法参数（仅开启时展开）。 */
  const modEscalateStep = modStep("5", t("pt.modSecEscalate"), "",
    h("label", { className: "qbot-ptModCheck" },
      h("input", { type: "checkbox", className: "qbot-checkbox",
        checked: modCfg.escalateEnabled, disabled: !canAdmin,
        onChange: (e: any) => setModCfg((c) => ({ ...c, escalateEnabled: e.target.checked })) }),
      h("span", null, t("pt.modEscEnableCheck"))),
    modCfg.escalateEnabled
      ? h("div", { className: "qbot-ptModEsc" },
          h("div", { className: "qbot-ptGrid" },
            h("label", { key: "mode", className: "qbot-ptField" },
              h("span", null, t("pt.modEscMode")),
              h("select", { className: "qbot-settingSelect", value: modCfg.escalateMode,
                onChange: (e: any) => setModCfg((c) => ({ ...c, escalateMode: e.target.value as EscalateMode })),
                "aria-label": t("pt.modEscMode") },
                (["linear", "geometric", "custom"] as const).map((m) =>
                  h("option", { key: m, value: m }, t(`pt.modEscMode.${m}`))))),
            modCfg.escalateMode === "custom" ? null : h("label", { key: "factor", className: "qbot-ptField" },
              h("span", null, t("pt.modEscFactor")),
              h("input", { className: "qbot-settingInput", type: "number", min: 0.1, max: 10, step: 0.1,
                value: modCfg.escalateFactor,
                onChange: (e: any) => setModCfg((c) => ({ ...c, escalateFactor: e.target.value })),
                "aria-label": t("pt.modEscFactor") })),
            h("label", { key: "cap", className: "qbot-ptField" },
              h("span", null, t("pt.modEscCap")),
              h("input", { className: "qbot-settingInput", type: "number", min: 1, max: 43200,
                value: modCfg.escalateCap,
                onChange: (e: any) => setModCfg((c) => ({ ...c, escalateCap: e.target.value })),
                "aria-label": t("pt.modEscCap") })),
            h("label", { key: "window", className: "qbot-ptField" },
              h("span", null, t("pt.modEscWindow")),
              h("input", { className: "qbot-settingInput", type: "number", min: 1, max: 3650,
                value: modCfg.strikeWindowDays,
                onChange: (e: any) => setModCfg((c) => ({ ...c, strikeWindowDays: e.target.value })),
                "aria-label": t("pt.modEscWindow") }))),
          modCfg.escalateMode === "custom"
            ? h("label", { className: "qbot-ptField qbot-ptFieldWide" },
                h("span", null, t("pt.modEscSteps")),
                h("textarea", { className: "qbot-ptTextarea", rows: 2, value: modStepsText,
                  placeholder: t("pt.modEscStepsPlaceholder"),
                  onChange: (e: any) => setModStepsText(e.target.value) }),
                h("span", { className: "qbot-ptFieldHint" }, t("pt.modEscStepsHint")))
            : null,
          h("div", { className: "qbot-ptModEscPreview" },
            h("span", null, fmt("pt.modEscPreview", fmtDuration(modCfg.durations.light))),
            h("strong", null, modEscPreview())))
      : h("div", { className: "qbot-ptModEscOff" }, t("pt.modEscOffHint")));

  /** 步骤 2：违规类型勾选 + 判定尺度（宽松/标准/严格）。 */
  const modCatsStep = modStep("2", t("pt.modSecCats"), "",
    h("div", { className: "qbot-ptModCats" },
      MOD_CATS.map((cat) => h("label", { key: cat, className: "qbot-ptModCat" },
        h("input", { type: "checkbox", className: "qbot-checkbox",
          checked: modCfg.categories.includes(cat),
          onChange: () => {
            const on = modCfg.categories.includes(cat);
            setModCfg((c) => ({
              ...c,
              categories: on
                ? c.categories.filter((x) => x !== cat)
                : [...c.categories, cat],
            }));
          } }),
        h("span", null, t(`pt.modCat.${cat}`))))),
    h("div", { className: "qbot-ptModStrict" },
      h("div", { className: "qbot-ptModStrictLabel" }, t("pt.modStrictness")),
      h("div", { className: "qbot-ptModRadioGroup" },
        (["lenient", "normal", "strict"] as const).map((s) =>
          h("label", { key: s, className: "qbot-ptModRadio" },
            h("input", { type: "radio", name: "modStrictness", className: "qbot-radio",
              checked: modCfg.strictness === s, disabled: !canAdmin,
              onChange: () => setModCfg((c) => ({ ...c, strictness: s })) }),
            h("span", null, t(`pt.modStrict.${s}`))))),
      h("div", { className: "qbot-ptFieldHint" }, t("pt.modStrictHint"))));

  /** 审核配置 pane：Hero 概览 + 两个逻辑分组 + 沉底保存。 */
  const modConfigPane = h(React.Fragment, null,
    h("div", { className: `qbot-ptModHero${modCfgLoaded && modCfg.enabled ? " is-on" : ""}` },
      h("div", { className: "qbot-ptModHeroMain" },
        h("div", { className: "qbot-ptModHeroTitle" },
          h("span", { className: "qbot-ptModHeroIcon", "aria-hidden": "true" }, modCfgLoaded && modCfg.enabled ? "✓" : "◎"),
          h("strong", null, t("pt.modCfgTitle")),
          modCfgLoaded
            ? h("span", { className: `qbot-ptModStatus${modCfg.enabled ? " is-on" : " is-off"}` },
                h("span", { className: "qbot-ptModStatusDot" }),
                modCfg.enabled ? t("pt.modOn") : t("pt.modOff"))
            : null),
        h("div", { className: "qbot-ptModHeroDesc" }, t("pt.modCfgDesc")),
        modCfgLoaded
          ? h("div", { className: "qbot-ptModHeroSummary" },
              h("span", null, fmt("pt.modSummaryCats", String(modCfg.categories.length))),
              h("span", null, fmt("pt.modSummaryDur",
                fmtDuration(modCfg.durations.light),
                fmtDuration(modCfg.durations.medium),
                fmtDuration(modCfg.durations.severe))))
          : null)),

    modCfgLoaded
      ? h(React.Fragment, null,
          // ── 分组一：开关与检测范围 ──────────────────────────────────────
          modGroupHead(t("pt.modGroupDetect"), t("pt.modGroupDetectDesc")),
          h("div", { className: "qbot-ptModGroup" },
            modStep("1", t("pt.modSecEnable"), "",
              h("label", { className: "qbot-ptModCheck" },
                h("input", { type: "checkbox", className: "qbot-checkbox",
                  checked: modCfg.enabled, disabled: !canAdmin,
                  onChange: (e: any) => setModCfg((c) => ({ ...c, enabled: e.target.checked })) }),
                h("span", null, t("pt.modEnableCheck")))),
            modCatsStep,
          // ── 分组二：处罚规则与例外 ──────────────────────────────────────
          modGroupHead(t("pt.modGroupPunish"), t("pt.modGroupPunishDesc")),
          h("div", { className: "qbot-ptModGroup" },
            modStep("3", t("pt.modSecRules"), "",
              h("textarea", { className: "qbot-ptTextarea", rows: 3,
                value: modRulesText, placeholder: t("pt.modRulesPlaceholder"),
                onChange: (e: any) => setModRulesText(e.target.value) }),
              // 规则自测：用草稿配置判定，改完规则不用先保存；只显示模型判定，不真的禁言。
              h("div", { className: "qbot-ptModTest" },
                h("div", { className: "qbot-ptModTestTitle" }, t("pt.modTestTitle")),
                h("div", { className: "qbot-ptModTestRow" },
                  h("input", { className: "qbot-settingInput", value: modTestText,
                    placeholder: t("pt.modTestPlaceholder"),
                    onChange: (e: any) => setModTestText(e.target.value),
                    "aria-label": t("pt.modTestTitle") }),
                  adminBtn("mod.test", t("pt.modTestBtn"), testModeration)),
                modTestResult
                  ? h("div", { className: `qbot-ptModTestResult is-${modTestResult.level}` },
                      h("span", { className: `qbot-ptModLevel is-${modTestResult.level}` },
                        t(`pt.modLevel.${modTestResult.level}`)),
                      h("span", { className: "qbot-ptModTestReason" },
                        modTestResult.reason || t("pt.modTestNoReason")),
                      modTestResult.category && modTestResult.category !== "none"
                        ? h("span", { className: "qbot-ptModTestChip" },
                            fmt("pt.modTestCat", t(`pt.modCat.${modTestResult.category}`)))
                        : null,
                      h("span", { className: "qbot-ptModTestChip" },
                        fmt("pt.modTestDuration", fmtDuration(modTestResult.minutes))))
                  : null)),
            modStep("4", t("pt.modSecDuration"), "",
              h("div", { className: "qbot-ptGrid" },
                (["light", "medium", "severe"] as const).map((lv) =>
                  h("label", { key: lv, className: "qbot-ptField" },
                    h("span", null, t(`pt.modLevel.${lv}`)),
                    h("input", { className: "qbot-settingInput", type: "number", min: 1, max: 43200,
                      value: modCfg.durations[lv],
                      onChange: (e: any) => {
                        const v = e.target.value;
                        setModCfg((c) => ({ ...c, durations: { ...c.durations, [lv]: v } }));
                      } }))))),
            modEscalateStep,
            modStep("6", t("pt.modSecWhite"), "",
              h("textarea", { className: "qbot-ptTextarea", rows: 2,
                value: modWhiteText, placeholder: t("pt.modWhitePlaceholder"),
                onChange: (e: any) => setModWhiteText(e.target.value) }))),
          h("div", { className: "qbot-ptModSaveBar" },
            adminBtn("mod.save", t("common.save"), saveModeration, true))))
      : null);

  /** 处罚记录 pane：概览统计 + 时间线卡片（仅最近 30 条）。 */
  const recentLogs = modLogs.slice(0, 30);
  const modLogStats = h("div", { className: "qbot-ptModStats" },
    h("div", { className: "qbot-ptModStat" },
      h("strong", null, String(recentLogs.length)), h("span", null, t("pt.modStatTotal"))),
    h("div", { className: "qbot-ptModStat is-ok" },
      h("strong", null, String(recentLogs.filter((l) => !l.error && l.minutes > 0).length)), h("span", null, t("pt.modStatMuted"))),
    h("div", { className: "qbot-ptModStat is-esc" },
      h("strong", null, String(recentLogs.filter((l) => (l.strikeCount ?? 0) > 1).length)), h("span", null, t("pt.modStatEsc"))),
    h("div", { className: "qbot-ptModStat is-fail" },
      h("strong", null, String(recentLogs.filter((l) => !!l.error).length)), h("span", null, t("pt.modStatFailed"))));

  const modLogCard = (log: ModLog, i: number) => {
    const who = log.senderName || log.sender || "?";
    return h("div", { key: i, className: `qbot-ptModRec is-${log.level}${log.error ? " is-failed" : ""}` },
      h("span", { className: "qbot-ptModRecDot", "aria-hidden": "true" }),
      h("div", { className: "qbot-ptModRecCard" },
        h("div", { className: "qbot-ptModRecHead" },
          h("span", { className: "qbot-ptModRecAvatar", "aria-hidden": "true" }, who.slice(0, 1).toUpperCase()),
          h("span", { className: "qbot-ptModRecWho" }, who),
          h("span", { className: `qbot-ptModLevel is-${log.level}` }, t(`pt.modLevel.${log.level}`)),
          h("time", { className: "qbot-ptModRecTime" }, formatTime(log.at))),
        h("div", { className: "qbot-ptModRecQuote" }, log.content || "—"),
        h("div", { className: "qbot-ptModRecReason" },
          h("span", { className: "qbot-ptModRecReasonTag" }, t("pt.modReasonLabel")),
          h("span", null, log.reason || log.category)),
        h("div", { className: "qbot-ptModRecChips" },
          h("span", { className: "qbot-ptModChip" }, fmt("pt.modDuration", fmtDuration(log.minutes))),
          typeof log.strikeCount === "number"
            ? h("span", { className: "qbot-ptModChip is-strike" }, fmt("pt.modStrikeShort", String(log.strikeCount)))
            : null,
          log.escalated && typeof log.strikeCount === "number"
            ? h("span", { className: "qbot-ptModChip is-meta" },
                fmt("pt.modStrike", String(log.strikeCount), String(log.baseMinutes ?? 0), String(log.minutes)))
            : null,
          log.error ? h("span", { className: "qbot-ptModChip is-error" }, t("pt.modFailed")) : null),
        log.error ? h("div", { className: "qbot-ptModRecErr" }, modErrorText(log.error)) : null,
        log.noticeError ? h("div", { className: "qbot-ptModRecErr is-warn" }, `${t("pt.modNoticeFailed")}：${log.noticeError}`) : null));
  };

  const modLogsPane = h(React.Fragment, null,
    h("div", { className: "qbot-ptModLogHead" },
      h("div", { className: "qbot-ptModLogHeadText" },
        h("strong", null, t("pt.modLogsTitle")),
        h("span", null, `${t("pt.modLogsHint")} ${t("pt.modLogsScope")}`))),
    modLogsLoaded && recentLogs.length
      ? h(React.Fragment, null,
          modLogStats,
          h("div", { className: "qbot-ptModTimeline" }, recentLogs.map(modLogCard)))
      : h("div", { className: "qbot-ptModLogEmpty" },
          h("span", { className: "qbot-ptModLogEmptyIcon", "aria-hidden": "true" }, "◎"),
          h("strong", null, t("pt.modLogsEmpty")),
          h("span", null, t("pt.modLogsEmptyDesc"))));

  /** 禁言批量按钮：等宽、未勾选/无权限时禁用，避免点击时文案变化造成布局抖动。 */
  const mutedActionBtn = (key: string, label: string, variant: string, onClick: () => void) =>
    h("button", {
      type: "button",
      className: `qbot-btn qbot-ptMutedBtn${variant ? ` ${variant}` : ""}`,
      disabled: busy === key || !canAdmin || mutedChecked.size === 0,
      title: !canAdmin ? t("pt.permNeedAdmin") : !mutedChecked.size ? t("pt.needSelectMember") : undefined,
      onClick,
    }, busy === key ? t("common.loading") : label);

  /** 禁言成员 pane：当前被禁言成员 + 勾选后续费/减轻/解除。 */
  const mutedPane = h(React.Fragment, null,
    h("div", { className: "qbot-ptModLogHead" },
      h("div", { className: "qbot-ptModLogHeadText" },
        h("strong", null, t("pt.mutedTitle")),
        h("span", null, t("pt.mutedHint")))),
    mutedLoaded && muted.length
      ? h(React.Fragment, null,
          h("div", { className: "qbot-ptMutedOps" },
            h("div", { className: "qbot-ptMutedOpsTop" },
              h("label", { className: "qbot-ptMutedCheck" },
                h("input", { type: "checkbox", className: "qbot-checkbox",
                  checked: mutedChecked.size > 0 && muted.every((m) => mutedChecked.has(m.member_openid)),
                  onChange: () => setMutedChecked((prev) => {
                    const all = muted.every((m) => prev.has(m.member_openid));
                    const next = new Set(prev);
                    for (const m of muted) { if (all) next.delete(m.member_openid); else next.add(m.member_openid); }
                    return next;
                  }) }),
                h("span", null, t("pt.selectAll"))),
              // 常驻固定宽度：勾选数变化只改文字，不再让后续控件左右跳动。
              h("span", { className: `qbot-ptMutedCount${mutedChecked.size ? " is-on" : ""}` },
                fmt("pt.selectedCount", mutedChecked.size)),
              h("span", { className: "qbot-ptMutedOpsSpacer" }),
              h("label", { className: "qbot-ptMutedDuration" },
                h("span", null, t("pt.muteAdjustDuration")),
                h("select", { className: "qbot-settingSelect", value: String(muteAdjustMinutes),
                  onChange: (e: any) => setMuteAdjustMinutes(Number(e.target.value)), "aria-label": t("pt.muteAdjustDuration") },
                  [10, 30, 60, 360, 1440, 43200].map((m) =>
                    h("option", { key: m, value: String(m) }, m < 60 ? fmt("pt.muteMinutes", m) : m < 1440 ? fmt("pt.muteHours", m / 60) : fmt("pt.muteDays", m / 1440)))))),
            h("div", { className: "qbot-ptMutedOpsActions" },
              mutedActionBtn("mod.muteRenew", t("pt.mutedRenew"), "qbot-btnPrimary", () => adjustMuted(muteAdjustMinutes)),
              mutedActionBtn("mod.muteReduce", t("pt.mutedReduce"), "", () => adjustMuted(-muteAdjustMinutes)),
              mutedActionBtn("mod.muteUn", t("pt.unmuteBtn"), "qbot-btnDanger", unmuteMuted))),
          h("div", { className: "qbot-ptMutedList" },
            muted.map((m) => h("label", { key: m.member_openid, className: `qbot-ptMutedRow${mutedChecked.has(m.member_openid) ? " is-on" : ""}` },
              h("input", { type: "checkbox", className: "qbot-checkbox",
                checked: mutedChecked.has(m.member_openid),
                onChange: () => toggleMutedCheck(m.member_openid) }),
              h("span", { className: "qbot-ptMutedAvatar", "aria-hidden": "true" },
                (m.username || m.member_openid).slice(0, 1).toUpperCase()),
              h("span", { className: "qbot-ptMutedWho" },
                m.username || m.member_openid.slice(0, 10) + "…"),
              h("span", { className: "qbot-ptMutedExpire" },
                `${t("pt.mutedUntil")} ${fmtExpire(m.mute_expire_at)}`)))))
      : h("div", { className: "qbot-ptModLogEmpty" },
          h("span", { className: "qbot-ptModLogEmptyIcon", "aria-hidden": "true" }, "◎"),
          h("strong", null, t("pt.mutedEmpty")),
          h("span", null, t("pt.mutedEmptyDesc"))));

  const modTabs = [
    { key: "config", label: t("pt.modTabConfig") },
    { key: "logs", label: t("pt.modTabLogs") },
    { key: "muted", label: t("pt.modTabMuted") },
  ];
  const pickModTab = (k: string) => setModInnerTab(k as "config" | "logs" | "muted");

  const moderationBody = block(t("pt.modGuideTitle"), t("pt.modGuideDesc"),
    !group
      ? h("div", { className: "qbot-ptEmpty" },
          h("span", { className: "qbot-ptEmptyIcon" }, "⌁"),
          h("span", null, t("pt.groupNoSelect")))
      : perm !== "admin"
        ? h("div", { className: "qbot-ptPermTip" }, t("pt.modNeedAdmin"))
        : h(React.Fragment, null,
            subNav(modTabs, modInnerTab, pickModTab),
            h("div", { className: "qbot-ptModPane" },
              modInnerTab === "config" ? modConfigPane : modInnerTab === "logs" ? modLogsPane : mutedPane)));

  /** 入群 AI 自动审批 pane：与 AI 审核一致的 Hero + 分组步骤 + 沉底保存布局。 */
  const joinAutoPane = h(React.Fragment, null,
    h("div", { className: `qbot-ptModHero${jaCfgLoaded && jaCfg.enabled ? " is-on" : ""}` },
      h("div", { className: "qbot-ptModHeroMain" },
        h("div", { className: "qbot-ptModHeroTitle" },
          h("span", { className: "qbot-ptModHeroIcon", "aria-hidden": "true" }, jaCfgLoaded && jaCfg.enabled ? "✓" : "◎"),
          h("strong", null, t("pt.jaTitle")),
          jaCfgLoaded
            ? h("span", { className: `qbot-ptModStatus${jaCfg.enabled ? " is-on" : " is-off"}` },
                h("span", { className: "qbot-ptModStatusDot" }),
                jaCfg.enabled ? t("pt.jaOn") : t("pt.jaOff"))
            : null),
        h("div", { className: "qbot-ptModHeroDesc" }, t("pt.jaDesc")),
        jaCfgLoaded
          ? h("div", { className: "qbot-ptModHeroSummary" },
              h("span", null, fmt("pt.jaSummaryReq", String(jaReqText.split(/[\n，,]+/).map((s) => s.trim()).filter(Boolean).length))),
              h("span", null, fmt("pt.jaSummaryWhite", String(jaWhiteText.split(/[\n，,]+/).map((s) => s.trim()).filter(Boolean).length))),
              h("span", null, jaCfg.allowEmpty ? t("pt.jaSummaryEmptyOn") : t("pt.jaSummaryEmptyOff")))
          : null)),

    jaCfgLoaded
      ? h(React.Fragment, null,
          // ── 分组一：规则设置 ──────────────────────────────────────────────
          modGroupHead(t("pt.jaGroupRules"), t("pt.jaGroupRulesDesc")),
          h("div", { className: "qbot-ptModGroup" },
            modStep("1", t("pt.jaSecEnable"), "",
              h("label", { className: `qbot-ptJaEnableCheck${jaCfg.enabled ? " is-on" : ""}` },
                h("input", { type: "checkbox", className: "qbot-checkbox",
                  checked: jaCfg.enabled, disabled: !canAdmin,
                  onChange: (e: any) => setJaCfg((c) => ({ ...c, enabled: e.target.checked })) }),
                h("span", { className: "qbot-ptJaEnableText" },
                  h("strong", null, t("pt.jaEnableCheck")),
                  h("span", null, t("pt.jaEnableCheckDesc"))))),
            modStep("2", t("pt.jaSecReq"), "",
              h("textarea", { className: "qbot-ptTextarea", rows: 3,
                value: jaReqText, placeholder: t("pt.jaReqPlaceholder"),
                onChange: (e: any) => setJaReqText(e.target.value) })),
            modStep("3", t("pt.jaSecEmpty"), "",
              h("div", { className: "qbot-ptJaEmptyOpts" },
                h("button", { type: "button", className: `qbot-ptJaEmptyOpt${!jaCfg.allowEmpty ? " is-on" : ""}`,
                  disabled: !canAdmin, onClick: () => setJaCfg((c) => ({ ...c, allowEmpty: false })) },
                  h("span", { className: "qbot-ptJaEmptyIcon", "aria-hidden": "true" }, "◎"),
                  h("span", { className: "qbot-ptJaEmptyText" },
                    h("strong", null, t("pt.jaEmptyKeep")),
                    h("span", null, t("pt.jaEmptyKeepDesc"))),
                  h("span", { className: "qbot-ptJaEmptyCheck", "aria-hidden": "true" }, !jaCfg.allowEmpty ? "✓" : "")),
                h("button", { type: "button", className: `qbot-ptJaEmptyOpt${jaCfg.allowEmpty ? " is-on" : ""}`,
                  disabled: !canAdmin, onClick: () => setJaCfg((c) => ({ ...c, allowEmpty: true })) },
                  h("span", { className: "qbot-ptJaEmptyIcon", "aria-hidden": "true" }, "✦"),
                  h("span", { className: "qbot-ptJaEmptyText" },
                    h("strong", null, t("pt.jaEmptyAi")),
                    h("span", null, t("pt.jaEmptyAiDesc"))),
                  h("span", { className: "qbot-ptJaEmptyCheck", "aria-hidden": "true" }, jaCfg.allowEmpty ? "✓" : "")))),
            modStep("4", t("pt.jaSecWhite"), "",
              h("textarea", { className: "qbot-ptTextarea", rows: 3,
                value: jaWhiteText, placeholder: t("pt.jaWhitePlaceholder"),
                disabled: !canAdmin,
                onChange: (e: any) => setJaWhiteText(e.target.value) }))),
          // ── 分组二：自动运行（无需手动点击） ──────────────────────────────
          modGroupHead(t("pt.jaGroupAuto"), t("pt.jaGroupAutoDesc")),
          h("div", { className: "qbot-ptModGroup" },
            modStep("5", t("pt.jaSecAuto"), "",
              h("div", { className: `qbot-ptJaAutoState ${jaCfg.enabled ? "is-on" : "is-off"}` },
                h("span", { className: "qbot-ptJaAutoDot", "aria-hidden": "true" }),
                h("span", null, jaCfg.enabled ? t("pt.jaAutoOn") : t("pt.jaAutoOff"))))),
          h("div", { className: "qbot-ptModSaveBar" },
            adminBtn("ja.save", t("common.save"), saveJoinAuto, true)))
      : null);

  /** 审批记录 pane：最近 30 条，卡片展示；含 AI 判定理由与申请理由原文。 */
  const recentJaLogs = jaLogs.slice(0, 30);
  const jaLogStats = h("div", { className: "qbot-ptModStats" },
    h("div", { className: "qbot-ptModStat" },
      h("strong", null, String(recentJaLogs.length)), h("span", null, t("pt.jaStatTotal"))),
    h("div", { className: "qbot-ptModStat is-ok" },
      h("strong", null, String(recentJaLogs.filter((l) => l.action === "pass").length)), h("span", null, t("pt.jaStatPass"))),
    h("div", { className: "qbot-ptModStat is-esc" },
      h("strong", null, String(recentJaLogs.filter((l) => l.action === "keep").length)), h("span", null, t("pt.jaStatKeep"))),
    h("div", { className: "qbot-ptModStat is-fail" },
      h("strong", null, String(recentJaLogs.filter((l) => l.action === "error" || l.action === "decline").length)), h("span", null, t("pt.jaStatFail"))));

  const joinRecordsPane = h(React.Fragment, null,
    h("div", { className: "qbot-ptModLogHead" },
      h("div", { className: "qbot-ptModLogHeadText" },
        h("strong", null, t("pt.jaRecordsTitle")),
        h("span", null, t("pt.jaRecordsHint")))),
    jaLogsLoaded && recentJaLogs.length
      ? h(React.Fragment, null,
          jaLogStats,
          h("div", { className: "qbot-ptJaRecordList" }, recentJaLogs.map((log, i) =>
            h("div", { key: i, className: `qbot-ptJaRecord is-${log.action}` },
              h("div", { className: "qbot-ptJaRecordHead" },
                h("span", { className: "qbot-ptJaRecordAvatar", "aria-hidden": "true" }, (log.username || "?").slice(0, 1).toUpperCase()),
                h("span", { className: "qbot-ptJaRecordWho" }, log.username || "—"),
                h("span", { className: `qbot-ptJaRecordAct is-${log.action}` }, t(`pt.jaAct.${log.action}`)),
                h("time", { className: "qbot-ptJaRecordTime" }, formatTime(log.at))),
              h("div", { className: "qbot-ptJaRecordRow" },
                h("span", { className: "qbot-ptJaRecordLabel" }, t("pt.jaRecordReason")),
                h("span", { className: "qbot-ptJaRecordValue" }, log.reason || "—")),
              h("div", { className: "qbot-ptJaRecordRow" },
                h("span", { className: "qbot-ptJaRecordLabel" }, t("pt.jaRecordIntro")),
                h("span", { className: "qbot-ptJaRecordIntro" }, log.intro || t("pt.jaRecordIntroEmpty"))),
              log.error ? h("div", { className: "qbot-ptJaRecordErr" }, log.error) : null))))
      : h("div", { className: "qbot-ptModLogEmpty" },
          h("span", { className: "qbot-ptModLogEmptyIcon", "aria-hidden": "true" }, "◎"),
          h("strong", null, t("pt.jaRecordsEmpty")),
          h("span", null, t("pt.jaRecordsEmptyDesc"))));

  /** 手动审批 pane：拉取待处理申请并逐条通过/拒绝。 */
  const joinManualPane = h(React.Fragment, null,
    h("div", { className: "qbot-ptModLogHead" },
      h("div", { className: "qbot-ptModLogHeadText" },
        h("strong", null, t("pt.jaManualTitle")),
        h("span", null, t("pt.jaManualDesc")))),
    requests.length
      ? h("div", { className: "qbot-ptList" },
          requests.map((r) => h("div", { key: r.join_request_id, className: "qbot-ptReqRow" },
            h("div", { className: "qbot-ptReqMain" },
              h("strong", null, r.username || r.member_openid.slice(0, 10) + "…"),
              h("span", { className: "qbot-hint" },
                `${r.apply_at?.slice(0, 16).replace("T", " ") ?? ""} · ${r.apply_source === "invited" ? t("pt.joinInvited") : t("pt.joinSelf")}`),
              r.verify_info?.verify_message
                ? h("span", { className: "qbot-ptReqVerify" }, `「${r.verify_info.verify_message}」`)
                : null,
              r.risk_tips ? h("span", { className: "qbot-ptReqRisk" }, r.risk_tips) : null),
            h("div", { className: "qbot-ptReqOps" },
              adminBtn(`join.ok:${r.member_openid}`, t("pt.joinApproveBtn"), () => approveJoin(r, true), true),
              adminBtn(`join.no:${r.member_openid}`, t("pt.joinDeclineBtn"), () => approveJoin(r, false))))))
      : h("div", { className: "qbot-ptModLogEmpty" },
          h("span", { className: "qbot-ptModLogEmptyIcon", "aria-hidden": "true" }, "◎"),
          h("strong", null, t("pt.joinEmpty")),
          h("span", null, t("pt.joinEmptyDesc"))));

  const joinTabs = [
    { key: "auto", label: t("pt.jaTabAuto") },
    { key: "manual", label: t("pt.jaTabManual") },
    { key: "records", label: t("pt.jaTabRecords") },
  ];

  const groupPanes: Array<{ key: string; label: string; body: React.ReactNode }> = [
    { key: "info", label: t("pt.navInfo"), body: block(t("pt.infoTitle"), t("pt.infoHint"),
        profile
          ? h("div", { className: "qbot-ptInfoGrid" },
              infoCell(t("pt.infoName"), profile.group_name),
              infoCell(t("pt.infoMemo"), profile.group_finger_memo),
              infoCell(t("pt.infoClass"), profile.group_class_text),
              infoCell(t("pt.infoTags"), Array.isArray(profile.group_tags) && profile.group_tags.length
                ? h("span", { className: "qbot-ptTags" },
                    profile.group_tags.map((tag: string) => h("span", { key: tag, className: "qbot-chip" }, tag)))
                : t("pt.infoEmpty")),
              infoCell(t("pt.infoMembers"), String(profile.group_member_num ?? 0)),
              infoCell(t("pt.infoUnion"), profile.union_group_openid || t("pt.infoEmpty")),
              infoCell("group_openid", profile.group_openid))
          : null,
      ) },
    { key: "members", label: t("pt.navMembers"), body: block(t("pt.membersTitle"), t("pt.admHint"),
        memberCursor || members.length
          ? h("div", { className: "qbot-ptRow" },
              memberCursor ? adminBtn("adm.more", t("archive.loadMore"), () => loadMembers(memberCursor)) : null,
              members.length ? h("span", { className: "qbot-hint" }, fmt("pt.membersTotal", members.length)) : null)
          : null,
        members.length
          ? h("div", { className: "qbot-ptRow" },
              h("input", { className: "qbot-settingInput qbot-ptSearch", value: memberSearch,
                placeholder: t("pt.membersSearch"),
                onChange: (e: any) => setMemberSearch(e.target.value), "aria-label": t("pt.membersSearch") }),
              h("button", { type: "button", className: "qbot-btn", onClick: () => {
                const page = new Set(shownMembers.map((m) => m.member_openid));
                setChecked((prev) => {
                  const all = [...page].every((o) => prev.has(o));
                  const next = new Set(prev);
                  for (const o of page) { if (all) next.delete(o); else next.add(o); }
                  return next;
                });
              } }, checked.size && shownMembers.length && shownMembers.every((m) => checked.has(m.member_openid))
                ? t("pt.clearSelect") : t("pt.selectAll")),
              checked.size ? h("span", { className: "qbot-hint" }, fmt("pt.selectedCount", checked.size)) : null)
          : null,
        shownMembers.length
          ? h("div", { className: "qbot-ptMembers" },
              shownMembers.map((m) => h("div", { key: m.member_openid, className: "qbot-ptMemberRow" },
                h("label", { className: "qbot-ptMemberCheck" },
                  h("input", { type: "checkbox", className: "qbot-checkbox",
                    checked: checked.has(m.member_openid),
                    onChange: () => toggleCheck(m.member_openid) }),
                  h("span", { className: "qbot-ptMemberName" }, m.username || m.member_openid.slice(0, 10) + "…"),
                  m.member_role && m.member_role !== "member"
                    ? h("span", { className: "qbot-chip is-active" }, m.member_role === "owner" ? t("pt.roleOwner") : t("pt.roleAdmin"))
                    : null,
                  m.bot ? h("span", { className: "qbot-chip" }, "Bot") : null),
                h("button", { type: "button", className: "qbot-btn qbot-ptMemberInfo",
                  title: t("pt.memberDetail"), onClick: () => showMemberDetail(m) }, "ⓘ"))))
          : null,
        // 成员详情是查询结果，直接在列表下方内联展示，不用吸顶 toast。
        memberDetail
          ? h("div", { className: "qbot-ptInfoGrid" },
              infoCell(t("pt.memberDetail"), h("code", { className: "qbot-mono" }, JSON.stringify(memberDetail, null, 2))))
          : null,
        members.length
          ? h("div", { className: "qbot-ptRow qbot-ptOps" },
              h("select", { className: "qbot-settingSelect", value: String(muteMinutes),
                onChange: (e: any) => setMuteMinutes(Number(e.target.value)), "aria-label": t("pt.muteDuration") },
                [10, 30, 60, 360, 1440, 43200].map((m) =>
                  h("option", { key: m, value: String(m) }, m < 60 ? fmt("pt.muteMinutes", m) : m < 1440 ? fmt("pt.muteHours", m / 60) : fmt("pt.muteDays", m / 1440)))),
              adminBtn("adm.mute", t("pt.muteBtn"), () => muteSelected(muteMinutes), true),
              adminBtn("adm.unmute", t("pt.unmuteBtn"), () => muteSelected(0)),
              adminBtn("adm.remove", t("pt.removeBtn"), removeSelected))
          : null,
      ) },
    { key: "black", label: t("pt.navBlack"), body: block(t("pt.blackTitle"), t("pt.blackHint"),
        blacklist.length ? h("div", { className: "qbot-ptRow" },
          h("span", { className: "qbot-hint" }, fmt("pt.blackLoaded", blacklist.length))) : null,
        h("div", { className: "qbot-ptRow" },
          h(GroupPicker, { value: blackPick, options: blackCandidates, onChange: setBlackPick,
            placeholder: t("pt.blackPick"), label: t("pt.blackTitle") }),
          adminBtn("black.add", t("pt.blackAdd"), () => changeBlacklist("add", blackPick ? [blackPick.trim()] : [])),
          adminBtn("black.del", t("pt.blackDel"), () => changeBlacklist("del", blacklist.map((b) => b.member_openid)))),
        blacklist.length
          ? h("div", { className: "qbot-ptList" },
              blacklist.map((b) => h("div", { key: b.member_openid, className: "qbot-ptPanelRow" },
                h("code", { className: "qbot-mono" }, b.member_openid),
                h("span", { className: "qbot-ptPanelRemark" }, b.username || "—"),
                b.banned_at ? h("span", { className: "qbot-hint" }, formatTime(b.banned_at)) : null,
                h("button", { type: "button", className: "qbot-btn qbot-btnDanger", disabled: !canAdmin,
                  onClick: () => changeBlacklist("del", [b.member_openid]) }, t("pt.blackDel")))))
          : null,
      ) },
    { key: "join", label: t("pt.navJoin"), body: block(t("pt.joinTitle"), t("pt.joinHint"),
        !group
          ? h("div", { className: "qbot-ptEmpty" },
              h("span", { className: "qbot-ptEmptyIcon" }, "⌁"),
              h("span", null, t("pt.groupNoSelect")))
          : perm !== "admin"
            ? h("div", { className: "qbot-ptPermTip" }, t("pt.jaNeedAdmin"))
            : h(React.Fragment, null,
                subNav(joinTabs, jaInnerTab, (k) => pickJoinTab(k as "auto" | "manual" | "records")),
                h("div", { className: "qbot-ptModPane" },
                  jaInnerTab === "auto" ? joinAutoPane
                    : jaInnerTab === "records" ? joinRecordsPane
                    : joinManualPane))) },
    { key: "moderation", label: t("pt.navModeration"), body: moderationBody },
    { key: "panels", label: t("pt.panelsTitle"), body: block(t("pt.panelsTitle"), t("pt.panelsHint"),
        h("div", { className: "qbot-ptRow" },
          btn("panels.new", t("pt.panelNew"), startNewPanel, false)),
        panelsLoaded && panels.length
          ? h("div", { className: "qbot-ptRow qbot-hint" }, fmt("pt.panelsCount", panels.length))
          : panelsLoaded ? h("div", { className: "qbot-ptEmpty" }, t("pt.panelsEmpty")) : null,
        // 面板列表：查看 / 编辑 / 删除
        ...panels.map((p) => h("div", { key: p.panel_id, className: "qbot-ptPanelRow" },
          h("div", { className: "qbot-ptPanelMeta" },
            h("code", { className: "qbot-mono" }, p.panel_id ?? "—"),
            h("span", { className: "qbot-hint" }, fmt("pt.panelsItems", p.panel?.items?.length ?? 0)),
            p.panel?.remark ? h("span", { className: "qbot-ptPanelRemark" }, p.panel.remark) : null),
          h("div", { className: "qbot-ptRow" },
            btn(`panels.view:${p.panel_id}`, t("pt.panelView"), () => openPanel(p, "view")),
            btn(`panels.edit:${p.panel_id}`, t("common.edit"), () => openPanel(p, "edit")),
            btn(`panels.del:${p.panel_id}`, t("common.delete"), () => deletePanel(p.panel_id ?? ""))))),
        // 表单：仅点新增/编辑/查看后展开；查看模式全部禁用
        panelFormMode
          ? h("div", { className: "qbot-ptPanelForm" },
              h("div", { className: "qbot-ptFieldLabel" },
                panelFormMode === "create" ? t("pt.panelCreating")
                  : panelFormMode === "edit" ? t("pt.panelEditing") : t("pt.panelViewing")),
              h("label", { className: "qbot-ptField qbot-ptFieldWide" },
                h("span", null, t("pt.panelRemark")),
                h("input", { className: "qbot-settingInput", value: panelRemark, maxLength: 255,
                  placeholder: t("pt.panelRemark"), "aria-label": t("pt.panelRemark"),
                  disabled: panelReadonly, onChange: (e: any) => setPanelRemark(e.target.value) })),
              // 填写示例（折叠）
              h("details", { className: "qbot-ptPanelHelp" },
                h("summary", null, t("pt.panelHelpTitle")),
                h("pre", { className: "qbot-ptPanelHelpCode" }, t("pt.panelHelpExample"))),
              // 面板元素：结构化表单
              h("div", { className: "qbot-ptFieldLabel" }, t("pt.panelItems")),
              ...panelItems.map((it, idx) => h("div", { key: idx, className: "qbot-ptItemCard" },
                h("div", { className: "qbot-ptItemHead" },
                  h("span", { className: "qbot-ptItemNo" }, fmt("pt.panelItemNo", idx + 1)),
                  h("div", { className: "qbot-ptItemHeadOps" },
                    // 查看模式用明确的「是/否」文本回显，避免 disabled checkbox 被宿主样式渲染成看不出勾选态的灰块。
                    panelReadonly
                      ? h("span", { className: `qbot-ptAdminBadge${it.only_admin ? " is-on" : ""}` },
                          `${t("pt.panelItemAdmin")}：${it.only_admin ? t("pt.panelAdminYes") : t("pt.panelAdminNo")}`)
                      : h("label", { className: "qbot-ptCheckRow" },
                          h("input", { type: "checkbox", className: "qbot-checkbox", checked: it.only_admin,
                            onChange: (e: any) => updatePanelItem(idx, { only_admin: e.target.checked }) }),
                          h("span", null, t("pt.panelItemAdmin"))),
                    panelReadonly ? null : btn(`panels.itemDel:${idx}`, t("pt.panelItemDel"), () => removePanelItem(idx), false, { className: "qbot-btn qbot-ptItemDel" }))),
                h("div", { className: "qbot-ptItemGrid" },
                  h("label", { className: "qbot-ptField qbot-ptItemType" },
                    h("span", null, t("pt.panelItemType")),
                    h("select", { className: "qbot-settingSelect", value: it.type,
                      disabled: panelReadonly, onChange: (e: any) => updatePanelItem(idx, { type: e.target.value, ...(e.target.value === "link" ? { link: it.link || "https://" } : {}) }),
                      "aria-label": t("pt.panelItemType") },
                      h("option", { value: "command" }, t("pt.panelItemTypeCmd")),
                      h("option", { value: "link" }, t("pt.panelItemTypeLink")))),
                  h("label", { className: "qbot-ptField qbot-ptItemName" },
                    h("span", null, it.type === "command" ? t("pt.panelItemCmd") : t("pt.panelItemName")),
                    it.type === "command"
                      ? panelReadonly
                        // 查看模式：纯文本回显实际保存值；无效旧值附提醒，不再混进下拉选项。
                        ? h("div", { className: "qbot-ptCmdReadonly" },
                            h("code", { className: "qbot-mono" }, it.name || "—"),
                            !panelCmdCmds.includes(it.name)
                              ? h("span", { className: "qbot-ptCmdWarn" }, t("pt.panelCmdInvalid"))
                              : null)
                        : h("select", { className: "qbot-settingSelect", value: panelCmdCmds.includes(it.name) ? it.name : "",
                            onChange: (e: any) => updatePanelItem(idx, { name: e.target.value }),
                            "aria-label": t("pt.panelItemCmd") },
                            // 占位项：无合法命令被选中时显示；无效旧值不进下拉，保存前必须重选。
                            h("option", { value: "" }, t("pt.panelCmdPick")),
                            ...panelCmdChoices().map((c) =>
                              h("option", { key: c.cmd, value: c.cmd }, `${c.cmd} ${t(c.labelKey)}`)))
                      : h("input", { className: "qbot-settingInput", value: it.name, maxLength: 14,
                          placeholder: t("pt.panelItemNamePh"), disabled: panelReadonly,
                          onChange: (e: any) => updatePanelItem(idx, { name: e.target.value }),
                          "aria-label": t("pt.panelItemName") })),
                  h("label", { className: "qbot-ptField qbot-ptFieldWide" },
                    h("span", null, t("pt.panelItemDesc")),
                    h("input", { className: "qbot-settingInput", value: it.desc, maxLength: 80,
                      placeholder: t("pt.panelItemDescPh"), disabled: panelReadonly,
                      onChange: (e: any) => updatePanelItem(idx, { desc: e.target.value }),
                      "aria-label": t("pt.panelItemDesc") })),
                  it.type === "link"
                    ? h("label", { className: "qbot-ptField qbot-ptFieldWide" },
                        h("span", null, t("pt.panelItemLink")),
                        h("input", { className: "qbot-settingInput", value: it.link,
                          placeholder: "https://example.com", disabled: panelReadonly,
                          onChange: (e: any) => updatePanelItem(idx, { link: e.target.value }),
                          "aria-label": t("pt.panelItemLink") }))
                    : null))),
              panelItems.length === 0
                ? h("div", { className: "qbot-ptEmpty" }, t("pt.panelItemsEmpty")) : null,
              h("div", { className: "qbot-ptPanelActions" },
                panelReadonly ? null : h("div", { className: "qbot-ptRow" },
                  btn("panels.itemAdd", t("pt.panelItemAdd"), addPanelItem, false,
                    { className: "qbot-btn qbot-ptAddBtn", disabled: panelItems.length >= PANEL_ITEM_MAX }),
                  h("span", { className: "qbot-hint" }, fmt("pt.panelItemCount", panelItems.length, PANEL_ITEM_MAX))),
                h("div", { className: "qbot-ptRow qbot-ptPanelActionsEnd" },
                  panelReadonly ? null : btn("panels.save", t("common.save"), savePanel, true),
                  btn("panels.cancel", panelReadonly ? t("common.close") : t("common.cancel"), closePanelForm))))
          : null,
      ) },
  ];

  // ── 通用能力：各子标签内容 ────────────────────────────────────────────────
  const generalPanes: Array<{ key: string; label: string; body: React.ReactNode }> = [
    { key: "share", label: t("pt.navShare"), body: block(t("pt.shareTitle"), t("pt.shareHint"),
        h("div", { className: "qbot-ptRow" },
          btn("share", t("pt.shareGen"), genShareLink, true),
          shareUrl ? h("span", { className: "qbot-ptShareUrl", title: shareUrl }, shareUrl) : null,
          shareUrl ? h("button", { type: "button", className: "qbot-btn",
            onClick: () => { if (shareUrl) void navigator.clipboard?.writeText(shareUrl).catch(() => undefined); } },
            t("common.copy")) : null),
        h("div", { className: "qbot-ptSelf" },
          h("div", { className: "qbot-ptRow" },
            h("span", { className: "qbot-ptFieldLabel" }, t("pt.selfTitle")),
            btn("self.load", t("pt.selfLoad"), loadSelfInfo)),
          selfInfo
            ? h("div", { className: "qbot-ptInfoGrid" },
                infoCell(t("pt.selfName"), selfInfo.username || "—"),
                infoCell(t("pt.selfId"), selfInfo.id || "—"),
                infoCell(t("pt.selfBot"), selfInfo.bot ? t("pt.selfBotYes") : t("pt.selfBotNo")),
                selfInfo.welcomeMsg ? infoCell(t("pt.selfWelcome"), selfInfo.welcomeMsg) : null)
            : null),
      ) },
    { key: "menu", label: t("pt.navMenu"), body: block(t("pt.menuTitle"), t("pt.menuHint"),
        h("div", { className: "qbot-ptRow" },
          btn("menu.gen", t("pt.menuGen"), genMenu),
          btn("menu.save", t("common.save"), saveMenu, menuDirty)),
        h("textarea", { className: "qbot-ptTextarea", rows: 8, value: menuJson,
          placeholder: t("pt.menuPlaceholder"),
          onChange: (e: any) => { setMenuJson(e.target.value); setMenuDirty(true); },
          spellCheck: false, "aria-label": t("pt.menuTitle") }),
      ) },
    { key: "material", label: t("pt.navMaterial"), body: block(t("pt.materialTitle"), t("pt.materialHint"),
        h("div", { className: "qbot-ptRow" },
          h("input", { className: "qbot-settingInput qbot-ptGroupPick", value: materialUrl,
            placeholder: "https://…(png/jpeg/gif/webp ≤10MB)",
            onChange: (e: any) => setMaterialUrl(e.target.value), "aria-label": t("pt.materialTitle") }),
          btn("material", t("pt.materialUpload"), uploadMaterial)),
        materialRef ? h("div", { className: "qbot-ptRow" },
          h("code", { className: "qbot-ptShareUrl" }, materialRef),
          h("span", { className: "qbot-hint" }, t("pt.materialCopied"))) : null,
      ) },
    { key: "card", label: t("pt.navCard"), body: block(t("pt.cardTitle"), t("pt.cardHint"),
        h("div", { className: "qbot-ptGrid" },
          h("label", { className: "qbot-ptField" },
            h("span", null, t("pt.cardScope")),
            h("select", { className: "qbot-settingSelect", value: cardScope, onChange: (e: any) => pickCardScope(e.target.value) },
              h("option", { value: "group" }, t("pt.scopeGroup")),
              h("option", { value: "c2c" }, t("pt.scopeC2c")))),
          h("label", { className: "qbot-ptField" },
            h("span", null, t("pt.cardOpenid")),
            h(GroupPicker, {
              value: cardOpenid,
              options: cardScope === "group" ? displayOptions : [],
              onChange: pickCardOpenid,
              placeholder: t("pt.cardOpenidPlaceholder"), label: t("pt.cardOpenid"),
            }))),
        // 被动回复选择：绕开主动消息权限限制。
        h("div", { className: "qbot-ptReply" },
          h("div", { className: "qbot-ptRow" },
            h("span", { className: "qbot-ptFieldLabel" }, t("pt.cardReplyMsg")),
            btn("card.replies", t("pt.cardReplyLoad"), loadReplyMsgs)),
          h("div", { className: "qbot-ptBlockDesc" }, t("pt.cardReplyHint")),
          replyMsgs.length
            ? h("select", { className: "qbot-settingSelect qbot-ptReplySelect", value: replyMsgId,
                onChange: (e: any) => setReplyMsgId(e.target.value), "aria-label": t("pt.cardReplyMsg") },
                h("option", { value: "" }, t("pt.cardReplyNone")),
                ...replyMsgs.map((m) => h("option", { key: m.msgId, value: m.msgId },
                  `${m.senderName || m.sender || "?"}：${m.content.slice(0, 24)} · ${fmt("pt.replyLeft", m.leftSec)}`)))
            : null),
        h("div", { className: "qbot-ptGrid" },
          h("label", { className: "qbot-ptField" },
            h("span", null, t("pt.cardTitleLabel")),
            h("input", { className: "qbot-settingInput", value: cardTitle, maxLength: 50, onChange: (e: any) => setCardTitle(e.target.value) })),
        h("label", { className: "qbot-ptField qbot-ptFieldWide" },
          h("span", null, t("pt.cardPic")),
          h("input", { className: "qbot-settingInput", value: cardPic, placeholder: "https://…/cover.jpg", onChange: (e: any) => setCardPic(e.target.value) }),
          h("span", { className: "qbot-ptFieldHint" }, t("pt.cardPicHint")))),
        h("label", { className: "qbot-ptField qbot-ptFieldWide" },
          h("span", null, t("pt.cardDesc")),
          h("textarea", { className: "qbot-ptTextarea", rows: 2, maxLength: 200, value: cardDesc, onChange: (e: any) => setCardDesc(e.target.value) })),
        h("label", { className: "qbot-ptField qbot-ptFieldWide" },
          h("span", null, t("pt.cardUrl")),
          h("input", { className: "qbot-settingInput", value: cardUrl, placeholder: "https://…", onChange: (e: any) => setCardUrl(e.target.value) })),
        h("div", { className: "qbot-ptRow" }, btn("card", t("pt.cardSend"), sendCard, true)),
      ) },
  ];

  // 左侧导航两大组：群聊（含执行记录）/ 通用。图标仅装饰，不参与本地化。
  const NAV_GROUPS: Array<{
    title: string; items: Array<{ key: string; label: string; icon: string }>;
  }> = [
    {
      title: t("pt.catGroup"),
      items: [
        ...groupPanes.map((p, i) => ({
          key: `g:${p.key}`, label: p.label,
          icon: ["◈", "♙", "⊘", "⌑", "✦", "▦"][i] ?? "•",
        })),
        { key: "g:assistant", label: t("ai.title"), icon: "✧" },
      ],
    },
    {
      title: t("pt.catGeneral"),
      items: generalPanes.map((p, i) => ({
        key: `u:${p.key}`, label: p.label,
        icon: ["↗", "☰", "▣", "▤"][i] ?? "•",
      })),
    },
  ];
  const isGroupScope = navKey.startsWith("g:");
  const activeKey = navKey.slice(2);
  const activeGroupPane = groupPanes.find((p) => p.key === activeKey) ?? groupPanes[0];
  const activeGeneralPane = generalPanes.find((p) => p.key === activeKey) ?? generalPanes[0];

  // 控制台单棵导航树切换焦点时，同步二级导航项与三级子 Tab。
  React.useEffect(() => {
    if (!focus) return;
    setNavKey(focus.nav);
    if (focus.joinTab) setJaInnerTab(focus.joinTab);
    if (focus.modTab) setModInnerTab(focus.modTab);
  }, [focus?.nav, focus?.joinTab, focus?.modTab]);

  // 从控制台其它菜单切回来时 group 由外层带(!group)恢复，重新校验权限以加载数据；
  // group 未变（如仅切子 Tab）时不重复请求。
  const lastPermGroup = React.useRef("");
  React.useEffect(() => {
    if (group && group !== lastPermGroup.current) {
      lastPermGroup.current = group;
      checkPerm(group);
    }
    if (!group) lastPermGroup.current = "";
  }, [group, checkPerm]);

  // 选群 / 切换左侧导航 / 切换子标签后自动加载当前面板数据，不再需要手点「加载」按钮。
  // 切面板、切群、切子标签、权限从 checking 变为 admin 都会触发；assistant（执行记录）由组件自转。
  React.useEffect(() => {
    if (!isGroupScope) {
      // 图文卡片的消息列表需先选目标 openid 才能查，保留主动加载按钮。
      if (activeKey === "menu") loadMenu();
      return;
    }
    // 指令面板作用于全部群，与选群无关，进入即加载。
    if (activeKey === "panels") { loadPanels(); return; }
    if (!group) return;
    switch (activeKey) {
      case "info": loadProfile(); break;
      case "black": loadBlacklist(); break;
      case "members": if (canAdmin) loadMembers(""); break;
      case "join":
        if (!canAdmin) break;
        if (jaInnerTab === "auto") loadJoinAuto();
        else if (jaInnerTab === "manual") loadRequests();
        else if (jaInnerTab === "records") loadJoinAutoLogs();
        break;
      case "moderation":
        if (!canAdmin) break;
        if (modInnerTab === "config") loadModeration();
        else if (modInnerTab === "logs") loadModLogs();
        else if (modInnerTab === "muted") loadMuted();
        break;
      default: break;
    }
  }, [activeKey, group, isGroupScope, canAdmin, jaInnerTab, modInnerTab]);

  return h("div", { className: `qbot-ptLayout${embedded ? " is-embedded" : ""}` },
    // ══ 左侧分组导航（群聊 / 通用 两大组，与频道管理同款） ════════════════════
    embedded ? null : h("nav", { className: "qbot-ptNav", role: "tablist", "aria-label": t("pt.tabTitle") },
      NAV_GROUPS.map((group) => h("div", { className: "qbot-ptNavGroup", key: group.title },
        h("div", { className: "qbot-ptNavGroupTitle" }, group.title),
        ...group.items.map((item) => h("button", {
          key: item.key, type: "button", role: "tab",
          "aria-selected": navKey === item.key,
          className: `qbot-ptNavItem${navKey === item.key ? " is-active" : ""}`,
          onClick: () => setNavKey(item.key),
        },
          h("span", { className: "qbot-ptNavIcon", "aria-hidden": "true" }, item.icon),
          h("span", null, item.label))))))

    // ══ 右侧内容 ══════════════════════════════════════════════════════════════
    , h("div", { className: "qbot-ptContent" },
      isGroupScope
        ? h(React.Fragment, null,
            // 选群卡片：群聊组内细项共用（执行记录也按群过滤）；指令面板作用于全部群，无需选群。
            activeKey === "panels" ? null : h("div", { className: "qbot-ptPickCard" },
              h("div", { className: "qbot-ptStepTag" }, t("pt.stepPick")),
              h("div", { className: "qbot-ptRow" },
                h(GroupPicker, {
                  value: group, options: displayOptions, onChange: pickGroup,
                  placeholder: t("pt.groupPlaceholder"), label: t("pt.groupPickerTitle"),
                }),
                group ? h("span", { className: "qbot-ptGroupId", title: group }, group) : null),
              permBanner,
              !canAdmin && perm === "member"
                ? h("div", { className: "qbot-ptPermTip" }, t("pt.permDeniedTip"))
                : null),
            activeKey === "assistant"
              ? h(AiChatPanel, {
                  key: group || "nogroup",
                  rpcCall,
                  appId,
                  scope: "group",
                  groupOpenid: group || "",
                })
              : activeKey === "panels"
                ? h("div", { className: "qbot-ptSubPane" }, activeGroupPane.body)
                : group
                  ? h("div", { className: "qbot-ptSubPane" }, activeGroupPane.body)
                  : h("div", { className: "qbot-ptEmpty" },
                      h("span", { className: "qbot-ptEmptyIcon" }, "⌁"),
                      h("span", null, t("pt.groupEmpty"))))
        : h("div", { className: "qbot-ptSubPane" }, activeGeneralPane.body)));
}

/** 群资料的一个只读字段。 */
function infoCell(label: string, content: React.ReactNode) {
  return h("div", { className: "qbot-ptInfoCell" },
    h("span", { className: "qbot-ptInfoLabel" }, label),
    h("span", { className: "qbot-ptInfoValue" }, content || t("pt.infoEmpty")));
}

/**
 * 群 / openid 可搜索选择器：按钮展示当前值，弹出面板内输入即过滤，
 * 候选项显示来源徽章与提示，可手输任意 openid（无选项时仍可用）。
 */
function GroupPicker(props: {
  value: string;
  options: GroupOption[];
  onChange: (v: string) => void;
  placeholder: string;
  label: string;
}) {
  const { value, options, onChange, placeholder, label } = props;
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  /** fixed 弹层坐标（相对视口），下方空间不够时翻到按钮上方。 */
  const [pos, setPos] = React.useState<{ left: number; top: number; width: number; placement: "bottom" | "top" }>({
    left: 0, top: 0, width: 0, placement: "bottom",
  });
  const PANEL_MAX = 300;
  const GAP = 4;

  const reposition = React.useCallback(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const spaceBelow = window.innerHeight - r.bottom;
    const placement = spaceBelow < Math.min(PANEL_MAX, 180) + GAP && r.top > spaceBelow ? "top" : "bottom";
    setPos({
      left: r.left,
      top: placement === "bottom" ? r.bottom + GAP : r.top - GAP,
      width: r.width,
      placement,
    });
  }, []);

  React.useEffect(() => {
    if (!open) return;
    reposition();
    const onDoc = (e: any) => {
      const target = e.target as Node;
      if (btnRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onDoc, true);
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      document.removeEventListener("pointerdown", onDoc, true);
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open, reposition]);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? options.filter((o) => o.value.toLowerCase().includes(q) || o.label.toLowerCase().includes(q))
    : options;
  const current = options.find((o) => o.value === value);
  const panelStyle: React.CSSProperties = {
    left: pos.left,
    width: pos.width,
    maxHeight: PANEL_MAX,
    ...(pos.placement === "bottom" ? { top: pos.top } : { bottom: window.innerHeight - pos.top }),
  };
  return h(React.Fragment, null,
    h("div", { className: "qbot-ptCombo" },
      h("button", {
        ref: btnRef,
        type: "button",
        className: `qbot-ptComboBtn${value ? " is-on" : ""}`,
        onClick: () => setOpen((v) => !v),
        "aria-label": label, "aria-expanded": open,
        title: value ? (current?.label ?? value) : placeholder,
      },
        h("span", { className: "qbot-ptComboBtnText" }, value ? (current?.label ?? value) : placeholder),
        current?.memberNum
          ? h("span", { className: "qbot-convGroupMembers", title: fmt("archive.groupMemberNum", String(current.memberNum)) },
              fmt("archive.groupMembersShort", String(current.memberNum)))
          : null,
        h("svg", { className: "qbot-archMemberCaret", width: 12, height: 12, viewBox: "0 0 24 24", fill: "none",
          stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" },
          h("path", { d: "M6 9l6 6 6-6" })))),
    open
      ? createPortal(
          h("div", { ref: panelRef, className: `qbot-ptComboPanel is-${pos.placement}`, role: "listbox", "aria-label": label, style: panelStyle },
            h("input", { className: "qbot-settingInput qbot-ptComboSearch", value: query,
              placeholder: t("pt.membersSearch"),
              onChange: (e: any) => setQuery(e.target.value), "aria-label": t("pt.membersSearch"), autoFocus: true }),
            h("div", { className: "qbot-ptComboList" },
              filtered.length
                ? filtered.slice(0, 80).map((o) => h("button", { key: o.value, type: "button", role: "option",
                    "aria-selected": o.value === value,
                    className: `qbot-ptComboItem${o.value === value ? " is-on" : ""}`,
                    title: o.value,
                    onClick: () => { onChange(o.value); setQuery(""); setOpen(false); },
                  },
                    h("span", { className: "qbot-ptComboItemLabel" }, o.label),
                    o.memberNum
                      ? h("span", { className: "qbot-convGroupMembers", title: fmt("archive.groupMemberNum", String(o.memberNum)) },
                          fmt("archive.groupMembersShort", String(o.memberNum)))
                      : null,
                    h("span", { className: `qbot-ptComboSource is-${o.source}` },
                      o.source === "config" ? t("pt.groupSourceConfig") : t("pt.groupSourceArchive")),
                    o.hint ? h("span", { className: "qbot-ptComboItemHint" }, o.hint) : null))
                : h("div", { className: "qbot-ptComboEmpty" }, t("pt.comboEmpty"))),
            query.trim()
              ? h("button", { type: "button", className: "qbot-ptComboManual",
                  onClick: () => { onChange(query.trim()); setQuery(""); setOpen(false); } },
                  `${t("pt.comboEmpty")} → ${query.trim()}`)
              : null),
          document.body,
        )
      : null,
  );
}
