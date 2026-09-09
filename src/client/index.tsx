/**
 * dsh-qqbot 设置界面 — 挂进 DSH 设置页「QQ 机器人」。
 *
 * 界面完全模仿 @xmanrui/dsh-im 的客户端设置面板（无左侧导航栏，仅右侧面板）：
 * 标题栏品牌区 + 卡片 radius 14 + #1677ff 主色 + 状态圆点 + 分段 Tab +
 * 编号步骤列表 + 等宽输入框，配色/字体/阴影全部对齐 dsh-im 的
 * --dsw-alias-* 设计令牌（含浅色回退）。
 *
 * 结构（多机器人）：
 *   机器人列表 → 点击卡片进详情（连接状态 / 行为配置）
 *   「添加机器人」→ 分段 Tab（扫码登录 | 手动填写），配置成功才开放行为配置。
 * 所有可枚举配置（工作区 / 模型 / Preset / 数值参数）均为下拉选择。
 *
 * 通过 connection.rpc 与 host 管理服务通信（/qqbot-settings 通道）。
 * 模块契约对齐 dsh-im / dsh 0.1.2-rc.1：导出 name/apply/inject，
 * ctx.slots.inject("settings.section", () => ctx.slots.register(spec, 函数组件))。
 */
import * as React from "react";
import { SHANGHAI_TZ } from "../shared/time.js";
import { QQBOT_LOCALE_NAMESPACE, en, h, localizeText, setTranslator, zh } from "./i18n.js";

export const name = "qqbot-settings";
// locale：宿主语言服务（ctx.locale.register/bind），支撑设置界面双语。
export const inject = ["slots", "connection", "locale"];

declare const __PLUGIN_VERSION__: string;

const RPC_CHANNEL = "/qqbot-settings";

type RpcCall = (
  endpoint: string,
  payload?: Record<string, unknown>,
  signal?: AbortSignal,
) => Promise<Reply>;

/** 服务端信封：{ok, value}（新版）/ {ok, data}（兼容旧版）；error 为 {code,message} 或字符串。 */
interface Reply {
  ok: boolean;
  value?: any;
  data?: any;
  error?: unknown;
}

interface QrSnapshot {
  status: "idle" | "pending" | "success" | "failure";
  qrUrl?: string;
  /** PNG DataURL，对齐 dsh-im 的 qrCodeDataUrl（<img> 直接展示）。 */
  qrCodeDataUrl?: string;
  qrSvg?: string;
  /** 二维码过期时间戳（毫秒），驱动倒计时进度条。 */
  expiresAt?: number;
  appId?: string;
  error?: string;
}

interface BotInfo {
  appId: string;
  appIdMasked: string;
  source: string;
  savedAt: string;
  enabled: boolean;
  primary: boolean;
  ws: { state: string; lastConnectedAt: number | null; lastError: string | null };
  counters: { received: number; sessions: number; replies: number; proactive: number; errors: number };
  pendingReplies: number;
  boundSessions: number;
  groupBuffers: Array<{ openid: string; buffered: number }>;
  /** 该机器人独立的行为配置（设置界面编辑对象）。 */
  config: Record<string, any>;
}

interface BotsData {
  primaryAppId: string;
  runtimeReady: boolean;
  bots: BotInfo[];
}

interface Catalogs {
  /** 已配置的模型目录（宿主 llm 运行时服务，settings.yaml 兜底）。 */
  models: Array<{ id: string; label: string; group?: string }>;
  /** 宿主 Agent Preset 目录（agentPresets 服务）。 */
  agentPresets: Array<{ id: string; label: string }>;
}

const EMPTY_CATALOGS: Catalogs = { models: [], agentPresets: [] };

const FIELD_LABELS: Record<string, string> = {
  workspacePath: "工作区目录",
  agentPreset: "Agent Preset",
  model: "模型",
  valueThreshold: "群消息价值阈值",
  atContextMessages: "AT 上下文条数",
  groupCooldownMs: "群回复最小间隔",
  senderCooldownMs: "同人回复间隔",
  replyChunkChars: "分片字符数",
  maxRepliesPerMessage: "每条消息最大回复",
  quoteMaxChars: "引用字数上限",
  quotaPerDay: "主动消息日配额",
};

/** 数值项说明：写清「影响什么 + 什么时候生效」，配置界面直接展示。 */
const FIELD_HELP: Record<string, string> = {
  valueThreshold:
    "0–10 分。机器人给每条群消息打分，只有达到分数才会回复；分数越高越安静。设为 0 表示群里所有消息都回复（容易刷屏）。@ 机器人的消息不受此限制，一定会回复。",
  atContextMessages:
    "@ 机器人时，额外附带群里最近 N 条消息一起送给模型，让它听懂上下文。设为 0 则只发送被 @ 的这一条。条数越多越聪明，也越耗 token。",
  groupCooldownMs:
    "同一个群里，两次「非 @ 触发」的回复之间至少要隔这么久，用来防止机器人刷屏。@ 机器人的回复不受限制。",
  senderCooldownMs:
    "同一个人在这么短的时间内不会被回复第二次，避免被同一个人连续刷屏。",
  replyChunkChars:
    "QQ 单条消息有长度限制，超长的回复会按这个字数切成多条依次发送。太小会切得很碎，太大会被平台截断。",
  maxRepliesPerMessage:
    "一条用户消息最多触发几次被动回复（QQ 平台硬上限为 5）。调小可以避免机器人一次性连发多条。",
  quoteMaxChars:
    "文本引用最多显示多少字（仅主动消息回退为文本引用时使用；原生引用气泡由 QQ 客户端自行截断），超出部分以省略号结尾。",
  quotaPerDay:
    "单日最多发送多少条主动消息（定时消息、欢迎语、出箱补发、AI 发图都计入）。0 表示不限制——但 QQ 平台主动消息配额极少，超发会被限流，建议保持默认 50。",
};

/** 开关项说明：逐条写清开启/关闭后的实际行为。 */
const SWITCH_DEFS: Array<{ key: string; label: string; desc: string; def: boolean }> = [
  {
    key: "groupFullReply",
    label: "群全量消息回复",
    desc: "开启后，群里没有 @ 机器人的消息也会参与价值评分，达到阈值才回复；@ 机器人的消息始终回复并可使用工具。关闭后，机器人只处理 @ 它的群消息。",
    def: true,
  },
  {
    key: "allowC2c",
    label: "接受单聊消息",
    desc: "是否响应 QQ 私聊（C2C）消息。关闭后机器人只处理群消息，私聊一律忽略。",
    def: true,
  },
  {
    key: "respondToBots",
    label: "响应机器人消息",
    desc: "开启后，其他机器人发出的消息也会触发本机器人回复。默认关闭：其他机器人的消息一律忽略，防止同群的多个机器人互相触发、循环刷屏。注意 QQ 平台在群聊里通常不向机器人推送其他机器人的消息，此开关只在平台确实推送时才有实际效果。",
    def: false,
  },
  {
    key: "markdownReply",
    label: "Markdown 回复",
    desc: "优先以 QQ Markdown 格式发送，排版更好看；若平台拒绝该格式，会自动降级为纯文本重发，不会丢消息。",
    def: true,
  },
  {
    key: "proactiveFallback",
    label: "被动失败转主动消息",
    desc: "被动回复超时或失败时，改用主动消息接口补发一次。主动消息每日配额极少，仅在排查问题时临时开启。",
    def: false,
  },
  {
    key: "archiveEnabled",
    label: "消息本地归档",
    desc: "把收到的消息与发出的回复写入 ~/.dsh/qqbot/archive/，作为审计轨迹留档，方便事后排查。",
    def: true,
  },
  {
    key: "multimodalInbound",
    label: "多模态消息",
    desc: "群里/私聊发来的图片、文件、语音会以附件形式注入会话上下文：视觉模型可以直接看图，语音优先使用平台自带转写文本。关闭后非文字内容只保留占位说明。",
    def: true,
  },
  {
    key: "memoryEnabled",
    label: "长期记忆",
    desc: "每个群/单聊维护一份持久记忆（跨 /new 保留）。对话里说「记住某事」AI 会自动写入；用 /记忆 查看、/清空记忆 清空。",
    def: true,
  },
  {
    key: "welcomeEnabled",
    label: "欢迎语",
    desc: "新成员进群或新好友添加时，机器人自动发送欢迎语（文案见下方输入框，{nick} 会替换为对方标识）。走主动消息通道，消耗每日配额。",
    def: false,
  },
  {
    key: "reactionRecall",
    label: "表情撤回",
    desc: "任何人对机器人发出的消息点 🗑️ 表情回应，机器人就撤回那条消息（需要平台的「消息撤回」权限）。",
    def: false,
  },
];

/** QQ 企鹅 glyph */
function QqLogoGlyph() {
  return h("svg", { viewBox: "0 0 24 24", focusable: "false", "aria-hidden": "true" },
    h("path", {
      fill: "currentColor",
      d: "M21.395 15.035a40 40 0 0 0-.803-2.264l-1.079-2.695c.001-.032.014-.562.014-.836C19.526 4.632 17.351 0 12 0S4.474 4.632 4.474 9.241c0 .274.013.804.014.836l-1.08 2.695a39 39 0 0 0-.802 2.264c-1.021 3.283-.69 4.643-.438 4.673.54.065 2.103-2.472 2.103-2.472 0 1.469.756 3.387 2.394 4.771-.612.188-1.363.479-1.845.835-.434.32-.379.646-.301.778.343.578 5.883.369 7.482.189 1.6.18 7.14.389 7.483-.189.078-.132.132-.458-.301-.778-.483-.356-1.233-.646-1.846-.836 1.637-1.384 2.393-3.302 2.393-4.771 0 0 1.563 2.537 2.103 2.472.251-.03.581-1.39-.438-4.673",
    }));
}

/** 文件夹 glyph，用于目录选择弹窗的行图标。 */
function FolderGlyph() {
  return h("svg", { viewBox: "0 0 24 24", focusable: "false", "aria-hidden": "true" },
    h("path", {
      fill: "currentColor",
      d: "M3 6.5A1.5 1.5 0 0 1 4.5 5h4.1c.47 0 .91.22 1.2.6L11 7h8.5A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11Z",
    }));
}

/** 上一级 glyph。 */
function FolderUpGlyph() {
  return h("svg", { viewBox: "0 0 24 24", focusable: "false", "aria-hidden": "true" },
    h("path", {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M11 19l-7-7 7-7M4 12h16",
    }));
}

