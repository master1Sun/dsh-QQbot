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
 *
 * 模块拆分（单一入口不变：src/client/index.tsx，esbuild 打包为 lib/client.js）：
 *   types.ts / meta.ts / glyphs.tsx / ui.tsx / styles.ts — 类型、配置元数据、
 *   图标、基础控件与工具、样式表；add-bot-view.tsx — 添加机器人视图；
 *   dialogs/*.tsx — 目录选择 / 定时消息 / 按群覆盖 / 消息归档四个弹窗。
 */
import * as React from "react";
import { QQBOT_LOCALE_NAMESPACE, en, h, localizeText, setTranslator, zh } from "./i18n.js";
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
import { QqBotGlyph, QqLogoGlyph } from "./glyphs.js";
import {
  ConfirmHost,
  OnlineBadge,
  SettingRow,
  StateLabel,
  TextArea,
  confirmDlg,
  errText,
  formatTime,
  presetOptions,
  val,
} from "./ui.js";
import { CSS_TEXT } from "./styles.js";
import { AddBotView } from "./add-bot-view.js";
import { ArchiveDialog } from "./dialogs/archive-dialog.js";
import { OverrideDialog } from "./dialogs/override-dialog.js";
import { ScheduleDialog } from "./dialogs/schedule-dialog.js";
import { WorkspacePickerDialog } from "./dialogs/workspace-picker.js";

export const name = "qqbot-settings";
// locale：宿主语言服务（ctx.locale.register/bind），支撑设置界面双语。
export const inject = ["slots", "connection", "locale"];

declare const __PLUGIN_VERSION__: string;

