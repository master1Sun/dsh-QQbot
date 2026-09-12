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
 * 模块契约对齐 dsh-im / dsh 0.1.5-rc.1：导出 name/apply/inject，
 * ctx.slots.inject("settings.section", () => ctx.slots.register(spec, 函数组件))。
 *
 * 模块拆分（单一入口不变：src/client/index.tsx，esbuild 打包为 lib/client.js）：
 *   types.ts / meta.ts / glyphs.tsx / ui.tsx / styles.ts — 类型、配置元数据、
 *   图标、基础控件与工具、样式表；add-bot-view.tsx — 添加机器人视图；
 *   dialogs/*.tsx — 目录选择 / 定时消息 / 按群覆盖 / 消息归档四个弹窗。
 */
import * as React from "react";
import { QQBOT_LOCALE_NAMESPACE, fmt, h, hostDictionaries, setLocale, setTranslator, t } from "./i18n/index.js";
import {
  EMPTY_CATALOGS,
  type BotInfo,
  type Reply,
  type BotsData,
  type Catalogs,
  type Option,
  type RpcCall,
  type Tone,
} from "./types.js";
import { COOLDOWN_OPTIONS, FIELD_HELP, FIELD_LABELS, SWITCH_DEFS, cooldownLabel } from "./meta.js";
import { QqBotGlyph, QqBotGuideIcon, QqLogoGlyph } from "./glyphs.js";
import {
  ConfirmHost,
  OnlineBadge,
  SettingRow,
  StateLabel,
  TextArea,
  confirmDlg,
  countdownBadge,
  errText,
  formatTime,
  presetOptions,
  useCountdown,
  val,
} from "./ui.js";
import { CSS_TEXT } from "./styles.js";
import { AddBotView } from "./add-bot-view.js";
import { ArchiveDialog } from "./dialogs/archive-dialog.js";
import { OverrideDialog } from "./dialogs/override-dialog.js";
import { ScheduleDialog } from "./dialogs/schedule-dialog.js";
import { WorkspacePickerDialog } from "./dialogs/workspace-picker.js";
import { notifyBotsChanged, onBotsChanged, setRpcCall } from "./right-panel/api.js";
import { ScheduleTab } from "./right-panel/ScheduleTab.js";
import { TitleView } from "./right-panel/TitleView.js";

export const name = "qqbot-settings";
// locale：宿主语言服务（ctx.locale.register/bind），支撑设置界面双语。
// sidebarRightTabs / sidebarRight：新版右侧面板（定时消息 tab）。
export const inject = ["slots", "connection", "locale", "sidebarRightTabs", "sidebarRight"];

declare const __PLUGIN_VERSION__: string;

const RPC_CHANNEL = "/qqbot-settings";

/** 右侧面板 tab 的身份（包名）；也是主体/标题注册时用的 key。 */
const QQBOT_PANEL_ID = "@sunjuntao/dsh-qqbot";
/** tab 的 kind（sidebarRight.openTab(kind) 用）。 */
const QQBOT_PANEL_KIND = "qqbot-sched";

/** 提示条自动消失时长（秒）：倒计时归零后清空并隐藏。 */
const NOTICE_TTL_SECONDS = 8;