/** QQ 机器人 glyph（圆角方头 + 天线 + 双眼 + 微笑）。黑白配色：头身 currentColor 跟随主题文字色，眼嘴镂空透出背景。 */
function QqBotGlyph(props: { className?: string; uid: string }) {
  return h("svg", {
    viewBox: "0 0 24 24",
    width: "1em",
    height: "1em",
    focusable: "false",
    "aria-hidden": "true",
    className: props.className,
  },
    h("circle", { cx: 12, cy: 2.9, r: 1.2, fill: "currentColor" }),
    h("line", { x1: 12, y1: 4, x2: 12, y2: 6.2, stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" }),
    h("mask", { id: `qbot-face-${props.uid}` },
      h("rect", { x: 0, y: 0, width: 24, height: 24, fill: "#fff" }),
      h("circle", { cx: 9.3, cy: 12, r: 1.6, fill: "#000" }),
      h("circle", { cx: 14.7, cy: 12, r: 1.6, fill: "#000" }),
      h("path", { d: "M9.4 15.1 Q12 17.1 14.6 15.1", fill: "none", stroke: "#000", strokeWidth: 1.5, strokeLinecap: "round" })),
    h("rect", { x: 4.5, y: 6, width: 15, height: 13, rx: 4.5, fill: "currentColor", mask: `url(#qbot-face-${props.uid})` }));
}

/** 在线状态胶囊 */
function OnlineBadge(props: { tone: "success" | "warning" | "error" | "neutral"; text: string }) {
  return h("span", { className: "qbot-onlineBadge" },
    h("span", { className: "qbot-stateDot", "data-tone": props.tone }),
    props.text);
}

/** 状态标签：圆点 + 文案（dim-stateLabel）。 */
function StateLabel(props: { tone: "success" | "warning" | "error" | "neutral"; text: string }) {
  return h("span", { className: "qbot-stateLabel" },
    h("span", { className: "qbot-stateDot", "data-tone": props.tone }),
    props.text);
}

function Field(props: { label: string }, children: any) {
  return h("label", { className: "qbot-field" },
    h("span", { className: "qbot-fieldLabel" }, props.label),
    children);
}

function TextInput(props: any) {
  return h("input", { className: "qbot-input", ...props });
}

/** 多行文本输入：长文案 / 列表类设置项使用，避免单行 input 截断长文本。 */
function TextArea(props: any) {
  return h("textarea", { className: "qbot-textarea", ...props });
}

interface Option {
  value: string;
  label: string;
}

/**
 * 设置行：标题 + 说明 + 控件 三段式。
 * 说明（desc）必须回答「这项配置影响什么、什么时候生效」，不让用户靠猜。
 * wide=true 时控件通栏独占一行（置于标题/说明下方），供 textarea 等宽控件使用。
 */
function SettingRow(props: { label: string; desc: string; control: any; rowKey?: string; wide?: boolean }) {
  return h("div", { className: `qbot-settingRow${props.wide ? " is-wide" : ""}`, key: props.rowKey },
    h("div", { className: "qbot-settingCopy" },
      h("span", { className: "qbot-settingTitle" }, props.label),
      h("span", { className: "qbot-settingDesc" }, props.desc)),
    h("div", { className: `qbot-settingControl${props.wide ? " is-wide" : ""}` }, props.control));
}

/**
 * RPC 层在通道未响应时会返回结构化错误 { code, message, details } 而非字符串。
 * 统一转成可安全渲染的字符串，避免把对象当 React 子节点（React #31）。
 */
function errText(err: unknown): string {
  if (err == null) return "未知错误";
  if (typeof err === "string") return err;
  if (typeof err === "object") {
    const e = err as { message?: unknown; code?: unknown };
    if (typeof e.message === "string" && e.message) return e.message;
    if (typeof e.code === "string" && e.code) return e.code;
    try {
      const json = JSON.stringify(err);
      if (json && json !== "{}") return json;
    } catch { /* 不可序列化 */ }
  }
  return String(err);
}

const val = (res: Reply): any => (res && typeof res === "object" ? res.value ?? res.data : undefined);

function formatTime(raw: unknown): string {
  let ts: number;
  if (typeof raw === "number") ts = raw;
  else if (typeof raw === "string" && raw) ts = Date.parse(raw);
  else return "—";
  if (Number.isNaN(ts)) return typeof raw === "string" ? raw : "—";
  // 始终以上海时间（Asia/Shanghai）呈现，与查看者本地时区无关；
  // 日期文案语言跟随浏览器语言（配合界面 i18n）。
  return new Date(ts).toLocaleString(undefined, { timeZone: SHANGHAI_TZ });
}

const COOLDOWN_OPTIONS = [0, 10_000, 30_000, 60_000, 120_000, 300_000, 600_000, 1_800_000];

function cooldownLabel(ms: number): string {
  if (ms === 0) return "不限制";
  if (ms % 60_000 === 0 && ms >= 60_000) return `${ms / 60_000} 分钟`;
  return `${ms / 1000} 秒`;
}

/** 倒计时 mm:ss（对齐 dsh-im formatRemaining）。 */
function formatRemaining(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function QqbotSettingsTab({ rpcCall }: { rpcCall: RpcCall }) {
  const [status, setStatus] = React.useState<any>(null);
  const [bots, setBots] = React.useState<BotsData | null>(null);
  const [catalogs, setCatalogs] = React.useState<Catalogs>(EMPTY_CATALOGS);
  const [form, setForm] = React.useState<Record<string, any>>({});
  const [page, setPage] = React.useState<"list" | "add" | "detail">("list");
  const [detailAppId, setDetailAppId] = React.useState("");
  const [addTab, setAddTab] = React.useState<"qr" | "manual">("qr");
  const [qr, setQr] = React.useState<QrSnapshot | null>(null);
  const [manual, setManual] = React.useState({ appId: "", appSecret: "" });
  const [notice, setNotice] = React.useState("");
  const [loadError, setLoadError] = React.useState("");
  const [refreshing, setRefreshing] = React.useState(false);
  const [reconnecting, setReconnecting] = React.useState(false);
  const [update, setUpdate] = React.useState<{ busy: boolean; message: string; done: boolean }>({
    busy: false,
    message: "",
    done: false,
  });
  const [now, setNow] = React.useState(Date.now());
  const [picker, setPicker] = React.useState<{
    path: string;
    parent: string | null;
    dirs: Array<{ path: string; name: string }>;
    /** 单击选中的子文件夹（未选中时"选定此文件夹"作用于当前浏览目录）。 */
    selected: string;
    loading: boolean;
    error: string;
  } | null>(null);
  const pollRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = React.useCallback(async (appId?: string) => {
    try {
      const [s, c, b, cat] = await Promise.all([
        rpcCall("status"),
        rpcCall("config.get", appId ? { appId } : {}),
        rpcCall("bots.list"),
        rpcCall("catalogs"),
      ]);
      if (s.ok) setStatus(val(s) ?? null);
      else setLoadError(errText(s.error ?? "状态读取失败"));
      if (c.ok) {
        const stored = val(c)?.config ?? {};
        setForm({ ...stored });
      }
      if (b.ok) setBots(val(b) ?? null);
      if (cat.ok) setCatalogs({ ...EMPTY_CATALOGS, ...(val(cat) ?? {}) });
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : String(error));
    }
  }, [rpcCall]);

  React.useEffect(() => {
    void refresh();
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [refresh]);

  // 进入某个机器人详情时，载入「该机器人」的生效配置到表单，避免沿用上一个/主机器人。
  React.useEffect(() => {
    if (page !== "detail") return undefined;
    if (!detailAppId) return undefined;
    let alive = true;
    rpcCall("config.get", { appId: detailAppId }).then((res) => {
      if (!alive) return;
      if (res.ok) setForm({ ...(val(res)?.config ?? {}) });
    });
    return () => { alive = false; };
  }, [page, detailAppId, rpcCall]);

  // 扫码进行中：每秒走表，驱动二维码倒计时进度条（对齐 dsh-im QrPanel）。
  React.useEffect(() => {
    if (qr?.status !== "pending") return undefined;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [qr?.status, qr?.expiresAt]);

  // ── 添加机器人：扫码（Tab 1） ────────────────────────────────────────────────
  const startQr = async () => {
    setNotice("");
    const res = await rpcCall("qr.start");
    const snap = (res.ok ? val(res) : { status: "failure", error: errText(res.error) }) as QrSnapshot;
    setQr(snap);
    if (snap.status === "pending" || snap.status === "success") {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = setInterval(async () => {
        const state = await rpcCall("qr.state");
        const current = (state.ok ? val(state) : { status: "failure" }) as QrSnapshot;
        setQr(current);
        if (current.status === "success" || current.status === "failure" || current.status === "idle") {
          if (pollRef.current) clearInterval(pollRef.current);
          pollRef.current = null;
          if (current.status === "success") {
            await refresh();
            setDetailAppId(current.appId ?? "");
            setPage("detail");
            setNotice(`扫码成功，AppID ${current.appId} 已启用`);
          }
        }
      }, 2000);
    }
  };

  const cancelQr = async () => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = null;
    const res = await rpcCall("qr.cancel");
    setQr((res.ok ? val(res) : null) as QrSnapshot | null);
  };

  // ── 工作区目录选择弹窗（host: workspace.browse，只读逐级浏览） ───────────────
  const browseTo = async (target?: string) => {
    setPicker((prev) => (prev ? { ...prev, loading: true, error: "", selected: "" } : prev));
    const res = await rpcCall("workspace.browse", target ? { path: target } : {});
    if (res.ok) {
      const v = val(res) ?? {};
      setPicker({
        path: String(v.path ?? ""),
        parent: (v.parent as string | null) ?? null,
        dirs: Array.isArray(v.dirs) ? v.dirs : [],
        selected: "",
        loading: false,
        error: "",
      });
    } else {
      setPicker((prev) => (prev ? { ...prev, loading: false, error: errText(res.error) } : prev));
    }
  };

  const openPicker = () => {
    setPicker({ path: "", parent: null, dirs: [], selected: "", loading: true, error: "" });
    const current = String(form.workspacePath ?? "").trim();
    void browseTo(current || undefined);
  };

  const pickDirectory = () => {
    if (!picker) return;
    // 优先取单击选中的子文件夹；未选中时选定当前浏览目录。
    const chosen = picker.selected || picker.path;
    if (!chosen) return;
    setPicker(null);
    void (async () => {
      await saveField("workspacePath", chosen);
      setNotice(`工作区已保存：${chosen}（对新建会话生效）`);
    })();
  };

  // ── 添加机器人：手动填写（Tab 2） ────────────────────────────────────────────
  const saveManual = async () => {
    setNotice("");
    const res = await rpcCall("credentials.save", manual);
    if (res.ok) {
      const appId = (val(res)?.appId as string) || manual.appId;
      setManual({ appId: "", appSecret: "" });
      await refresh();
      setDetailAppId(appId);
      setPage("detail");
      setNotice(`凭据已保存，AppID ${appId} 已启用`);
    } else {
      setNotice(`保存失败：${errText(res.error)}`);
    }
  };

  // ── 行为配置（对齐 dsh-im：下拉/开关变更即保存热生效；作用于当前详情机器人） ──
  const saveField = async (key: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    const res = await rpcCall("config.save", { appId: detailAppId || undefined, [key]: value });
    if (!res.ok) setNotice(`保存失败：${errText(res.error)}`);
    else { setNotice(""); await refresh(detailAppId || undefined); }
  };

  // ── 运行统计刷新 ─────────────────────────────────────────────────────────────
  const refreshStats = async () => {
    setRefreshing(true);
    try { await refresh(); } finally { setRefreshing(false); }
  };

  // ── 机器人卡片操作 ──────────────────────────────────────────────────────────
  const setPrimaryBot = async (appId: string) => {
    setNotice("");
    const res = await rpcCall("bots.setPrimary", { appId });
    setNotice(res.ok ? "已设为主机器人" : `操作失败：${errText(res.error)}`);
    if (res.ok) await refresh();
  };

  /** 启用 / 停用：停用的机器人不会建立 QQ 长连接，也不会接收或回复消息。 */
  const toggleEnabled = async (bot: BotInfo, enabled: boolean) => {
    setNotice("");
    const res = await rpcCall("bots.enable", { appId: bot.appId, enabled });
    setNotice(res.ok ? (enabled ? "机器人已启用" : "机器人已停用") : `操作失败：${errText(res.error)}`);
    if (res.ok) await refresh();
  };

  const removeBot = async (bot: BotInfo) => {
    if (!window.confirm(localizeText(`确定删除机器人 ${bot.appIdMasked}？删除后该机器人停止接收消息。`))) return;
    setNotice("");
    const res = await rpcCall("bots.remove", { appId: bot.appId });
    if (res.ok) {
      await refresh();
      setPage("list");
      setNotice("机器人已删除");
    } else {
      setNotice(`删除失败：${errText(res.error)}`);
    }
  };

  // ── 重试连接：按当前凭据强制重建 WebSocket 长连接 ────────────────────────────
  const retryConnection = async () => {
    setNotice("");
    setReconnecting(true);
    try {
      const res = await rpcCall("bots.reconnect", detailAppId ? { appId: detailAppId } : {});
      if (res.ok) await refresh();
      setNotice(res.ok ? "已重新发起连接，请稍候查看状态" : `重试失败：${errText(res.error)}`);
    } finally {
      setReconnecting(false);
    }
  };

  // ── 版本检查与自更新（host: update.check / update.apply，源 GitHub master 分支） ──
  const runUpdateCheck = async () => {
    setUpdate({ busy: true, message: "正在检查更新…", done: false });
    try {
      const res = await rpcCall("update.check");
      if (!res.ok) {
        setUpdate({ busy: false, message: `检查失败：${errText(res.error)}`, done: false });
        return;
      }
      const v = (val(res) ?? {}) as { current?: string; latest?: string; hasUpdate?: boolean };
      if (!v.hasUpdate) {
        setUpdate({ busy: false, message: `暂无新版本（当前 v${v.current || "?"} 已是最新）`, done: false });
        return;
      }
      // 检查到新版本：自动更新（下载 → 备份旧文件 → 覆盖安装目录）。
      setUpdate({ busy: true, message: `发现新版本 v${v.latest}，正在自动更新…`, done: false });
      const applied = await rpcCall("update.apply");
      if (applied.ok) {
        const r = (val(applied) ?? {}) as { updatedTo?: string };
        setUpdate({
          busy: false,
          message: `已自动更新到 v${r.updatedTo ?? v.latest}（备份于安装目录 .update-backup/），重启 DSH 后生效`,
          done: true,
        });
      } else {
        setUpdate({ busy: false, message: `更新失败：${errText(applied.error)}`, done: false });
      }
    } catch (error) {
      setUpdate({
        busy: false,
        message: `检查失败：${error instanceof Error ? error.message : String(error)}`,
        done: false,
      });
    }
  };

  // ── 定时消息管理弹窗（schedule.list / schedule.add(编辑) / schedule.remove） ──
  const [scheduleModal, setScheduleModal] = React.useState<{
    loading: boolean;
    error: string;
    items: Array<Record<string, any>>;
    /** 范围 Tab：current=当前机器人（默认）；all=所有机器人。 */
    botScope: "current" | "all";
    /** 编辑中的条目草稿（null=列表视图）。 */
    editing: Record<string, any> | null;
    /** 编辑表单校验/保存错误。 */
    editError: string;
    saving: boolean;
  } | null>(null);
  const [scheduleRemoving, setScheduleRemoving] = React.useState("");

  const loadSchedules = async (botScope: "current" | "all") => {
    setScheduleModal((prev) => (prev ? { ...prev, loading: true, error: "" } : prev));
    const payload = botScope === "current" && detailAppId ? { appId: detailAppId } : { allBots: true };
    const res = await rpcCall("schedule.list", payload);
    if (res.ok) {
      const v = val(res) ?? {};
      setScheduleModal((prev) => (prev
        ? { ...prev, loading: false, error: "", items: Array.isArray(v.schedules) ? v.schedules : [] }
        : prev));
    } else {
      setScheduleModal((prev) => (prev ? { ...prev, loading: false, error: errText(res.error) } : prev));
    }
  };

  const openScheduleModal = () => {
    setScheduleModal({ loading: true, error: "", items: [], botScope: "current", editing: null, editError: "", saving: false });
    void loadSchedules("current");
  };

  const switchScheduleScope = (botScope: "current" | "all") => {
    // 切换 Tab 不清空旧列表：保留内容仅标记 loading（刷新态半透明），
    // 数据到达后整体替换，避免「清空 → spinner → 列表」的闪烁跳动。
    setScheduleModal((prev) => (prev && prev.botScope !== botScope ? { ...prev, botScope, loading: true, editing: null, editError: "" } : prev));
    void loadSchedules(botScope);
  };

  // ── 定时消息编辑：草稿字段与保存 ──
  const openScheduleEdit = (entry: Record<string, any>) => {
    setScheduleModal((prev) => (prev ? {
      ...prev,
      editing: {
        id: String(entry.id ?? ""),
        appId: typeof entry.appId === "string" ? entry.appId : "",
        scope: entry.scope === "group" ? "group" : "c2c",
        openid: String(entry.openid ?? ""),
        type: entry.type === "interval" ? "interval" : "daily",
        time: String(entry.time ?? ""),
        minutes: Number(entry.minutes ?? 30),
        mode: entry.mode === "ai" ? "ai" : "text",
        content: String(entry.content ?? ""),
      },
      editError: "",
      saving: false,
    } : prev));
  };

  const setEditField = (key: string, value: unknown) => {
    setScheduleModal((prev) => (prev?.editing ? { ...prev, editError: "", editing: { ...prev.editing, [key]: value } } : prev));
  };

  const saveScheduleEdit = async () => {
    const e = scheduleModal?.editing;
    if (!e) return;
    // 前端先做一轮与宿主一致的校验，及时给出可读提示。
    if (!String(e.openid ?? "").trim()) {
      setScheduleModal((prev) => (prev ? { ...prev, editError: "请填写接收方 openid（群或用户）" } : prev));
      return;
    }
    if (!String(e.content ?? "").trim()) {
      setScheduleModal((prev) => (prev ? { ...prev, editError: "内容不能为空" } : prev));
      return;
    }
    if (e.type === "daily" && !/^\d{1,2}:\d{2}$/.test(String(e.time ?? ""))) {
      setScheduleModal((prev) => (prev ? { ...prev, editError: "时间格式应为 HH:mm（如 09:30）" } : prev));
      return;
    }
    if (e.type === "interval" && !(Number(e.minutes) >= 5)) {
      setScheduleModal((prev) => (prev ? { ...prev, editError: "间隔不能小于 5 分钟" } : prev));
      return;
    }
    setScheduleModal((prev) => (prev ? { ...prev, saving: true, editError: "" } : prev));
    const payload: Record<string, unknown> = {
      id: e.id,
      scope: e.scope,
      openid: String(e.openid ?? "").trim(),
      type: e.type,
      content: String(e.content ?? "").trim(),
      mode: e.mode,
      ...(e.type === "daily" ? { time: String(e.time ?? "").trim() } : { minutes: Number(e.minutes) }),
      ...(e.appId ? { appId: e.appId } : (detailAppId ? { appId: detailAppId } : {})),
    };
    const res = await rpcCall("schedule.add", payload);
    if (res.ok) {
      setScheduleModal((prev) => (prev ? { ...prev, editing: null, saving: false } : prev));
      await loadSchedules(scheduleModal?.botScope ?? "current");
    } else {
      setScheduleModal((prev) => (prev ? { ...prev, saving: false, editError: errText(res.error) } : prev));
    }
  };

  const removeSchedule = async (id: string) => {
    if (!window.confirm(localizeText("确定删除这条定时消息？删除后立即停止发送。"))) return;
    setScheduleRemoving(id);
    const scopeNow = scheduleModal?.botScope ?? "current";
    try {
      const res = await rpcCall("schedule.remove", { id });
      if (res.ok) await loadSchedules(scopeNow);
      else setScheduleModal((prev) => (prev ? { ...prev, error: errText(res.error) } : prev));
    } finally {
      setScheduleRemoving("");
    }
  };

  // ── 消息归档弹窗（archive.list，只读最近记录；按当前详情机器人过滤） ──────────
  const [archiveModal, setArchiveModal] = React.useState<{
    loading: boolean;
    error: string;
    records: Array<Record<string, any>>;
    moreAvailable: boolean;
    monthsRead: number;
  } | null>(null);

  const loadArchive = async () => {
    setArchiveModal((prev) => (prev ? { ...prev, loading: true, error: "" } : prev));
    const res = await rpcCall("archive.list", detailAppId ? { appId: detailAppId, limit: 120 } : { limit: 120 });
    if (res.ok) {
      const v = val(res) ?? {};
      setArchiveModal({
        loading: false,
        error: "",
        records: Array.isArray(v.records) ? v.records : [],
        moreAvailable: Boolean(v.moreAvailable),
        monthsRead: Number(v.monthsRead ?? 0),
      });
    } else {
      setArchiveModal((prev) => (prev ? { ...prev, loading: false, error: errText(res.error) } : prev));
    }
  };

  const openArchiveModal = () => {
    setArchiveModal({ loading: true, error: "", records: [], moreAvailable: false, monthsRead: 0 });
    void loadArchive();
  };

  /** 定时消息编辑表单行：标签 + 控件 + 提示（提示写清「怎么填、影响什么」）。 */
  const scheduleField = (label: string, hint: string, control: any) =>
    h("div", { className: "qbot-editRow" },
      h("span", { className: "qbot-editLabel" }, label),
      control,
      h("span", { className: "qbot-editHint" }, hint));

  // ── 下拉选项 ────────────────────────────────────────────────────────────────
  /** 模型按供应商分组（group 顺序即服务端返回顺序）；无 id 的脏数据直接过滤。 */
  const modelGroups = (): Array<{ label: string; options: Option[] }> => {
    const groups: Array<{ label: string; options: Option[] }> = [];
    const index = new Map<string, number>();
    for (const m of catalogs.models) {
      if (!m || typeof m.id !== "string" || !m.id) continue;
      const slash = m.id.indexOf("/");
      const label = String(m.group ?? (slash > 0 ? m.id.slice(0, slash) : "模型"));
      const option: Option = { value: m.id, label: typeof m.label === "string" && m.label ? m.label : m.id };
      const at = index.get(label);
      if (at === undefined) {
        index.set(label, groups.length);
        groups.push({ label, options: [option] });
      } else {
        groups[at].options.push(option);
      }
    }
    return groups;
  };

  const presetOptions = (list: Array<{ id: string; label: string }>): Option[] => [
    { value: "", label: "跟随 Host 默认" },
    ...list
      .filter((p) => p && typeof p.id === "string" && p.id)
      .map((p) => ({ value: p.id, label: typeof p.label === "string" && p.label ? p.label : p.id })),
  ];

  /** 数值候选 → 下拉选项；当前值不在候选中时并入。 */
  const withCurrent = (candidates: number[], current: unknown, labelFn?: (n: number) => string): Option[] => {
    const list = candidates.map((n) => ({ value: String(n), label: labelFn ? labelFn(n) : String(n) }));
    const cur = Number(current);
    if (Number.isSafeInteger(cur) && !candidates.includes(cur)) {
      list.unshift({ value: String(cur), label: labelFn ? labelFn(cur) : String(cur) });
    }
    return list;
  };

  /** 数值下拉：变更即保存热生效（config.save 会同步替换内存配置并落盘）。 */
  const numSelect = (key: string, candidates: number[], labelFn?: (n: number) => string) =>
    SettingRow({
      label: FIELD_LABELS[key] ?? key,
      desc: FIELD_HELP[key] ?? "",
      control: h("select", {
        className: "qbot-settingSelect",
        value: String(form[key] ?? ""),
        onChange: (event: any) => void saveField(key, Number(event?.target?.value)),
        "aria-label": FIELD_LABELS[key] ?? key,
      }, withCurrent(candidates, form[key], labelFn).map((o) =>
        h("option", { key: o.value, value: o.value }, o.label))),
    });

  // ── 机器人状态 ──────────────────────────────────────────────────────────────
  const detailBot = React.useMemo(
    () => bots?.bots.find((b) => b.appId === detailAppId) ?? null,
    [bots, detailAppId],
  );
  const botState = (bot: BotInfo): { tone: "success" | "warning" | "error" | "neutral"; text: string } => {
    if (!bot.enabled) return { tone: "neutral", text: "已停用" };
    return bot.ws?.state === "connected"
      ? { tone: "success", text: "已连接" }
      : bot.ws?.state === "connecting"
        ? { tone: "warning", text: "正在连接" }
        : { tone: "error", text: "未连接" };
  };

  const globalBadge = (() => {
    const all = bots?.bots ?? [];
    const primary = all.find((b) => b.primary);
    const anyConnected = all.some((b) => b.ws?.state === "connected");
    if (primary?.ws?.state === "connected") return OnlineBadge({ tone: "success", text: "主机器人已连接" });
    if (anyConnected) return OnlineBadge({ tone: "warning", text: "部分机器人已连接" });
    if (all.length) return OnlineBadge({ tone: "error", text: "全部未连接" });
    return OnlineBadge({ tone: "neutral", text: "未配置机器人" });
  })();

  // ═══ 列表视图（panel 内容） ════════════════════════════════════════════════
  const listView = h("div", { className: "qbot-channelPage" },
    loadError ? h("div", { className: "qbot-statusNotice", role: "alert" }, loadError) : null,
    notice ? h("div", { className: "qbot-infoNotice" }, notice) : null,
    h("div", { className: "qbot-listHeading" },
      h("h3", null, `已配置机器人（${bots?.bots.length ?? 0}）`),
      h("button", {
        className: "qbot-btn qbot-btnPrimary", type: "button",
        onClick: () => { setAddTab("qr"); setQr(null); setNotice(""); setPage("add"); },
      }, "＋ 添加机器人")),
    h("div", { className: "qbot-botList" },
      (bots?.bots ?? []).map((bot) => {
        const st = botState(bot);
        return h("button", {
          key: bot.appId,
          type: "button",
          className: "qbot-botCard",
          onClick: () => { setDetailAppId(bot.appId); setNotice(""); setPage("detail"); },
        },
          h("div", { className: "qbot-botCardBody" },
            h("div", { className: "qbot-botTop" },
              h("div", { className: "qbot-botIdentity" },
                h("span", { className: "qbot-botAvatar", "aria-hidden": "true" }, h(QqLogoGlyph)),
                h("div", { className: "qbot-botName" },
                  h("h3", null, bot.appIdMasked),
                  h("p", null, `${bot.source === "qr" ? "扫码接入" : "手动填写"} · 保存于 ${formatTime(bot.savedAt)}`))),
              h("div", { className: "qbot-botTools" },
                h("div", { className: "qbot-botHealthGroup" },
                  StateLabel({ tone: st.tone, text: st.text }),
                  h("span", { className: "qbot-lastChecked" }, bot.primary ? "主机器人" : (bot.enabled ? "已启用" : "已停用")))),
            h("div", { className: "qbot-botChevron", "aria-hidden": "true" }))));
      }),
      (bots?.bots.length ?? 0) === 0
        ? h("div", { className: "qbot-surfaceCard" },
            h("div", { className: "qbot-surfaceBody qbot-emptyView" },
              h("div", { className: "qbot-emptyBrand", "aria-hidden": "true" }, h(QqLogoGlyph)),
              h("div", { className: "qbot-emptyCopy" },
                h("h3", null, "还没有配置成功的机器人"),
                h("p", null, "点击上方「＋ 添加机器人」，用手机 QQ 扫码，或手动填写 AppID / AppSecret。配置成功后即可在详情中设置行为参数。"))))
        : null,
      h("p", { className: "qbot-hint" }, "点击机器人卡片可进入详情：查看 QQ 连接状态、调整行为配置。")));

  // ═══ 添加视图（panel 内容，分段 Tab：扫码 | 手动） ══════════════════════════
  // 文案原则：只写界面/服务端真实具备的能力（生成二维码 → 扫码 → 自动落盘 → 跳转详情），
  // 不写未接入的入口（如终端 CLI 命令，本包未注册 bin）。
  const QR_DURATION_MS = 5 * 60_000;
  const qrRemaining = qr?.status === "pending" && qr?.expiresAt ? Math.max(0, qr.expiresAt - now) : 0;
  const qrProgress = Math.round(Math.min(1, qrRemaining / QR_DURATION_MS) * 100);
  const qrPending = qr?.status === "pending";
  /** pending 但图片还没到位：SDK 正在自动换下一张。 */
  const qrRefreshing = qrPending && !qr?.qrCodeDataUrl;

  /**
   * 引导块：小标题 + 编号步骤（每步「动作 + 一句说明」）。
   * 构成页面第二层层次，避免长段文字糊在一起。
   */
  const guideBlock = (title: string, steps: Array<{ title: string; desc: string }>) =>
    h("div", { className: "qbot-guideBlock" },
      h("span", { className: "qbot-guideTitle" }, title),
      h("ol", { className: "qbot-steps is-rich" },
        steps.map((s) => h("li", { key: s.title },
          h("strong", null, s.title),
          h("span", null, s.desc)))));

  /** 补充说明：只陈述真实行为（落盘位置、生效时机、限制），不承诺未实现的能力。 */
  const noteList = (notes: string[]) =>
    h("div", { className: "qbot-noteList" },
      h("span", { className: "qbot-noteTitle" }, "说明"),
      h("ul", null, notes.map((n, i) => h("li", { key: i }, n))));

  const qrStatusText = qr?.status === "success" ? "绑定成功"
    : qr?.status === "failure" ? "扫码失败"
      : qrRefreshing ? "正在刷新二维码"
        : qrPending ? "等待手机 QQ 扫码"
          : "二维码未生成";
  const qrStatusTone = qr?.status === "success" ? "success"
    : qr?.status === "failure" ? "error"
      : qrPending ? "warning"
        : "neutral";

  const qrPane = h("section", { className: "qbot-surfaceCard" },
    h("div", { className: "qbot-surfaceBody qbot-qrLayout" },
      h("div", { className: "qbot-qrColumn" },
        h("div", { className: "qbot-qrFrame" },
          qr?.qrCodeDataUrl
            ? h("img", { src: qr.qrCodeDataUrl, alt: "用于绑定 QQ 机器人的一次性二维码" })
            : h("div", { className: "qbot-qrPlaceholder" },
                h("span", { className: "qbot-qrPlaceholderIcon", "aria-hidden": "true" }, h(QqLogoGlyph)),
                h("strong", null, qrRefreshing ? "正在刷新二维码…" : "还没有生成二维码"),
                h("span", { className: "qbot-qrPlaceholderHint" },
                  qrRefreshing ? "几秒后会自动出现新的一张" : "点击下方「生成二维码」开始"))),
        h("div", { className: "qbot-countdown" },
          h("div", { className: "qbot-countdownTop" },
            h("span", null, "二维码有效时间"),
            h("strong", null, qrPending && qr?.qrCodeDataUrl ? formatRemaining(qrRemaining) : "--:--")),
          h("div", { className: "qbot-progress", style: { "--qbot-progress": `${qrProgress}%` } as any }, h("span"))),
        h("div", { className: "qbot-qrActions" },
          h("button", { className: "qbot-btn qbot-btnPrimary", type: "button", onClick: startQr },
            qrPending ? "重新生成二维码" : "生成二维码"),
          qrPending
            ? h("button", { className: "qbot-btn", type: "button", onClick: cancelQr }, "取消扫码")
            : null)),
      h("div", { className: "qbot-qrCopy" },
        StateLabel({ tone: qrStatusTone, text: qrStatusText }),
        h("h3", null, "手机 QQ 扫码接入"),
        h("p", { className: "qbot-qrLead" },
          "推荐方式。扫码后 QQ 会把机器人的 AppID 与 AppSecret 直接下发给本机 dsh，不需要手动复制，保存后立即生效。"),
        guideBlock("操作步骤", [
          { title: "生成二维码", desc: "点击二维码下方的「生成二维码」，出现二维码后开始 5 分钟倒计时。" },
          { title: "手机 QQ 扫一扫", desc: "打开手机 QQ，从右上角「＋」菜单进入「扫一扫」，扫描这张二维码。" },
          { title: "在 QQ 里确认绑定", desc: "按 QQ 页面提示完成确认，把这个机器人授权给本机 dsh 使用。" },
          { title: "等待自动跳转", desc: "本页每 2 秒检查一次结果，绑定成功后会自动进入机器人详情页。" },
        ]),
        qr?.status === "failure" ? h("p", { className: "qbot-qrError" }, qr.error ?? "扫码失败") : null,
        noteList([
          "二维码 5 分钟内有效；过期后会自动换一张新的，不需要手动刷新页面。",
          "扫码期间请保持本设置页打开，关闭页面会中断等待。",
          "凭据会写入 ~/.dsh/qqbot/credentials.json（仅当前用户可读），写入后立即生效，不需要重启 dsh。",
        ]))));

  const manualPane = h("section", { className: "qbot-surfaceCard" },
    h("div", { className: "qbot-surfaceBody qbot-manualPanel" },
      h("div", { className: "qbot-copyHead" },
        h("h3", null, "手动填写 AppID / AppSecret"),
        h("p", null, "适合已经在 QQ 开放平台创建过机器人的情况：先从开放平台把凭据复制出来，再回到这里填写保存。")),
      guideBlock("第 1 步 · 在 QQ 开放平台取得凭据", [
        { title: "打开 QQ 开放平台", desc: "浏览器访问 q.qq.com，用 QQ 登录。" },
        { title: "选择机器人", desc: "在机器人列表里点开要接入的机器人；还没有的话先创建一个。" },
        { title: "复制 AppID 与 AppSecret", desc: "进入该机器人的「开发设置」页面，复制 AppID（机器人 ID）与 AppSecret（机器人密钥）。" },
      ]),
      h("div", { className: "qbot-guideBlock" },
        h("span", { className: "qbot-guideTitle" }, "第 2 步 · 填到这里并保存"),
        h("div", { className: "qbot-credentialForm" },
          Field({ label: "AppID" },
            TextInput({
              value: manual.appId,
              placeholder: "机器人 ID",
              onChange: (e: any) => setManual({ ...manual, appId: e.target.value }),
            })),
          Field({ label: "AppSecret" },
            TextInput({
              type: "password",
              value: manual.appSecret,
              placeholder: "开发设置里的机器人密钥",
              onChange: (e: any) => setManual({ ...manual, appSecret: e.target.value }),
            }))),
        h("div", { className: "qbot-credentialActions" },
          h("button", { className: "qbot-btn qbot-btnPrimary", type: "button", onClick: saveManual }, "保存并启用"))),
      noteList([
        "保存后凭据写入 ~/.dsh/qqbot/credentials.json（权限 0600），立即生效，并自动设为当前使用的机器人。",
        "这里不会校验凭据是否正确。保存后请到机器人详情看「连接状态」：显示「运行正常」才是接通；未就绪就点「重试连接」。",
        "消息接收走 WebSocket 长连接，开放平台不需要填回调地址；但机器人回复要走 OpenAPI，需要把本机出口 IP 加进开放平台的 IP 白名单。",
        "AppSecret 保存后不再回显；需要更换时重新填一次保存即可覆盖。",
      ])));

  const addView = h("div", { className: "qbot-channelPage qbot-addView" },
    notice ? h("div", { className: "qbot-infoNotice" }, notice) : null,
    h("div", { className: "qbot-addNav" },
      h("button", { className: "qbot-btn", type: "button", onClick: () => { setPage("list"); setQr(null); } }, "← 返回列表")),
    h("header", { className: "qbot-addHead" },
      h("h2", null, "添加机器人"),
      h("p", null,
        "两种方式任选其一：扫码由 QQ 自动下发凭据；手动填写需要你先去 QQ 开放平台复制 AppID / AppSecret。接入成功后凭据立即生效，并自动成为当前使用的机器人。")),
    h("div", { className: "qbot-segTabs", role: "tablist" },
      h("button", {
        type: "button", role: "tab", "aria-selected": addTab === "qr",
        onClick: () => setAddTab("qr"),
      }, "扫码接入"),
      h("button", {
        type: "button", role: "tab", "aria-selected": addTab === "manual",
        onClick: () => setAddTab("manual"),
      }, "手动填写")),
    addTab === "qr" ? qrPane : manualPane);

  type Tone = "success" | "warning" | "error" | "neutral";

  const wsInfo = detailBot ? {
    state: String(detailBot.ws?.state ?? "idle"),
    lastConnectedAt: typeof detailBot.ws?.lastConnectedAt === "number" ? detailBot.ws.lastConnectedAt : null,
    lastError: typeof detailBot.ws?.lastError === "string" ? detailBot.ws.lastError : null,
  } : null;
  const connState: { tone: Tone; text: string } = !detailBot
    ? { tone: "neutral", text: "未配置" }
    : detailBot.ws?.state === "connected" ? { tone: "success", text: "运行正常" }
      : wsInfo?.state === "connecting" ? { tone: "warning", text: "正在连接" }
        : { tone: "error", text: "连接未就绪" };
  const lastChecked = wsInfo?.lastConnectedAt
    ? formatTime(wsInfo.lastConnectedAt)
    : "尚未检查";
  const cardSummary = notice
    || (detailBot && detailBot.ws?.state !== "connected"
      ? (wsInfo?.lastError ? `QQ 连接未就绪：${wsInfo.lastError}。插件会自动重试。` : "QQ 连接未就绪，插件会自动重试。")
      : "");

  /** WebSocket 内部状态 → 中文标签，避免把 idle/connecting 之类原样丢给用户。 */
  const WS_LABELS: Record<string, string> = {
    idle: "空闲",
    connecting: "连接中",
    connected: "已连接",
    reconnecting: "重连中",
    closed: "已断开",
    error: "异常",
  };
  const wsLabel = wsInfo ? (WS_LABELS[wsInfo.state] ?? wsInfo.state) : "—";
  const wsTone: Tone =
    wsInfo?.state === "connected" ? "success"
      : wsInfo?.state === "connecting" || wsInfo?.state === "reconnecting" ? "warning"
        : wsInfo?.state === "closed" || wsInfo?.state === "error" ? "error"
          : "neutral";

  /**
   * 分区卡片：标题 + 一句说明 + 主体 + 右上角操作，构成页面的第一层层次。
   * opts.open=false 时默认收起（用原生 details/summary，展开状态由浏览器保持，
   * 表单保存触发的重渲染不会重置折叠状态）。
   */
  const sectionCard = (title: string, desc: string, body: any, action?: any, opts?: { open?: boolean; danger?: boolean }) =>
    h("details", {
        className: opts?.danger ? "qbot-section is-danger" : "qbot-section",
        open: opts?.open ?? true,
      },
      h("summary", { className: "qbot-sectionHead" },
        h("div", { className: "qbot-sectionTitle" },
          h("h3", null, title),
          h("p", null, desc)),
        action ? h("div", { className: "qbot-sectionAction", onClick: (e: any) => e.stopPropagation() }, action) : null,
        h("span", { className: "qbot-sectionChevron", "aria-hidden": "true" }, "▸")),
      h("div", { className: "qbot-sectionBody" }, body));

  /** 指标卡：用于运行统计，比裸表格更易扫读。 */
  const metricCard = (label: string, value: string, tone: Tone) =>
    h("div", { className: "qbot-metric", "data-tone": tone, key: label },
      h("span", { className: "qbot-metricLabel" }, label),
      h("strong", { className: "qbot-metricValue" }, value));

  const metrics: Array<{ label: string; value: string; tone: Tone }> = detailBot
    ? (() => {
        const c = detailBot.counters ?? { received: 0, sessions: 0, replies: 0, proactive: 0, errors: 0 };
        const buffered = Array.isArray(detailBot.groupBuffers)
          ? detailBot.groupBuffers.reduce((n: number, b: any) => n + Number(b?.buffered ?? 0), 0)
          : 0;
        const errors = Number(c.errors ?? 0);
        const pending = Number(detailBot.pendingReplies ?? 0);
        return [
          { label: "收到消息", value: String(c.received ?? 0), tone: "neutral" as Tone },
          { label: "创建会话", value: String(c.sessions ?? 0), tone: "neutral" as Tone },
          { label: "被动回复", value: String(c.replies ?? 0), tone: "success" as Tone },
          { label: "主动消息", value: String(c.proactive ?? 0), tone: "neutral" as Tone },
          { label: "绑定会话", value: String(detailBot.boundSessions ?? 0), tone: "neutral" as Tone },
          { label: "待回复队列", value: String(pending), tone: (pending > 0 ? "warning" : "neutral") as Tone },
          { label: "群消息缓冲", value: String(buffered), tone: "neutral" as Tone },
          { label: "错误", value: String(errors), tone: (errors > 0 ? "error" : "neutral") as Tone },
        ];
      })()
    : [];

  const detailView = h("div", { className: "qbot-channelPage" },
    // ── 顶部导航：返回 + 页面标题 ──
    h("div", { className: "qbot-detailNav" },
      h("button", { className: "qbot-btn", type: "button", onClick: () => { setPage("list"); setNotice(""); } }, "← 返回列表"),
      h("div", { className: "qbot-detailNavTitle" },
        h("h3", null, "机器人详情"),
        h("span", null, "连接状态 · 行为配置 · 运行统计"))),
    loadError ? h("div", { className: "qbot-statusNotice", role: "alert" }, loadError) : null,

    // ── 概览：机器人身份 + 连接状态 ──
    h("section", { className: "qbot-hero" },
      h("div", { className: "qbot-heroMain" },
        h("span", { className: "qbot-heroAvatar", "aria-hidden": "true" }, h(QqLogoGlyph)),
        h("div", { className: "qbot-heroIdentity" },
          h("div", { className: "qbot-heroNameRow" },
            h("h2", null, detailBot ? detailBot.appIdMasked : "未选择机器人"),
            detailBot
              ?               h("span", { className: `qbot-chip${detailBot.primary ? " is-active" : ""}` },
                  detailBot.primary ? "主机器人" : (detailBot.enabled ? "已启用" : "已停用"))
              : null),
          h("div", { className: "qbot-heroMeta" },
            h("span", null, detailBot ? (detailBot.source === "qr" ? "扫码接入" : "手动填写") : "—"),
            h("span", { className: "qbot-metaDot", "aria-hidden": "true" }),
            h("span", null, detailBot ? `保存于 ${formatTime(detailBot.savedAt)}` : "—"))),
        h("div", { className: "qbot-heroActions" },
          h("button", {
            className: "qbot-btn", type: "button",
            disabled: !detailBot,
            onClick: openScheduleModal,
          }, "定时消息"),
          h("button", {
            className: "qbot-btn", type: "button",
            disabled: !detailBot,
            onClick: openArchiveModal,
          }, "消息归档"))),
      h("div", { className: "qbot-heroStats" },
        h("div", { className: "qbot-heroStat" },
          h("span", { className: "qbot-heroStatLabel" }, "连接状态"),
          h("div", { className: "qbot-heroStatValue" },
            h("span", { className: "qbot-stateDot", "data-tone": connState.tone }),
            h("strong", null, connState.text))),
        h("div", { className: "qbot-heroStat" },
          h("span", { className: "qbot-heroStatLabel" }, "WebSocket"),
          h("div", { className: "qbot-heroStatValue" },
            h("span", { className: "qbot-stateDot", "data-tone": wsTone }),
            h("strong", null, wsLabel))),
        h("div", { className: "qbot-heroStat" },
          h("span", { className: "qbot-heroStatLabel" }, "最近连接"),
          h("div", { className: "qbot-heroStatValue" }, h("strong", null, lastChecked)))),
      cardSummary ? h("div", { className: "qbot-heroFoot", role: "status" }, cardSummary) : null),

    // ── 运行统计 ──
    status
      ? sectionCard("运行统计", "本次 Host 启动以来的累计计数；数值不会自动刷新，需要时点「刷新」。",
          h("div", { className: "qbot-metricGrid" },
            metrics.map((m) => metricCard(m.label, m.value, m.tone))),
          h("button", {
            className: "qbot-btn", type: "button",
            disabled: refreshing,
            onClick: () => void refreshStats(),
          }, refreshing ? "刷新中…" : "刷新"), { open: false })
      : null,

    // ── 会话与模型 ──
    sectionCard("会话与模型", "决定这个机器人以什么身份、在哪个目录、用哪个模型干活；每个机器人彼此独立，改动只对之后新建的会话生效。",
      h("div", { className: "qbot-settingList" },
        // 工作区：路径较长，独占一行展示
        h("div", { className: "qbot-workspaceCard" },
          h("div", { className: "qbot-workspaceCardHead" },
            h("div", { className: "qbot-settingCopy" },
              h("span", { className: "qbot-settingTitle" }, "工作区目录"),
              h("span", { className: "qbot-settingDesc" },
                "QQ 消息创建的会话都在这个目录里读写文件。留空则使用默认工作区；改动只对新建会话生效。")),
            h("button", { className: "qbot-btn", type: "button", onClick: openPicker }, "选择目录")),
          h("code", { className: "qbot-workspacePath", title: String(form.workspacePath ?? "") },
            String(form.workspacePath ?? "").trim() || "默认工作区（~/.dsh/file）")),
        SettingRow({
          label: "模型",
          desc: "这个机器人会话使用的模型；留空则跟随宿主默认模型。切换后已有会话需要重置才会生效。",
          control: h("select", {
            className: "qbot-settingSelect",
            value: String(form.model ?? ""),
            onChange: (e: any) => void saveField("model", e.target.value),
            "aria-label": "模型",
          },
            h("option", { value: "" }, "跟随默认模型"),
            modelGroups().map((g) => h("optgroup", { key: g.label, label: g.label },
              g.options.map((o) => h("option", { key: o.value, value: o.value }, o.label))))),
        }),
        SettingRow({
          label: "Agent Preset",
          desc: "决定机器人的行事风格与可用工具。@ 机器人和单聊消息都走这个 Preset；群里非 @ 的回复走聊天 Preset，不会执行工具。",
          control: h("select", {
            className: "qbot-settingSelect",
            value: String(form.agentPreset ?? ""),
            onChange: (e: any) => void saveField("agentPreset", e.target.value),
            "aria-label": "Agent Preset",
          }, presetOptions(catalogs.agentPresets).map((o) =>
            h("option", { key: o.value, value: o.value }, o.label))),
        }),
        SettingRow({
          label: "群聊聊天 Preset",
          desc: "群内非 @ 的全量消息（只聊天、不执行工具）使用的 Preset；留空则跟随上方 Agent Preset。用于让群全量回复风格与 @/单聊区分开。",
          control: h("select", {
            className: "qbot-settingSelect",
            value: String(form.agentPresetChat ?? ""),
            onChange: (e: any) => void saveField("agentPresetChat", e.target.value),
            "aria-label": "群聊聊天 Preset",
          },
            h("option", { value: "" }, "跟随 Agent Preset"),
            presetOptions(catalogs.agentPresets).map((o) =>
              h("option", { key: o.value, value: o.value }, o.label))),
        }),
        SettingRow({
          rowKey: "secretEnv",
          wide: true,
          label: "AppSecret 凭据引用（secretEnv）",
          desc: "DSH 凭据引用作为 AppSecret 的替代来源（优先级高于明文 AppSecret）。填写后机器人在运行时凭此引用解析出真实密钥，无需在开放平台明文保存。留空则使用扫码/手动填写的 AppSecret。",
          control: TextArea({
            rows: 2,
            className: "qbot-textarea qbot-mono",
            defaultValue: String(form.secretEnv ?? ""),
            placeholder: "如 my-qq-app-secret（留空不启用）",
            onBlur: (e: any) => {
              const value = String(e?.target?.value ?? "").trim();
              if (value !== String(form.secretEnv ?? "")) void saveField("secretEnv", value);
            },
            "aria-label": "AppSecret 凭据引用",
          }),
        }))),

    // ── 消息与回复策略（开关） ──
    sectionCard("消息与回复策略", "控制这个机器人「听哪些消息、怎么回」，每个机器人彼此独立。所有开关改完立即生效，不需要重启。",
      h("div", { className: "qbot-settingList" },
        SWITCH_DEFS.map((it) => SettingRow({
          rowKey: it.key,
          label: it.label,
          desc: it.desc,
          control: h("input", {
            type: "checkbox",
            className: "qbot-switch",
            checked: Boolean(form[it.key] ?? it.def),
            onChange: (e: any) => void saveField(it.key, e.target.checked),
            "aria-label": it.label,
          }),
        })),
        SettingRow({
          rowKey: "quoteReply",
          label: "回复引用原话",
          desc: "仅群聊生效，单聊一律不引用：群里回复以 QQ 原生引用卡片回应（message_reference），卡片可点击定位到用户那条原消息。注意：引用卡片与 Markdown 同时携带时，部分场景平台会剥离 Markdown 改为纯文本（卡片保留），这是 QQ 平台限制；若想保住 Markdown 排版请选 off。off=不引用；at=仅群 @ 回复（避免群全量刷屏，推荐）；all=群聊全部回复都引用。此外，用户引用聊天里某条消息时，被引用的原文会始终注入模型上下文，让它知道对方在回应什么。",
          control: h("select", {
            className: "qbot-settingSelect",
            value: String(form.quoteReply ?? "at"),
            onChange: (e: any) => void saveField("quoteReply", e.target.value),
            "aria-label": "回复引用原话范围",
          },
            h("option", { value: "off" }, "off（不引用）"),
            h("option", { value: "at" }, "at（仅群 @，推荐）"),
            h("option", { value: "all" }, "all（群聊全部回复）")),
        }),
        SettingRow({
          rowKey: "voiceTranscription",
          label: "语音消息处理",
          desc: "收到语音消息时如何处理：off=忽略；note=使用平台自带的转写文本（推荐，无转写时显示占位）；download=把音频地址注入上下文；asr=调用下方自定义转写服务（POST {url} → {text}）。",
          control: h("select", {
            className: "qbot-settingSelect",
            value: String(form.voiceTranscription ?? "note"),
            onChange: (e: any) => void saveField("voiceTranscription", e.target.value),
            "aria-label": "语音消息处理方式",
          },
            h("option", { value: "off" }, "off（忽略语音）"),
            h("option", { value: "note" }, "note（平台转写，推荐）"),
            h("option", { value: "download" }, "download（注入音频地址）"),
            h("option", { value: "asr" }, "asr（自定义转写服务）")),
        }),
        SettingRow({
          rowKey: "asrEndpoint",
          wide: true,
          label: "自定义转写服务",
          desc: "voiceTranscription=asr 时使用的 HTTP 服务地址：机器人 POST { url: <音频地址> }，服务返回 { text: <转写文本> }。留空则回退为占位说明。",
          control: TextArea({
            rows: 2,
            className: "qbot-textarea qbot-mono",
            defaultValue: String(form.asrEndpoint ?? ""),
            placeholder: "https://…（留空不启用）",
            onBlur: (e: any) => {
              const value = String(e?.target?.value ?? "").trim();
              if (value !== String(form.asrEndpoint ?? "")) void saveField("asrEndpoint", value);
            },
            "aria-label": "自定义转写服务地址",
          }),
        }),
        SettingRow({
          rowKey: "replyLocale",
          label: "回复语言（replyLocale）",
          desc: "机器人直接发给 QQ 用户的系统文案（/help、/status、定时消息用法、欢迎语等）使用的语言。中文为源语言；选择 English 时这些文案自动翻译为英文，未命中的内容保持原文不丢信息。AI 对话内容本身不受影响。",
          control: h("select", {
            className: "qbot-settingSelect",
            value: String(form.replyLocale ?? "zh"),
            onChange: (e: any) => void saveField("replyLocale", e.target.value),
            "aria-label": "回复语言",
          },
            h("option", { value: "zh" }, "中文（默认）"),
            h("option", { value: "en" }, "English")),
        }),
        SettingRow({
          rowKey: "welcomeMessage",
          wide: true,
          label: "欢迎语文案",
          desc: "开启「欢迎语」后发送的内容；{nick} 会替换为新成员标识。留空使用默认文案「欢迎 {nick}！@我即可与我对话。」。",
          control: TextArea({
            rows: 3,
            defaultValue: String(form.welcomeMessage ?? ""),
            placeholder: "欢迎 {nick}！@我即可与我对话。",
            onBlur: (e: any) => {
              const value = String(e?.target?.value ?? "").trim();
              if (value !== String(form.welcomeMessage ?? "")) void saveField("welcomeMessage", value);
            },
            "aria-label": "欢迎语文案",
          }),
        }),
        SettingRow({
          rowKey: "bannedWords",
          wide: true,
          label: "敏感词列表",
          desc: "逗号分隔。群消息包含其中任意一词时，机器人撤回该消息并跳过回复（需要消息撤回权限；无权限时仅拦截回复）。",
          control: TextArea({
            rows: 3,
            defaultValue: Array.isArray(form.bannedWords) ? (form.bannedWords as string[]).join(", ") : "",
            placeholder: "词1, 词2（留空不启用）",
            onBlur: (e: any) => {
              const words = String(e?.target?.value ?? "").split(/[,，]/).map((w) => w.trim()).filter(Boolean);
              void saveField("bannedWords", words);
            },
            "aria-label": "敏感词列表",
          }),
        }))),

    // ── 回复调优（数值） ──
    sectionCard("回复调优", "调节这个机器人「回得多不多、切得多碎」，每个机器人彼此独立。改完立即生效，建议先按默认值跑一段时间再微调。",
      h("div", { className: "qbot-settingList" },
        numSelect("valueThreshold", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (n) => (n === 0 ? "0（全部回复）" : `${n} 分`)),
        numSelect("atContextMessages", [0, 2, 4, 6, 8, 10, 15, 20, 30, 50], (n) => (n === 0 ? "0（关闭）" : `${n} 条`)),
        numSelect("groupCooldownMs", COOLDOWN_OPTIONS, cooldownLabel),
        numSelect("senderCooldownMs", COOLDOWN_OPTIONS, cooldownLabel),
        numSelect("replyChunkChars", [200, 300, 500, 800, 1000, 1500, 2000, 3000, 4000]),
        numSelect("maxRepliesPerMessage", [1, 2, 3, 4, 5]),
        numSelect("quoteMaxChars", [40, 60, 80, 100, 120, 160, 200, 300, 500], (n) => `${n} 字`),
        numSelect("quotaPerDay", [0, 10, 20, 30, 50, 100, 200, 500], (n) => (n === 0 ? "0（不限）" : `${n} 条/天`))),
      undefined, { open: false }),

    // ── 连接与移除 ──
    sectionCard("连接与移除", "管理机器人的启用状态、设为主机器人、重建 QQ 长连接，或删除接入配置。",
      h("div", { className: "qbot-settingList" },
          detailBot
            ? SettingRow({
                label: detailBot.enabled ? "停用此机器人" : "启用此机器人",
                desc: "停用的机器人不会建立 QQ 长连接，也不会接收或回复消息；其它已启用的机器人不受影响。",
                control: h("button", {
                  className: "qbot-btn", type: "button",
                  disabled: detailBot.primary,
                  onClick: () => void toggleEnabled(detailBot, !detailBot.enabled),
                }, detailBot.enabled ? "停用" : "启用"),
              })
            : null,
          detailBot && !detailBot.primary
            ? SettingRow({
                label: "设为主机器人",
                desc: "未显式指定机器人时（配置编辑、主动消息、定时任务），默认作用于主机器人。所有「已启用」的机器人都会同时接收并回复消息。",
                control: h("button", {
                  className: "qbot-btn", type: "button",
                  onClick: () => void setPrimaryBot(detailBot.appId),
                }, "设为主机器人"),
              })
            : null,
          SettingRow({
            label: detailBot?.ws?.state === "connected" ? "检查连接" : "重试连接",
            desc: "按当前凭据重新建立 QQ WebSocket 长连接。收不到消息时先点它排查。",
            control: h("button", {
              className: "qbot-btn", type: "button",
              disabled: reconnecting || !detailBot,
              onClick: () => void retryConnection(),
            }, reconnecting ? "检查中…" : detailBot?.ws?.state === "connected" ? "检查连接" : "重试连接"),
          }),
          detailBot
            ? SettingRow({
                label: "移除接入",
                desc: "删除这个机器人的凭据与配置，删除后它会立刻停止接收消息，且无法撤销。",
                control: h("button", {
                  className: "qbot-btn qbot-btnDanger", type: "button",
                  onClick: () => void removeBot(detailBot),
                }, "移除接入"),
              })
            : null), undefined, { open: false, danger: true }));

  // ═══ 页面骨架：标题栏 + 面板（无左侧导航栏，导航由面板内按钮承担） ═══════════

  return h("section", { className: "qbot-page", "aria-label": "QQ 机器人设置" },
    h("header", { className: "qbot-title" },
      h("div", { className: "qbot-brand" },
        h(QqBotGlyph, { className: "qbot-brandGlyph", uid: "brand" }),
        h("div", { className: "qbot-brandText" },
          h("div", { className: "qbot-brandHeading" },
            h("strong", { className: "qbot-brandName" }, "QQ 机器人"),
            h("span", { className: "qbot-brandVersion" }, `v${typeof __PLUGIN_VERSION__ === "string" ? __PLUGIN_VERSION__ : "0.0.2"}`),
            h("button", {
              className: `qbot-btn qbot-updateBtn${update.done ? " is-done" : ""}`,
              type: "button",
              disabled: update.busy,
              title: "从 GitHub 检查新版本；发现新版本会自动下载并更新，重启 DSH 后生效",
              onClick: () => void runUpdateCheck(),
            }, update.busy ? "检查中…" : update.done ? "已更新 ✓" : "检查更新")),
          h("p", null, "把 QQ 机器人接入 DeepSeek Harness"))),
      h("div", { className: "qbot-titleActions" }, globalBadge)),
    update.message
      ? h("div", { className: "qbot-infoNotice qbot-updateNotice", role: "status" }, update.message)
      : null,
      h("div", { className: "qbot-panel", id: "qbot-panel" },
        page === "list" ? listView : page === "add" ? addView : detailView),
    picker
      ? h("div", { className: "qbot-modalOverlay" },
          h("div", { className: "qbot-modal", role: "dialog", "aria-modal": "true", "aria-label": "选择工作区目录" },
            h("div", { className: "qbot-modalHead" },
              h("div", null,
                h("strong", null, "选择工作区目录"),
                h("p", null, "逐级浏览并选定机器人读取文件的文件夹")),
              h("button", { className: "qbot-modalClose", type: "button", "aria-label": "关闭", onClick: () => setPicker(null) }, "×")),
            h("div", { className: "qbot-modalPath qbot-mono" },
              picker.loading
                ? "加载中…"
                : (picker.selected || picker.path || "—")),
            h("div", { className: `qbot-modalList${picker.loading && picker.dirs.length > 0 ? " is-refreshing" : ""}` },
              picker.error
                ? h("div", { className: "qbot-modalState qbot-modalError" }, picker.error)
                : picker.loading && picker.dirs.length === 0
                  ? h("div", { className: "qbot-modalState" }, h("span", { className: "qbot-spinner", "aria-hidden": "true" }), "正在读取目录…")
                  : [
                      picker.parent
                        ? h("button", { key: "__up", type: "button", className: "qbot-dirRow", onClick: () => void browseTo(picker.parent ?? undefined) },
                            h(FolderUpGlyph), "上一级")
                        : null,
                      picker.dirs.map((d) =>
                        h("button", {
                          key: d.path, type: "button",
                          className: `qbot-dirRow${picker.selected === d.path ? " is-selected" : ""}`,
                          title: "单击选中，双击进入",
                          onClick: () => setPicker((prev) => (prev ? { ...prev, selected: d.path } : prev)),
                          onDoubleClick: () => void browseTo(d.path),
                        },
                          h(FolderGlyph), d.name)),
                      !picker.loading && picker.dirs.length === 0
                        ? h("div", { className: "qbot-modalState" }, "该目录下没有子文件夹")
                        : null,
                    ]),
            h("div", { className: "qbot-modalFoot" },
              h("span", { className: "qbot-hint" }, "单击选中，双击进入；未选中时选定当前浏览的目录"),
              h("div", { className: "qbot-viewActions" },
                h("button", { className: "qbot-btn", type: "button", onClick: () => setPicker(null) }, "取消"),
                h("button", {
                  className: "qbot-btn qbot-btnPrimary", type: "button",
                  disabled: picker.loading || !picker.path,
                  onClick: pickDirectory,
                }, "选定此文件夹")))))
      : null,
    // ── 定时消息管理弹窗 ──
    scheduleModal
      ? h("div", { className: "qbot-modalOverlay" },
          h("div", { className: "qbot-modal qbot-modalWide", role: "dialog", "aria-modal": "true", "aria-label": "定时消息管理" },
            h("div", { className: "qbot-modalHead" },
              h("div", null,
                h("strong", null, "定时消息管理"),
                h("p", null, "这个机器人名下的全部定时发送任务（含聊天命令与 AI 设置的）")),
              h("button", { className: "qbot-modalClose", type: "button", "aria-label": "关闭", onClick: () => setScheduleModal(null) }, "×")),
            h("div", { className: `qbot-modalList${scheduleModal.loading && scheduleModal.items.length > 0 && !scheduleModal.editing ? " is-refreshing" : ""}` },
              scheduleModal.editing
                // ── 编辑视图：所有用户可设置的集中在上方，每项带提示 ──
                ? h("div", { className: "qbot-editForm" },
                    scheduleModal.editError
                      ? h("div", { className: "qbot-modalState qbot-modalError" }, scheduleModal.editError) : null,
                    scheduleField("发送范围", "发送到群聊还是单聊。改动范围后请确认下方 openid 与之匹配。",
                      h("select", {
                        className: "qbot-settingSelect", value: String(scheduleModal.editing.scope),
                        onChange: (ev: any) => setEditField("scope", ev.target.value),
                        "aria-label": "发送范围",
                      },
                        h("option", { value: "group" }, "群聊"),
                        h("option", { value: "c2c" }, "单聊"))),
                    scheduleField("接收方 openid", "接收消息的群或用户 openid（o 开头的长串）。机器人收到过该群/该用户消息后，可让 AI 用 /session 查到。",
                      TextInput({
                        className: "qbot-input qbot-mono", value: String(scheduleModal.editing.openid ?? ""),
                        placeholder: "群或用户的 openid",
                        onChange: (ev: any) => setEditField("openid", ev.target.value),
                        "aria-label": "接收方 openid",
                      })),
                    scheduleField("发送类型", "每天=到点每日发送一次；间隔=按分钟循环发送。",
                      h("select", {
                        className: "qbot-settingSelect", value: String(scheduleModal.editing.type),
                        onChange: (ev: any) => {
                          const type = ev.target.value;
                          setEditField("type", type);
                          if (type === "interval" && !(Number(scheduleModal?.editing?.minutes) >= 5)) setEditField("minutes", 30);
                        },
                        "aria-label": "发送类型",
                      },
                        h("option", { value: "daily" }, "每天（指定时刻）"),
                        h("option", { value: "interval" }, "间隔（循环分钟）"))),
                    scheduleModal.editing.type === "daily"
                      ? scheduleField("每天发送时间", "上海时间（UTC+8），24 小时制 HH:mm，例如 09:30。",
                          TextInput({
                            className: "qbot-input qbot-mono", value: String(scheduleModal.editing.time ?? ""),
                            placeholder: "09:30",
                            onChange: (ev: any) => setEditField("time", ev.target.value),
                            "aria-label": "每天发送时间",
                          }))
                      : scheduleField("间隔分钟", "两次发送之间的间隔分钟数，最小 5 分钟。间隔越小消耗的主动消息配额越多。",
                          h("select", {
                            className: "qbot-settingSelect", value: String(scheduleModal.editing.minutes ?? 30),
                            onChange: (ev: any) => setEditField("minutes", Number(ev.target.value)),
                            "aria-label": "间隔分钟",
                          },
                            [5, 10, 15, 30, 60, 120, 240, 720, 1440].map((n) =>
                              h("option", { key: n, value: String(n) }, n >= 60 && n % 60 === 0 ? `${n / 60} 小时` : `${n} 分钟`)))),
                    scheduleField("发送方式", "直接发送=到点原样发送下方内容；AI 生成=把下方内容作为指令交给 AI，生成结果再回复（会创建会话、消耗 token）。",
                      h("select", {
                        className: "qbot-settingSelect", value: String(scheduleModal.editing.mode ?? "text"),
                        onChange: (ev: any) => setEditField("mode", ev.target.value),
                        "aria-label": "发送方式",
                      },
                        h("option", { value: "text" }, "直接发送文本"),
                        h("option", { value: "ai" }, "AI 生成内容"))),
                    scheduleField("内容",
                      scheduleModal.editing.mode === "ai"
                        ? "给 AI 的生成指令（如「播报今天的天气」），到点由 AI 生成内容后发送。"
                        : "到点直接发送的文本，上限 2000 字。",
                      TextArea({
                        rows: 3, value: String(scheduleModal.editing.content ?? ""),
                        placeholder: scheduleModal.editing.mode === "ai" ? "例如：总结今天的待办" : "例如：记得喝水",
                        onChange: (ev: any) => setEditField("content", ev.target.value),
                        "aria-label": "定时消息内容",
                      })),
                    h("div", { className: "qbot-editActions" },
                      h("span", { className: "qbot-hint" }, scheduleModal.editing.appId && scheduleModal.editing.appId !== detailAppId
                        ? `该任务归属机器人 ${scheduleModal.editing.appId.slice(0, 4)}••••${scheduleModal.editing.appId.slice(-4)}`
                        : "保存后立即生效并重新计算下次发送时间"),
                      h("div", { className: "qbot-viewActions" },
                        h("button", { className: "qbot-btn", type: "button", disabled: scheduleModal.saving, onClick: () => setScheduleModal((prev) => (prev ? { ...prev, editing: null, editError: "" } : prev)) }, "取消"),
                        h("button", { className: "qbot-btn qbot-btnPrimary", type: "button", disabled: scheduleModal.saving, onClick: () => void saveScheduleEdit() }, scheduleModal.saving ? "保存中…" : "保存修改"))))
                // ── 列表视图 ──
                : [
                    // 范围 Tab：当前机器人 / 所有机器人
                    h("div", { key: "tabs", className: "qbot-schedTabs", role: "tablist" },
                      h("button", {
                        type: "button", role: "tab", "aria-selected": scheduleModal.botScope === "current",
                        className: `qbot-schedTab${scheduleModal.botScope === "current" ? " is-active" : ""}`,
                        onClick: () => switchScheduleScope("current"),
                      }, "当前机器人"),
                      h("button", {
                        type: "button", role: "tab", "aria-selected": scheduleModal.botScope === "all",
                        className: `qbot-schedTab${scheduleModal.botScope === "all" ? " is-active" : ""}`,
                        onClick: () => switchScheduleScope("all"),
                      }, "所有机器人")),
                    scheduleModal.error
                      ? h("div", { key: "err", className: "qbot-modalState qbot-modalError" }, scheduleModal.error)
                      : scheduleModal.items.length === 0
                        ? (scheduleModal.loading
                            ? h("div", { key: "loading", className: "qbot-modalState" }, h("span", { className: "qbot-spinner", "aria-hidden": "true" }), "正在读取定时消息…")
                            : h("div", { key: "empty", className: "qbot-modalState" }, "还没有定时消息。可在聊天里发 /定时 每天 09:00 内容，或直接让 AI 帮你设置。"))
                        : ([{ scope: "group", title: "群聊任务" }, { scope: "c2c", title: "单聊任务" }] as const).map((g) => {
                            const rows = scheduleModal.items.filter((e: any) => e.scope === g.scope);
                            if (rows.length === 0) return null;
                            return h("div", { key: g.scope, className: "qbot-schedGroup" },
                              h("div", { className: "qbot-schedGroupTitle", "data-scope": g.scope },
                                g.title, h("span", { className: "qbot-schedCount" }, `${rows.length}`)),
                              rows.map((e: any) => h("div", { key: String(e.id), className: "qbot-schedRow" },
                                h("div", { className: "qbot-schedMain" },
                                  h("div", { className: "qbot-schedTop" },
                                    h("span", { className: "qbot-chip is-active" },
                                      e.type === "daily" ? `每天 ${e.time ?? "--:--"}` : `每 ${Number(e.minutes ?? 0)} 分钟`),
                                    e.mode === "ai" ? h("span", { className: "qbot-chip" }, "AI 生成") : null,
                                    e.lastError ? h("span", { className: "qbot-chip qbot-chipWarn" }, "上次失败") : null),
                                  h("div", { className: "qbot-schedContent" }, String(e.content ?? "")),
                                  h("div", { className: "qbot-schedMeta" },
                                    h("span", null, `${e.scope === "group" ? "群" : "用户"} ${String(e.openid ?? "").slice(0, 16)}${String(e.openid ?? "").length > 16 ? "…" : ""}`),
                                    h("span", null, e.createdBy === "settings" ? "来自设置页" : e.createdBy === "ai" ? "来自 AI" : "来自聊天命令"),
                                    h("span", null, `下次发送 ${e.nextRunAt ? formatTime(e.nextRunAt) : "待补算"}`),
                                    e.lastError ? h("span", { className: "qbot-schedError" }, String(e.lastError)) : null)),
                                h("div", { className: "qbot-schedOps" },
                                  h("button", {
                                    className: "qbot-btn qbot-schedEdit", type: "button",
                                    onClick: () => openScheduleEdit(e),
                                  }, "编辑"),
                                  h("button", {
                                    className: "qbot-btn qbot-btnDanger qbot-schedRemove", type: "button",
                                    disabled: scheduleRemoving === String(e.id),
                                    onClick: () => void removeSchedule(String(e.id)),
                                  }, scheduleRemoving === String(e.id) ? "删除中…" : "删除")))));
                          }),
                  ]),
            h("div", { className: "qbot-modalFoot" },
              h("span", { className: "qbot-hint" },
                scheduleModal.botScope === "all"
                  ? `所有机器人共 ${scheduleModal.items.length} 条（每个群/单聊最多 5 条）`
                  : `共 ${scheduleModal.items.length} 条（每个群/单聊最多 5 条）`),
              h("div", { className: "qbot-viewActions" },
                h("button", { className: "qbot-btn", type: "button", disabled: scheduleModal.loading, onClick: () => void loadSchedules(scheduleModal.botScope) }, "刷新"),
                h("button", { className: "qbot-btn qbot-btnPrimary", type: "button", onClick: () => setScheduleModal(null) }, "关闭")))))
      : null,
    // ── 消息归档弹窗 ──
    archiveModal
      ? h("div", { className: "qbot-modalOverlay" },
          h("div", { className: "qbot-modal qbot-modalWide", role: "dialog", "aria-modal": "true", "aria-label": "消息归档" },
            h("div", { className: "qbot-modalHead" },
              h("div", null,
                h("strong", null, "消息归档"),
                h("p", null, "本地落盘的最近收发记录（只读，最新在前；按当前机器人过滤）")),
              h("button", { className: "qbot-modalClose", type: "button", "aria-label": "关闭", onClick: () => setArchiveModal(null) }, "×")),
            h("div", { className: `qbot-modalList${archiveModal.loading && archiveModal.records.length > 0 ? " is-refreshing" : ""}` },
              archiveModal.loading && archiveModal.records.length === 0
                ? h("div", { className: "qbot-modalState" }, h("span", { className: "qbot-spinner", "aria-hidden": "true" }), "正在读取归档…")
                : archiveModal.error
                  ? h("div", { className: "qbot-modalState qbot-modalError" }, archiveModal.error)
                  : archiveModal.records.length === 0
                    ? h("div", { className: "qbot-modalState" }, "归档为空。开启「消息本地归档」并收到消息后，这里会出现记录。")
                    : h("div", { className: "qbot-timeline" },
                        archiveModal.records.map((r: any, i: number) => {
                          const key = `${r.ts ?? ""}-${i}`;
                          // 会话事件：不进气泡，作居中系统节点。
                          if (r.kind === "session") {
                            return h("div", { key, className: "qbot-tlSystem" },
                              `会话 ${formatTime(r.ts)}${r.content ? ` · ${String(r.content)}` : ""}`);
                          }
                          const isUser = r.kind === "inbound";
                          return h("div", { key, className: `qbot-tlItem ${isUser ? "is-user" : "is-bot"}` },
                            h("span", { className: "qbot-tlDot", "aria-hidden": "true" }),
                            h("div", { className: "qbot-tlBody" },
                              h("div", { className: "qbot-tlMeta" },
                                h("span", { className: "qbot-tlRole" }, isUser ? "用户" : "机器人"),
                                (r.senderName || r.sender)
                                  ? h("span", { className: "qbot-mono" }, String(r.senderName || r.sender))
                                  : null,
                                h("span", { className: "qbot-mono" }, String(r.chat ?? "—")),
                                h("span", null, formatTime(r.ts))),
                              h("div", { className: "qbot-tlBubble" }, String(r.content ?? "")),
                              r.note ? h("div", { className: "qbot-tlNote" }, String(r.note)) : null));
                        }))),
            h("div", { className: "qbot-modalFoot" },
              h("span", { className: "qbot-hint" },
                archiveModal.moreAvailable
                  ? `已显示最近 ${archiveModal.records.length} 条（更早记录仍在归档文件里）`
                  : `共 ${archiveModal.records.length} 条记录`),
              h("div", { className: "qbot-viewActions" },
                h("button", { className: "qbot-btn", type: "button", disabled: archiveModal.loading, onClick: () => void loadArchive() }, "刷新"),
                h("button", { className: "qbot-btn qbot-btnPrimary", type: "button", onClick: () => setArchiveModal(null) }, "关闭")))))
      : null);
}

export function apply(ctx: any) {
  // 国际化：注册中英文字典并绑定宿主翻译函数（随宿主语言切换实时生效）。
  ctx.effect(
    () => ctx.locale?.register?.(QQBOT_LOCALE_NAMESPACE, { zh, en }),
    "qqbot-settings: locale dictionaries",
  );
  const t = ctx.locale?.bind?.(QQBOT_LOCALE_NAMESPACE);
  setTranslator(typeof t === "function" ? t : undefined);

  const rpcCall: RpcCall = async (endpoint, payload, signal) => {
    // framework 的 clientRequestSchema 要求信封必须带 payload 字段；始终传一个对象（至少 {}）。
    const raw = await ctx.connection.rpc.call(RPC_CHANNEL, endpoint, payload ?? {}, signal);
    // DSH RPC 在通道/处理器未真正响应时，会返回结构化错误信封 { code, message, details }，
    // 而不是约定的 { ok, value }。在此统一规整，避免下游把对象当 React 子节点（#31）。
    if (raw && typeof raw === "object" && "code" in raw && !("ok" in raw)) {
      const r = raw as { code?: unknown; message?: unknown };
      const msg = typeof r.message === "string" && r.message
        ? r.message
        : typeof r.code === "string" ? r.code : "RPC 调用失败";
      return { ok: false, error: msg };
    }
    return raw as Reply;
  };

  ctx.effect(() => installStyles(), "qqbot-settings: styles");
  ctx.slots.inject("settings.section", () =>
    ctx.slots.register(
      {
        name: "settings.section",
        id: "dsh-qqbot",
        order: 31,
        label: () => h("span", { className: "qbot-navLabel" },
          h(QqBotGlyph, { className: "qbot-navGlyph", uid: "nav" }),
          h("span", { className: "qbot-navText" }, localizeText("QQ 机器人"))),
        inject: () => ({ rpcCall }),
      },
      QqbotSettingsTab,
    ));
}

function installStyles(): () => void {
  if (typeof document === "undefined") return () => {};
  const existing = document.querySelector('style[data-plugin-css="dsh-qqbot"]');
  if (existing) return () => {};
  const style = document.createElement("style");
  style.dataset.plugin = "@sunjuntao/dsh-qqbot";
  style.dataset.pluginCss = "dsh-qqbot";
  style.textContent = CSS_TEXT;
  document.head.append(style);
  return () => style.remove();
}

/**
 * 样式完全对齐 @xmanrui/dsh-im 的 plugin-src/client/styles.js：
 * 同一套 --dsw-alias-* 设计令牌（含浅色回退）、同样的圆角/阴影/字号/间距/交互态。
 */
const CSS_TEXT = `
.qbot-page {
  --qbot-blue: #1677ff;
  --qbot-blue-dark: #0958d9;
  --qbot-business: var(--dsw-alias-state-business-primary, #3370ff);
  width: 100%;
  max-width: 1080px;
  padding: 2px 0 30px;
  color: var(--dsw-alias-label-primary, #1f2329);
  box-sizing: border-box;
}
.qbot-page *, .qbot-page *::before, .qbot-page *::after { box-sizing: border-box; }

/* ── 标题栏（dim-title）────────────────────────────────────────────────── */
.qbot-title { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin: 0 0 18px; }
.qbot-brand { min-width: 0; width: max-content; max-width: 100%; display: flex; flex-direction: column; align-items: flex-start; gap: 1px; margin: -2px -6px; padding: 2px 6px; border-radius: 8px; }
.qbot-brandHeading { display: flex; align-items: baseline; gap: 8px; white-space: nowrap; }
.qbot-brandName { color: var(--dsw-alias-label-primary, #1f2329); font-size: 20px; line-height: 24px; font-weight: 800; letter-spacing: .04em; }
.qbot-brandVersion { color: var(--dsw-alias-label-tertiary, #8f959e); font: 500 10px/16px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: 0; }
.qbot-updateBtn { align-self: center; min-height: 20px; padding: 1px 9px; border-radius: 999px; font-size: 11px; line-height: 16px; font-weight: 560; }
.qbot-updateBtn:disabled { cursor: default; opacity: .65; }
.qbot-updateBtn.is-done { color: var(--dsw-alias-state-success-primary, #2ea121); border-color: color-mix(in srgb, var(--dsw-alias-state-success-primary, #2ea121) 45%, var(--dsw-alias-border-l2, #dfe1e5)); }
.qbot-title p { margin: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 18px; font-weight: 500; white-space: nowrap; }
.qbot-titleActions { display: flex; align-items: center; justify-content: flex-end; gap: 8px; flex-wrap: wrap; }

/* 标题栏品牌区：QQ 机器人图标 + 文案（横向排列） */
.qbot-brand { flex-direction: row; align-items: center; gap: 10px; }
.qbot-brandText { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.qbot-brandGlyph { flex: none; width: 30px; height: 30px; color: var(--qbot-blue, #1677ff); }

/* 设置侧栏导航项：QQ 机器人图标 + 文案，隐藏宿主默认齿轮 */
.qbot-navLabel { display: inline-flex; align-items: center; gap: 8px; }
.qbot-navGlyph { flex: none; width: 18px; height: 18px; color: inherit; }
.qbot-navText { white-space: nowrap; }
.VOzbGW_navCell:has(.qbot-navLabel) .VOzbGW_navIcon { display: none !important; }

/* ── 面板（dim-panel）──────────────────────────────────────────────────── */
.qbot-panel { min-width: 0; }

/* ── 状态胶囊 / 状态标签（dim-onlineBadge / dim-stateLabel / dim-stateDot）─ */
.qbot-onlineBadge { min-height: 30px; display: inline-flex; align-items: center; gap: 7px; padding: 0 11px; border: 0; border-radius: 999px; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-bg-module-platform, #f2f3f5); font: inherit; font-size: 12px; font-weight: 400; line-height: normal; white-space: nowrap; }
.qbot-stateLabel { display: inline-flex; align-items: center; gap: 8px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: normal; font-weight: 600; }
.qbot-stateDot { flex: none; width: 8px; height: 8px; border-radius: 50%; background: var(--dsw-alias-label-tertiary, #8f959e); box-shadow: none; }
.qbot-stateDot[data-tone="success"] { background: var(--dsw-alias-state-success-primary, #20a162); box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-success-primary, #20a162) 14%, transparent); }
.qbot-stateDot[data-tone="warning"] { background: var(--dsw-alias-state-warn-primary, #d97706); }
.qbot-stateDot[data-tone="error"] { background: var(--dsw-alias-state-error-primary, #d54941); }

/* ── 面板通用（dim-channelPage / dim-surfaceCard）─────────────────────── */
.qbot-channelPage { min-width: 0; width: 100%; max-width: none; display: flex; flex-direction: column; gap: 12px; padding: 0 0 24px; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-surfaceCard { position: relative; overflow: hidden; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 14px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 1px 2px rgb(31 35 41 / 3%); }
.qbot-surfaceBody { padding: 24px; display: flex; flex-direction: column; gap: 12px; }
.qbot-cardTitle { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 17px; line-height: 1.35; font-weight: 650; }
.qbot-listHeading { min-height: 0; display: flex; align-items: center; justify-content: space-between; gap: 16px; margin: 0; }
.qbot-listHeading h3 { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 14px; line-height: normal; font-weight: 650; }
.qbot-listTitle { min-width: 0; display: inline-flex; align-items: center; gap: 10px; }
.qbot-hint { margin: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 1.6; }

/* ── 通知（dim-statusNotice / info 变体）──────────────────────────────── */
.qbot-statusNotice { display: flex; align-items: flex-start; gap: 10px; padding: 13px 15px; border: 1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 22%, var(--dsw-alias-border-l2, #dfe1e5)); border-radius: 10px; color: var(--dsw-alias-state-error-primary, #d54941); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 8%, var(--dsw-alias-bg-layer-1, #fff)); font-size: 13px; line-height: 1.5; }
.qbot-infoNotice { display: flex; align-items: flex-start; gap: 10px; padding: 13px 15px; border: 1px solid color-mix(in srgb, var(--qbot-business) 22%, var(--dsw-alias-border-l2, #dfe1e5)); border-radius: 10px; color: var(--qbot-business); background: color-mix(in srgb, var(--qbot-business) 7%, var(--dsw-alias-bg-layer-1, #fff)); font-size: 13px; line-height: 1.5; }
/* 页面级更新提示（qbot-page 是普通块布局，无 channelPage 的 flex gap，需自带下边距与面板隔开） */
.qbot-updateNotice { margin: 0 0 18px; }

/* ── 机器人卡片（dim-botCard）─────────────────────────────────────────── */
.qbot-botList { min-width: 0; width: 100%; max-width: 100%; display: grid; grid-template-columns: minmax(0, 1fr); gap: 8px; }
.qbot-botCard { position: relative; min-width: 0; width: 100%; max-width: 100%; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 14px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 1px 2px rgb(31 35 41 / 3%); font: inherit; text-align: left; cursor: pointer; transition: border-color .16s ease, box-shadow .16s ease; }
.qbot-botCard:hover { border-color: color-mix(in srgb, var(--qbot-blue) 25%, var(--dsw-alias-border-l2, #e5e6eb)); box-shadow: 0 5px 16px rgb(31 35 41 / 5%); }
.qbot-botCard:focus-visible { outline: none; border-color: color-mix(in srgb, var(--qbot-blue) 72%, var(--dsw-alias-border-l2, #dfe1e5)); box-shadow: 0 0 0 1px color-mix(in srgb, var(--qbot-blue) 24%, transparent) inset, 0 3px 12px rgb(22 119 255 / 7%); }
.qbot-botCardBody { padding: 12px; display: flex; align-items: center; gap: 12px; }
.qbot-botTop { min-width: 0; flex: 1 1 auto; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.qbot-botIdentity { min-width: 0; flex: 1 1 0; display: flex; align-items: center; gap: 10px; }
.qbot-botAvatar { flex: none; width: 38px; height: 38px; display: grid; place-items: center; overflow: hidden; border-radius: 11px; color: #fff; background: var(--qbot-blue); }
.qbot-botAvatar svg { width: 27px; height: 27px; }
.qbot-botName { min-width: 0; }
.qbot-botName h3 { overflow: hidden; margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 15px; font-weight: 650; line-height: normal; text-overflow: ellipsis; white-space: nowrap; }
.qbot-botName p { overflow: hidden; margin: 4px 0 0; color: var(--dsw-alias-label-secondary, #646a73); font: 12px ui-monospace, SFMono-Regular, monospace; line-height: normal; text-overflow: ellipsis; white-space: nowrap; }
.qbot-botTools { flex: none; display: flex; align-items: center; gap: 8px; }
.qbot-botHealthGroup { min-width: 0; max-width: 100%; flex: none; display: grid; justify-items: end; gap: 5px; }
.qbot-lastChecked { display: inline-flex; align-items: baseline; gap: 4px; color: var(--dsw-alias-label-tertiary, #8f959e); font: inherit; font-size: 11px; font-weight: 400; line-height: normal; white-space: nowrap; }
.qbot-botChevron { flex: none; width: 9px; height: 9px; border-right: 1.6px solid var(--dsw-alias-label-tertiary, #8f959e); border-bottom: 1.6px solid var(--dsw-alias-label-tertiary, #8f959e); transform: rotate(-45deg); }

/* ── 空状态（dim-emptyView）───────────────────────────────────────────── */
.qbot-emptyView { min-height: 230px; display: grid; grid-template-columns: minmax(0, 1fr) 180px; align-items: center; gap: 30px; }
.qbot-emptyCopy { min-width: 0; }
.qbot-emptyCopy h3 { margin: 8px 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 18px; line-height: 1.35; font-weight: 650; }
.qbot-emptyCopy > p { max-width: 560px; margin: 0; color: var(--dsw-alias-label-secondary, #646a73); line-height: 1.65; }
.qbot-emptyBrand { width: 110px; height: 110px; display: grid; place-items: center; justify-self: center; border-radius: 28px; color: #fff; background: var(--qbot-blue); box-shadow: 0 18px 45px rgb(22 119 255 / 18%); }
.qbot-emptyBrand svg { width: 56px; height: 56px; }

/* ── 分段 Tab（dim-contextTabs）───────────────────────────────────────── */
.qbot-segTabs { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 3px; padding: 3px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 8px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-segTabs button { min-width: 0; min-height: 34px; padding: 5px 12px; border: 0; border-radius: 6px; color: var(--dsw-alias-label-secondary, #646a73); background: transparent; font: inherit; font-weight: 500; cursor: pointer; transition: color .15s ease, background .15s ease, box-shadow .15s ease; }
.qbot-segTabs button:hover:not([aria-selected="true"]) { color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-segTabs button[aria-selected="true"] { color: var(--qbot-business); background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 1px 3px rgb(31 35 41 / 12%); }

/* ── 扫码布局（dim-qrLayout / dim-qrFrame / dim-steps）────────────────── */
/* 设置面板实际宽度有限，扫码区改为纵向：二维码在上，说明在下（不再左右分栏）。 */
.qbot-qrLayout { display: flex; flex-direction: column; align-items: stretch; gap: 22px; }
.qbot-qrColumn { width: 100%; min-width: 0; max-width: 320px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 12px; }
.qbot-qrFrame { position: relative; width: min(270px, 100%); height: auto; aspect-ratio: 1; display: grid; place-items: center; overflow: hidden; padding: 10px; border: 1px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 16px; background: #fff; }
.qbot-qrFrame::before { content: ""; position: absolute; inset: 7px; z-index: 0; border: 1px solid color-mix(in srgb, var(--qbot-blue) 16%, var(--dsw-alias-border-l2, #dfe1e5)); border-radius: 12px; pointer-events: none; }
.qbot-qrSvg { position: relative; z-index: 1; width: 100%; height: 100%; }
.qbot-qrSvg svg { width: 100%; height: 100%; display: block; }
.qbot-qrFallback { position: relative; z-index: 1; display: grid; place-items: center; gap: 8px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 13px; line-height: 1.5; text-align: center; }
.qbot-qrPending { position: absolute; left: 10px; right: 10px; bottom: 10px; z-index: 2; padding: 5px 0; border-radius: 8px; color: var(--qbot-blue); background: rgb(255 255 255 / 92%); font-size: 12px; font-weight: 600; text-align: center; backdrop-filter: blur(3px); }
.qbot-countdown { width: 100%; margin: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: normal; }
.qbot-qrCopy { width: 100%; min-width: 0; display: flex; flex-direction: column; gap: 12px; overflow-wrap: anywhere; }
.qbot-qrCopy h3 { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 18px; line-height: 1.35; font-weight: 650; }
.qbot-qrCopy > p { margin: 0; color: var(--dsw-alias-label-secondary, #646a73); line-height: 1.65; }
.qbot-qrLead { margin: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12.5px; line-height: 1.7; }

/* ── 添加机器人：页面层级（页头）───────────────────────────────────────── */
.qbot-addView { gap: 14px; }
.qbot-addNav { display: flex; align-items: center; gap: 10px; }
.qbot-addHead { display: flex; flex-direction: column; gap: 5px; }
.qbot-addHead h2 { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 19px; line-height: 1.35; font-weight: 700; }
.qbot-addHead p { max-width: 760px; margin: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12.5px; line-height: 1.75; }

/* ── 添加机器人：引导块（第二层层次）──────────────────────────────────── */
.qbot-manualPanel { gap: 16px; }
.qbot-copyHead { display: flex; flex-direction: column; gap: 5px; }
.qbot-copyHead h3 { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 17px; line-height: 1.35; font-weight: 650; }
.qbot-copyHead p { max-width: 660px; margin: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12.5px; line-height: 1.7; }
.qbot-guideBlock { min-width: 0; display: flex; flex-direction: column; gap: 10px; padding: 14px 15px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-guideTitle { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; font-weight: 700; letter-spacing: .1em; }
.qbot-steps.is-rich { width: 100%; margin: 0; }
.qbot-steps.is-rich li { flex-direction: column; align-items: flex-start; gap: 2px; min-height: 0; padding: 2px 0 9px 36px; }
.qbot-steps.is-rich li:last-child { padding-bottom: 0; }
.qbot-steps.is-rich li strong { color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; font-weight: 650; line-height: 1.5; }
.qbot-steps.is-rich li > span { color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 1.7; }

/* ── 添加机器人：补充说明（第三层层次）────────────────────────────────── */
.qbot-noteList { min-width: 0; display: flex; flex-direction: column; gap: 7px; padding: 13px 15px; border: 1px dashed var(--dsw-alias-border-l2, #dfe1e5); border-radius: 10px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-noteTitle { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; font-weight: 700; letter-spacing: .1em; }
.qbot-noteList ul { display: flex; flex-direction: column; gap: 6px; margin: 0; padding: 0; list-style: none; }
.qbot-noteList li { position: relative; padding-left: 13px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 1.75; }
.qbot-noteList li::before { content: ""; position: absolute; left: 0; top: 9px; width: 4px; height: 4px; border-radius: 50%; background: var(--dsw-alias-border-l2, #c9cdd4); }

/* ── 扫码：二维码占位 + 操作区 ─────────────────────────────────────────── */
.qbot-qrPlaceholder { position: relative; z-index: 1; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 9px; text-align: center; color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-qrPlaceholderIcon { display: grid; place-items: center; width: 54px; height: 54px; border-radius: 16px; color: var(--qbot-blue); background: color-mix(in srgb, var(--qbot-blue) 10%, transparent); }
.qbot-qrPlaceholderIcon svg { width: 28px; height: 28px; }
.qbot-qrPlaceholder strong { color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; font-weight: 650; }
.qbot-qrPlaceholderHint { font-size: 12px; line-height: 1.6; }
.qbot-qrActions { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 10px; }
.qbot-qrError { margin: 12px 0 0; color: var(--dsw-alias-state-error-primary, #d54941); font-size: 12px; line-height: 1.5; overflow-wrap: anywhere; }
.qbot-steps { margin: 18px 0 0; padding: 0; list-style: none; counter-reset: qbot-step; }
.qbot-steps li { position: relative; min-height: 28px; display: flex; align-items: center; padding: 5px 0 5px 36px; color: var(--dsw-alias-label-secondary, #646a73); line-height: 1.5; counter-increment: qbot-step; }
.qbot-steps li::before { content: counter(qbot-step); position: absolute; left: 0; top: 4px; width: 25px; height: 25px; display: grid; place-items: center; border-radius: 8px; color: #4d93f8; background: color-mix(in srgb, var(--qbot-blue) 16%, var(--dsw-alias-bg-layer-1, #fff)); font-size: 12px; font-weight: 650; }

/* ── 凭据表单（dim-credentialPanel / dim-credentialField）─────────────── */
.qbot-credentialPanel { display: grid; gap: 18px; }
.qbot-credentialTitle { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 17px; line-height: 1.35; font-weight: 650; }
.qbot-credentialForm { min-width: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px 12px; }
.qbot-credentialActions { grid-column: 1 / -1; }
.qbot-field { min-width: 0; display: grid; gap: 7px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: normal; font-weight: 560; }
.qbot-input { width: 100%; min-width: 0; height: 38px; padding: 0 11px; border: 1px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 8px; outline: none; color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-bg-layer-1, #fff); font: 13px ui-monospace, SFMono-Regular, Menlo, monospace; transition: border-color .16s ease, box-shadow .16s ease; }
.qbot-input:focus { border-color: #4e5969; box-shadow: 0 0 0 3px rgb(78 89 105 / 10%); }
.qbot-input::placeholder { color: var(--dsw-alias-label-tertiary, #8f959e); font-family: inherit; }
select.qbot-input { cursor: pointer; font-family: inherit; }

/* ── 配置网格 ─────────────────────────────────────────────────────────── */
.qbot-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px 12px; }

/* ── 卡片层级：标题块 / 分组标签 ──────────────────────────────────────── */
.qbot-cardHead { display: flex; flex-direction: column; gap: 5px; }
.qbot-cardHead .qbot-cardTitle { margin: 0; }
.qbot-subLabel { margin: 8px 0 -6px; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; font-weight: 680; letter-spacing: .12em; }

/* ── 工作区路径字段 ───────────────────────────────────────────────────── */
.qbot-pathField { display: flex; align-items: stretch; gap: 8px; }
.qbot-pathBox { flex: 1 1 auto; min-width: 0; height: 34px; display: flex; align-items: center; padding: 0 12px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 8px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-pathText { overflow: hidden; color: var(--dsw-alias-label-primary, #1f2329); font: 12px ui-monospace, SFMono-Regular, Menlo, monospace; text-overflow: ellipsis; white-space: nowrap; }
.qbot-pathField .qbot-btn { flex: none; min-height: 34px; }

/* ── 高级选项折叠区（模仿 dsh-im dim-collapsibleAccount）──────────────── */
.qbot-collapsible { min-width: 0; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-collapsibleHead { min-width: 0; display: flex; align-items: center; gap: 10px; padding: 13px 15px; border-radius: 10px; cursor: pointer; user-select: none; -webkit-user-select: none; transition: background .15s ease; }
.qbot-collapsibleHead:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-collapsibleHead:focus-visible { outline: 2px solid var(--qbot-business); outline-offset: 2px; }
.qbot-collapsibleCopy { min-width: 0; flex: 1 1 auto; display: flex; flex-direction: column; gap: 2px; }
.qbot-collapsibleCopy strong { color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; line-height: normal; font-weight: 650; }
.qbot-collapsibleCopy span { overflow: hidden; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: normal; text-overflow: ellipsis; white-space: nowrap; }
.qbot-collapsibleChevron { flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; width: 9px; height: 9px; border-right: 1.6px solid var(--dsw-alias-label-tertiary, #8f959e); border-bottom: 1.6px solid var(--dsw-alias-label-tertiary, #8f959e); transform: rotate(-45deg); transition: transform .22s cubic-bezier(.4, 0, .2, 1); transform-origin: 50% 50%; }
.qbot-collapsible.is-open .qbot-collapsibleChevron { transform: rotate(45deg); }
.qbot-collapsibleBody { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .22s cubic-bezier(.4, 0, .2, 1); }
.qbot-collapsible.is-open > .qbot-collapsibleBody { grid-template-rows: 1fr; }
.qbot-collapsibleInner { min-height: 0; overflow: hidden; }
.qbot-collapsible:not(.is-open) .qbot-collapsibleInner { visibility: hidden; }
.qbot-collapsibleContent { display: flex; flex-direction: column; gap: 14px; padding: 2px 15px 15px; border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); padding-top: 14px; }

/* ── 目录选择弹窗 ─────────────────────────────────────────────────────── */
.qbot-modalOverlay { position: fixed; inset: 0; z-index: 9999; display: grid; place-items: center; padding: 24px; background: rgb(31 35 41 / 42%); backdrop-filter: blur(2px); animation: qbotFadeIn 0.16s ease-out; }
.qbot-modal { width: min(560px, 100%); height: min(72vh, 640px); display: flex; flex-direction: column; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 14px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 24px 64px rgb(31 35 41 / 24%); overflow: hidden; animation: qbotPopIn 0.18s ease-out; }
@keyframes qbotFadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes qbotPopIn { from { opacity: 0; transform: scale(0.97) translateY(6px); } to { opacity: 1; transform: none; } }
.qbot-modalHead { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 18px 20px 14px; }
.qbot-modalHead strong { color: var(--dsw-alias-label-primary, #1f2329); font-size: 16px; line-height: 1.4; font-weight: 650; }
.qbot-modalHead p { margin: 2px 0 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; }
.qbot-modalClose { flex: none; width: 28px; height: 28px; border: 0; border-radius: 8px; color: var(--dsw-alias-label-tertiary, #8f959e); background: transparent; font-size: 18px; line-height: 1; cursor: pointer; }
.qbot-modalClose:hover { color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-modalPath { margin: 0 20px; padding: 8px 12px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 8px; color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-bg-module-platform, #f7f8fa); font-size: 12px; overflow-wrap: anywhere; }
.qbot-modalList { flex: 1 1 auto; min-height: 140px; margin: 12px 20px 0; padding: 6px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; overflow-y: auto; display: flex; flex-direction: column; gap: 2px; }
.qbot-dirRow { display: flex; align-items: center; gap: 10px; min-height: 38px; padding: 0 10px; border: 0; border-radius: 8px; color: var(--dsw-alias-label-primary, #1f2329); background: transparent; font: inherit; font-size: 13px; text-align: left; cursor: pointer; transition: background .12s ease; }
.qbot-dirRow.is-selected { background: var(--dsw-alias-bg-active, rgba(22, 119, 255, .14)); font-weight: 600; }
.qbot-dirRow:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-dirRow svg { flex: none; width: 16px; height: 16px; color: var(--qbot-business); }
.qbot-modalState { display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 96px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 13px; }
.qbot-modalError { color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-modalFoot { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding: 14px 20px 18px; }
/* 宽弹窗：定时消息 / 消息归档 列表内容较长，放宽上限 */
.qbot-modalWide { width: min(760px, 100%); }
/* ── 概览第一行右侧操作区（定时消息 / 消息归档 入口） ── */
.qbot-heroActions { display: flex; align-items: center; gap: 8px; margin-left: auto; padding-left: 12px; flex: none; }
/* ── 定时消息弹窗：范围 Tab + 群聊/单聊分组 ── */
.qbot-schedTabs { display: flex; align-items: center; gap: 4px; padding: 10px 12px 8px; border-bottom: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-schedTab { flex: none; padding: 5px 14px; border: 1px solid transparent; border-radius: 999px; background: transparent; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; cursor: pointer; }
.qbot-schedTab:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-schedTab.is-active { background: var(--dsw-alias-bg-layer-1, #fff); border-color: var(--dsw-alias-border-l2, #e5e6eb); color: var(--qbot-blue); font-weight: 600; box-shadow: 0 1px 2px rgb(31 35 41 / 6%); }
.qbot-schedGroup { display: flex; flex-direction: column; gap: 6px; padding: 8px 12px 4px; }
.qbot-schedGroupTitle { display: flex; align-items: center; gap: 8px; margin: 4px 0 2px; font-size: 12px; font-weight: 600; color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-schedGroupTitle[data-scope="group"] { color: var(--qbot-blue); }
.qbot-schedGroupTitle::after { content: ""; flex: 1; height: 1px; background: var(--dsw-alias-border-l1, #eef0f3); }
.qbot-schedCount { flex: none; min-width: 20px; text-align: center; padding: 0 6px; border-radius: 999px; background: var(--dsw-alias-interactive-bg-hover, #eef0f3); color: var(--dsw-alias-label-secondary, #646a73); font-size: 11px; font-weight: 600; }
/* 定时消息行：任务卡片式（类型徽标 + 内容 + 元信息 + 删除） */
.qbot-schedRow { display: flex; align-items: flex-start; gap: 12px; padding: 10px 12px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-schedMain { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
.qbot-schedTop { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.qbot-chipWarn { color: var(--dsw-alias-state-warn-primary, #d97706); }
.qbot-schedContent { color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; line-height: 1.5; overflow-wrap: anywhere; white-space: pre-wrap; }
.qbot-schedMeta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 12px; }
.qbot-schedError { color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-schedRemove { flex: none; }
/* 行内操作列：编辑 + 删除 纵向排列 */
.qbot-schedOps { display: flex; flex-direction: column; gap: 6px; flex: none; }
/* ── 定时消息编辑表单：标签 + 控件 + 提示 三行式 ── */
.qbot-editForm { display: flex; flex-direction: column; gap: 14px; padding: 14px 16px 18px; }
.qbot-editRow { display: flex; flex-direction: column; gap: 4px; }
.qbot-editLabel { font-size: 13px; font-weight: 600; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-editHint { font-size: 12px; line-height: 1.5; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-editActions { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-top: 2px; }
/* ── 归档时间轴：左竖线 + 节点圆点；用户蓝气泡靠左、机器人灰气泡靠右 ── */
.qbot-timeline { position: relative; display: flex; flex-direction: column; gap: 14px; padding: 6px 4px 6px 30px; }
.qbot-timeline::before { content: ""; position: absolute; left: 10px; top: 0; bottom: 0; width: 2px; border-radius: 1px; background: var(--dsw-alias-border-l2, #e5e6eb); }
.qbot-tlItem { position: relative; }
.qbot-tlDot { position: absolute; left: -25px; top: 26px; width: 10px; height: 10px; border-radius: 50%; background: var(--dsw-alias-label-tertiary, #8f959e); box-shadow: 0 0 0 3px var(--dsw-alias-bg-layer-1, #fff); }
.qbot-tlItem.is-user .qbot-tlDot { background: var(--qbot-blue); }
.qbot-tlBody { display: flex; flex-direction: column; gap: 4px; max-width: 84%; }
.qbot-tlItem.is-user .qbot-tlBody { align-items: flex-start; }
.qbot-tlItem.is-bot .qbot-tlBody { margin-left: auto; align-items: flex-end; }
.qbot-tlMeta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 11px; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-tlRole { font-weight: 650; color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-tlItem.is-user .qbot-tlRole { color: var(--qbot-blue); }
.qbot-tlBubble { padding: 8px 12px; border-radius: 12px; font-size: 13px; line-height: 1.55; overflow-wrap: anywhere; white-space: pre-wrap; color: var(--dsw-alias-label-primary, #1f2329); }
/* 用户：蓝色高亮气泡（左） */
.qbot-tlItem.is-user .qbot-tlBubble { background: color-mix(in srgb, var(--qbot-blue) 9%, var(--dsw-alias-bg-layer-1, #fff)); border: 1px solid color-mix(in srgb, var(--qbot-blue) 32%, transparent); border-top-left-radius: 4px; }
/* 机器人：中性灰气泡（右） */
.qbot-tlItem.is-bot .qbot-tlBubble { background: var(--dsw-alias-bg-module-platform, #f7f8fa); border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-top-right-radius: 4px; }
.qbot-tlNote { font-size: 11px; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-tlSystem { position: relative; text-align: center; font-size: 12px; color: var(--dsw-alias-label-tertiary, #8f959e); padding: 2px 0; }

/* ── 开关行（dim-contextSwitchRow / dim-contextSwitch）────────────────── */
.qbot-switches { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 3px 24px; }
.qbot-switchRow { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 34px; cursor: pointer; }
.qbot-switchText { min-width: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; line-height: normal; }
.qbot-switch { appearance: none; flex: none; width: 32px; height: 19px; margin: 0; border: 1px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 12px; background: var(--dsw-alias-interactive-bg-hover, #eef0f3); cursor: pointer; transition: background .16s ease, border-color .16s ease; }
.qbot-switch::before { content: ""; display: block; width: 13px; height: 13px; margin: 2px; border-radius: 50%; background: var(--dsw-alias-label-secondary, #646a73); transition: transform .16s ease, background .16s ease; }
.qbot-switch:checked { border-color: var(--qbot-business); background: var(--qbot-business); }
.qbot-switch:checked::before { transform: translateX(13px); background: #fff; }

/* ── 按钮（dim-viewActions / dim-cardActions / dim-updateButton）──────── */
.qbot-viewActions { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; }
.qbot-cardActions { display: flex; align-items: center; justify-content: flex-end; flex-wrap: wrap; gap: 8px; margin: 0; padding-top: 6px; border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
.qbot-btn { min-height: 34px; display: inline-flex; align-items: center; justify-content: center; padding: 0 13px; border: 1px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 8px; color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-bg-layer-1, #fff); font: inherit; font-size: 13px; font-weight: 560; line-height: normal; white-space: nowrap; cursor: pointer; transition: border-color .15s ease, background .15s ease, color .15s ease; }
.qbot-btn:hover:not(:disabled) { border-color: #aeb3bb; background: var(--dsw-alias-interactive-bg-hover, #f7f8fa); }
.qbot-btn:focus-visible { outline: 2px solid color-mix(in srgb, var(--qbot-blue) 62%, white); outline-offset: 2px; }
.qbot-btn:disabled { opacity: .55; cursor: default; }
.qbot-btnPrimary, .qbot-btnPrimary:hover:not(:disabled) { border-color: var(--qbot-blue); color: #fff; background: var(--qbot-blue); }
.qbot-btnPrimary:hover:not(:disabled) { border-color: var(--qbot-blue-dark); background: var(--qbot-blue-dark); }
.qbot-btnDanger { color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-btnDanger:hover:not(:disabled) { border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 40%, var(--dsw-alias-border-l2, #dfe1e5)); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 7%, var(--dsw-alias-bg-layer-1, #fff)); }

/* ── KV 网格（dim-updateVersions）─────────────────────────────────────── */
.qbot-kv { display: grid; grid-template-columns: max-content minmax(0, 1fr); gap: 8px 18px; margin: 0; font-size: 12px; line-height: 18px; }
.qbot-kv > div { display: contents; }
.qbot-kv dt { color: var(--dsw-alias-label-secondary, #646a73); white-space: nowrap; }
.qbot-kv dd { min-width: 0; margin: 0; overflow-wrap: anywhere; }
.qbot-mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }

/* ── 双卡并排 / 加载 ──────────────────────────────────────────────────── */
.qbot-cardPair { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 12px; align-items: start; }
.qbot-spinner { width: 24px; height: 24px; border: 3px solid var(--dsw-alias-border-l2, #e6e8eb); border-top-color: var(--qbot-blue); border-radius: 50%; animation: qbot-spin .8s linear infinite; }
@keyframes qbot-spin { to { transform: rotate(360deg); } }

/* ── 扫码倒计时（dim-countdown / dim-progress）────────────────────────── */
.qbot-qrFrame img { position: relative; z-index: 1; width: 100%; height: 100%; display: block; image-rendering: pixelated; }
.qbot-countdown { width: 100%; margin: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: normal; }
.qbot-countdownTop { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 6px; }
.qbot-countdownTop strong { color: var(--dsw-alias-label-primary, #1f2329); font-variant-numeric: tabular-nums; }
.qbot-progress { height: 4px; overflow: hidden; margin: 0; border-radius: 99px; background: var(--dsw-alias-bg-module-platform, #eef0f3); }
.qbot-progress span { display: block; width: var(--qbot-progress, 100%); height: 100%; border-radius: 99px; background: var(--qbot-blue); transition: width 1s linear; }

/* ── 账号卡折叠头（dim-collapsibleAccount 头部 + dim-botCardTools）────── */
.qbot-accountHead { min-width: 0; display: flex; align-items: center; gap: 12px; padding: 14px 16px; cursor: pointer; user-select: none; -webkit-user-select: none; }
.qbot-accountHead:hover { background: var(--dsw-alias-interactive-bg-hover, #f7f8fa); }
.qbot-accountHead:focus-visible { outline: 2px solid var(--qbot-business); outline-offset: -2px; border-radius: 14px; }
.qbot-accountTools { min-width: 0; flex: 1 1 auto; display: flex; align-items: center; justify-content: flex-end; gap: 12px; }
.qbot-healthGroup { min-width: 0; display: grid; justify-items: end; gap: 3px; }


/* ── 高级选项行（dim-contextEnhancement 行样式）───────────────────────── */
.qbot-enhanceRow { border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 9px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-enhanceRow > .qbot-collapsibleHead { padding: 10px 12px; border-radius: 9px; gap: 8px; }
.qbot-enhanceLead { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 8px; color: var(--qbot-business); background: color-mix(in srgb, var(--qbot-business) 10%, transparent); }
.qbot-enhanceLead svg { width: 15px; height: 15px; }
.qbot-enhanceRow .qbot-collapsibleHead strong { flex: 1 1 auto; color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; font-weight: 650; }
.qbot-enhanceChip { flex: none; padding: 2px 8px; border-radius: 999px; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-bg-layer-1, #fff); border: 1px solid var(--dsw-alias-border-l1, #eef0f3); font-size: 11px; white-space: nowrap; }
.qbot-enhanceRow .qbot-collapsibleContent { padding: 2px 12px 12px; }

/* ── 底部操作（dim-cardFooter / dim-cardSummary）──────────────────────── */
.qbot-cardFooter { display: flex; align-items: center; justify-content: flex-end; gap: 10px; margin-top: 6px; padding-top: 12px; border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
.qbot-cardSummary { min-width: 0; color: var(--dsw-alias-label-secondary, #646a73); font: inherit; font-size: 12px; font-weight: 400; line-height: normal; overflow-wrap: anywhere; white-space: normal; }

/* ── 详情页：顶部导航 ─────────────────────────────────────────────────── */
.qbot-detailNav { display: flex; align-items: center; gap: 14px; }
.qbot-detailNavTitle { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.qbot-detailNavTitle h3 { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 16px; line-height: normal; font-weight: 700; }
.qbot-detailNavTitle span { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 12px; line-height: normal; }

/* ── 详情页：概览横幅 ─────────────────────────────────────────────────── */
.qbot-hero { position: relative; overflow: hidden; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 14px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 1px 2px rgb(31 35 41 / 3%); }
.qbot-hero::before { content: ""; position: absolute; inset: 0 0 auto; height: 3px; background: linear-gradient(90deg, var(--qbot-blue), color-mix(in srgb, var(--qbot-blue) 25%, transparent)); }
.qbot-heroMain { display: flex; align-items: center; gap: 14px; padding: 20px 20px 14px; }
.qbot-heroAvatar { flex: none; width: 52px; height: 52px; display: grid; place-items: center; border-radius: 16px; color: #fff; background: linear-gradient(140deg, #3d8bff, var(--qbot-blue-dark)); box-shadow: 0 8px 20px rgb(22 119 255 / 22%); }
.qbot-heroAvatar svg { width: 30px; height: 30px; }
.qbot-heroIdentity { min-width: 0; flex: 1 1 auto; display: flex; flex-direction: column; gap: 6px; }
.qbot-heroNameRow { min-width: 0; display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
.qbot-heroNameRow h2 { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font: 700 18px/1.3 ui-monospace, SFMono-Regular, Menlo, monospace; overflow-wrap: anywhere; }
.qbot-chip { flex: none; padding: 2px 9px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 999px; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-bg-module-platform, #f7f8fa); font-size: 11px; font-weight: 600; line-height: 17px; white-space: nowrap; }
.qbot-chip.is-active { border-color: color-mix(in srgb, var(--qbot-business) 32%, transparent); color: var(--qbot-business); background: color-mix(in srgb, var(--qbot-business) 10%, transparent); }
.qbot-heroMeta { display: flex; align-items: center; gap: 8px; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 12px; line-height: normal; }
.qbot-metaDot { width: 3px; height: 3px; border-radius: 50%; background: currentColor; opacity: .6; }
.qbot-heroStats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1px; margin: 0 20px 20px; padding: 1px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-border-l1, #eef0f3); overflow: hidden; }
.qbot-heroStat { min-width: 0; display: flex; flex-direction: column; gap: 5px; padding: 11px 14px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-heroStatLabel { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; font-weight: 600; letter-spacing: .06em; }
.qbot-heroStatValue { display: flex; align-items: center; gap: 7px; color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; font-weight: 650; line-height: normal; }
.qbot-heroFoot { margin: 0 20px 18px; padding: 10px 13px; border: 1px solid color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 24%, var(--dsw-alias-border-l2, #dfe1e5)); border-radius: 9px; color: var(--dsw-alias-label-secondary, #646a73); background: color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 7%, var(--dsw-alias-bg-layer-1, #fff)); font-size: 12px; line-height: 1.6; overflow-wrap: anywhere; }

/* ── 详情页：分区卡片（第一层层次，details/summary 折叠）──────────────── */
.qbot-section { border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 14px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 1px 2px rgb(31 35 41 / 3%); overflow: hidden; }
.qbot-section.is-danger { border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 26%, var(--dsw-alias-border-l2, #e5e6eb)); }
.qbot-section > summary.qbot-sectionHead { cursor: pointer; list-style: none; user-select: none; }
.qbot-section > summary.qbot-sectionHead::-webkit-details-marker { display: none; }
.qbot-section:not([open]) > summary.qbot-sectionHead { border-bottom-color: transparent; }
.qbot-sectionChevron { flex: none; align-self: center; margin-left: auto; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 13px; line-height: 1; transition: transform .18s ease; }
.qbot-sectionAction + .qbot-sectionChevron { margin-left: 0; }
.qbot-section > summary.qbot-sectionHead:hover .qbot-sectionTitle h3 { color: color-mix(in srgb, var(--dsw-alias-brand-primary, #4e5969) 72%, var(--dsw-alias-label-primary, #1f2329)); }
.qbot-section[open] > summary.qbot-sectionHead .qbot-sectionChevron { transform: rotate(90deg); }
.qbot-sectionHead { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; padding: 16px 20px 13px; border-bottom: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-sectionTitle { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.qbot-sectionTitle h3 { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 15px; line-height: normal; font-weight: 680; }
.qbot-sectionTitle p { margin: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 1.6; }
.qbot-section.is-danger .qbot-sectionTitle h3 { color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-sectionAction { flex: none; display: flex; align-items: center; gap: 8px; }
.qbot-sectionBody { min-width: 0; padding: 14px 20px 18px; background: var(--dsw-alias-bg-layer-1, #fff); }

/* ── 详情页：设置行列表（第二层层次）─────────────────────────────────── */
.qbot-settingList { display: flex; flex-direction: column; gap: 8px; }
.qbot-settingRow { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; column-gap: 16px; row-gap: 8px; padding: 12px 14px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); transition: border-color .15s ease, background .15s ease; }
.qbot-settingRow:hover { border-color: var(--dsw-alias-border-l2, #dfe1e5); }
.qbot-settingCopy { min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.qbot-settingTitle { color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; font-weight: 650; line-height: normal; }
.qbot-settingDesc { min-width: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 1.65; }
.qbot-settingControl { flex: none; display: flex; align-items: center; justify-content: flex-end; min-width: 190px; }
.qbot-settingSelect { width: 100%; min-width: 0; max-width: 260px; height: 34px; padding: 0 9px; border: 1px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 8px; outline: none; color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-bg-layer-1, #fff); font: inherit; font-size: 13px; cursor: pointer; transition: border-color .16s ease, box-shadow .16s ease; }
.qbot-settingSelect:focus { border-color: #4e5969; box-shadow: 0 0 0 3px rgb(78 89 105 / 10%); }

/* 文本输入设置行（textarea）：说明在上、输入框通栏在下，长文本不再被窄框截断 */
.qbot-settingRow.is-wide { grid-template-columns: minmax(0, 1fr); }
.qbot-settingControl.is-wide { width: 100%; min-width: 0; justify-content: stretch; }
.qbot-settingControl.is-wide > .qbot-textarea { width: 100%; }
.qbot-textarea { display: block; width: 100%; min-width: 0; min-height: 56px; max-height: 240px; padding: 8px 11px; border: 1px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 8px; outline: none; resize: vertical; color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-bg-layer-1, #fff); font: inherit; font-size: 13px; line-height: 1.6; transition: border-color .16s ease, box-shadow .16s ease; }
.qbot-textarea:focus { border-color: #4e5969; box-shadow: 0 0 0 3px rgb(78 89 105 / 10%); }
.qbot-textarea::placeholder { color: var(--dsw-alias-label-tertiary, #8f959e); font-family: inherit; }

/* ── 详情页：工作区卡片 ───────────────────────────────────────────────── */
.qbot-workspaceCard { min-width: 0; display: flex; flex-direction: column; gap: 9px; padding: 13px 14px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-workspaceCardHead { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; column-gap: 16px; row-gap: 8px; }
.qbot-workspacePath { min-width: 0; display: block; padding: 8px 11px; border: 1px dashed var(--dsw-alias-border-l2, #dfe1e5); border-radius: 8px; color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-bg-layer-1, #fff); font: 12px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace; overflow-wrap: anywhere; }

/* ── 详情页：运行统计指标卡 ───────────────────────────────────────────── */
.qbot-metricGrid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
.qbot-metric { min-width: 0; display: flex; flex-direction: column; gap: 5px; padding: 12px 13px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-left: 3px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 10px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-metric[data-tone="success"] { border-left-color: var(--dsw-alias-state-success-primary, #20a162); }
.qbot-metric[data-tone="warning"] { border-left-color: var(--dsw-alias-state-warn-primary, #d97706); }
.qbot-metric[data-tone="error"] { border-left-color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-metricLabel { color: var(--dsw-alias-label-secondary, #646a73); font-size: 11px; line-height: normal; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.qbot-metricValue { color: var(--dsw-alias-label-primary, #1f2329); font-size: 19px; line-height: 1.2; font-weight: 700; font-variant-numeric: tabular-nums; }
.qbot-metric[data-tone="error"] .qbot-metricValue { color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-metric[data-tone="warning"] .qbot-metricValue { color: var(--dsw-alias-state-warn-primary, #d97706); }

/* ── 响应式 ───────────────────────────────────────────────────────────── */
@media (max-width: 900px) {
  .qbot-metricGrid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 760px) {
  .qbot-emptyView { grid-template-columns: 1fr; }
  .qbot-emptyBrand { display: none; }
  .qbot-credentialForm, .qbot-grid, .qbot-switches { grid-template-columns: 1fr; }
  .qbot-heroStats { grid-template-columns: 1fr; }
  .qbot-heroMain { flex-wrap: wrap; }
  .qbot-sectionHead { flex-direction: column; align-items: stretch; }
  .qbot-settingRow, .qbot-workspaceCardHead { grid-template-columns: minmax(0, 1fr); }
  .qbot-settingControl { justify-content: flex-start; min-width: 0; }
  .qbot-settingSelect { max-width: none; }
}
@media (pointer: coarse) {
  .qbot-segTabs button, .qbot-switchRow { min-height: 44px; }
}
`;
