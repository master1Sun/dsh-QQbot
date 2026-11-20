/**
 * QQ 频道管理弹窗：与「平台能力」弹窗同一外壳（遮罩 / 头部 / 吸顶提示 / 底部关闭），
 * 内部改为**竖向 Tab**（左侧导航 + 右侧内容），把官方频道 OpenAPI 能力按功能分组：
 *   频道列表 → 频道详情 → 子频道 → 频道成员 → 身份组 → 发消息 → 事件说明
 *
 * 接口对应：GET /users/@me/guilds、GET /guilds/{id}、GET|POST|PATCH|DELETE /channels/{id}、
 * GET /guilds/{id}/members、GET /guilds/{id}/members/{user}、GET|POST|PATCH|DELETE /guilds/{id}/roles、
 * PUT|DELETE /guilds/{id}/members/{user}/roles/{role}、POST /channels/{id}/messages。
 * 功能需要新宿主 RPC（guild.*），宿主旧版本会返回 unknown endpoint — 提示里给出重启指引。
 */
import * as React from "react";
import { fmt, h, t, useLocale } from "../i18n/index.js";
import type { RpcCall } from "../types.js";
import { confirmDlg, errText, formatTime, val } from "../ui.js";
import { AiChatPanel } from "./ai-chat-panel.js";

export type GuildTab = "guilds" | "info" | "channels" | "members" | "roles" | "message" | "speak" | "content" | "ai" | "apiPerm" | "events" | "assistant";

/** 由外层控制台单棵导航树驱动的焦点：指定要显示的二级 Tab 及其三级子 Tab。 */
export interface GuildFocus {
  tab: GuildTab;
  speakTab?: "all" | "member" | "frequency" | "keyword";
  kwTab?: "config" | "logs";
  contentTab?: "recall" | "announce" | "pin" | "schedule" | "audio" | "forum";
  aiTab?: "config" | "logs" | "reply" | "replyLogs";
}

interface GuildItem {
  id: string; name: string; icon?: string; owner_id?: string; owner?: boolean;
  member_count?: number; max_members?: number; description?: string; joined_at?: string;
}

/** GET /guilds/{id}/api_permission 返回结构（官方：auth_status === 1 才已授权）。 */
interface ApiPermEntry {
  path?: string; method?: string; desc?: string; auth_status?: number | string;
}
interface ApiPermResult {
  apis?: ApiPermEntry[];
  [key: string]: unknown;
}

interface ChannelItem {
  id: string; guild_id?: string; name?: string; type?: number; sub_type?: number;
  position?: number; parent_id?: string; private_type?: number; speak_permission?: number;
}

interface RoleItem {
  id?: string; role_id?: string; name?: string; color?: number; hoist?: number;
  number?: number; member_limit?: number;
}

const TEXT_KEYS: Array<{ key: GuildTab; icon: string }> = [
  { key: "guilds", icon: "◈" },
  { key: "info", icon: "ⓘ" },
  { key: "channels", icon: "☰" },
  { key: "members", icon: "♙" },
  { key: "roles", icon: "◆" },
  { key: "message", icon: "✎" },
  { key: "speak", icon: "◉" },
  { key: "content", icon: "⌫" },
  { key: "ai", icon: "✦" },
  { key: "assistant", icon: "✧" },
  { key: "apiPerm", icon: "⚿" },
  { key: "events", icon: "⌁" },
];

const CHANNEL_TYPES = [0, 2, 4, 10005, 10006, 10007];
const DEFAULT_ROLE_IDS = new Set(["1", "2", "4", "5"]);

const str = (v: unknown): string => (typeof v === "string" ? v : typeof v === "number" ? String(v) : "");
const num = (v: unknown): number => (typeof v === "number" && Number.isFinite(v) ? v : 0);
/** 多行文本框 → 去空行/去首尾空白的字符串数组。 */
const splitLines = (v: string): string[] => v.split("\n").map((s) => s.trim()).filter(Boolean);
const intOf = (v: string, fallback = 0): number => {
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
};

/** 生成开箱即用的日程 JSON（毫秒时间戳：1 小时后开始、持续 1 小时）。 */
const defaultScheduleBody = (): string => {
  const start = Date.now() + 60 * 60 * 1000;
  const end = start + 60 * 60 * 1000;
  return JSON.stringify({
    name: "新日程",
    start_timestamp: String(start),
    end_timestamp: String(end),
    remind_type: "1",
  }, null, 2);
};

/**
 * 校验创建/修改日程的请求体，返回错误文案 key（通过返回空串）。
 * 官方要求：name 非空；start/end 为毫秒时间戳字符串且 start > 当前、end > start、时长 ≤ 7 天；remind_type 0-5。
 */
const checkScheduleBody = (body: Record<string, unknown>): string => {
  if (!str(body.name).trim()) return "gv.schErrName";
  const start = Number(body.start_timestamp);
  const end = Number(body.end_timestamp);
  if (!body.start_timestamp || !Number.isFinite(start)) return "gv.schErrStart";
  if (!body.end_timestamp || !Number.isFinite(end)) return "gv.schErrEnd";
  if (start <= Date.now()) return "gv.schErrPast";
  if (end <= start) return "gv.schErrEndBeforeStart";
  if (end - start > 7 * 24 * 60 * 60 * 1000) return "gv.schErrTooLong";
  if (!["0", "1", "2", "3", "4", "5"].includes(str(body.remind_type))) return "gv.schErrRemind";
  return "";
};

function friendlyError(message: string): string {
  if (/unknown endpoint|unknown rpc/i.test(message)) return t("pt.errHostRestart");
  // 应用无接口访问权限：QQ 频道部分接口（成员列表/详情、帖子等）需在开发者中心单独开通，
  // 且多数仅私域机器人可用、开通后需把机器人移出频道再重新加入。给可操作提示而非原始 JSON。
  if (/11253|40012010|应用无接口访问权限|api.*permission|no api.*access/i.test(message)) return t("gv.errApiPermission");
  // 精华/撤回等接口需要真实 message_id；填成子频道 ID 会报 501009 unmarshal error。
  if (/501009|unmarshal error|消息.*(格式|无效)|invalid.*message.?id/i.test(message)) return `${t("gv.errBadMsgId")}（${message}）`;
  // 日程 302013-302024：把官方码映射为可操作提示。
  const sch: Record<string, string> = {
    "302013": "gv.schErr302013", "302014": "gv.schErrTooLong", "302015": "gv.schErrPast",
    "302016": "gv.schErrEndBeforeStart", "302017": "gv.schErrEmpty", "302018": "gv.schErrType",
    "302019": "gv.schErr302019", "302020": "gv.schErr302020", "302021": "gv.schErr302021",
    "302022": "gv.schErr302022", "302023": "gv.schErr302023", "302024": "gv.schErr302024",
  };
  const schCode = /3020(1[3-9]|2[0-4])/.exec(message)?.[0];
  if (schCode) return `${t(sch[schCode])}（${schCode}）`;
  if (/403|401|no permission|权限不足|not admin|500013|500014/i.test(message)) return `${t("gv.noPermission")}（${message}）`;
  return message;
}

/** QQ 身份组颜色是 32 位 ARGB 十进制（高 8 位 alpha）。与 <input type=color> 的 #RRGGBB 互转。 */
function argbToHex(v: unknown): string {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return "#7b00cc";
  const rgb = n & 0x00ffffff;
  return `#${rgb.toString(16).padStart(6, "0")}`;
}
function hexToArgb(hex: string): number {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return 4294967295;
  return (0xff000000 | parseInt(m[1], 16)) >>> 0;
}

function channelName(c: ChannelItem): string {
  return c.name || `子频道 ${str(c.id).slice(-6)}`;
}

function channelTypeLabel(c: ChannelItem): string {
  const key = `gv.chType.${c.type ?? 0}`;
  const label = t(key);
  return label === key ? t("gv.chType.0") : label;
}

function guildFrom(v: unknown): GuildItem[] {
  const list = Array.isArray(v) ? v : [];
  return list
    .filter((g): g is Record<string, unknown> => !!g && typeof g === "object")
    .map((g) => ({
      id: str(g.id), name: str(g.name), icon: str(g.icon) || undefined,
      owner_id: str(g.owner_id) || undefined, owner: g.owner === true,
      member_count: num(g.member_count), max_members: num(g.max_members),
      description: str(g.description) || undefined, joined_at: str(g.joined_at) || undefined,
    }))
    .filter((g) => !!g.id);
}

function channelsFrom(v: unknown): ChannelItem[] {
  const list = Array.isArray(v) ? v : [];
  return list
    .filter((c): c is Record<string, unknown> => !!c && typeof c === "object")
    .map((c) => ({
      id: str(c.id), guild_id: str(c.guild_id) || undefined, name: str(c.name) || undefined,
      type: num(c.type), sub_type: num(c.sub_type), position: num(c.position),
      parent_id: str(c.parent_id) || undefined, private_type: num(c.private_type),
      speak_permission: num(c.speak_permission),
    }))
    .filter((c) => !!c.id);
}

function rolesFrom(v: unknown): RoleItem[] {
  const list = Array.isArray(v) ? v : [];
  return list
    .filter((r): r is Record<string, unknown> => !!r && typeof r === "object")
    .map((r) => ({
      id: str(r.id || r.role_id), name: str(r.name), color: num(r.color), hoist: num(r.hoist),
      number: num(r.number), member_limit: num(r.member_limit),
    }));
}

/** 小标题 + 说明（每个 Tab 顶部统一）。 */
function paneHead(title: string, desc: string) {
  return h("div", { className: "qbot-gvPaneHead" },
    h("strong", null, title),
    h("p", null, desc));
}

/** 可粘贴 / 下拉选择的 ID 输入框：手输、粘贴、从候选列表点选三合一。 */
function idInput(opts: {
  value: string; onChange: (v: string) => void; placeholder?: string; label: string;
  listId: string; candidates: Array<{ value: string; label: string }>;
}) {
  return h("div", { className: "qbot-gvIdInput" },
    h("input", {
      className: "qbot-input qbot-mono", list: opts.listId, value: opts.value,
      placeholder: opts.placeholder ?? opts.label, "aria-label": opts.label,
      onChange: (e: any) => opts.onChange(e.target.value),
    }),
    h("datalist", { id: opts.listId },
      opts.candidates.map((c) => h("option", { key: c.value, value: c.value }, c.label))));
}

/** 只读信息格。 */
function infoCell(label: string, content: React.ReactNode) {
  return h("div", { className: "qbot-gvInfoCell" },
    h("span", { className: "qbot-gvInfoLabel" }, label),
    h("span", { className: "qbot-gvInfoValue" }, content || "—"));
}

/** 表单行：左标签、右控件。 */
function field(label: string, control: React.ReactNode, hint?: string) {
  return h("label", { className: "qbot-gvField" },
    h("span", { className: "qbot-gvFieldLabel" }, label),
    control,
    hint ? h("small", { className: "qbot-gvFieldHint" }, hint) : null);
}