export function QqbotSettingsTab({ rpcCall }: { rpcCall: RpcCall }) {
  const [status, setStatus] = React.useState<any>(null);
  const [bots, setBots] = React.useState<BotsData | null>(null);
  const [catalogs, setCatalogs] = React.useState<Catalogs>(EMPTY_CATALOGS);
  const [form, setForm] = React.useState<Record<string, any>>({});
  const [page, setPage] = React.useState<"list" | "add" | "detail">("list");
  const [detailAppId, setDetailAppId] = React.useState("");
  // ── 弹窗开关：内容与状态由各弹窗组件自管理（挂载即拉取数据） ──────────────
  const [scheduleOpen, setScheduleOpen] = React.useState(false);
  const [archiveOpen, setArchiveOpen] = React.useState(false);
  const [pickerOpen, setPickerOpen] = React.useState(false);
  /** 按群配置编辑目标 openid；空串=新增覆盖，null=弹窗关闭。 */
  const [overrideEdit, setOverrideEdit] = React.useState<string | null>(null);

  const [notice, setNotice] = React.useState("");
  const [loadError, setLoadError] = React.useState("");
  const [refreshing, setRefreshing] = React.useState(false);
  const [reconnecting, setReconnecting] = React.useState(false);
  const [update, setUpdate] = React.useState<{ busy: boolean; message: string; done: boolean }>({
    busy: false,
    message: "",
    done: false,
  });

  const refresh = React.useCallback(async (appId?: string) => {
    try {
      const [s, c, b, cat] = await Promise.all([
        rpcCall("status"),
        rpcCall("config.get", appId ? { appId } : {}),
        rpcCall("bots.list"),
        rpcCall("catalogs"),
      ]);
      if (s.ok) setStatus(val(s) ?? null);
      else setLoadError(errText(s.error ?? t("common.statusReadFailed")));
      if (c.ok) {
        const stored = val(c)?.config ?? {};
        setForm({ ...stored });
      }
      if (b.ok) setBots(val(b) ?? null);
      // 广播机器人列表可能已变化：右侧面板 tab 的显隐立即同步（不等轮询）。
      notifyBotsChanged();
      if (cat.ok) setCatalogs({ ...EMPTY_CATALOGS, ...(val(cat) ?? {}) });
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : String(error));
    }
  }, [rpcCall]);
  React.useEffect(() => {
    void refresh();
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

  // ── 行为配置（对齐 dsh-im：下拉/开关变更即保存热生效；作用于当前详情机器人） ──
  const saveField = async (key: string, value: unknown): Promise<{ ok: boolean; error?: string; data?: any }> => {
    setForm((prev) => ({ ...prev, [key]: value }));
    const res = await rpcCall("config.save", { appId: detailAppId || undefined, [key]: value });
    if (!res.ok) {
      const message = fmt("notice.saveFailedPrefix", errText(res.error));
      setNotice(message);
      return { ok: false, error: message };
    }
    setNotice("");
    await refresh(detailAppId || undefined);
    return { ok: true, data: val(res) };
  };

  // 弹窗是否打开（ref 供 effect 读取，避免加入依赖导致弹窗关闭时重复触发滚动）。
  const dialogOpenRef = React.useRef(false);
  dialogOpenRef.current = Boolean(scheduleOpen || archiveOpen || pickerOpen || overrideEdit !== null);

  // 提示条渲染在页面顶部，长页面滚动后可能落在视口外：提示变化时自动滚动到可见区域。
  // 弹窗打开期间不滚动：弹窗内有内联提示，且弹窗保存成功后不应把主界面拉回顶部。
  React.useEffect(() => {
    if (!notice || dialogOpenRef.current) return;
    const el = document.getElementById("qbot-notice");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [notice]);

  // 提示条自动消失：8 秒倒计时后清空；倒计时秒数实时显示在提示条右侧（见 countdownBadge）。
  const noticeLeft = useCountdown(notice, NOTICE_TTL_SECONDS, () => setNotice(""));

  // ── 运行统计刷新 ─────────────────────────────────────────────────────────────
  const refreshStats = async () => {
    setRefreshing(true);
    try { await refresh(); } finally { setRefreshing(false); }
  };

  // ── 运行统计复位：清零该机器人的持久计数（stats.reset 后刷新展示） ───────────
  const [resetting, setResetting] = React.useState(false);
  const resetStats = async () => {
    setResetting(true);
    try {
      const res = await rpcCall("stats.reset", detailAppId ? { appId: detailAppId } : {});
      if (res.ok) await refresh();
    } finally {
      setResetting(false);
    }
  };

  // ── 机器人卡片操作 ──────────────────────────────────────────────────────────
  const setPrimaryBot = async (appId: string) => {
    setNotice("");
    const res = await rpcCall("bots.setPrimary", { appId });
    setNotice(res.ok ? t("notice.setPrimary") : fmt("notice.operationFailedPrefix", errText(res.error)));
    if (res.ok) await refresh();
  };

  /** 启用 / 停用：停用的机器人不会建立 QQ 长连接，也不会接收或回复消息。 */
  const toggleEnabled = async (bot: BotInfo, enabled: boolean) => {
    setNotice("");
    const res = await rpcCall("bots.enable", { appId: bot.appId, enabled });
    setNotice(res.ok ? (enabled ? t("notice.botEnabled") : t("notice.botDisabled")) : fmt("notice.operationFailedPrefix", errText(res.error)));
    if (res.ok) await refresh();
  };

  const removeBot = async (bot: BotInfo) => {
    if (!(await confirmDlg({ message: fmt("conn.removeConfirm", bot.appIdMasked), danger: true }))) return;
    setNotice("");
    const res = await rpcCall("bots.remove", { appId: bot.appId });
    if (res.ok) {
      await refresh();
      setPage("list");
      setNotice(t("notice.botRemoved"));
    } else {
      setNotice(fmt("notice.removeFailedPrefix", errText(res.error)));
    }
  };

  // ── 重试连接：按当前凭据强制重建 WebSocket 长连接 ────────────────────────────
  const retryConnection = async () => {
    setNotice("");
    setReconnecting(true);
    try {
      const res = await rpcCall("bots.reconnect", detailAppId ? { appId: detailAppId } : {});
      if (res.ok) await refresh();
      setNotice(res.ok ? t("notice.reconnectStarted") : fmt("notice.retryFailedPrefix", errText(res.error)));
    } finally {
      setReconnecting(false);
    }
  };

  // ── 版本检查与自更新（host: update.check / update.apply，源 GitHub master 分支） ──
  const runUpdateCheck = async () => {
    setUpdate({ busy: true, message: t("update.checking"), done: false });
    try {
      const res = await rpcCall("update.check");
      if (!res.ok) {
        setUpdate({ busy: false, message: fmt("notice.checkFailedPrefix", errText(res.error)), done: false });
        return;
      }
      const v = (val(res) ?? {}) as { current?: string; latest?: string; hasUpdate?: boolean };
      if (!v.hasUpdate) {
        setUpdate({ busy: false, message: fmt("update.noNewVersion", v.current || "?"), done: false });
        return;
      }
      // 检查到新版本：自动更新（下载 → 备份旧文件 → 覆盖安装目录）。
      setUpdate({ busy: true, message: fmt("update.found", v.latest ?? "?"), done: false });
      const applied = await rpcCall("update.apply");
      if (applied.ok) {
        const r = (val(applied) ?? {}) as { updatedTo?: string };
        setUpdate({
          busy: false,
          message: fmt("update.updatedTo", r.updatedTo ?? v.latest ?? "?"),
          done: true,
        });
      } else {
        setUpdate({ busy: false, message: fmt("notice.updateFailedPrefix", errText(applied.error)), done: false });
      }
    } catch (error) {
      setUpdate({
        busy: false,
        message: fmt("notice.checkFailedPrefix", error instanceof Error ? error.message : String(error)),
        done: false,
      });
    }
  };

  // 检查更新的提示条不常驻：非进行中的消息（成功/失败/无新版本）8 秒后自动消失；
  // 进行中（busy）的进度提示保留，busy 结束后重新计时。
  React.useEffect(() => {
    if (!update.message || update.busy) return undefined;
    const timer = setTimeout(() => setUpdate((u) => ({ ...u, message: "" })), 8000);
    return () => clearTimeout(timer);
  }, [update.message, update.busy]);

  const groupOverrides = (form.groupOverrides && typeof form.groupOverrides === "object" && !Array.isArray(form.groupOverrides))
    ? form.groupOverrides as Record<string, Record<string, unknown>>
    : {};

  /** 覆盖字段的简短摘要（列表行展示）。 */
  const overrideSummary = (ov: Record<string, unknown>): string => {
    const parts: string[] = [];
    if (ov.groupFullReply !== undefined) parts.push(fmt("group.summaryFullReply", ov.groupFullReply ? t("sched.form.onShort") : t("sched.form.offShort")));
    if (ov.valueThreshold !== undefined) parts.push(fmt("group.summaryThreshold", String(ov.valueThreshold)));
    if (ov.atContextMessages !== undefined) parts.push(fmt("group.summaryContext", String(ov.atContextMessages)));
    if (ov.groupCooldownMs !== undefined) parts.push(fmt("group.summaryGroupCooldown", cooldownLabel(Number(ov.groupCooldownMs))));
    if (ov.senderCooldownMs !== undefined) parts.push(fmt("group.summarySenderCooldown", cooldownLabel(Number(ov.senderCooldownMs))));
    if (ov.replyChunkChars !== undefined) parts.push(fmt("group.summaryChunk", String(ov.replyChunkChars)));
    if (ov.maxRepliesPerMessage !== undefined) parts.push(fmt("group.summaryMaxReplies", String(ov.maxRepliesPerMessage)));
    if (ov.markdownReply !== undefined) parts.push(fmt("group.summaryMarkdown", ov.markdownReply ? t("sched.form.onShort") : t("sched.form.offShort")));
    if (ov.memoryEnabled !== undefined) parts.push(fmt("group.summaryMemory", ov.memoryEnabled ? t("sched.form.onShort") : t("sched.form.offShort")));
    if (Array.isArray(ov.bannedWords) && ov.bannedWords.length > 0) parts.push(fmt("group.summaryBannedWords", ov.bannedWords.length));
    if (typeof ov.agentPresetChat === "string" && ov.agentPresetChat) parts.push(fmt("group.summaryChatPreset", ov.agentPresetChat));
    return parts.length > 0 ? parts.join(" · ") : t("group.noOverrides");
  };

  const removeOverride = async (openid: string) => {
    if (!(await confirmDlg({ message: fmt("group.removeConfirm", `${openid.slice(0, 10)}…`), danger: true }))) return;
    const next: Record<string, Record<string, unknown>> = { ...groupOverrides };
    delete next[openid];
    await saveField("groupOverrides", next);
  };

  // ── 下拉选项 ────────────────────────────────────────────────────────────────
  /**
   * 模型按供应商分组（group 顺序即服务端返回顺序）；无 id 的脏数据直接过滤。
   * 由于「默认模型」可能同时出现在目录的多个分组里（id 相同），这里按 id 去重——否则
   * `<select>` 只会选中第一条，用户选下面那条会「跳」回上面那条（表现为跳回默认）。
   * 另外：当前已存模型若不在目录中（如自定义/本地模型），补一条，避免下拉找不到匹配
   * 而回退显示第一项「跟随默认模型」。
   */
  const modelGroups = (): Array<{ label: string; options: Option[] }> => {
    const groups: Array<{ label: string; options: Option[] }> = [];
    const index = new Map<string, number>();
    const seen = new Set<string>();
    const push = (groupLabel: string, option: Option): void => {
      if (seen.has(option.value)) return;
      seen.add(option.value);
      const at = index.get(groupLabel);
      if (at === undefined) {
        index.set(groupLabel, groups.length);
        groups.push({ label: groupLabel, options: [option] });
      } else {
        groups[at].options.push(option);
      }
    };
    const cur = String(form.model ?? "").trim();
    if (cur && !catalogs.models.some((m) => m && typeof m.id === "string" && m.id === cur)) {
      push(t("sched.scopeCurrent"), { value: cur, label: fmt("notice.currentSuffix", cur) });
    }
    for (const m of catalogs.models) {
      if (!m || typeof m.id !== "string" || !m.id) continue;
      const slash = m.id.indexOf("/");
      const label = String(m.group ?? (slash > 0 ? m.id.slice(0, slash) : t("session.model")));
      push(label, { value: m.id, label: typeof m.label === "string" && m.label ? m.label : m.id });
    }
    return groups;
  };

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
    if (!bot.enabled) return { tone: "neutral", text: t("status.disabled") };
    return bot.ws?.state === "connected"
      ? { tone: "success", text: t("status.connected") }
      : bot.ws?.state === "connecting"
        ? { tone: "warning", text: t("status.connecting") }
        : { tone: "error", text: t("status.disconnected") };
  };

  const globalBadge = (() => {
    const all = bots?.bots ?? [];
    const primary = all.find((b) => b.primary);
    const anyConnected = all.some((b) => b.ws?.state === "connected");
    if (primary?.ws?.state === "connected") return OnlineBadge({ tone: "success", text: t("status.primaryConnected") });
    if (anyConnected) return OnlineBadge({ tone: "warning", text: t("status.someConnected") });
    if (all.length) return OnlineBadge({ tone: "error", text: t("status.allDisconnected") });
    return OnlineBadge({ tone: "neutral", text: t("status.noBot") });
  })();

  // ═══ 列表视图（panel 内容） ════════════════════════════════════════════════
  const listView = h("div", { className: "qbot-channelPage" },
    loadError ? h("div", { className: "qbot-statusNotice", role: "alert" }, loadError) : null,
    notice ? h("div", { className: "qbot-infoNotice", id: "qbot-notice", role: "status", key: `notice-${notice}` },
      h("span", { className: "qbot-noticeText", key: "text" }, notice), countdownBadge(noticeLeft)) : null,
    h("div", { className: "qbot-listHeading" },
      h("h3", null, fmt("status.configuredBots", bots?.bots.length ?? 0)),
      h("button", {
        className: "qbot-btn qbot-btnPrimary", type: "button",
        onClick: () => { setNotice(""); setPage("add"); },
      }, t("list.addBot"))),
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
                  h("p", null, fmt("notice.sourceSavedAt", bot.source === "qr" ? t("qr.tabScan") : t("qr.tabManual"), formatTime(bot.savedAt))))),
              h("div", { className: "qbot-botTools" },
                h("div", { className: "qbot-botHealthGroup" },
                  StateLabel({ tone: st.tone, text: st.text }),
                  h("span", { className: "qbot-lastChecked" }, bot.primary ? t("status.primaryBot") : (bot.enabled ? t("status.enabled") : t("status.disabled"))))),
            h("div", { className: "qbot-botChevron", "aria-hidden": "true" }))));
      }),
      (bots?.bots.length ?? 0) === 0
        ? h("div", { className: "qbot-surfaceCard" },
            h("div", { className: "qbot-surfaceBody qbot-emptyView" },
              h("div", { className: "qbot-emptyBrand", "aria-hidden": "true" }, h(QqLogoGlyph)),
              h("div", { className: "qbot-emptyCopy" },
                h("h3", null, t("list.empty")),
                h("p", null, t("list.emptyHint")))))
        : null,
      h("p", { className: "qbot-hint" }, t("list.cardHint"))));


  const wsInfo = detailBot ? {
    state: String(detailBot.ws?.state ?? "idle"),
    lastConnectedAt: typeof detailBot.ws?.lastConnectedAt === "number" ? detailBot.ws.lastConnectedAt : null,
    lastError: typeof detailBot.ws?.lastError === "string" ? detailBot.ws.lastError : null,
  } : null;
  const connState: { tone: Tone; text: string } = !detailBot
    ? { tone: "neutral", text: t("status.notConfigured") }
    : detailBot.ws?.state === "connected" ? { tone: "success", text: t("status.running") }
      : wsInfo?.state === "connecting" ? { tone: "warning", text: t("status.connecting") }
        : { tone: "error", text: t("status.notReady") };
  const lastChecked = wsInfo?.lastConnectedAt
    ? formatTime(wsInfo.lastConnectedAt)
    : t("status.unchecked");
  const cardSummary = notice
    || (detailBot && detailBot.ws?.state !== "connected"
      ? (wsInfo?.lastError ? fmt("notice.qqNotReadyDetail", wsInfo.lastError) : t("status.qqNotReadyDefault"))
      : "");

  /** WebSocket 内部状态 → 中文标签，避免把 idle/connecting 之类原样丢给用户。 */
  const WS_LABELS: Record<string, string> = {
    idle: t("status.idle"),
    connecting: t("status.connectingShort"),
    connected: t("status.connected"),
    reconnecting: t("status.reconnecting"),
    closed: t("status.disconnectedShort"),
    error: t("status.error"),
  };
  const wsLabel = wsInfo ? (WS_LABELS[wsInfo.state] ?? wsInfo.state) : "—";
  const wsTone: Tone =
    wsInfo?.state === "connected" ? "success"
      : wsInfo?.state === "connecting" || wsInfo?.state === "reconnecting" ? "warning"
        : wsInfo?.state === "closed" || wsInfo?.state === "error" ? "error"
          : "neutral";

  /**
   * 分区卡片：标题 + 一句说明 + 主体 + 右上角操作，构成页面的第一层层次。
   * 默认收起（用原生 details/summary，展开状态由浏览器保持，
   * 表单保存触发的重渲染不会重置折叠状态）；opts.open=true 可单独默认展开。
   */
  const sectionCard = (title: string, desc: string, body: any, action?: any, opts?: { open?: boolean; danger?: boolean }) =>
    h("details", {
        className: opts?.danger ? "qbot-section is-danger" : "qbot-section",
        open: opts?.open ?? false,
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
          { label: t("stats.received"), value: String(c.received ?? 0), tone: "neutral" as Tone },
          { label: t("stats.sessions"), value: String(c.sessions ?? 0), tone: "neutral" as Tone },
          { label: t("stats.passive"), value: String(c.replies ?? 0), tone: "success" as Tone },
          { label: t("stats.proactive"), value: String(c.proactive ?? 0), tone: "neutral" as Tone },
          { label: t("stats.bound"), value: String(detailBot.boundSessions ?? 0), tone: "neutral" as Tone },
          { label: t("stats.pendingQueue"), value: String(pending), tone: (pending > 0 ? "warning" : "neutral") as Tone },
          { label: t("stats.groupBuffer"), value: String(buffered), tone: "neutral" as Tone },
          { label: t("stats.errors"), value: String(errors), tone: (errors > 0 ? "error" : "neutral") as Tone },
        ];
      })()
    : [];

  const detailView = h("div", { className: "qbot-channelPage" },
    // ── 顶部导航：返回 + 机器人身份（QQ 图标 / 编号 / 启用状态 / 连接状态），整条 sticky 吸顶 ──
    h("div", { className: "qbot-detailNav" },
      h("button", { className: "qbot-btn", type: "button", onClick: () => { setPage("list"); setNotice(""); } }, t("add.backToList")),
      h("div", { className: "qbot-detailIdentity" },
        h("span", { className: "qbot-detailAvatar", "aria-hidden": "true" }, h(QqLogoGlyph)),
        h("strong", null, detailBot ? detailBot.appIdMasked : t("detail.noneSelected")),
        detailBot
          ? h("span", { className: `qbot-chip${detailBot.primary ? " is-active" : ""}` },
              detailBot.primary ? t("status.primaryBot") : (detailBot.enabled ? t("status.enabled") : t("status.disabled")))
          : null,
        h("span", { className: "qbot-onlineBadge qbot-detailNavState" },
          h("span", { className: "qbot-stateDot", "data-tone": connState.tone }),
          connState.text))),
    loadError ? h("div", { className: "qbot-statusNotice", role: "alert" }, loadError) : null,

    // ── 概览：机器人身份 + 连接状态 ──
    h("section", { className: "qbot-hero" },
      h("div", { className: "qbot-heroMain" },
        h("span", { className: "qbot-heroAvatar", "aria-hidden": "true" }, h(QqLogoGlyph)),
        h("div", { className: "qbot-heroIdentity" },
          h("div", { className: "qbot-heroNameRow" },
            h("h2", null, detailBot ? detailBot.appIdMasked : t("detail.noneSelected")),
            detailBot
              ?               h("span", { className: `qbot-chip${detailBot.primary ? " is-active" : ""}` },
                  detailBot.primary ? t("status.primaryBot") : (detailBot.enabled ? t("status.enabled") : t("status.disabled")))
              : null),
          h("div", { className: "qbot-heroMeta" },
            h("span", null, detailBot ? (detailBot.source === "qr" ? t("qr.tabScan") : t("qr.tabManual")) : "—"),
            h("span", { className: "qbot-metaDot", "aria-hidden": "true" }),
            h("span", null, detailBot ? fmt("notice.savedAtPrefix", formatTime(detailBot.savedAt)) : "—"))),
        h("div", { className: "qbot-heroActions" },
          h("button", {
            className: "qbot-btn", type: "button",
            disabled: !detailBot,
            onClick: () => setScheduleOpen(true),
          }, t("sched.tabScheduled")),
          h("button", {
            className: "qbot-btn", type: "button",
            disabled: !detailBot,
            onClick: () => setArchiveOpen(true),
          }, t("archive.tab")))),
      h("div", { className: "qbot-heroStats" },
        h("div", { className: "qbot-heroStat" },
          h("span", { className: "qbot-heroStatLabel" }, t("detail.connectionStatus")),
          h("div", { className: "qbot-heroStatValue" },
            h("span", { className: "qbot-stateDot", "data-tone": connState.tone }),
            h("strong", null, connState.text))),
        h("div", { className: "qbot-heroStat" },
          h("span", { className: "qbot-heroStatLabel" }, "WebSocket"),
          h("div", { className: "qbot-heroStatValue" },
            h("span", { className: "qbot-stateDot", "data-tone": wsTone }),
            h("strong", null, wsLabel))),
        h("div", { className: "qbot-heroStat" },
          h("span", { className: "qbot-heroStatLabel" }, t("detail.lastConnected")),
          h("div", { className: "qbot-heroStatValue" }, h("strong", null, lastChecked)))),
      cardSummary ? h("div", { className: "qbot-heroFoot", id: "qbot-notice", role: "status" },
        h("span", { className: "qbot-noticeText", key: "text" }, cardSummary),
        notice ? countdownBadge(noticeLeft) : null) : null),

    // ── 运行统计（持久化：跨重启累计，stats/<appId>.json；可复位清零） ──
    status
      ? sectionCard(t("stats.title"), t("stats.hint"),
          h("div", { className: "qbot-metricGrid" },
            metrics.map((m) => metricCard(m.label, m.value, m.tone))),
          h("div", { className: "qbot-sectionActions" },
            h("button", {
              className: "qbot-btn", type: "button",
              disabled: refreshing,
              onClick: () => void refreshStats(),
            }, refreshing ? t("common.refreshing") : t("common.refresh")),
            h("button", {
              className: "qbot-btn qbot-btnDanger", type: "button",
              disabled: resetting || refreshing,
              title: t("stats.resetHint"),
              onClick: () => void resetStats(),
            }, resetting ? t("common.resetting") : t("common.reset"))))
      : null,

    // ── 会话与模型 ──
    sectionCard(t("session.title"), t("session.hint"),
      h("div", { className: "qbot-settingList" },
        // 工作区：路径较长，独占一行展示
        h("div", { className: "qbot-workspaceCard" },
          h("div", { className: "qbot-workspaceCardHead" },
            h("div", { className: "qbot-settingCopy" },
              h("span", { className: "qbot-settingTitle" }, t("session.workspace")),
              h("span", { className: "qbot-settingDesc" },
                t("session.workspaceHint"))),
            h("button", { className: "qbot-btn", type: "button", onClick: () => setPickerOpen(true) }, t("session.chooseDir"))),
          h("code", { className: "qbot-workspacePath", title: String(form.workspacePath ?? "") },
            String(form.workspacePath ?? "").trim() || t("session.defaultWorkspace"))),
        SettingRow({
          label: t("session.model"),
          desc: t("session.modelHint"),
          control: h("select", {
            // key 随「当前值 + 目录规模」变化：目录异步到达时强制重挂载，
            // 避免「value 先于 option 设置」导致 select 卡在第一项「跟随默认模型」。
            key: `model-${String(form.model ?? "")}-${catalogs.models.length}`,
            className: "qbot-settingSelect",
            value: String(form.model ?? ""),
            onChange: (e: any) => void saveField("model", e.target.value),
            "aria-label": t("session.model"),
          },
            h("option", { value: "" }, t("session.followDefaultModel")),
            modelGroups().map((g) => h("optgroup", { key: g.label, label: g.label },
              g.options.map((o) => h("option", { key: o.value, value: o.value }, o.label))))),
        }),
        SettingRow({
          label: "Agent Preset",
          desc: t("session.presetHint"),
          control: h("select", {
            className: "qbot-settingSelect",
            value: String(form.agentPreset ?? ""),
            onChange: (e: any) => void saveField("agentPreset", e.target.value),
            "aria-label": "Agent Preset",
          }, presetOptions(catalogs.agentPresets).map((o) =>
            h("option", { key: o.value, value: o.value }, o.label))),
        }),
        // 群聊聊天 Preset（agentPresetChat）与 AppSecret 凭据引用（secretEnv）已从界面移除，
        // 仅通过 bots.json 配置——默认 agentPresetChat 留空即跟随上方 Agent Preset（见 rule.ts）。
      )),

    // ── 消息与回复策略（开关） ──
    sectionCard(t("policy.title"), t("policy.hint"),
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
          label: t("policy.quote"),
          desc: t("policy.quoteHint"),
          control: h("select", {
            className: "qbot-settingSelect",
            value: String(form.quoteReply ?? "at"),
            onChange: (e: any) => void saveField("quoteReply", e.target.value),
            "aria-label": t("policy.quoteScope"),
          },
            h("option", { value: "off" }, t("policy.quoteScopeOff")),
            h("option", { value: "at" }, t("policy.quoteScopeAt")),
            h("option", { value: "all" }, t("policy.quoteScopeAll"))),
        }),
        // 语音相关配置（语音消息处理 / ASR / STT / TTS）已从界面移除，仅通过 bots.json 配置——
        // 详见 meta.ts SWITCH_DEFS 顶部注释。
        SettingRow({
          rowKey: "replyLocale",
          label: t("replyLocale.label"),
          desc: t("replyLocale.hint"),
          control: h("select", {
            className: "qbot-settingSelect",
            value: String(form.replyLocale ?? "zh"),
            onChange: (e: any) => void saveField("replyLocale", e.target.value),
            "aria-label": t("replyLocale.labelShort"),
          },
            h("option", { value: "zh" }, t("replyLocale.zh")),
            h("option", { value: "en" }, "English")),
        }),
        // 欢迎语开关与文案已从界面移除（默认开启），仅通过 bots.json 配置 welcomeEnabled / welcomeMessage。
        SettingRow({
          rowKey: "bannedWords",
          wide: true,
          label: t("feature.bannedWords"),
          desc: t("feature.bannedWordsHint"),
          control: TextArea({
            rows: 3,
            defaultValue: Array.isArray(form.bannedWords) ? (form.bannedWords as string[]).join(", ") : "",
            placeholder: t("feature.bannedWordsPlaceholder"),
            onBlur: (e: any) => {
              const words = String(e?.target?.value ?? "").split(/[,，]/).map((w) => w.trim()).filter(Boolean);
              void saveField("bannedWords", words);
            },
            "aria-label": t("feature.bannedWords"),
          }),
        }))),

    // ── 回复调优（数值） ──
    sectionCard(t("tune.title"), t("tune.hint"),
      h("div", { className: "qbot-settingList" },
        numSelect("valueThreshold", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (n) => (n === 0 ? t("tune.allZero") : fmt("override.scoreOption", n))),
        numSelect("atContextMessages", [0, 2, 4, 6, 8, 10, 15, 20, 30, 50], (n) => (n === 0 ? t("tune.offZero") : fmt("override.countOption", n))),
        numSelect("groupCooldownMs", COOLDOWN_OPTIONS, cooldownLabel),
        numSelect("senderCooldownMs", COOLDOWN_OPTIONS, cooldownLabel),
        numSelect("replyChunkChars", [200, 300, 500, 800, 1000, 1500, 2000, 3000, 4000]),
        numSelect("maxRepliesPerMessage", [1, 2, 3, 4, 5]),
        numSelect("quoteMaxChars", [40, 60, 80, 100, 120, 160, 200, 300, 500], (n) => fmt("override.charsOption", n)),
        numSelect("quotaPerDay", [0, 10, 20, 30, 50, 100, 200, 500], (n) => (n === 0 ? t("quota.unlimitedZero") : fmt("override.perDayOption", n)))),
      undefined),

    // ── 按群配置（群级覆盖） ──
    sectionCard(t("group.title"), t("group.hint"),
      h("div", { className: "qbot-settingList" },
        Object.keys(groupOverrides).length === 0
          ? h("div", { className: "qbot-modalState" }, t("group.empty"))
          : Object.entries(groupOverrides).map(([openid, ov]) =>
              h("div", { key: openid, className: "qbot-schedRow" },
                h("div", { className: "qbot-schedMain" },
                  h("div", { className: "qbot-schedTop" },
                    h("span", { className: "qbot-chip is-active" }, t("group.group")),
                    h("code", { className: "qbot-mono", title: openid },
                      `${openid.slice(0, 12)}${openid.length > 12 ? "…" : ""}`)),
                  h("div", { className: "qbot-schedContent" }, overrideSummary(ov))),
                h("div", { className: "qbot-schedOps" },
                  h("button", { className: "qbot-btn qbot-schedEdit", type: "button", onClick: () => setOverrideEdit(openid) }, t("common.edit")),
                  h("button", { className: "qbot-btn qbot-btnDanger", type: "button", onClick: () => void removeOverride(openid) }, t("common.delete"))))),
        h("div", { className: "qbot-editActions" },
          h("span", { className: "qbot-hint" }, t("group.overrideHint")),
          h("button", { className: "qbot-btn qbot-btnPrimary", type: "button", onClick: () => setOverrideEdit("") }, t("group.add")))),
      undefined),

    // ── 连接与移除 ──
    sectionCard(t("conn.title"), t("conn.hint"),
      h("div", { className: "qbot-settingList" },
          detailBot
            ? SettingRow({
                label: detailBot.enabled ? t("conn.disableBot") : t("conn.enableBot"),
                desc: t("conn.disableHint"),
                control: h("button", {
                  className: "qbot-btn", type: "button",
                  disabled: detailBot.primary,
                  onClick: () => void toggleEnabled(detailBot, !detailBot.enabled),
                }, detailBot.enabled ? t("conn.disable") : t("conn.enable")),
              })
            : null,
          detailBot && !detailBot.primary
            ? SettingRow({
                label: t("conn.setPrimary"),
                desc: t("conn.primaryHint"),
                control: h("button", {
                  className: "qbot-btn", type: "button",
                  onClick: () => void setPrimaryBot(detailBot.appId),
                }, t("conn.setPrimary")),
              })
            : null,
          SettingRow({
            label: detailBot?.ws?.state === "connected" ? t("conn.check") : t("conn.retry"),
            desc: t("conn.retryHint"),
            control: h("button", {
              className: "qbot-btn", type: "button",
              disabled: reconnecting || !detailBot,
              onClick: () => void retryConnection(),
            }, reconnecting ? t("conn.checking") : detailBot?.ws?.state === "connected" ? t("conn.check") : t("conn.retry")),
          }),
          detailBot
            ? SettingRow({
                label: t("conn.remove"),
                desc: t("conn.removeHint"),
                control: h("button", {
                  className: "qbot-btn qbot-btnDanger", type: "button",
                  onClick: () => void removeBot(detailBot),
                }, t("conn.remove")),
              })
            : null), undefined, { danger: true }));

  const addBotView = h(AddBotView, {
    rpcCall,
    notice,
    setNotice,
    onBotReady: async (appId: string) => {
      await refresh();
      setDetailAppId(appId);
      setPage("detail");
    },
    onBack: () => setPage("list"),
  });

  // ═══ 页面骨架：标题栏 + 面板（无左侧导航栏，导航由面板内按钮承担） ═══════════

  return h("section", { className: "qbot-page", "aria-label": t("app.settingsTitle") },
    h("header", { className: "qbot-title" },
      h("div", { className: "qbot-brand" },
        h(QqBotGlyph, { className: "qbot-brandGlyph", uid: "brand" }),
        h("div", { className: "qbot-brandText" },
          h("div", { className: "qbot-brandHeading" },
            h("strong", { className: "qbot-brandName" }, t("app.title")),
            h("span", { className: "qbot-brandVersion" }, `v${typeof __PLUGIN_VERSION__ === "string" ? __PLUGIN_VERSION__ : "0.0.2"}`),
            h("button", {
              className: `qbot-btn qbot-updateBtn${update.done ? " is-done" : ""}`,
              type: "button",
              disabled: update.busy,
              title: t("update.hint"),
              onClick: () => void runUpdateCheck(),
            }, update.busy ? t("conn.checking") : update.done ? t("update.updated") : t("update.check"))),
          h("p", null, t("app.subtitle")))),
      h("div", { className: "qbot-titleActions" }, globalBadge)),
    update.message
      ? h("div", { className: "qbot-infoNotice qbot-updateNotice", role: "status" }, update.message)
      : null,
      h("div", { className: "qbot-panel", id: "qbot-panel" },
        page === "list" ? listView : page === "add" ? addBotView : detailView),
    pickerOpen
      ? h(WorkspacePickerDialog, {
          rpcCall,
          initialPath: String(form.workspacePath ?? "").trim(),
          onClose: () => setPickerOpen(false),
          onPick: (dir: string) => {
            setPickerOpen(false);
            void (async () => {
              await saveField("workspacePath", dir);
              setNotice(fmt("notice.workspaceSavedPrefix", dir));
            })();
          },
        })
      : null,
    // ── 定时消息管理弹窗（自包含组件） ──
    scheduleOpen
      ? h(ScheduleDialog, { rpcCall, detailAppId, onClose: () => setScheduleOpen(false) })
      : null,
    // ── 按群配置（群级覆盖）编辑弹窗 ──
    overrideEdit !== null
      ? h(OverrideDialog, {
          overrides: groupOverrides,
          editOpenid: overrideEdit,
          rpcCall,
          appId: detailAppId,
          onClose: () => setOverrideEdit(null),
          onSave: async (next: Record<string, Record<string, unknown>>, openid: string) => {
            const r = await saveField("groupOverrides", next);
            if (!r.ok) return r;
            const short = `${openid.slice(0, 10)}${openid.length > 10 ? "…" : ""}`;
            // 端到端回读校验：确认该群覆盖确实落盘，避免「返回成功却没写进去」的静默失败。
            if (next[openid]) {
              const saved = (r.data?.groupOverrides ?? {}) as Record<string, unknown>;
              if (!(openid in saved)) {
                const message = fmt("notice.groupOverrideSaveNoEffect", short);
                setNotice(message);
                return { ok: false, error: message };
              }
            }
            setNotice(fmt("notice.groupOverrideSaved", short));
            return { ok: true };
          },
        })
      : null,
    // ── 消息归档弹窗（自包含组件） ──
    archiveOpen
      ? h(ArchiveDialog, { rpcCall, detailAppId, onClose: () => setArchiveOpen(false) })
      : null,
    // ── 全局自定义确认框（window.confirm 的替代，置顶于所有弹窗） ──
    h(ConfirmHost, null));
}