const RPC_CHANNEL = "/qqbot-settings";

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
      const message = `保存失败：${errText(res.error)}`;
      setNotice(message);
      return { ok: false, error: message };
    }
    setNotice("");
    await refresh(detailAppId || undefined);
    return { ok: true, data: val(res) };
  };

  // 提示条渲染在页面顶部，长页面滚动后可能落在视口外：提示变化时自动滚动到可见区域。
  React.useEffect(() => {
    if (!notice) return;
    const el = document.getElementById("qbot-notice");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [notice]);

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
    if (!(await confirmDlg({ message: localizeText(`确定删除机器人 ${bot.appIdMasked}？删除后该机器人停止接收消息。`), danger: true }))) return;
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
    if (ov.groupFullReply !== undefined) parts.push(`全量回复 ${ov.groupFullReply ? "开" : "关"}`);
    if (ov.valueThreshold !== undefined) parts.push(`阈值 ${ov.valueThreshold}`);
    if (ov.atContextMessages !== undefined) parts.push(`上下文 ${ov.atContextMessages} 条`);
    if (ov.groupCooldownMs !== undefined) parts.push(`群冷却 ${cooldownLabel(Number(ov.groupCooldownMs))}`);
    if (ov.senderCooldownMs !== undefined) parts.push(`同人冷却 ${cooldownLabel(Number(ov.senderCooldownMs))}`);
    if (ov.replyChunkChars !== undefined) parts.push(`分片 ${ov.replyChunkChars}`);
    if (ov.maxRepliesPerMessage !== undefined) parts.push(`回复上限 ${ov.maxRepliesPerMessage}`);
    if (ov.markdownReply !== undefined) parts.push(`Markdown ${ov.markdownReply ? "开" : "关"}`);
    if (ov.memoryEnabled !== undefined) parts.push(`记忆 ${ov.memoryEnabled ? "开" : "关"}`);
    if (Array.isArray(ov.bannedWords) && ov.bannedWords.length > 0) parts.push(`敏感词 ${ov.bannedWords.length} 个`);
    if (typeof ov.agentPresetChat === "string" && ov.agentPresetChat) parts.push(`聊天 Preset ${ov.agentPresetChat}`);
    return parts.length > 0 ? parts.join(" · ") : "无覆盖字段";
  };

  const removeOverride = async (openid: string) => {
    if (!(await confirmDlg({ message: localizeText(`确定删除群 ${openid.slice(0, 10)}… 的覆盖配置？删除后该群恢复使用机器人默认配置。`), danger: true }))) return;
    const next: Record<string, Record<string, unknown>> = { ...groupOverrides };
    delete next[openid];
    await saveField("groupOverrides", next);
  };

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
    notice ? h("div", { className: "qbot-infoNotice", id: "qbot-notice", role: "status" }, notice) : null,
    h("div", { className: "qbot-listHeading" },
      h("h3", null, `已配置机器人（${bots?.bots.length ?? 0}）`),
      h("button", {
        className: "qbot-btn qbot-btnPrimary", type: "button",
        onClick: () => { setNotice(""); setPage("add"); },
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
    // ── 顶部导航：返回 + 机器人身份（QQ 图标 / 编号 / 启用状态 / 连接状态），整条 sticky 吸顶 ──
    h("div", { className: "qbot-detailNav" },
      h("button", { className: "qbot-btn", type: "button", onClick: () => { setPage("list"); setNotice(""); } }, "← 返回列表"),
      h("div", { className: "qbot-detailIdentity" },
        h("span", { className: "qbot-detailAvatar", "aria-hidden": "true" }, h(QqLogoGlyph)),
        h("strong", null, detailBot ? detailBot.appIdMasked : "未选择机器人"),
        detailBot
          ? h("span", { className: `qbot-chip${detailBot.primary ? " is-active" : ""}` },
              detailBot.primary ? "主机器人" : (detailBot.enabled ? "已启用" : "已停用"))
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
            onClick: () => setScheduleOpen(true),
          }, "定时消息"),
          h("button", {
            className: "qbot-btn", type: "button",
            disabled: !detailBot,
            onClick: () => setArchiveOpen(true),
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
      cardSummary ? h("div", { className: "qbot-heroFoot", id: "qbot-notice", role: "status" }, cardSummary) : null),

    // ── 运行统计（持久化：跨重启累计，stats/<appId>.json；可复位清零） ──
    status
      ? sectionCard("运行统计", "该机器人的持久运行计数（重启不清零）；数值不会自动刷新，需要时点「刷新」。",
          h("div", { className: "qbot-metricGrid" },
            metrics.map((m) => metricCard(m.label, m.value, m.tone))),
          h("div", { className: "qbot-sectionActions" },
            h("button", {
              className: "qbot-btn", type: "button",
              disabled: refreshing,
              onClick: () => void refreshStats(),
            }, refreshing ? "刷新中…" : "刷新"),
            h("button", {
              className: "qbot-btn qbot-btnDanger", type: "button",
              disabled: resetting || refreshing,
              title: "把该机器人的运行计数清零（立即生效并落盘）",
              onClick: () => void resetStats(),
            }, resetting ? "复位中…" : "复位")))
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
            h("button", { className: "qbot-btn", type: "button", onClick: () => setPickerOpen(true) }, "选择目录")),
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
          desc: "回复以 QQ 原生引用卡片定位到用户那条原消息（message_reference，走主动消息通道发送，不与 msg_id 同传——手机端两者同传会堆叠重复引用）。仅群聊生效，单聊一律不引用：off=不引用；at=仅群 @ 回复（推荐）；all=群聊全部回复。卡片发送失败时自动降级为普通被动回复（无卡片，内容不丢）。此外，用户引用聊天里某条消息时，被引用的原文会始终注入模型上下文，让它知道对方在回应什么。",
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
      undefined),

    // ── 按群配置（群级覆盖） ──
    sectionCard("按群配置", "为特定群单独覆盖行为配置（阈值/冷却/敏感词/上下文等），其余字段跟随机器人默认。适合把某一个群调得更活跃或更安静，而不影响其他群。",
      h("div", { className: "qbot-settingList" },
        Object.keys(groupOverrides).length === 0
          ? h("div", { className: "qbot-modalState" }, "还没有按群覆盖配置，所有群都使用上方机器人默认配置。")
          : Object.entries(groupOverrides).map(([openid, ov]) =>
              h("div", { key: openid, className: "qbot-schedRow" },
                h("div", { className: "qbot-schedMain" },
                  h("div", { className: "qbot-schedTop" },
                    h("span", { className: "qbot-chip is-active" }, "群"),
                    h("code", { className: "qbot-mono", title: openid },
                      `${openid.slice(0, 12)}${openid.length > 12 ? "…" : ""}`)),
                  h("div", { className: "qbot-schedContent" }, overrideSummary(ov))),
                h("div", { className: "qbot-schedOps" },
                  h("button", { className: "qbot-btn qbot-schedEdit", type: "button", onClick: () => setOverrideEdit(openid) }, "编辑"),
                  h("button", { className: "qbot-btn qbot-btnDanger", type: "button", onClick: () => void removeOverride(openid) }, "删除")))),
        h("div", { className: "qbot-editActions" },
          h("span", { className: "qbot-hint" }, "覆盖字段未设置时跟随机器人默认；全部清空并保存即删除该群覆盖。"),
          h("button", { className: "qbot-btn qbot-btnPrimary", type: "button", onClick: () => setOverrideEdit("") }, "添加群覆盖"))),
      undefined),

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
              setNotice(`工作区已保存：${dir}（对新建会话生效）`);
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
          presets: catalogs.agentPresets,
          onClose: () => setOverrideEdit(null),
          onSave: async (next: Record<string, Record<string, unknown>>, openid: string) => {
            const r = await saveField("groupOverrides", next);
            if (!r.ok) return r;
            const short = `${openid.slice(0, 10)}${openid.length > 10 ? "…" : ""}`;
            // 端到端回读校验：确认该群覆盖确实落盘，避免「返回成功却没写进去」的静默失败。
            if (next[openid]) {
              const saved = (r.data?.groupOverrides ?? {}) as Record<string, unknown>;
              if (!(openid in saved)) {
                const message = `保存未生效：群 ${short} 的覆盖未写入配置，请重试`;
                setNotice(message);
                return { ok: false, error: message };
              }
            }
            setNotice(`群 ${short} 的覆盖配置已保存（立即生效）`);
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