export function GuildManager(props: {
  rpcCall: RpcCall;
  appId: string;
  onNotify: (text: string, tone: "error" | "success") => void;
  /** 首次进入时定位的二级 Tab（独立弹窗默认「频道列表」）。 */
  initialTab?: GuildTab;
  /** 由外层控制台单棵导航树驱动的焦点；传入后隐藏本组件自带导航。 */
  focus?: GuildFocus;
  /** 嵌入控制台内容区：隐藏一级 Tab 导航，仅渲染焦点对应内容。 */
  embedded?: boolean;
}) {
  const { rpcCall, appId, onNotify, initialTab, focus, embedded } = props;
  useLocale();
  const [active, setActive] = React.useState<GuildTab>(focus?.tab ?? initialTab ?? "guilds");
  const [busy, setBusy] = React.useState("");
  const [guilds, setGuilds] = React.useState<GuildItem[]>([]);
  const [guild, setGuild] = React.useState<GuildItem | null>(null);
  const [info, setInfo] = React.useState<Record<string, unknown> | null>(null);
  const [channels, setChannels] = React.useState<ChannelItem[]>([]);
  const [channelId, setChannelId] = React.useState("");
  const [members, setMembers] = React.useState<Array<Record<string, unknown>>>([]);
  const [memberAfter, setMemberAfter] = React.useState("");
  const [memberQuery, setMemberQuery] = React.useState("");
  const [memberDetail, setMemberDetail] = React.useState<Record<string, unknown> | null>(null);
  const [roles, setRoles] = React.useState<RoleItem[]>([]);

  // 子频道表单（新建 / 编辑共用）
  const [chEditId, setChEditId] = React.useState("");
  const [chName, setChName] = React.useState("");
  const [chType, setChType] = React.useState("0");
  const [chSubType, setChSubType] = React.useState("1");
  const [chPosition, setChPosition] = React.useState("1");
  const [chParent, setChParent] = React.useState("0");
  const [chPrivate, setChPrivate] = React.useState("0");
  const [chSpeak, setChSpeak] = React.useState("1");

  // 身份组表单
  const [roleEditId, setRoleEditId] = React.useState("");
  const [roleName, setRoleName] = React.useState("");
  const [roleColor, setRoleColor] = React.useState("4294967295");
  const [roleHoist, setRoleHoist] = React.useState(false);
  const [assignUser, setAssignUser] = React.useState("");
  const [assignRole, setAssignRole] = React.useState("");
  const [assignChannel, setAssignChannel] = React.useState("");

  const [messageChannel, setMessageChannel] = React.useState("");
  const [messageText, setMessageText] = React.useState("");
  const [messageResult, setMessageResult] = React.useState<unknown>(null);

  // 发言管理：全员禁言 / 指定成员禁言 / 消息频率设置 / 违规字样处置
  type SpeakTab = NonNullable<GuildFocus["speakTab"]>;
  const [speakTab, setSpeakTab] = React.useState<SpeakTab>(focus?.speakTab ?? "all");
  const [muteUserId, setMuteUserId] = React.useState("");
  const [muteMinutes, setMuteMinutes] = React.useState("10");
  const [msgSettingText, setMsgSettingText] = React.useState("");
  // 发言管理：违规词自动处置（本地关键词匹配，命中即禁言违规者+删除违规内容）
  const [kwEnabled, setKwEnabled] = React.useState(false);
  const [kwWords, setKwWords] = React.useState("");
  const [kwMuteMinutes, setKwMuteMinutes] = React.useState("60");
  const [kwDeleteContent, setKwDeleteContent] = React.useState(true);
  const [kwDeleteThreadOnReply, setKwDeleteThreadOnReply] = React.useState(false);
  const [kwWhitelist, setKwWhitelist] = React.useState("");
  const [kwChannels, setKwChannels] = React.useState("");
  const [kwLogs, setKwLogs] = React.useState<Array<Record<string, unknown>>>([]);
  const [kwTab, setKwTab] = React.useState<NonNullable<GuildFocus["kwTab"]>>(focus?.kwTab ?? "config");

  // 内容管理：撤回消息
  const [recallChannel, setRecallChannel] = React.useState("");
  const [recallMessageId, setRecallMessageId] = React.useState("");
  const [recallHideTip, setRecallHideTip] = React.useState(true);

  // 二级弹窗：子频道 / 身份组编辑（点击列表行的「编辑」后弹出，不再内联平铺）
  const [chDialog, setChDialog] = React.useState(false);
  const [roleDialog, setRoleDialog] = React.useState(false);
  const [assignDialog, setAssignDialog] = React.useState(false);
  // 内容管理子功能（公告 / 精华 / 日程 / 音频 / 帖子）
  type ContentTab = NonNullable<GuildFocus["contentTab"]>;
  const [contentTab, setContentTab] = React.useState<ContentTab>(focus?.contentTab ?? "recall");
  const [contentResult, setContentResult] = React.useState<unknown>(null);
  // 各内容子功能的表单字段
  const [announceMsgId, setAnnounceMsgId] = React.useState("");
  const [announceChannel, setAnnounceChannel] = React.useState("");
  const [announceType, setAnnounceType] = React.useState("1");
  const [pinMsgId, setPinMsgId] = React.useState("");
  // 从子频道拉取的真实消息列表（含 message_id），供精华/撤回等选择，避免误填子频道 ID。
  const [pinMessages, setPinMessages] = React.useState<Array<{ id: string; content: string; author: string; timestamp: string }>>([]);
  /** 是否已查询过消息列表：区分「尚未加载」与「查到 0 条」，用于内联提示。 */
  const [pinMessagesLoaded, setPinMessagesLoaded] = React.useState(false);
  const [scheduleBody, setScheduleBody] = React.useState(defaultScheduleBody());
  const [scheduleId, setScheduleId] = React.useState("");
  const [audioBody, setAudioBody] = React.useState("{\n  \"audio_url\": \"\",\n  \"text\": \"\"\n}");
  const [forumThreadId, setForumThreadId] = React.useState("");
  const [forumBody, setForumBody] = React.useState("{\n  \"title\": \"\",\n  \"content\": \"\"\n}");
  const [apiPermResult, setApiPermResult] = React.useState<ApiPermResult | null>(null);
  const [apiPermOnlyUnauth, setApiPermOnlyUnauth] = React.useState(false);
  // AI 接管子 Tab（审核配置 / 处罚记录 / 自动回帖）
  const [aiTab, setAiTab] = React.useState<NonNullable<GuildFocus["aiTab"]>>(focus?.aiTab ?? "config");
  // 颜色选择器：与十进制 ARGB 输入联动
  const [roleColorHex, setRoleColorHex] = React.useState("#7b00cc");
  // AI 接管配置与日志
  const [aiLogs, setAiLogs] = React.useState<Array<Record<string, unknown>>>([]);
  const [aiEnabled, setAiEnabled] = React.useState(false);
  const [aiMute, setAiMute] = React.useState(true);
  const [aiRecall, setAiRecall] = React.useState(false);
  const [aiWarn, setAiWarn] = React.useState(true);
  const [aiDurLight, setAiDurLight] = React.useState("10");
  const [aiDurMedium, setAiDurMedium] = React.useState("1440");
  const [aiDurSevere, setAiDurSevere] = React.useState("43200");
  const [aiRules, setAiRules] = React.useState("");
  const [aiWhitelist, setAiWhitelist] = React.useState("");
  const [aiChannels, setAiChannels] = React.useState("");
  // 自动回帖配置与日志
  const [replyLogs, setReplyLogs] = React.useState<Array<Record<string, unknown>>>([]);
  const [replyEnabled, setReplyEnabled] = React.useState(false);
  const [replyOnPost, setReplyOnPost] = React.useState(true);
  const [replyOnMention, setReplyOnMention] = React.useState(true);
  const [replyOnce, setReplyOnce] = React.useState(true);
  const [replyPrompt, setReplyPrompt] = React.useState("");
  const [replyWhitelist, setReplyWhitelist] = React.useState("");
  const [replyChannels, setReplyChannels] = React.useState("");
  const [replyGuildMessages, setReplyGuildMessages] = React.useState(false);
  const [replyForumEvents, setReplyForumEvents] = React.useState(false);

  /** 所有提示统一走弹窗头部吸顶 toast（5 秒自动消失），不再内联占表单空间。
   *  二级弹窗会盖住主弹窗头部，因此内部也保留一份，确保表单校验错误可见。 */
  const [subNotice, setSubNotice] = React.useState<{ text: string; tone: "error" | "success" } | null>(null);
  React.useEffect(() => {
    if (!subNotice) return;
    const id = window.setTimeout(() => setSubNotice(null), 5000);
    return () => window.clearTimeout(id);
  }, [subNotice]);
  const notify = React.useCallback((text: string, tone: "error" | "success") => {
    onNotify(text, tone);
    setSubNotice({ text, tone });
  }, [onNotify]);
  const notifyError = React.useCallback((text: string) => notify(text, "error"), [notify]);
  const notifySuccess = React.useCallback((text: string) => notify(text, "success"), [notify]);

  /** 统一 RPC 包装：错误走友好提示，成功提示上报给弹窗头部。 */
  const call = React.useCallback(async (
    endpoint: string,
    payload: Record<string, unknown> = {},
    successText = "",
  ): Promise<any> => {
    const res = await rpcCall(endpoint, { appId, ...payload });
    if (!res.ok) throw new Error(friendlyError(errText(res.error)));
    const data = val(res);
    if (successText) onNotify(successText, "success");
    return data;
  }, [appId, rpcCall, onNotify]);

  /** 短操作包装：busy 防重复，失败走弹窗吸顶红字。 */
  const run = React.useCallback(async (key: string, fn: () => Promise<void>) => {
    setBusy(key);
    try { await fn(); }
    catch (e) {
      notifyError(friendlyError(e instanceof Error ? e.message : String(e)));
    } finally { setBusy(""); }
  }, [notifyError]);

  const btn = (key: string, label: string, onClick: () => void, primary = false, disabled = false) =>
    h("button", {
      className: `qbot-btn${primary ? " qbot-btnPrimary" : ""}`, type: "button",
      disabled: busy === key || disabled, onClick,
    }, busy === key ? t("common.loading") : label);

  const loadGuilds = React.useCallback(async () => {
    await run("guilds", async () => { setGuilds(guildFrom(await call("guild.list"))); });
  }, [call, run]);

  React.useEffect(() => { void loadGuilds(); }, [loadGuilds]);

  /** 切换频道：清空该频道下的缓存数据，避免显示上一个频道的信息。 */
  const pickGuild = (g: GuildItem) => {
    if (guild?.id === g.id) return;
    setGuild(g);
    setInfo(null); setChannels([]); setChannelId(""); setMessageChannel("");
    setMembers([]); setMemberAfter(""); setMemberDetail(null); setRoles([]);
    setChEditId(""); setRoleEditId("");
    setMsgSettingText(""); setRecallChannel("");     setRecallMessageId("");
    setPinMessages([]); setPinMessagesLoaded(false); setPinMsgId("");
    setAiLogs([]);
    setReplyLogs([]);
  };

  React.useEffect(() => {
    if (!guild?.id) return;
    const id = guild.id;
    if (active === "info") {
      void run("info", async () => { setInfo(await call("guild.info", { guildId: id }) ?? {}); });
    } else if (active === "channels") {
      void run("channels", async () => {
        const list = channelsFrom(await call("guild.channels", { guildId: id }));
        setChannels(list);
        setChannelId((prev) => (prev && list.some((c) => c.id === prev) ? prev : (list[0]?.id ?? "")));
      });
    } else if (active === "members") {
      void run("members", async () => {
        const data = await call("guild.members", { guildId: id, after: "0", limit: 100 }) ?? {};
        setMembers(Array.isArray(data.members) ? data.members : []);
        setMemberAfter(str(data.next));
      });
    } else if (active === "roles") {
      void run("roles", async () => { setRoles(rolesFrom(await call("guild.roles", { guildId: id }))); });
    } else if (active === "speak") {
      void run("speak", async () => {
        const setting = await call("guild.setting.get", { guildId: id }) ?? {};
        setMsgSettingText(JSON.stringify(setting, null, 2));
        // 违规词自动处置配置 + 日志
        const kc = await call("guild.keyword.config.get", { guildId: id }) ?? {};
        const kcfg = kc.config ?? {};
        setKwEnabled(kcfg.enabled === true);
        setKwWords(Array.isArray(kcfg.words) ? kcfg.words.join("\n") : "");
        setKwMuteMinutes(String(kcfg.muteMinutes ?? 60));
        setKwDeleteContent(kcfg.deleteContent !== false);
        setKwDeleteThreadOnReply(kcfg.deleteThreadOnReply === true);
        setKwWhitelist(Array.isArray(kcfg.whitelist) ? kcfg.whitelist.join("\n") : "");
        setKwChannels(Array.isArray(kcfg.channelIds) ? kcfg.channelIds.join("\n") : "");
        const kl = await call("guild.keyword.logs", { guildId: id, limit: 30 }) ?? {};
        setKwLogs(Array.isArray(kl.logs) ? kl.logs : []);
      });
    } else if (active === "ai") {
      void run("ai", async () => {
        const mc = await call("guild.mod.config.get", { guildId: id }) ?? {};
        const cfg = mc.config ?? {};
        setAiEnabled(cfg.enabled === true);
        setAiMute(cfg.actions?.mute !== false);
        setAiRecall(cfg.actions?.recall === true);
        setAiWarn(cfg.actions?.warn !== false);
        setAiDurLight(String(cfg.durations?.light ?? 10));
        setAiDurMedium(String(cfg.durations?.medium ?? 1440));
        setAiDurSevere(String(cfg.durations?.severe ?? 43200));
        setAiRules(Array.isArray(cfg.rules) ? cfg.rules.join("\n") : "");
        setAiWhitelist(Array.isArray(cfg.whitelist) ? cfg.whitelist.join("\n") : "");
        setAiChannels(Array.isArray(cfg.channelIds) ? cfg.channelIds.join("\n") : "");
        const logs = await call("guild.mod.logs", { guildId: id, limit: 30 }) ?? {};
        setAiLogs(Array.isArray(logs.logs) ? logs.logs : []);
        const rc = await call("guild.reply.config.get", { guildId: id }) ?? {};
        const rcfg = rc.config ?? {};
        setReplyEnabled(rcfg.enabled === true);
        setReplyOnPost(rcfg.onPost !== false);
        setReplyOnMention(rcfg.onMention !== false);
        setReplyOnce(rcfg.once !== false);
        setReplyPrompt(typeof rcfg.prompt === "string" ? rcfg.prompt : "");
        setReplyWhitelist(Array.isArray(rcfg.whitelist) ? rcfg.whitelist.join("\n") : "");
        setReplyChannels(Array.isArray(rcfg.channelIds) ? rcfg.channelIds.join("\n") : "");
        const rlogs = await call("guild.reply.logs", { guildId: id, limit: 30 }) ?? {};
        setReplyLogs(Array.isArray(rlogs.logs) ? rlogs.logs : []);
        const bc = await call("config.get") ?? {};
        const botCfg = bc.config ?? {};
        setReplyGuildMessages(botCfg.guildMessageEvents === true);
        setReplyForumEvents(botCfg.forumEvents === true);
      });
    }
    // run/call 是稳定引用（依赖 appId），这里只按 tab + 频道变化触发。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, guild?.id]);

  // 控制台单棵导航树切换焦点时，把二级 Tab 与三级子 Tab 同步到本组件状态。
  React.useEffect(() => {
    if (!focus) return;
    setActive(focus.tab);
    if (focus.speakTab) setSpeakTab(focus.speakTab);
    if (focus.kwTab) setKwTab(focus.kwTab);
    if (focus.contentTab) setContentTab(focus.contentTab);
    if (focus.aiTab) setAiTab(focus.aiTab);
  }, [focus?.tab, focus?.speakTab, focus?.kwTab, focus?.contentTab, focus?.aiTab]);

  const needGuild = h("div", { className: "qbot-gvEmpty", role: "status" }, t("gv.needGuild"));

  // ── 各 Tab 内容 ──────────────────────────────────────────────────────────
  const setupHint = h("div", { className: "qbot-gvSetup", role: "note" },
    h("div", { className: "qbot-gvSetupHead" },
      h("span", { className: "qbot-gvSetupIcon", "aria-hidden": "true" }, "ⓘ"),
      h("strong", null, t("gv.setupTitle"))),
    h("ol", { className: "qbot-gvSetupSteps" },
      h("li", null, t("gv.setupStep1")),
      h("li", null, t("gv.setupStep2"))),
    h("div", { className: "qbot-gvSetupFoot" },
      h("span", null, t("gv.setupFoot")),
      h("a", {
        className: "qbot-gvSetupLink",
        href: "https://bot.q.qq.com/",
        target: "_blank", rel: "noreferrer noopener",
      }, t("gv.setupLink"))));

  const guildsPane = () => h("div", { className: "qbot-gvPane" },
    paneHead(t("gv.tab.guilds"), t("gv.guildsDesc")),
    setupHint,
    h("div", { className: "qbot-gvPaneActions" },
      h("span", { className: "qbot-gvCount" }, fmt("gv.guildsTotal", String(guilds.length))),
      btn("guilds", t("common.refresh"), () => void loadGuilds())),
    guilds.length
      ? h("div", { className: "qbot-gvGuildGrid" }, guilds.map((g) =>
          h("button", {
            key: g.id, type: "button",
            className: `qbot-gvGuildCard${guild?.id === g.id ? " is-on" : ""}`,
            title: g.description || g.name, onClick: () => pickGuild(g),
          },
            h("span", { className: "qbot-gvGuildAvatar" }, (g.name || "?").slice(0, 1)),
            h("span", { className: "qbot-gvGuildMain" },
              h("strong", null, g.name || t("gv.infoEmpty")),
              h("small", null, fmt("gv.guildMembers", String(g.member_count)))),
            guild?.id === g.id
              ? h("span", { className: "qbot-gvBadge" }, t("gv.selected"))
              : null)))
      : h("div", { className: "qbot-gvEmpty" }, t("gv.guildsEmpty")));

  const infoPane = () => h("div", { className: "qbot-gvPane" },
    paneHead(t("gv.tab.info"), t("gv.infoDesc")),
    !guild ? needGuild : info
      ? h("div", { className: "qbot-gvInfoGrid" },
          infoCell(t("gv.infoName"), str(info.name) || guild.name),
          infoCell(t("gv.infoId"), guild.id),
          infoCell(t("gv.infoOwner"), str(info.owner_id) || str(info.owner)),
          infoCell(t("gv.infoMember"), num(info.member_count) || ""),
          infoCell(t("gv.infoMax"), num(info.max_members) || ""),
          infoCell(t("gv.infoJoined"), str(info.joined_at) ? formatTime(info.joined_at) : ""),
          h("div", { className: "qbot-gvInfoCell is-wide" },
            h("span", { className: "qbot-gvInfoLabel" }, t("gv.infoIntro")),
            h("span", { className: "qbot-gvInfoValue" }, str(info.description) || "—")))
      : h("div", { className: "qbot-gvEmpty" }, t("gv.infoEmpty")));

  /** 保存子频道（新建或编辑），成功后刷新列表；内联与二级弹窗共用。 */
  const saveChannel = () => void run("chSave", async () => {
    if (!guild) return;
    const name = chName.trim();
    if (!name) { notifyError(t("gv.chName")); return; }
    if (chEditId) {
      await call("guild.channel.patch", {
        channelId: chEditId,
        body: {
          name, position: intOf(chPosition, 1), parent_id: chParent.trim() || "0",
          private_type: intOf(chPrivate), speak_permission: intOf(chSpeak, 1),
        },
      }, t("gv.chUpdated"));
    } else {
      await call("guild.channel.create", {
        guildId: guild.id,
        body: {
          name, type: intOf(chType), sub_type: intOf(chSubType, 1),
          position: intOf(chPosition, 1), parent_id: chParent.trim() || "0",
          private_type: intOf(chPrivate), speak_permission: intOf(chSpeak, 1),
        },
      }, t("gv.chCreated"));
    }
    setChDialog(false); setChEditId(""); setChName("");
    const list = channelsFrom(await call("guild.channels", { guildId: guild.id }));
    setChannels(list);
  });

  /** 打开子频道二级弹窗：编辑带入当前值，新建用默认值。 */
  const openChannelDialog = (c?: ChannelItem) => {
    if (c) {
      setChEditId(c.id); setChName(c.name ?? "");
      setChType(String(c.type ?? 0)); setChSubType(String(c.sub_type ?? 1));
      setChPosition(String(c.position ?? 1)); setChParent(c.parent_id ?? "0");
      setChPrivate(String(c.private_type ?? 0)); setChSpeak(String(c.speak_permission ?? 1));
    } else {
      setChEditId(""); setChName(""); setChType("0"); setChSubType("1");
      setChPosition("1"); setChParent("0"); setChPrivate("0"); setChSpeak("1");
    }
    setChDialog(true);
  };

  const channelForm = () => h("div", { className: "qbot-gvForm" },
    h("div", { className: "qbot-gvFormHead" },
      h("strong", null, chEditId ? t("gv.chEdit") : t("gv.chCreate"))),
    field(t("gv.chName"), h("input", {
      className: "qbot-input", value: chName, placeholder: "公告区",
      onChange: (e: any) => setChName(e.target.value),
    })),
    field(t("gv.chType"), h("select", {
      className: "qbot-settingSelect", value: chType, disabled: !!chEditId,
      onChange: (e: any) => setChType(e.target.value),
    }, CHANNEL_TYPES.map((v) => h("option", { key: v, value: String(v) }, t(`gv.chType.${v}`))))),
    field(t("gv.chSubType"), h("input", {
      className: "qbot-input", type: "number", value: chSubType, disabled: !!chEditId,
      onChange: (e: any) => setChSubType(e.target.value),
    })),
    field(t("gv.chPosition"), h("input", {
      className: "qbot-input", type: "number", value: chPosition,
      onChange: (e: any) => setChPosition(e.target.value),
    })),
    field(t("gv.chParent"), h("input", {
      className: "qbot-input", value: chParent, placeholder: "0",
      onChange: (e: any) => setChParent(e.target.value),
    }), t("gv.chParentHint")),
    field(t("gv.chPrivate"), h("select", {
      className: "qbot-settingSelect", value: chPrivate,
      onChange: (e: any) => setChPrivate(e.target.value),
    }, ["0", "1", "2"].map((v) => h("option", { key: v, value: v }, v)))),
    field(t("gv.chSpeak"), h("select", {
      className: "qbot-settingSelect", value: chSpeak,
      onChange: (e: any) => setChSpeak(e.target.value),
    }, ["0", "1", "2"].map((v) => h("option", { key: v, value: v }, v)))),
    h("div", { className: "qbot-gvFormActions" },
      btn("chSave", t("common.save"), saveChannel, true),
      h("button", { className: "qbot-btn", type: "button", onClick: () => { setChDialog(false); setChEditId(""); setChName(""); } }, t("common.cancel"))));

  const channelsPane = () => h("div", { className: "qbot-gvPane" },
    paneHead(t("gv.tab.channels"), t("gv.chDesc")),
    !guild ? needGuild : h(React.Fragment, null,
      h("div", { className: "qbot-gvList" },
        h("div", { className: "qbot-gvListHead" },
          h("strong", null, t("gv.chList")),
          h("div", { className: "qbot-gvRowOps" },
            h("button", { className: "qbot-btn qbot-btnPrimary", type: "button", onClick: () => openChannelDialog() }, t("gv.chCreate")),
            btn("channels", t("common.refresh"), () => void run("channels", async () => {
              const list = channelsFrom(await call("guild.channels", { guildId: guild.id }));
              setChannels(list);
            })))),
        channels.length
          ? channels.map((c) => h("div", { key: c.id, className: "qbot-gvRow" },
              h("div", { className: "qbot-gvRowMain" },
                h("strong", null, channelName(c)),
                h("small", null, `${channelTypeLabel(c)} · ${c.id}`)),
              h("div", { className: "qbot-gvRowOps" },
                h("button", {
                  className: "qbot-btn", type: "button",
                  onClick: () => openChannelDialog(c),
                }, t("common.edit")),
                h("button", {
                  className: "qbot-btn qbot-btnDanger", type: "button",
                  disabled: busy === `chDel:${c.id}`,
                  onClick: () => void run(`chDel:${c.id}`, async () => {
                    if (!(await confirmDlg({ message: fmt("gv.delConfirm", channelName(c)) }))) return;
                    await call("guild.channel.delete", { channelId: c.id }, t("gv.chDeleted"));
                    setChannels((prev) => prev.filter((x) => x.id !== c.id));
                    if (channelId === c.id) setChannelId("");
                    if (messageChannel === c.id) setMessageChannel("");
                  }),
                }, t("common.delete")))))
          : h("div", { className: "qbot-gvEmpty" }, t("gv.infoEmpty")))));

  const membersPane = () => {
    const q = memberQuery.trim().toLowerCase();
    const shown = q
      ? members.filter((m) => {
          const user = (m.user && typeof m.user === "object" ? m.user : {}) as Record<string, unknown>;
          return str(user.id).toLowerCase().includes(q)
            || str(user.username).toLowerCase().includes(q)
            || str(m.nick).toLowerCase().includes(q);
        })
      : members;
    return h("div", { className: "qbot-gvPane" },
      paneHead(t("gv.tab.members"), t("gv.memDesc")),
      !guild ? needGuild : h(React.Fragment, null,
        memberDetail
          ? h("div", { className: "qbot-gvDetail" },
              h("div", { className: "qbot-gvDetailHead" },
                h("strong", null, str((memberDetail.user as Record<string, unknown> | undefined)?.username) || str(memberDetail.nick) || t("gv.memDetail")),
                h("button", { className: "qbot-modalClose", type: "button", "aria-label": t("common.close"), onClick: () => setMemberDetail(null) }, "×")),
              h("div", { className: "qbot-gvInfoGrid" },
                infoCell(t("gv.infoId"), str((memberDetail.user as Record<string, unknown> | undefined)?.id)),
                infoCell(t("gv.memNick"), str(memberDetail.nick)),
                infoCell(t("gv.memRoles"), Array.isArray(memberDetail.roles) ? (memberDetail.roles as string[]).join(" / ") : ""),
                infoCell(t("gv.memJoined"), str(memberDetail.joined_at) ? formatTime(memberDetail.joined_at) : ""),
                infoCell(t("gv.memBot"), memberDetail.user && (memberDetail.user as Record<string, unknown>).bot === true ? t("gv.memBot") : "")))
          : null,
        h("div", { className: "qbot-gvPaneActions" },
          h("input", {
            className: "qbot-input qbot-gvSearch", type: "search", value: memberQuery,
            placeholder: t("gv.memSearch"), "aria-label": t("gv.memSearch"),
            onChange: (e: any) => setMemberQuery(e.target.value),
          }),
          h("span", { className: "qbot-gvCount" }, fmt("gv.memTotal", String(shown.length)))),
        h("div", { className: "qbot-gvList" },
          shown.length
            ? shown.map((m, i) => {
                const user = (m.user && typeof m.user === "object" ? m.user : {}) as Record<string, unknown>;
                const uid = str(user.id);
                return h("button", { key: `${uid}:${i}`, type: "button", className: "qbot-gvRow is-button",
                  onClick: () => void run(`mem:${uid}`, async () => {
                    setMemberDetail(await call("guild.member", { guildId: guild.id, userId: uid }) ?? m);
                  }),
                },
                  h("div", { className: "qbot-gvRowMain" },
                    h("strong", null, str(user.username) || str(m.nick) || uid),
                    h("small", null, `${uid}${Array.isArray(m.roles) && m.roles.length ? ` · ${(m.roles as string[]).join("/")}` : ""}`)),
                  h("span", { className: "qbot-gvRowMore" }, t("gv.memDetail")));
              })
            : h("div", { className: "qbot-gvEmpty" }, t("gv.memEmpty"))),
        memberAfter
          ? h("div", { className: "qbot-gvPaneActions" },
              btn("more", t("gv.memMore"), () => void run("more", async () => {
                const data = await call("guild.members", { guildId: guild.id, after: memberAfter, limit: 100 }) ?? {};
                const next = Array.isArray(data.members) ? (data.members as Array<Record<string, unknown>>) : [];
                setMembers((prev) => {
                  const seen = new Set(prev.map((m) => str((m.user as Record<string, unknown> | undefined)?.id)));
                  return [...prev, ...next.filter((m) => !seen.has(str((m.user as Record<string, unknown> | undefined)?.id)))];
                });
                setMemberAfter(str(data.next));
              })))
          : null,
        // 更多成员能力：在线数（按子频道）/ 身份组成员 / 删除成员
        h("div", { className: "qbot-gvForm" },
          h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.memMoreTitle"))),
          h("div", { className: "qbot-gvFormRow" },
            field(t("gv.memOnlineChannel"), h("select", {
              className: "qbot-settingSelect", value: channelId,
              onChange: (e: any) => setChannelId(e.target.value),
            }, h("option", { value: "" }, "—"),
              channels.map((c) => h("option", { key: c.id, value: c.id }, channelName(c))))),
            field(t("gv.memRoleId"), h("input", {
              className: "qbot-input qbot-mono", value: assignRole,
              placeholder: t("gv.memRoleIdPlaceholder"), "aria-label": t("gv.memRoleId"),
              onChange: (e: any) => setAssignRole(e.target.value),
            }))),
          h("div", { className: "qbot-gvFormActions" },
            btn("memOnline", t("gv.memOnline"), () => void run("memOnline", async () => {
              if (!channelId) { notifyError(t("gv.needChannel")); return; }
              setContentResult(await call("guild.channel.online", { channelId }));
            })),
            btn("memRoleList", t("gv.memRoleList"), () => void run("memRoleList", async () => {
              if (!assignRole.trim()) { notifyError(t("gv.memRoleId")); return; }
              setContentResult(await call("guild.role.members", { guildId: guild.id, roleId: assignRole.trim() }));
            })),
            btn("memKick", t("gv.memKick"), () => void run("memKick", async () => {
              if (!assignUser.trim()) { notifyError(t("gv.roleUserId")); return; }
              if (!(await confirmDlg({ message: fmt("gv.memKickConfirm", assignUser.trim()) }))) return;
              setContentResult(await call("guild.member.delete", { guildId: guild.id, userId: assignUser.trim() }, t("gv.memKicked")));
              setMembers((prev) => prev.filter((m) => str((m.user as Record<string, unknown> | undefined)?.id) !== assignUser.trim()));
            }))),
          h("div", { className: "qbot-gvResult" },
            contentResult === null ? null : h("pre", null, JSON.stringify(contentResult, null, 2))))));
  };

  /** 颜色：颜色选择器改 hex 时同步十进制 ARGB（保留 alpha=FF）。 */
  const onRoleColorPick = (hex: string) => {
    setRoleColorHex(hex);
    setRoleColor(String(hexToArgb(hex)));
  };
  const onRoleColorNumber = (v: string) => {
    setRoleColor(v);
    setRoleColorHex(argbToHex(v));
  };

  /** 保存身份组，内联与二级弹窗共用。 */
  const saveRole = () => void run("roleSave", async () => {
    if (!guild) return;
    const name = roleName.trim();
    if (!name) { notifyError(t("gv.roleName")); return; }
    const color = intOf(roleColor, 4294967295) || 4294967295;
    const body = { name, color, hoist: roleHoist ? 1 : 0 };
    if (roleEditId) {
      await call("guild.role.patch", { guildId: guild.id, roleId: roleEditId, body }, t("gv.roleUpdated"));
    } else {
      await call("guild.role.create", { guildId: guild.id, body }, t("gv.roleCreated"));
    }
    setRoleDialog(false); setRoleEditId(""); setRoleName("");
    setRoles(rolesFrom(await call("guild.roles", { guildId: guild.id })));
  });

  /** 打开身份组二级弹窗。 */
  const openRoleDialog = (r?: RoleItem) => {
    if (r) {
      setRoleEditId(str(r.id)); setRoleName(r.name ?? "");
      setRoleColor(String(r.color || 4294967295)); setRoleColorHex(argbToHex(r.color));
      setRoleHoist(r.hoist === 1);
    } else {
      setRoleEditId(""); setRoleName(""); setRoleColor("4294967295");
      setRoleColorHex("#ffffff"); setRoleHoist(false);
    }
    setRoleDialog(true);
  };

  const roleForm = () => h("div", { className: "qbot-gvForm" },
    h("div", { className: "qbot-gvFormHead" },
      h("strong", null, roleEditId ? t("gv.roleEdit") : t("gv.roleCreate"))),
    field(t("gv.roleName"), h("input", {
      className: "qbot-input", value: roleName, placeholder: t("gv.roleNamePlaceholder"),
      onChange: (e: any) => setRoleName(e.target.value),
    })),
    field(t("gv.roleColor"), h("div", { className: "qbot-gvColorRow" },
      h("input", {
        className: "qbot-gvColorPick", type: "color", value: roleColorHex,
        "aria-label": t("gv.roleColor"), onChange: (e: any) => onRoleColorPick(e.target.value),
      }),
      h("input", {
        className: "qbot-input qbot-gvColorNum", type: "number", value: roleColor,
        "aria-label": t("gv.roleColorArgb"), onChange: (e: any) => onRoleColorNumber(e.target.value),
      })), t("gv.roleColorHint")),
    h("label", { className: "qbot-gvCheck" },
      h("input", { type: "checkbox", checked: roleHoist, onChange: (e: any) => setRoleHoist(e.target.checked) }),
      h("span", null, t("gv.roleHoist"))),
    h("div", { className: "qbot-gvFormActions" },
      btn("roleSave", t("common.save"), saveRole, true),
      h("button", { className: "qbot-btn", type: "button", onClick: () => { setRoleDialog(false); setRoleEditId(""); setRoleName(""); } }, t("common.cancel"))));

  const rolesPane = () => h("div", { className: "qbot-gvPane" },
    paneHead(t("gv.tab.roles"), t("gv.roleDesc")),
    !guild ? needGuild : h(React.Fragment, null,
      h("div", { className: "qbot-gvList" },
        h("div", { className: "qbot-gvListHead" },
          h("strong", null, t("gv.roleList")),
          h("div", { className: "qbot-gvRowOps" },
            h("button", { className: "qbot-btn", type: "button", onClick: () => setAssignDialog(true) }, t("gv.roleAssign")),
            h("button", { className: "qbot-btn qbot-btnPrimary", type: "button", onClick: () => openRoleDialog() }, t("gv.roleCreate")),
            btn("roles", t("common.refresh"), () => void run("roles", async () => {
              setRoles(rolesFrom(await call("guild.roles", { guildId: guild.id })));
            })))),
        roles.length
          ? roles.map((r) => {
              const rid = str(r.id);
              const isDefault = DEFAULT_ROLE_IDS.has(rid);
              return h("div", { key: rid, className: "qbot-gvRow" },
                h("div", { className: "qbot-gvRowMain" },
                  h("strong", null, r.name || rid),
                  h("small", null, `${rid} · ${fmt("gv.roleCount", String(r.number))}${isDefault ? ` · ${t("gv.roleDefault")}` : ""}`)),
                isDefault ? null : h("div", { className: "qbot-gvRowOps" },
                  h("button", {
                    className: "qbot-btn", type: "button",
                    onClick: () => openRoleDialog(r),
                  }, t("common.edit")),
                  h("button", {
                    className: "qbot-btn qbot-btnDanger", type: "button",
                    disabled: busy === `roleDel:${rid}`,
                    onClick: () => void run(`roleDel:${rid}`, async () => {
                      if (!(await confirmDlg({ message: fmt("gv.delConfirm", r.name || rid) }))) return;
                      await call("guild.role.delete", { guildId: guild.id, roleId: rid }, t("gv.roleDeleted"));
                      setRoles((prev) => prev.filter((x) => str(x.id) !== rid));
                    }),
                  }, t("common.delete"))));
            })
          : h("div", { className: "qbot-gvEmpty" }, t("gv.infoEmpty")))));

  const assignRoleMember = async (add: boolean) => {
    if (!guild) return;
    await run(add ? "roleAdd" : "roleRemove", async () => {
      if (!assignUser.trim() || !assignRole.trim()) {
        notifyError(`${t("gv.roleUserId")} / ${t("gv.roleRoleId")}`);
        return;
      }
      await call("guild.role.member", {
        guildId: guild.id, userId: assignUser.trim(), roleId: assignRole.trim(),
        add, channelId: assignChannel.trim(),
      }, add ? t("gv.roleAssigned") : t("gv.roleUnassigned"));
      setAssignDialog(false);
    });
  };

  /** 「给成员分配身份组」二级弹窗内容（由身份组列表头部按钮触发）。 */
  const assignRoleForm = () => h("div", { className: "qbot-gvForm" },
    h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.roleAssign"))),
    field(t("gv.roleUserId"), idInput({
      value: assignUser, onChange: setAssignUser, placeholder: t("gv.userIdPlaceholder"),
      label: t("gv.roleUserId"), listId: "gv-assign-user-list",
      candidates: members.map((m) => {
        const u = (m.user && typeof m.user === "object" ? m.user : {}) as Record<string, unknown>;
        return { value: str(u.id), label: str(u.username) || str(m.nick) || str(u.id) };
      }).filter((c) => !!c.value),
    }), t("gv.idPasteHint")),
    field(t("gv.roleRoleId"), h("input", {
      className: "qbot-input", value: assignRole, placeholder: "身份组 ID",
      onChange: (e: any) => setAssignRole(e.target.value),
    })),
    field(t("gv.roleAssignChannel"), h("input", {
      className: "qbot-input", value: assignChannel, placeholder: "仅身份组 5 需要",
      onChange: (e: any) => setAssignChannel(e.target.value),
    })),
    h("div", { className: "qbot-gvFormActions" },
      btn("roleAdd", t("gv.roleAdd"), () => void assignRoleMember(true), true),
      btn("roleRemove", t("gv.roleRemove"), () => void assignRoleMember(false))));

  const messagePane = () => h("div", { className: "qbot-gvPane" },
    paneHead(t("gv.tab.message"), t("gv.msgDesc")),
    !guild ? needGuild : h(React.Fragment, null,
      h("div", { className: "qbot-gvForm" },
        field(t("gv.msgChannel"), h("select", {
          className: "qbot-settingSelect", value: messageChannel || channelId,
          onChange: (e: any) => { setMessageChannel(e.target.value); setMessageResult(null); },
        },
          h("option", { value: "" }, "—"),
          channels.map((c) => h("option", { key: c.id, value: c.id }, channelName(c))))),
        field(t("gv.msgContent"), h("textarea", {
          className: "qbot-ptTextarea", rows: 5, value: messageText,
          placeholder: t("gv.msgPlaceholder"), "aria-label": t("gv.msgContent"),
          onChange: (e: any) => setMessageText(e.target.value),
        })),
        h("div", { className: "qbot-gvFormActions" },
          btn("msgSend", t("gv.msgSend"), () => void run("msgSend", async () => {
            const cid = messageChannel || channelId;
            if (!cid) { notifyError(t("gv.needChannel")); return; }
            if (!messageText.trim()) { notifyError(t("gv.msgContent")); return; }
            const res = await call("guild.message.send", { channelId: cid, content: messageText }, t("gv.msgSent"));
            setMessageResult(res ?? {});
            setMessageText("");
          }), true))),
      messageResult !== null ? (() => {
        const msgId = str((messageResult as Record<string, unknown>)?.id);
        return h("div", { className: "qbot-gvForm qbot-gvReceipt" },
          h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.msgReceipt"))),
          msgId
            ? h("div", { className: "qbot-gvReceiptOk" },
                h("code", null, `${t("gv.msgId")}: ${msgId}`),
                h("span", null, t("gv.msgHasId")))
            : h("div", { className: "qbot-gvReceiptWarn" }, t("gv.msgNoId")),
          h("details", { className: "qbot-gvRawDetails" },
            h("summary", null, t("gv.msgRaw")),
            h("pre", null, JSON.stringify(messageResult, null, 2))));
      })() : null,
      h("div", { className: "qbot-gvForm qbot-gvTip" },
        h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.msgTipTitle"))),
        h("p", null, t("gv.msgTip")))));

  // ── 发言管理 ────────────────────────────────────────────────────────────
  const doMute = async (userId: string, minutes: number) => {
    if (!guild) return;
    await run("mute", async () => {
      if (!userId.trim()) { notifyError(t("gv.muteNeedUser")); return; }
      await call(userId === "*" ? "guild.mute.all" : "guild.mute.member",
        userId === "*" ? { guildId: guild.id, minutes } : { guildId: guild.id, userId: userId.trim(), minutes },
        minutes === 0 ? t("gv.muteUnmuted") : t("gv.muteDone"));
    });
  };
  const saveMsgSetting = async () => {
    if (!guild) return;
    await run("settingSave", async () => {
      let body: Record<string, unknown>;
      try { body = JSON.parse(msgSettingText); }
      catch { notifyError(t("gv.settingInvalidJson")); return; }
      await call("guild.setting.put", { guildId: guild.id, body }, t("gv.settingSaved"));
    });
  };
  const saveKeywordConfig = async () => {
    if (!guild) return;
    if (kwEnabled && !splitLines(kwWords).length) { notifyError(t("gv.kwNeedWords")); return; }
    await run("kwSave", async () => {
      const config = {
        enabled: kwEnabled,
        words: splitLines(kwWords),
        muteMinutes: intOf(kwMuteMinutes, 60),
        deleteContent: kwDeleteContent,
        deleteThreadOnReply: kwDeleteThreadOnReply,
        whitelist: splitLines(kwWhitelist),
        channelIds: splitLines(kwChannels),
      };
      await call("guild.keyword.config.save", { guildId: guild.id, config }, t("gv.kwSaved"));
    });
  };
  const reloadKeywordLogs = async () => {
    if (!guild) return;
    await run("kwLogs", async () => {
      const kl = await call("guild.keyword.logs", { guildId: guild.id, limit: 30 }) ?? {};
      setKwLogs(Array.isArray(kl.logs) ? kl.logs : []);
    });
  };
  const keywordPane = () => h("div", { className: "qbot-gvStack" },
    h("div", { className: "qbot-gvSubTabs" },
      h("button", {
        type: "button", role: "tab", "aria-selected": kwTab === "config",
        className: `qbot-gvSubTab${kwTab === "config" ? " is-on" : ""}`,
        onClick: () => setKwTab("config"),
      }, t("gv.kwSubConfig")),
      h("button", {
        type: "button", role: "tab", "aria-selected": kwTab === "logs",
        className: `qbot-gvSubTab${kwTab === "logs" ? " is-on" : ""}`,
        onClick: () => { setKwTab("logs"); void reloadKeywordLogs(); },
      }, t("gv.kwSubLogs"))),
    kwTab === "config" ? h("div", { className: "qbot-gvStack" },
      h("div", { className: "qbot-gvForm" },
        h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.kwTitle"))),
        h("label", { className: "qbot-gvCheck" },
          h("input", { type: "checkbox", checked: kwEnabled, onChange: (e: any) => setKwEnabled(e.target.checked) }),
          t("gv.kwEnable")),
        h("small", { className: "qbot-gvFieldHint" }, t("gv.kwEnableHint"))),
      h("div", { className: "qbot-gvForm" },
        h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.kwWordsTitle"))),
        h("textarea", {
          className: "qbot-ptTextarea", rows: 6, value: kwWords, placeholder: t("gv.kwWordsPlaceholder"),
          "aria-label": t("gv.kwWordsTitle"), onChange: (e: any) => setKwWords(e.target.value),
        }),
        h("small", { className: "qbot-gvFieldHint" }, t("gv.kwWordsHint"))),
      h("div", { className: "qbot-gvForm" },
        h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.kwActionTitle"))),
        field(t("gv.kwMuteMinutes"), h("input", {
          className: "qbot-input qbot-gvInputShort", type: "number", min: "0", max: "43200",
          value: kwMuteMinutes, onChange: (e: any) => setKwMuteMinutes(e.target.value),
        }), t("gv.kwMuteMinutesHint")),
        h("label", { className: "qbot-gvCheck" },
          h("input", { type: "checkbox", checked: kwDeleteContent, onChange: (e: any) => setKwDeleteContent(e.target.checked) }),
          t("gv.kwDeleteContent")),
        h("label", { className: "qbot-gvCheck" },
          h("input", { type: "checkbox", checked: kwDeleteThreadOnReply, onChange: (e: any) => setKwDeleteThreadOnReply(e.target.checked) }),
          t("gv.kwDeleteThreadOnReply")),
        h("small", { className: "qbot-gvFieldHint" }, t("gv.kwActionHint"))),
      h("div", { className: "qbot-gvForm" },
        h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.kwScopeTitle"))),
        field(t("gv.kwWhitelist"), h("textarea", {
          className: "qbot-ptTextarea", rows: 3, value: kwWhitelist, placeholder: t("gv.kwWhitelistPlaceholder"),
          "aria-label": t("gv.kwWhitelist"), onChange: (e: any) => setKwWhitelist(e.target.value),
        }), t("gv.kwWhitelistHint")),
        field(t("gv.kwChannels"), h("textarea", {
          className: "qbot-ptTextarea", rows: 3, value: kwChannels, placeholder: t("gv.kwChannelsPlaceholder"),
          "aria-label": t("gv.kwChannels"), onChange: (e: any) => setKwChannels(e.target.value),
        }), t("gv.kwChannelsHint"))),
      h("div", { className: "qbot-gvFormActions" },
        btn("kwSave", t("gv.kwSave"), () => void saveKeywordConfig(), true)))
      : null,
    kwTab === "logs" ? h("div", { className: "qbot-gvForm" },
      h("div", { className: "qbot-gvFormHead" },
        h("strong", null, t("gv.kwLogsTitle")),
        btn("kwLogs", t("gv.kwLogsRefresh"), () => void reloadKeywordLogs())),
      kwLogs.length
        ? h("div", { className: "qbot-gvAiLogs" }, kwLogs.map((l, i) =>
            h("div", { key: i, className: "qbot-gvAiLog" },
              h("div", { className: "qbot-gvAiLogHead" },
                h("span", { className: "qbot-gvAiLevel is-severe" }, str(l.source)),
                h("span", null, `${str(l.senderName || str(l.sender).slice(0, 8))} · ${formatTime(str(l.at))}`)),
              h("div", { className: "qbot-gvAiLogBody" }, str(l.content)),
              h("div", { className: "qbot-gvAiLogMeta" },
                `${t("gv.kwMatched")}: ${(Array.isArray(l.matched) ? l.matched : []).join(",") || "—"}`
                + ` · ${t("gv.kwMuteMinutes")} ${num(l.muteMinutes)}`
                + ` [${(Array.isArray(l.actions) ? l.actions : []).join(",") || "—"}]`
                + (Array.isArray(l.errors) && l.errors.length ? ` · ${l.errors.join("; ")}` : "")))))
        : h("div", { className: "qbot-gvEmpty" }, t("gv.kwLogsEmpty"))) : null);

  const speakPane = () => h("div", { className: "qbot-gvPane" },
    paneHead(t("gv.tab.speak"), t("gv.speakDesc")),
    !guild ? needGuild : h("div", { className: "qbot-gvStack" },
      h("div", { className: "qbot-gvSubTabs", role: "tablist" },
        ([
          { key: "all", label: t("gv.st.all") },
          { key: "member", label: t("gv.st.member") },
          { key: "frequency", label: t("gv.st.frequency") },
          { key: "keyword", label: t("gv.st.keyword") },
        ] as Array<{ key: SpeakTab; label: string }>).map((x) => h("button", {
          key: x.key, type: "button", role: "tab", "aria-selected": speakTab === x.key,
          className: `qbot-gvSubTab${speakTab === x.key ? " is-on" : ""}`,
          onClick: () => setSpeakTab(x.key),
        }, x.label))),
      speakTab === "all" ? h("div", { className: "qbot-gvForm" },
        h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.muteAllTitle"))),
        field(t("gv.muteMinutes"), h("input", {
          className: "qbot-input qbot-gvInputShort", type: "number", min: "0", max: "43200", value: muteMinutes,
          onChange: (e: any) => setMuteMinutes(e.target.value),
        }), t("gv.muteMinutesHint")),
        h("div", { className: "qbot-gvFormActions" },
          btn("muteAll", t("gv.muteAll"), () => void doMute("*", intOf(muteMinutes, 10))),
          btn("unmuteAll", t("gv.unmuteAll"), () => void doMute("*", 0)))) : null,
      speakTab === "member" ? h("div", { className: "qbot-gvForm" },
        h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.muteOneTitle"))),
        field(t("gv.muteUserId"), idInput({
          value: muteUserId, onChange: setMuteUserId, placeholder: t("gv.muteUserPlaceholder"),
          label: t("gv.muteUserId"), listId: "gv-mute-user-list",
          candidates: members.map((m) => {
            const u = (m.user && typeof m.user === "object" ? m.user : {}) as Record<string, unknown>;
            return { value: str(u.id), label: str(u.username) || str(m.nick) || str(u.id) };
          }).filter((c) => !!c.value),
        }), t("gv.idPasteHint")),
        h("div", { className: "qbot-gvFormActions" },
          btn("muteOne", t("gv.muteOne"), () => void doMute(muteUserId, intOf(muteMinutes, 10))),
          btn("unmuteOne", t("gv.unmuteOne"), () => void doMute(muteUserId, 0)))) : null,
      speakTab === "frequency" ? h("div", { className: "qbot-gvForm" },
        h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.settingTitle"))),
        h("small", { className: "qbot-gvFieldHint" }, t("gv.settingHint")),
        h("textarea", {
          className: "qbot-ptTextarea", rows: 8, value: msgSettingText, spellCheck: false,
          "aria-label": t("gv.settingTitle"),
          onChange: (e: any) => setMsgSettingText(e.target.value),
        }),
        h("div", { className: "qbot-gvFormActions" },
          btn("settingSave", t("gv.settingSave"), () => void saveMsgSetting(), true))) : null,
      speakTab === "keyword" ? h("div", { className: "qbot-gvForm qbot-gvKwCard" },
        h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.kwSectionTitle"))),
        h("small", { className: "qbot-gvFieldHint" }, t("gv.kwSectionDesc")),
        keywordPane()) : null));

  // ── 内容管理（撤回 / 公告 / 精华 / 日程 / 音频 / 帖子） ──────────────────
  const CONTENT_TABS: Array<{ key: ContentTab; label: string }> = [
    { key: "recall", label: t("gv.ct.recall") },
    { key: "announce", label: t("gv.ct.announce") },
    { key: "pin", label: t("gv.ct.pin") },
    { key: "schedule", label: t("gv.ct.schedule") },
    { key: "audio", label: t("gv.ct.audio") },
    { key: "forum", label: t("gv.ct.forum") },
  ];
  const subTabs = h("div", { className: "qbot-gvSubTabs", role: "tablist" },
    CONTENT_TABS.map((x) => h("button", {
      key: x.key, type: "button", role: "tab", "aria-selected": contentTab === x.key,
      className: `qbot-gvSubTab${contentTab === x.key ? " is-on" : ""}`,
      onClick: () => { setContentTab(x.key); setContentResult(null); },
    }, x.label)));

  const jsonBox = h("div", { className: "qbot-gvResult" },
    contentResult === null ? null : h("pre", null, JSON.stringify(contentResult, null, 2)));

  const recallForm = () => h("div", { className: "qbot-gvForm" },
    field(t("gv.msgChannel"), h("select", {
      className: "qbot-settingSelect", value: recallChannel || channelId,
      onChange: (e: any) => setRecallChannel(e.target.value),
    },
      h("option", { value: "" }, "—"),
      channels.map((c) => h("option", { key: c.id, value: c.id }, channelName(c))))),
    field(t("gv.recallMessageId"), idInput({
      value: recallMessageId, onChange: setRecallMessageId, placeholder: t("gv.recallMessagePlaceholder"),
      label: t("gv.recallMessageId"), listId: "gv-recall-msg-list",
      candidates: [],
    }), t("gv.recallMessageHint")),
    h("label", { className: "qbot-gvCheck" },
      h("input", { type: "checkbox", checked: recallHideTip, onChange: (e: any) => setRecallHideTip(e.target.checked) }),
      t("gv.recallHideTip")),
    h("div", { className: "qbot-gvFormActions" },
      btn("recall", t("gv.recallDo"), () => void run("recall", async () => {
        const cid = recallChannel || channelId;
        if (!cid) { notifyError(t("gv.needChannel")); return; }
        if (!recallMessageId.trim()) { notifyError(t("gv.recallMessageId")); return; }
        await call("guild.message.delete", {
          channelId: cid, messageId: recallMessageId.trim(), hideTip: recallHideTip,
        }, t("gv.recallDone"));
      }), true)));

  const announceForm = () => h("div", { className: "qbot-gvStack" },
    h("div", { className: "qbot-gvForm qbot-gvTip" },
      h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.annHintTitle"))),
      h("p", null, t("gv.annHint"))),
    h("div", { className: "qbot-gvForm" },
      field(t("gv.announceChannel"), h("select", {
        className: "qbot-settingSelect", value: announceChannel || channelId,
        onChange: (e: any) => setAnnounceChannel(e.target.value),
      }, h("option", { value: "" }, "—"),
        channels.map((c) => h("option", { key: c.id, value: c.id }, channelName(c))))),
      field(t("gv.recallMessageId"), h("input", {
        className: "qbot-input", value: announceMsgId, placeholder: t("gv.idPasteHint"),
        "aria-label": t("gv.recallMessageId"), onChange: (e: any) => setAnnounceMsgId(e.target.value),
      })),
      field(t("gv.announceType"), h("select", {
        className: "qbot-settingSelect", value: announceType,
        onChange: (e: any) => setAnnounceType(e.target.value),
      }, h("option", { value: "1" }, t("gv.announceTypeWelcome")),
        h("option", { value: "0" }, t("gv.announceTypeMember")))),
      h("div", { className: "qbot-gvFormActions" },
        btn("annCreate", t("gv.annCreate"), () => void run("annCreate", async () => {
          if (!announceMsgId.trim()) { notifyError(t("gv.recallMessageId")); return; }
          setContentResult(await call("guild.announce.create", {
            guildId: guild!.id,
            body: { message_id: announceMsgId.trim(), channel_id: announceChannel || channelId, announces_type: intOf(announceType, 1) },
          }, t("gv.annCreated")));
        }), true),
        btn("annDel", t("gv.annDelete"), () => void run("annDel", async () => {
          if (!announceMsgId.trim()) { notifyError(t("gv.recallMessageId")); return; }
          setContentResult(await call("guild.announce.delete", { guildId: guild!.id, messageId: announceMsgId.trim() }, t("gv.annDeleted")));
        })))),
    jsonBox);

  const pinCandidates = pinMessages.map((m) => ({
    value: m.id,
    label: `${String(m.content || "").replace(/\s+/g, " ").slice(0, 28) || "—"} · ${m.author || "—"} · ${m.id.slice(-8)}`,
  }));
  const pinForm = () => h("div", { className: "qbot-gvStack" },
    h("div", { className: "qbot-gvForm qbot-gvTip" }, h("p", null, t("gv.pinTip"))),
    h("div", { className: "qbot-gvForm" },
      field(t("gv.msgChannel"), h("select", {
        className: "qbot-settingSelect", value: channelId,
        onChange: (e: any) => {
          setChannelId(e.target.value);
          setPinMessages([]); setPinMessagesLoaded(false); setPinMsgId("");
        },
      }, h("option", { value: "" }, "—"),
        channels.map((c) => h("option", { key: c.id, value: c.id }, channelName(c))))),
      field(t("gv.pinMessageId"), idInput({
        value: pinMsgId, onChange: setPinMsgId, placeholder: t("gv.pinMsgPlaceholder"),
        label: t("gv.pinMessageId"), listId: "gv-pin-msg-list", candidates: pinCandidates,
      }), t("gv.pinHint")),
      h("div", { className: "qbot-gvFormActions" },
        btn("pinLoad", t("gv.pinLoad"), () => void run("pinLoad", async () => {
          if (!channelId) { notifyError(t("gv.needChannel")); return; }
          const list = await call("guild.message.list", { channelId, limit: 50 });
          const rows = (Array.isArray(list) ? list : []).filter((m: any) => m && typeof m === "object" && m.id);
          setPinMessages(rows);
          setPinMessagesLoaded(true);
        })),
        btn("pinList", t("gv.pinList"), () => void run("pinList", async () => {
          if (!channelId) { notifyError(t("gv.needChannel")); return; }
          setContentResult(await call("guild.pin.list", { channelId }));
        })),
        btn("pinAdd", t("gv.pinAdd"), () => void run("pinAdd", async () => {
          if (!channelId || !pinMsgId.trim()) { notifyError(t("gv.pinMessageId")); return; }
          if (pinMsgId.trim() === channelId) { notifyError(t("gv.errBadMsgId")); return; }
          setContentResult(await call("guild.pin.add", { channelId, messageId: pinMsgId.trim() }, t("gv.pinAdded")));
        }), true),
        btn("pinDel", t("gv.pinDelete"), () => void run("pinDel", async () => {
          if (!channelId || !pinMsgId.trim()) { notifyError(t("gv.pinMessageId")); return; }
          if (pinMsgId.trim() === channelId) { notifyError(t("gv.errBadMsgId")); return; }
          setContentResult(await call("guild.pin.delete", { channelId, messageId: pinMsgId.trim() }, t("gv.pinDeleted")));
        }))),
        // 查询结果内联展示，不弹吸顶提示。
        pinMessagesLoaded
          ? h("div", { className: "qbot-gvFieldHint" },
              pinMessages.length ? fmt("gv.pinLoaded", pinMessages.length) : t("gv.pinLoadEmpty"))
          : null),
    jsonBox);

  const scheduleForm = () => h("div", { className: "qbot-gvStack" },
    h("div", { className: "qbot-gvForm" },
      field(t("gv.msgChannel"), h("select", {
        className: "qbot-settingSelect", value: channelId,
        onChange: (e: any) => setChannelId(e.target.value),
      }, h("option", { value: "" }, "—"),
        channels.map((c) => h("option", { key: c.id, value: c.id }, channelName(c))))),
      field(t("gv.scheduleId"), h("input", {
        className: "qbot-input qbot-mono", value: scheduleId, placeholder: t("gv.scheduleIdPlaceholder"),
        "aria-label": t("gv.scheduleId"), onChange: (e: any) => setScheduleId(e.target.value),
      })),
      field(t("gv.scheduleBody"), h("textarea", {
        className: "qbot-ptTextarea qbot-mono", rows: 8, value: scheduleBody,
        "aria-label": t("gv.scheduleBody"), onChange: (e: any) => setScheduleBody(e.target.value),
      }), t("gv.scheduleHint")),
      h("div", { className: "qbot-gvFormActions" },
        btn("schReset", t("gv.schReset"), () => { setScheduleBody(defaultScheduleBody()); notifySuccess(t("gv.schResetDone")); }),
        btn("schList", t("gv.schList"), () => void run("schList", async () => {
          if (!channelId) { notifyError(t("gv.needChannel")); return; }
          setContentResult(await call("guild.schedule.list", { channelId }));
        })),
        btn("schGet", t("gv.schGet"), () => void run("schGet", async () => {
          if (!channelId || !scheduleId.trim()) { notifyError(t("gv.scheduleId")); return; }
          setContentResult(await call("guild.schedule.get", { channelId, scheduleId: scheduleId.trim() }));
        })),
        btn("schCreate", t("gv.schCreate"), () => void run("schCreate", async () => {
          if (!channelId) { notifyError(t("gv.needChannel")); return; }
          let body: Record<string, unknown>;
          try { body = JSON.parse(scheduleBody); } catch { notifyError(t("gv.invalidJson")); return; }
          const err = checkScheduleBody(body);
          if (err) { notifyError(t(err)); return; }
          setContentResult(await call("guild.schedule.create", { channelId, body }, t("gv.schCreated")));
        }), true),
        btn("schPatch", t("gv.schPatch"), () => void run("schPatch", async () => {
          if (!channelId || !scheduleId.trim()) { notifyError(t("gv.scheduleId")); return; }
          let body: Record<string, unknown>;
          try { body = JSON.parse(scheduleBody); } catch { notifyError(t("gv.invalidJson")); return; }
          const err = checkScheduleBody(body);
          if (err) { notifyError(t(err)); return; }
          setContentResult(await call("guild.schedule.patch", { channelId, scheduleId: scheduleId.trim(), body }, t("gv.schPatched")));
        })),
        btn("schDel", t("gv.schDelete"), () => void run("schDel", async () => {
          if (!channelId || !scheduleId.trim()) { notifyError(t("gv.scheduleId")); return; }
          setContentResult(await call("guild.schedule.delete", { channelId, scheduleId: scheduleId.trim() }, t("gv.schDeleted")));
        })))),
    jsonBox);

  const audioForm = () => h("div", { className: "qbot-gvStack" },
    h("div", { className: "qbot-gvForm" },
      field(t("gv.msgChannel"), h("select", {
        className: "qbot-settingSelect", value: channelId,
        onChange: (e: any) => setChannelId(e.target.value),
      }, h("option", { value: "" }, "—"),
        channels.filter((c) => c.type === 2 || c.type === 10005).map((c) => h("option", { key: c.id, value: c.id }, channelName(c))))),
      field(t("gv.audioBody"), h("textarea", {
        className: "qbot-ptTextarea", rows: 6, value: audioBody,
        "aria-label": t("gv.audioBody"), onChange: (e: any) => setAudioBody(e.target.value),
      }), t("gv.audioHint")),
      h("div", { className: "qbot-gvFormActions" },
        btn("audioDo", t("gv.audioDo"), () => void run("audioDo", async () => {
          if (!channelId) { notifyError(t("gv.needChannel")); return; }
          let body: Record<string, unknown>;
          try { body = JSON.parse(audioBody); } catch { notifyError(t("gv.invalidJson")); return; }
          setContentResult(await call("guild.audio", { channelId, body }, t("gv.audioDone")));
        }), true))),
    jsonBox);

  const forumForm = () => h("div", { className: "qbot-gvStack" },
    h("div", { className: "qbot-gvForm qbot-gvTip" }, h("p", null, t("gv.forumTip"))),
    h("div", { className: "qbot-gvForm" },
      field(t("gv.msgChannel"), h("select", {
        className: "qbot-settingSelect", value: channelId,
        onChange: (e: any) => setChannelId(e.target.value),
      }, h("option", { value: "" }, "—"),
        channels.filter((c) => c.type === 10007).map((c) => h("option", { key: c.id, value: c.id }, channelName(c))))),
      field(t("gv.forumThreadId"), h("input", {
        className: "qbot-input qbot-mono", value: forumThreadId, placeholder: t("gv.forumThreadIdPlaceholder"),
        "aria-label": t("gv.forumThreadId"), onChange: (e: any) => setForumThreadId(e.target.value),
      })),
      field(t("gv.forumBody"), h("textarea", {
        className: "qbot-ptTextarea", rows: 6, value: forumBody,
        "aria-label": t("gv.forumBody"), onChange: (e: any) => setForumBody(e.target.value),
      })),
      h("div", { className: "qbot-gvFormActions" },
        btn("forumList", t("gv.forumList"), () => void run("forumList", async () => {
          if (!channelId) { notifyError(t("gv.needChannel")); return; }
          setContentResult(await call("guild.forum.threads", { channelId }));
        })),
        btn("forumGet", t("gv.forumGet"), () => void run("forumGet", async () => {
          if (!channelId || !forumThreadId.trim()) { notifyError(t("gv.forumThreadId")); return; }
          setContentResult(await call("guild.forum.thread.get", { channelId, threadId: forumThreadId.trim() }));
        })),
        btn("forumCreate", t("gv.forumCreate"), () => void run("forumCreate", async () => {
          if (!channelId) { notifyError(t("gv.needChannel")); return; }
          let body: Record<string, unknown>;
          try { body = JSON.parse(forumBody); } catch { notifyError(t("gv.invalidJson")); return; }
          setContentResult(await call("guild.forum.thread.create", { channelId, body }, t("gv.forumCreated")));
        }), true),
        btn("forumDel", t("gv.forumDelete"), () => void run("forumDel", async () => {
          if (!channelId || !forumThreadId.trim()) { notifyError(t("gv.forumThreadId")); return; }
          setContentResult(await call("guild.forum.thread.delete", { channelId, threadId: forumThreadId.trim() }, t("gv.forumDeleted")));
        })))),
    jsonBox);

  const contentPane = () => h("div", { className: "qbot-gvPane" },
    paneHead(t("gv.tab.content"), t("gv.contentDesc")),
    !guild ? needGuild : h(React.Fragment, null,
      subTabs,
      contentTab === "recall" ? recallForm() : null,
      contentTab === "announce" ? announceForm() : null,
      contentTab === "pin" ? pinForm() : null,
      contentTab === "schedule" ? scheduleForm() : null,
      contentTab === "audio" ? audioForm() : null,
      contentTab === "forum" ? forumForm() : null));

  // ── AI 接管 ────────────────────────────────────────────────────────────
  const lines = (v: string) => v.split("\n").map((s) => s.trim()).filter(Boolean);
  const saveAiConfig = async () => {
    if (!guild) return;
    await run("aiSave", async () => {
      const config = {
        enabled: aiEnabled,
        actions: { mute: aiMute, recall: aiRecall, warn: aiWarn },
        durations: { light: intOf(aiDurLight, 10), medium: intOf(aiDurMedium, 1440), severe: intOf(aiDurSevere, 43200) },
        rules: lines(aiRules),
        whitelist: lines(aiWhitelist),
        channelIds: lines(aiChannels),
      };
      await call("guild.mod.config.save", { guildId: guild.id, config }, t("gv.aiSaved"));
    });
  };
  const saveReplyConfig = async () => {
    if (!guild) return;
    await run("replySave", async () => {
      const config = {
        enabled: replyEnabled,
        onPost: replyOnPost,
        onMention: replyOnMention,
        once: replyOnce,
        prompt: replyPrompt,
        whitelist: lines(replyWhitelist),
        channelIds: lines(replyChannels),
      };
      await call("guild.reply.config.save", { guildId: guild.id, config }, t("gv.replySaved"));
      // intents 变更会触发对应机器人重连，确保订阅位立即生效。
      await call("config.save", { guildMessageEvents: replyGuildMessages, forumEvents: replyForumEvents });
    });
  };
  const aiPane = () => h("div", { className: "qbot-gvPane" },
    paneHead(t("gv.tab.ai"), t("gv.aiDesc")),
    !guild ? needGuild : h(React.Fragment, null,
      h("div", { className: "qbot-gvSubTabs", role: "tablist" },
        h("button", {
          type: "button", role: "tab", "aria-selected": aiTab === "config",
          className: `qbot-gvSubTab${aiTab === "config" ? " is-on" : ""}`,
          onClick: () => setAiTab("config"),
        }, t("gv.aiSubConfig")),
        h("button", {
          type: "button", role: "tab", "aria-selected": aiTab === "logs",
          className: `qbot-gvSubTab${aiTab === "logs" ? " is-on" : ""}`,
          onClick: () => setAiTab("logs"),
        }, t("gv.aiSubLogs")),
        h("button", {
          type: "button", role: "tab", "aria-selected": aiTab === "reply",
          className: `qbot-gvSubTab${aiTab === "reply" ? " is-on" : ""}`,
          onClick: () => setAiTab("reply"),
        }, t("gv.aiSubReply")),
        h("button", {
          type: "button", role: "tab", "aria-selected": aiTab === "replyLogs",
          className: `qbot-gvSubTab${aiTab === "replyLogs" ? " is-on" : ""}`,
          onClick: () => setAiTab("replyLogs"),
        }, t("gv.replyLogsTitle"))),
      aiTab === "config" ? h("div", { className: "qbot-gvStack" },
      h("div", { className: "qbot-gvForm" },
        h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.aiEnableTitle"))),
        h("label", { className: "qbot-gvCheck" },
          h("input", { type: "checkbox", checked: aiEnabled, onChange: (e: any) => setAiEnabled(e.target.checked) }),
          t("gv.aiEnable")),
        h("small", { className: "qbot-gvFieldHint" }, t("gv.aiEnableHint"))),
      h("div", { className: "qbot-gvForm" },
        h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.aiActionTitle"))),
        h("label", { className: "qbot-gvCheck" },
          h("input", { type: "checkbox", checked: aiMute, onChange: (e: any) => setAiMute(e.target.checked) }), t("gv.aiActMute")),
        h("label", { className: "qbot-gvCheck" },
          h("input", { type: "checkbox", checked: aiRecall, onChange: (e: any) => setAiRecall(e.target.checked) }), t("gv.aiActRecall")),
        h("label", { className: "qbot-gvCheck" },
          h("input", { type: "checkbox", checked: aiWarn, onChange: (e: any) => setAiWarn(e.target.checked) }), t("gv.aiActWarn")),
        h("small", { className: "qbot-gvFieldHint" }, t("gv.aiActionHint"))),
      h("div", { className: "qbot-gvForm" },
        h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.aiDurationTitle"))),
        h("div", { className: "qbot-gvFormRow" },
          field(t("gv.aiDurLight"), h("input", { className: "qbot-input", type: "number", min: "1", max: "43200", value: aiDurLight, onChange: (e: any) => setAiDurLight(e.target.value) })),
          field(t("gv.aiDurMedium"), h("input", { className: "qbot-input", type: "number", min: "1", max: "43200", value: aiDurMedium, onChange: (e: any) => setAiDurMedium(e.target.value) })),
          field(t("gv.aiDurSevere"), h("input", { className: "qbot-input", type: "number", min: "1", max: "43200", value: aiDurSevere, onChange: (e: any) => setAiDurSevere(e.target.value) }))),
        h("small", { className: "qbot-gvFieldHint" }, t("gv.aiDurationHint"))),
      h("div", { className: "qbot-gvForm" },
        h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.aiRulesTitle"))),
        h("textarea", {
          className: "qbot-ptTextarea", rows: 5, value: aiRules, placeholder: t("gv.aiRulesPlaceholder"),
          "aria-label": t("gv.aiRulesTitle"), onChange: (e: any) => setAiRules(e.target.value),
        }),
        h("small", { className: "qbot-gvFieldHint" }, t("gv.aiRulesHint"))),
      h("div", { className: "qbot-gvForm" },
        h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.aiScopeTitle"))),
        field(t("gv.aiWhitelist"), h("textarea", {
          className: "qbot-ptTextarea", rows: 3, value: aiWhitelist, placeholder: t("gv.aiWhitelistPlaceholder"),
          "aria-label": t("gv.aiWhitelist"), onChange: (e: any) => setAiWhitelist(e.target.value),
        }), t("gv.aiWhitelistHint")),
        field(t("gv.aiChannels"), h("textarea", {
          className: "qbot-ptTextarea", rows: 3, value: aiChannels, placeholder: t("gv.aiChannelsPlaceholder"),
          "aria-label": t("gv.aiChannels"), onChange: (e: any) => setAiChannels(e.target.value),
        }), t("gv.aiChannelsHint"))),
      h("div", { className: "qbot-gvFormActions" },
        btn("aiSave", t("gv.aiSave"), () => void saveAiConfig(), true)))
      : null,
      aiTab === "logs" ? h("div", { className: "qbot-gvForm" },
        h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.aiLogsTitle"))),
        aiLogs.length
          ? h("div", { className: "qbot-gvAiLogs" }, aiLogs.map((l, i) =>
              h("div", { key: i, className: "qbot-gvAiLog" },
                h("div", { className: "qbot-gvAiLogHead" },
                  h("span", { className: `qbot-gvAiLevel is-${str(l.level)}` }, str(l.level)),
                  h("span", null, `${str(l.senderName || str(l.sender).slice(0, 8))} · ${formatTime(str(l.at))}`)),
                h("div", { className: "qbot-gvAiLogBody" }, str(l.content)),
                h("div", { className: "qbot-gvAiLogMeta" },
                  `${str(l.category)} · ${t("gv.aiLogMinutes")} ${num(l.minutes)} · ${t("gv.aiLogStrike")} ${num(l.strikeCount)}`,
                  ` [${(Array.isArray(l.actions) ? l.actions : []).join(",") || "—"}]`,
                  l.reason ? ` · ${str(l.reason)}` : ""))))
          : h("div", { className: "qbot-gvEmpty" }, t("gv.aiLogsEmpty"))) : null,
      aiTab === "reply" ? h("div", { className: "qbot-gvStack" },
        h("div", { className: "qbot-gvForm" },
          h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.replyEnableTitle"))),
          h("label", { className: "qbot-gvCheck" },
            h("input", { type: "checkbox", checked: replyEnabled, onChange: (e: any) => setReplyEnabled(e.target.checked) }),
            t("gv.replyEnable")),
          h("small", { className: "qbot-gvFieldHint" }, t("gv.replyEnableHint"))),
        h("div", { className: "qbot-gvForm" },
          h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.replyTriggers"))),
          h("label", { className: "qbot-gvCheck" },
            h("input", { type: "checkbox", checked: replyOnPost, onChange: (e: any) => setReplyOnPost(e.target.checked) }), t("gv.replyOnPost")),
          h("label", { className: "qbot-gvCheck" },
            h("input", { type: "checkbox", checked: replyOnMention, onChange: (e: any) => setReplyOnMention(e.target.checked) }), t("gv.replyOnMention")),
          h("label", { className: "qbot-gvCheck" },
            h("input", { type: "checkbox", checked: replyOnce, onChange: (e: any) => setReplyOnce(e.target.checked) }), t("gv.replyOnce")),
          h("small", { className: "qbot-gvFieldHint" }, t("gv.replyTriggerHint"))),
        h("div", { className: "qbot-gvForm" },
          h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.replyPrompt"))),
          h("textarea", {
            className: "qbot-ptTextarea", rows: 4, value: replyPrompt, placeholder: t("gv.replyPromptPlaceholder"),
            "aria-label": t("gv.replyPrompt"), onChange: (e: any) => setReplyPrompt(e.target.value),
          }),
          h("small", { className: "qbot-gvFieldHint" }, t("gv.replyPromptHint"))),
        h("div", { className: "qbot-gvForm" },
          h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.replyScopeTitle"))),
          field(t("gv.replyWhitelist"), h("textarea", {
            className: "qbot-ptTextarea", rows: 3, value: replyWhitelist, placeholder: t("gv.replyWhitelistPlaceholder"),
            "aria-label": t("gv.replyWhitelist"), onChange: (e: any) => setReplyWhitelist(e.target.value),
          })),
          field(t("gv.replyChannels"), h("textarea", {
            className: "qbot-ptTextarea", rows: 3, value: replyChannels, placeholder: t("gv.replyChannelsPlaceholder"),
            "aria-label": t("gv.replyChannels"), onChange: (e: any) => setReplyChannels(e.target.value),
          })),
          h("small", { className: "qbot-gvFieldHint" }, t("gv.replyScopeHint"))),
        h("div", { className: "qbot-gvForm" },
          h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.replyIntents"))),
          h("label", { className: "qbot-gvCheck" },
            h("input", { type: "checkbox", checked: replyGuildMessages, onChange: (e: any) => setReplyGuildMessages(e.target.checked) }), t("gv.replyGuildMessages")),
          h("label", { className: "qbot-gvCheck" },
            h("input", { type: "checkbox", checked: replyForumEvents, onChange: (e: any) => setReplyForumEvents(e.target.checked) }), t("gv.replyForumEvents")),
          h("small", { className: "qbot-gvFieldHint" }, t("gv.replyIntentsHint")),
          h("a", {
            className: "qbot-gvSetupLink",
            href: "https://q.qq.com/qqbot/",
            target: "_blank", rel: "noreferrer noopener",
          }, t("gv.replyIntentsLink"))),
        h("div", { className: "qbot-gvFormActions" },
          btn("replySave", t("gv.replySave"), () => void saveReplyConfig(), true)))
      : null,
      aiTab === "replyLogs" ? h("div", { className: "qbot-gvForm" },
        h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.replyLogsTitle"))),
        replyLogs.length
          ? h("div", { className: "qbot-gvAiLogs" }, replyLogs.map((l, i) =>
              h("div", { key: i, className: "qbot-gvAiLog" },
                h("div", { className: "qbot-gvAiLogHead" },
                  h("span", { className: `qbot-gvAiLevel is-${l.ok ? "light" : "severe"}` },
                    l.ok ? t("gv.replyLogOk") : t("gv.replyLogFail")),
                  h("span", null, `${str(l.senderName || str(l.sender).slice(0, 8))} · ${formatTime(str(l.at))}`)),
                h("div", { className: "qbot-gvAiLogBody" }, str(l.reply || l.content)),
                h("div", { className: "qbot-gvAiLogMeta" },
                  `${str(l.trigger === "mention" ? t("gv.replyOnMention") : t("gv.replyOnPost"))} · ${str(l.source)}`,
                  l.error ? ` · ${str(l.error)}` : ""))))
          : h("div", { className: "qbot-gvEmpty" }, t("gv.replyLogsEmpty"))) : null));

  const EVENTS: Array<{ key: string; label: string; fields: string[] }> = [
    { key: "guild_create", label: t("gv.evtGuildCreate"), fields: ["id", "name", "owner_id", "member_count", "joined_at"] },
    { key: "guild_update", label: t("gv.evtGuildUpdate"), fields: ["id", "name", "owner_id", "member_count"] },
    { key: "guild_delete", label: t("gv.evtGuildDelete"), fields: ["id", "op_user_id"] },
    { key: "channel_create", label: t("gv.evtChannelCreate"), fields: ["id", "guild_id", "name", "type"] },
    { key: "channel_update", label: t("gv.evtChannelUpdate"), fields: ["id", "guild_id", "name", "type"] },
    { key: "channel_delete", label: t("gv.evtChannelDelete"), fields: ["id", "guild_id", "op_user_id"] },
  ];
  const fieldLabels: Record<string, string> = {
    id: t("gv.evtFieldId"), guild_id: t("gv.evtFieldId"), name: t("gv.evtFieldName"),
    owner_id: t("gv.evtFieldOwner"), op_user_id: t("gv.evtFieldOwner"),
    member_count: t("gv.evtFieldCount"), joined_at: t("gv.evtFieldTime"), type: t("gv.chType"),
  };
  interface ApiDocEntry {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    path: string;
    descKey: string;
    notes?: string[];
  }
  interface ApiDocGroup { titleKey: string; items: ApiDocEntry[] }
  const API_GROUPS: ApiDocGroup[] = [
    {
      titleKey: "gv.docGroup.guild",
      items: [
        { method: "GET", path: "/users/@me/guilds", descKey: "gv.doc.guilds" },
        { method: "GET", path: "/guilds/{guild_id}", descKey: "gv.doc.guildGet" },
        { method: "GET", path: "/guilds/{guild_id}/channels", descKey: "gv.doc.channels" },
        { method: "GET", path: "/channels/{channel_id}", descKey: "gv.doc.channelGet" },
        { method: "POST", path: "/guilds/{guild_id}/channels", descKey: "gv.doc.channelCreate", notes: ["gv.docNote.admin"] },
        { method: "PATCH", path: "/channels/{channel_id}", descKey: "gv.doc.channelPatch", notes: ["gv.docNote.admin"] },
        { method: "DELETE", path: "/channels/{channel_id}", descKey: "gv.doc.channelDelete", notes: ["gv.docNote.admin"] },
        { method: "GET", path: "/channels/{channel_id}/online_nums", descKey: "gv.doc.channelOnline" },
      ],
    },
    {
      titleKey: "gv.docGroup.member",
      items: [
        { method: "GET", path: "/guilds/{guild_id}/members", descKey: "gv.doc.memberList", notes: ["gv.docNote.private"] },
        { method: "GET", path: "/guilds/{guild_id}/members/{user_id}", descKey: "gv.doc.memberGet", notes: ["gv.docNote.private"] },
        { method: "DELETE", path: "/guilds/{guild_id}/members/{user_id}", descKey: "gv.doc.memberDelete", notes: ["gv.docNote.admin"] },
        { method: "PATCH", path: "/guilds/{guild_id}/mute", descKey: "gv.doc.muteAll", notes: ["gv.docNote.admin"] },
        { method: "PATCH", path: "/guilds/{guild_id}/members/{user_id}/mute", descKey: "gv.doc.muteMember", notes: ["gv.docNote.admin"] },
        { method: "GET", path: "/guilds/{guild_id}/members/{user_id}/roles", descKey: "gv.doc.memberRoles" },
        { method: "PUT", path: "/guilds/{guild_id}/members/{user_id}/roles/{role_id}", descKey: "gv.doc.memberRolePut", notes: ["gv.docNote.admin", "gv.docNote.memberRole"] },
        { method: "DELETE", path: "/guilds/{guild_id}/members/{user_id}/roles/{role_id}", descKey: "gv.doc.memberRoleDelete", notes: ["gv.docNote.admin", "gv.docNote.memberRole"] },
        { method: "GET", path: "/guilds/{guild_id}/roles/{role_id}/members", descKey: "gv.doc.roleMembers", notes: ["gv.docNote.privateShort"] },
      ],
    },
    {
      titleKey: "gv.docGroup.role",
      items: [
        { method: "GET", path: "/guilds/{guild_id}/roles", descKey: "gv.doc.roles" },
        { method: "POST", path: "/guilds/{guild_id}/roles", descKey: "gv.doc.roleCreate", notes: ["gv.docNote.admin"] },
        { method: "PATCH", path: "/guilds/{guild_id}/roles/{role_id}", descKey: "gv.doc.rolePatch", notes: ["gv.docNote.admin"] },
        { method: "DELETE", path: "/guilds/{guild_id}/roles/{role_id}", descKey: "gv.doc.roleDelete", notes: ["gv.docNote.admin", "gv.docNote.builtin"] },
        { method: "GET", path: "/channels/{channel_id}/roles/{role_id}", descKey: "gv.doc.channelRoleGet" },
        { method: "PATCH", path: "/channels/{channel_id}/roles/{role_id}", descKey: "gv.doc.channelRolePatch", notes: ["gv.docNote.admin"] },
      ],
    },
    {
      titleKey: "gv.docGroup.message",
      items: [
        { method: "POST", path: "/channels/{channel_id}/messages", descKey: "gv.doc.messageSend", notes: ["gv.docNote.quota"] },
        { method: "GET", path: "/channels/{channel_id}/messages", descKey: "gv.doc.messageList", notes: ["gv.docNote.msgId"] },
        { method: "DELETE", path: "/channels/{channel_id}/messages/{message_id}", descKey: "gv.doc.messageDelete", notes: ["gv.docNote.admin", "gv.docNote.msgId"] },
        { method: "GET", path: "/guilds/{guild_id}/message/setting", descKey: "gv.doc.msgSettingGet" },
        { method: "PUT", path: "/guilds/{guild_id}/message/setting", descKey: "gv.doc.msgSettingPut", notes: ["gv.docNote.admin"] },
      ],
    },
    {
      titleKey: "gv.docGroup.content",
      items: [
        { method: "GET", path: "/guilds/{guild_id}/announces", descKey: "gv.doc.announceList", notes: ["gv.docNote.noAnnounceList"] },
        { method: "POST", path: "/guilds/{guild_id}/announces", descKey: "gv.doc.announceCreate", notes: ["gv.docNote.admin", "gv.docNote.msgId"] },
        { method: "DELETE", path: "/guilds/{guild_id}/announces/{message_id}", descKey: "gv.doc.announceDelete", notes: ["gv.docNote.admin"] },
        { method: "GET", path: "/channels/{channel_id}/pins", descKey: "gv.doc.pins" },
        { method: "PUT", path: "/channels/{channel_id}/pins/{message_id}", descKey: "gv.doc.pinAdd", notes: ["gv.docNote.admin", "gv.docNote.msgId", "gv.docNote.pin"] },
        { method: "DELETE", path: "/channels/{channel_id}/pins/{message_id}", descKey: "gv.doc.pinDelete", notes: ["gv.docNote.admin", "gv.docNote.msgId"] },
        { method: "GET", path: "/channels/{channel_id}/schedules", descKey: "gv.doc.schedules" },
        { method: "GET", path: "/channels/{channel_id}/schedules/{schedule_id}", descKey: "gv.doc.scheduleGet" },
        { method: "POST", path: "/channels/{channel_id}/schedules", descKey: "gv.doc.scheduleCreate", notes: ["gv.docNote.admin", "gv.docNote.schedule"] },
        { method: "PATCH", path: "/channels/{channel_id}/schedules/{schedule_id}", descKey: "gv.doc.schedulePatch", notes: ["gv.docNote.admin", "gv.docNote.schedule"] },
        { method: "DELETE", path: "/channels/{channel_id}/schedules/{schedule_id}", descKey: "gv.doc.scheduleDelete", notes: ["gv.docNote.admin"] },
        { method: "POST", path: "/channels/{channel_id}/audio", descKey: "gv.doc.audio" },
        { method: "GET", path: "/channels/{channel_id}/threads", descKey: "gv.doc.threads", notes: ["gv.docNote.forum"] },
        { method: "GET", path: "/channels/{channel_id}/threads/{thread_id}", descKey: "gv.doc.threadGet", notes: ["gv.docNote.forum"] },
        { method: "PUT", path: "/channels/{channel_id}/threads", descKey: "gv.doc.threadCreate", notes: ["gv.docNote.forum"] },
        { method: "DELETE", path: "/channels/{channel_id}/threads/{thread_id}", descKey: "gv.doc.threadDelete", notes: ["gv.docNote.forum"] },
      ],
    },
    {
      titleKey: "gv.docGroup.permission",
      items: [
        { method: "GET", path: "/channels/{channel_id}/permissions", descKey: "gv.doc.channelPermGet" },
        { method: "PUT", path: "/channels/{channel_id}/permissions/all", descKey: "gv.doc.channelPermAll", notes: ["gv.docNote.admin"] },
        { method: "GET", path: "/guilds/{guild_id}/api_permission", descKey: "gv.doc.apiPermGet" },
        { method: "POST", path: "/guilds/{guild_id}/api_permission", descKey: "gv.doc.apiPermPost" },
      ],
    },
  ];
  const eventsPane = () => h("div", { className: "qbot-gvPane" },
    paneHead(t("gv.tab.events"), t("gv.evtDesc")),
    h("div", { className: "qbot-gvDocIntro" }, t("gv.docIntro")),
    h("div", { className: "qbot-gvDocGroups" }, API_GROUPS.map((g) =>
      h("section", { key: g.titleKey, className: "qbot-gvDocGroup" },
        h("div", { className: "qbot-gvDocGroupHead" },
          h("strong", null, t(g.titleKey)),
          h("span", null, String(g.items.length))),
        h("div", { className: "qbot-gvDocGrid" }, g.items.map((item) =>
          h("div", { key: `${item.method} ${item.path}`, className: "qbot-gvDocCard" },
            h("div", { className: "qbot-gvDocCardTop" },
              h("span", { className: `qbot-gvDocMethod is-${item.method.toLowerCase()}` }, item.method),
              h("code", { className: "qbot-gvDocPath" }, item.path)),
            h("div", { className: "qbot-gvDocDesc" }, t(item.descKey)),
            item.notes?.length
              ? h("div", { className: "qbot-gvDocNotes" }, item.notes.map((note) =>
                  h("span", { key: note, className: "qbot-gvDocNote" }, t(note))))
              : null)))))),
    h("div", { className: "qbot-gvDocSectionTitle" }, t("gv.docEventTitle")),
    h("div", { className: "qbot-gvEventGrid" }, EVENTS.map((e) =>
      h("div", { key: e.key, className: "qbot-gvEventCard" },
        h("strong", null, e.label),
        h("code", null, e.key.toUpperCase()),
        h("div", { className: "qbot-gvEventFields" },
          h("span", { className: "qbot-gvEventLabel" }, t("gv.evtFields")),
          e.fields.map((f) => h("span", { key: f, className: "qbot-gvEventField" }, fieldLabels[f] || f)))))));

  // ── 接口权限授权（开发者中心 /guilds/{id}/api_permission） ────────────────
  const apiPermPane = () => {
    const all = Array.isArray(apiPermResult?.apis) ? apiPermResult!.apis! : [];
    const isOk = (row: ApiPermEntry) => Number(row.auth_status) === 1;
    const okCount = all.filter(isOk).length;
    const rows = apiPermOnlyUnauth ? all.filter((row) => !isOk(row)) : all;
    return h("div", { className: "qbot-gvPane" },
      paneHead(t("gv.tab.apiPerm"), t("gv.apiPermDesc")),
      !guild ? needGuild : h("div", { className: "qbot-gvStack" },
        h("div", { className: "qbot-gvForm" },
          h("small", { className: "qbot-gvFieldHint" }, t("gv.apiPermHint")),
          h("div", { className: "qbot-gvFormActions" },
            btn("apiPermGet", t("gv.apiPermGet"), () => void run("apiPermGet", async () => {
              setApiPermResult((await call("guild.apiPerm.get", { guildId: guild.id })) as ApiPermResult);
            }), true))),
        apiPermResult === null ? null : h("div", { className: "qbot-gvStack" },
          h("div", { className: "qbot-gvPermBar" },
            h("span", null, fmt("gv.apiPermCount", all.length, okCount, all.length - okCount)),
            h("label", { className: "qbot-gvCheck" },
              h("input", {
                type: "checkbox", checked: apiPermOnlyUnauth,
                onChange: (e: any) => setApiPermOnlyUnauth(e.target.checked),
              }), t("gv.apiPermOnlyUnauth"))),
          rows.length
            ? h("div", { className: "qbot-gvPermTable" },
                h("div", { className: "qbot-gvPermHead" },
                  h("span", null, t("gv.apiPermColMethod")),
                  h("span", null, t("gv.apiPermColPath")),
                  h("span", null, t("gv.apiPermColDesc")),
                  h("span", null, t("gv.apiPermColState"))),
                rows.map((row, i) => {
                  const method = str(row.method).toUpperCase();
                  const granted = isOk(row);
                  return h("div", { key: `${method}-${str(row.path)}-${i}`, className: "qbot-gvPermRow" },
                    method
                      ? h("span", { className: `qbot-gvDocMethod is-${method.toLowerCase()}` }, method)
                      : h("span", null, "—"),
                    h("code", { className: "qbot-gvPermPath" }, str(row.path) || "—"),
                    h("span", { className: "qbot-gvPermDesc" }, str(row.desc) || "—"),
                    h("span", {
                      className: `qbot-gvPermState is-${granted ? "ok" : "no"}`,
                      title: `auth_status=${str(row.auth_status)}`,
                    }, granted ? t("gv.apiPermStateOk") : t("gv.apiPermStateNo")));
                }))
            : h("div", { className: "qbot-gvEmpty" }, t("gv.apiPermEmpty")),
          h("details", { className: "qbot-gvPermRaw" },
            h("summary", null, t("gv.apiPermRaw")),
            h("pre", null, JSON.stringify(apiPermResult, null, 2))))));
  };

  /** AI 执行记录：只读展示 agent 聊天里触发过的操作，输入入口不在这里。 */
  const assistantPane = () => h("div", { className: "qbot-gvPane" },
    h(AiChatPanel, {
      key: guild?.id || "noguild",
      rpcCall,
      appId,
      scope: "guild",
      guildId: guild?.id || "",
      channelId: channelId || messageChannel || recallChannel || "",
    }));

  const panes: Record<GuildTab, () => React.ReactNode> = {
    guilds: guildsPane, info: infoPane, channels: channelsPane,
    members: membersPane, roles: rolesPane, message: messagePane,
    speak: speakPane, content: contentPane, ai: aiPane, apiPerm: apiPermPane, events: eventsPane,
    assistant: assistantPane,
  };

  /** 二级弹窗外壳：点列表「编辑」后弹出，独立于主内容层。 */
  const subDialog = (title: string, body: React.ReactNode, onClose: () => void) =>
    h("div", { className: "qbot-gvSubOverlay" },
      h("div", { className: "qbot-gvSubModal", role: "dialog", "aria-modal": "true", "aria-label": title },
        h("div", { className: "qbot-modalHead" },
          h("strong", null, title),
          h("button", { className: "qbot-modalClose", type: "button", "aria-label": t("common.close"), onClick: onClose }, "×")),
        subNotice
          ? h("div", {
              className: `qbot-detailToast qbot-gvSubToast is-${subNotice.tone}`,
              role: subNotice.tone === "error" ? "alert" : "status",
              onClick: () => setSubNotice(null),
            }, subNotice.text)
          : null,
        body));

  return h(React.Fragment, null,
    h("div", { className: `qbot-gvLayout${embedded ? " is-embedded" : ""}` },
      embedded ? null : h("nav", { className: "qbot-gvNav", role: "tablist", "aria-label": t("gv.title") },
        TEXT_KEYS.map((tab) => h("button", {
          key: tab.key, type: "button", role: "tab",
          "aria-selected": active === tab.key,
          className: `qbot-gvNavItem${active === tab.key ? " is-active" : ""}`,
          onClick: () => setActive(tab.key),
        },
          h("span", { className: "qbot-gvNavIcon", "aria-hidden": "true" }, tab.icon),
          h("span", null, t(`gv.tab.${tab.key}`))))),
      h("div", { className: "qbot-gvContent" },
        guild && active !== "guilds" && active !== "events"
          ? h("div", { className: "qbot-gvScope" },
              h("span", { className: "qbot-gvScopeDot", "aria-hidden": "true" }),
              h("span", { className: "qbot-gvScopeName", title: guild.name }, guild.name),
              h("code", { className: "qbot-gvScopeId" }, guild.id))
          : null,
        panes[active]())),
    chDialog ? subDialog(chEditId ? t("gv.chEdit") : t("gv.chCreate"), channelForm(), () => { setChDialog(false); setChEditId(""); }) : null,
    roleDialog ? subDialog(roleEditId ? t("gv.roleEdit") : t("gv.roleCreate"), roleForm(), () => { setRoleDialog(false); setRoleEditId(""); }) : null,
    assignDialog ? subDialog(t("gv.roleAssign"), assignRoleForm(), () => setAssignDialog(false)) : null);
}

/** 频道管理弹窗外壳：与平台能力弹窗样式统一。 */
export function GuildManagerDialog(props: {
  rpcCall: RpcCall;
  appId: string;
  onClose: () => void;
  /** 嵌入控制台时指定初始二级 Tab；独立弹窗默认「频道列表」。 */
  initialTab?: GuildTab;
}) {
  const { rpcCall, appId, onClose, initialTab } = props;
  useLocale();
  const [notice, setNotice] = React.useState<{ text: string; tone: "error" | "success" } | null>(null);

  React.useEffect(() => {
    if (!notice) return;
    const id = window.setTimeout(() => setNotice(null), 5000);
    return () => window.clearTimeout(id);
  }, [notice]);

  return h("div", {
    className: "qbot-modalOverlay",
  },
    h("div", {
      className: "qbot-modal qbot-modalWide qbot-gvModal",
      role: "dialog", "aria-modal": "true", "aria-label": t("gv.title"),
    },
      h("div", { className: "qbot-modalHead" },
        h("div", null,
          h("strong", null, t("gv.title")),
          h("p", null, t("gv.hint"))),
        h("button", {
          className: "qbot-modalClose", type: "button",
          "aria-label": t("common.close"), onClick: onClose,
        }, "×")),
      notice
        ? h("div", {
            className: `qbot-detailToast qbot-ptDialogToast is-${notice.tone}`,
            role: notice.tone === "error" ? "alert" : "status",
            onClick: () => setNotice(null),
          }, notice.text)
        : null,
      h("div", { className: "qbot-gvBody" },
        h(GuildManager, {
          key: `${appId || "default"}-${initialTab ?? "guilds"}`,
          rpcCall,
          appId,
          initialTab,
          onNotify: (text: string, tone: "error" | "success") => setNotice({ text, tone }),
        })),
      h("div", { className: "qbot-modalFoot qbot-ptDialogFoot" },
        h("span", { className: "qbot-hint" }, t("gv.summary")),
        h("button", {
          className: "qbot-btn qbot-btnPrimary", type: "button", onClick: onClose,
        }, t("common.close")))));
}