export function apply(ctx: any) {
  // 国际化：注册 cn/en 两份字段名文案表并绑定宿主翻译函数。
  // 宿主 locale id 固定为 zh/en，这里把项目内部的 cn 映射为 zh 后注册。
  ctx.effect(
    () => ctx.locale?.register?.(QQBOT_LOCALE_NAMESPACE, hostDictionaries),
    "qqbot-settings: locale dictionaries",
  );
  const bound = ctx.locale?.bind?.(QQBOT_LOCALE_NAMESPACE);
  setTranslator(typeof bound === "function" ? bound : undefined);

  // 跟随宿主语言：读一次当前语言，并订阅后续切换事件。
  try {
    const initial = ctx.locale?.getLocale?.();
    if (typeof initial === "string") setLocale(initial);
  } catch { /* 宿主未提供 getLocale 时保持默认 */ }
  ctx.effect(() => {
    const off = ctx.locale?.subscribe?.((locale: string) => setLocale(locale));
    return typeof off === "function" ? off : () => {};
  }, "qqbot-settings: locale subscription");

  const rpcCall: RpcCall = async (endpoint, payload, signal) => {
    // framework 的 clientRequestSchema 要求信封必须带 payload 字段；始终传一个对象（至少 {}）。
    const raw = await ctx.connection.rpc.call(RPC_CHANNEL, endpoint, payload ?? {}, signal);
    // DSH RPC 在通道/处理器未真正响应时，会返回结构化错误信封 { code, message, details }，
    // 而不是约定的 { ok, value }。在此统一规整，避免下游把对象当 React 子节点（#31）。
    if (raw && typeof raw === "object" && "code" in raw && !("ok" in raw)) {
      const r = raw as { code?: unknown; message?: unknown };
      const msg = typeof r.message === "string" && r.message
        ? r.message
        : typeof r.code === "string" ? r.code : t("common.rpcFailed");
      return { ok: false, error: msg };
    }
    return raw as Reply;
  };

  // 把 rpc 调用能力桥接给右侧面板组件（组件层拿不到 ctx）。
  setRpcCall(rpcCall);

  ctx.effect(() => installStyles(), "qqbot-settings: styles");
  ctx.slots.inject("settings.section", () =>
    ctx.slots.register(
      {
        name: "settings.section",
        id: "dsh-qqbot",
        order: 31,
        label: () => h("span", { className: "qbot-navLabel" },
          h(QqBotGlyph, { className: "qbot-navGlyph", uid: "nav" }),
          h("span", { className: "qbot-navText" }, t("app.title"))),
        inject: () => ({ rpcCall }),
      },
      QqbotSettingsTab,
    ));

  // ── 右侧面板 tab（定时消息）：按登录状态动态注册 ──────────────────────────
  // QQ 未登录（没有任何 ws=connected 的机器人）时不出现面板入口；
  // 轮询 bots.list 检测连接状态变化，动态注册 / 注销 tab 类型。
  // ② 主体与 ③ 标题是 keyed slot，常驻无害——只有 ① 决定 chip 是否显示。
  let disposePanelTab: (() => void) | null = null;
  const registerPanelTab = () => {
    if (disposePanelTab) return;
    disposePanelTab =
      (ctx.sidebarRightTabs as { register: (d: Record<string, unknown>) => () => void }).register({
        id: QQBOT_PANEL_ID,
        kind: QQBOT_PANEL_KIND,
        // title / guide 由宿主在打开面板时求值，这里每次调用都走 i18n，切换语言后即为当前语言。
        title: () => t("panel.title"),
        guide: [
          {
            order: 100,
            title: () => t("panel.title"),
            description: () => t("panel.subtitle"),
            // 入口胶囊的图标；不传则宿主画占位方块。用插件统一的 QQ 机器人 glyph。
            icon: QqBotGuideIcon,
          },
        ],
      });
  };
  const unregisterPanelTab = () => {
    try { disposePanelTab?.(); } catch { /* 已被宿主回收时忽略 */ }
    disposePanelTab = null;
  };

  const syncPanelTab = async () => {
    try {
      const res = await rpcCall("bots.list");
      const bots = res.ok ? (val(res) as { bots?: unknown[] } | null)?.bots : undefined;
      const anyConnected = Array.isArray(bots)
        && bots.some((b: any) => b?.ws?.state === "connected");
      if (anyConnected) registerPanelTab();
      else unregisterPanelTab();
    } catch { /* RPC 暂不可用时保持现状，等下一轮轮询 */ }
  };

  // 初次检测 + 定时轮询（登录 / 掉线后最迟一个周期内更新入口）。
  // 设置页的增删 / 启停 / 重连等动作会通过 notifyBotsChanged() 即时触发同步，不等轮询。
  void syncPanelTab();
  const offBotsChanged = onBotsChanged(() => void syncPanelTab());
  const panelTabTimer = setInterval(() => void syncPanelTab(), 15_000);
  ctx.effect(
    () => () => {
      clearInterval(panelTabTimer);
      offBotsChanged();
      unregisterPanelTab();
    },
    "qqbot: right-panel tab lifecycle",
  );

  // ② 主体（keyed by 包名）：嵌入完整 CRUD+测试能力的 ScheduleManager。
  ctx.effect(
    () =>
      ctx.slots.inject("sidebar.right.pane.tab", () =>
        ctx.slots.register(
          { name: "sidebar.right.pane.tab", key: QQBOT_PANEL_ID },
          ScheduleTab as (props: unknown) => React.ReactNode,
        )),
    "qqbot: right-panel tab body",
  );

  // ③ chip 标题（keyed by 包名）。
  ctx.effect(
    () =>
      ctx.slots.inject("sidebar.right.pane.tab.title", () =>
        ctx.slots.register(
          { name: "sidebar.right.pane.tab.title", key: QQBOT_PANEL_ID },
          TitleView as (props: unknown) => React.ReactNode,
        )),
    "qqbot: right-panel tab title",
  );
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
