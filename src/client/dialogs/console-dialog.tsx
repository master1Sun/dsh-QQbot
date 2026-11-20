/**
 * 机器人管理控制台（点列表卡片弹出的主窗口）。
 *
 * 结构仿 WorkBuddy 设置：Modal 外壳 + 左侧单棵三级导航树 + 右侧内容区。
 *  - 一级：概览 / 运行 / 配置 / 群聊 / 频道 / 管理
 *  - 二级：各分组下的能力项（部分带子项，点开后展开三级）
 *  - 三级：能力项内部的子 Tab（如发言管理下的全员禁言、违规字样处置配置等）
 * 左侧是唯一导航入口，右侧只渲染焦点对应的内容——不再跳详情页、不再开独立窗口、
 * 也不在内嵌组件里重复一套导航（频道/群聊组件以 embedded 模式只出内容）。
 *
 * 所有显示文案走 i18n（console.* / gv.* / pt.*），组件用 useLocale() 跟随宿主语言。
 */
import * as React from "react";
import { fmt, h, t, useLocale } from "../i18n/index.js";
import type { BotInfo, RpcCall } from "../types.js";
import { ScheduleManager } from "../schedule-manager.js";
import { PlatformTools, type PlatformFocus } from "./platform-tools.js";
import { AiOpsLogPanel } from "./ai-chat-panel.js";
import { ArchiveDialog } from "./archive-dialog.js";
import { GuildManager, type GuildFocus } from "./guild-manager-dialog.js";
import { ConfigManifestDialog } from "./config-manifest-dialog.js";
import { val } from "../ui.js";

type ConfigPane = "session" | "policy" | "tune" | "override" | "manifest";

type View =
  | { kind: "overview" }
  | { kind: "schedule" }
  | { kind: "archive" }
  | { kind: "config"; pane: ConfigPane }
  | { kind: "assistant" }
  | { kind: "connection" }
  | { kind: "platform"; focus: PlatformFocus }
  | { kind: "guild"; focus: GuildFocus };

interface Leaf {
  id: string;
  /** i18n key，渲染时调用 t()，避免模块级冻结语言。 */
  label: string;
  icon: string;
  view: View;
  children?: Leaf[];
}
interface NavGroup {
  id: string;
  label: string;
  icon: string;
  items: Leaf[];
}

const platLeaf = (id: string, label: string, icon: string, nav: string, extra?: Partial<PlatformFocus>): Leaf => ({
  id, label, icon, view: { kind: "platform", focus: { nav, ...extra } },
});
const guildLeaf = (id: string, label: string, icon: string, tab: GuildFocus["tab"], extra?: Partial<GuildFocus>): Leaf => ({
  id, label, icon, view: { kind: "guild", focus: { tab, ...extra } },
});

/** 单棵三级导航树：一级分组 → 二级能力 → 三级子 Tab。 */
const NAV_TREE: NavGroup[] = [
  {
    id: "overview", label: "console.grpOverview", icon: "▤",
    items: [{ id: "overview", label: "console.navOverview", icon: "◈", view: { kind: "overview" } }],
  },
  {
    id: "runtime", label: "console.grpRuntime", icon: "◷",
    items: [
      { id: "schedule", label: "console.navSchedule", icon: "◷", view: { kind: "schedule" } },
      { id: "archive", label: "console.navArchive", icon: "▣", view: { kind: "archive" } },
    ],
  },
  {
    id: "config", label: "console.grpConfig", icon: "◇",
    items: [
      { id: "session", label: "console.navSession", icon: "◇", view: { kind: "config", pane: "session" } },
      { id: "policy", label: "console.navPolicy", icon: "⇄", view: { kind: "config", pane: "policy" } },
      { id: "tune", label: "console.navTune", icon: "≋", view: { kind: "config", pane: "tune" } },
      { id: "override", label: "console.navOverride", icon: "▦", view: { kind: "config", pane: "override" } },
      { id: "manifest", label: "console.navManifest", icon: "{ }", view: { kind: "config", pane: "manifest" } },
    ],
  },
  {
    id: "group", label: "console.navPlatform", icon: "⚡",
    items: [
      platLeaf("g:info", "pt.navInfo", "◈", "g:info"),
      platLeaf("g:members", "pt.navMembers", "♙", "g:members"),
      platLeaf("g:black", "pt.navBlack", "⊘", "g:black"),
      {
        id: "g:join", label: "pt.navJoin", icon: "⌑",
        view: { kind: "platform", focus: { nav: "g:join", joinTab: "auto" } },
        children: [
          platLeaf("g:join:auto", "pt.jaTabAuto", "·", "g:join", { joinTab: "auto" }),
          platLeaf("g:join:manual", "pt.jaTabManual", "·", "g:join", { joinTab: "manual" }),
          platLeaf("g:join:records", "pt.jaTabRecords", "·", "g:join", { joinTab: "records" }),
        ],
      },
      {
        id: "g:moderation", label: "pt.navModeration", icon: "✦",
        view: { kind: "platform", focus: { nav: "g:moderation", modTab: "config" } },
        children: [
          platLeaf("g:moderation:config", "pt.modTabConfig", "·", "g:moderation", { modTab: "config" }),
          platLeaf("g:moderation:logs", "pt.modTabLogs", "·", "g:moderation", { modTab: "logs" }),
          platLeaf("g:moderation:muted", "pt.modTabMuted", "·", "g:moderation", { modTab: "muted" }),
        ],
      },
      platLeaf("g:panels", "pt.panelsTitle", "▦", "g:panels"),
      platLeaf("g:assistant", "ai.title", "✧", "g:assistant"),
      platLeaf("u:share", "pt.navShare", "↗", "u:share"),
      platLeaf("u:menu", "pt.navMenu", "☰", "u:menu"),
      platLeaf("u:material", "pt.navMaterial", "▣", "u:material"),
      platLeaf("u:card", "pt.navCard", "▤", "u:card"),
    ],
  },
  {
    id: "guild", label: "console.navGuild", icon: "◈",
    items: [
      guildLeaf("guilds", "gv.tab.guilds", "◈", "guilds"),
      guildLeaf("info", "gv.tab.info", "ⓘ", "info"),
      guildLeaf("channels", "gv.tab.channels", "☰", "channels"),
      guildLeaf("members", "gv.tab.members", "♙", "members"),
      guildLeaf("roles", "gv.tab.roles", "◆", "roles"),
      guildLeaf("message", "gv.tab.message", "✎", "message"),
      {
        id: "speak", label: "gv.tab.speak", icon: "◉",
        view: { kind: "guild", focus: { tab: "speak", speakTab: "all" } },
        children: [
          guildLeaf("speak:all", "gv.st.all", "·", "speak", { speakTab: "all" }),
          guildLeaf("speak:member", "gv.st.member", "·", "speak", { speakTab: "member" }),
          guildLeaf("speak:frequency", "gv.st.frequency", "·", "speak", { speakTab: "frequency" }),
          guildLeaf("speak:keyword:config", "console.navKwConfig", "·", "speak", { speakTab: "keyword", kwTab: "config" }),
          guildLeaf("speak:keyword:logs", "console.navKwLogs", "·", "speak", { speakTab: "keyword", kwTab: "logs" }),
        ],
      },
      {
        id: "content", label: "gv.tab.content", icon: "⌫",
        view: { kind: "guild", focus: { tab: "content", contentTab: "recall" } },
        children: [
          guildLeaf("content:recall", "gv.ct.recall", "·", "content", { contentTab: "recall" }),
          guildLeaf("content:announce", "gv.ct.announce", "·", "content", { contentTab: "announce" }),
          guildLeaf("content:pin", "gv.ct.pin", "·", "content", { contentTab: "pin" }),
          guildLeaf("content:schedule", "gv.ct.schedule", "·", "content", { contentTab: "schedule" }),
          guildLeaf("content:audio", "gv.ct.audio", "·", "content", { contentTab: "audio" }),
          guildLeaf("content:forum", "gv.ct.forum", "·", "content", { contentTab: "forum" }),
        ],
      },
      {
        id: "ai", label: "gv.tab.ai", icon: "✦",
        view: { kind: "guild", focus: { tab: "ai", aiTab: "config" } },
        children: [
          guildLeaf("ai:config", "gv.aiSubConfig", "·", "ai", { aiTab: "config" }),
          guildLeaf("ai:logs", "gv.aiSubLogs", "·", "ai", { aiTab: "logs" }),
          guildLeaf("ai:reply", "gv.aiSubReply", "·", "ai", { aiTab: "reply" }),
          guildLeaf("ai:replyLogs", "gv.replyLogsTitle", "·", "ai", { aiTab: "replyLogs" }),
        ],
      },
      guildLeaf("apiPerm", "gv.tab.apiPerm", "⚿", "apiPerm"),
      guildLeaf("assistant", "gv.tab.assistant", "✧", "assistant"),
      guildLeaf("events", "gv.tab.events", "⌁", "events"),
    ],
  },
  {
    id: "manage", label: "console.grpManage", icon: "✧",
    items: [
      { id: "connection", label: "conn.title", icon: "⚙", view: { kind: "connection" } },
    ],
  },
];

interface NavPath {
  group: NavGroup;
  parent?: Leaf;
  leaf: Leaf;
}
function findPath(id: string): NavPath | undefined {
  for (const group of NAV_TREE) {
    for (const item of group.items) {
      if (item.id === id) return { group, leaf: item };
      for (const child of item.children ?? []) {
        if (child.id === id) return { group, parent: item, leaf: child };
      }
    }
  }
  return undefined;
}

/** 生成最近 N 天的上海日期键（YYYY-MM-DD），旧→新。不依赖宿主时区。 */
function lastDays(n: number): string[] {
  const out: string[] = [];
  const now = Date.now();
  const offset = 8 * 60 * 60 * 1000;
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now + offset - i * 86400_000);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

export function ConsoleDialog(props: {
  rpcCall: RpcCall;
  bot: BotInfo | null;
  groups: string[];
  onClose: () => void;
  onNotify: (text: string, tone: "error" | "success") => void;
  /** 配置类分区节点：与详情页共用同一份表单。 */
  configPanes: Record<ConfigPane, React.ReactNode>;
  /** 连接与移除面板：与详情页管理 Tab 共用同一份。 */
  connectionPane: React.ReactNode;
  /** 配置清单保存成功后的回读刷新。 */
  onConfigSaved: () => Promise<void>;
}) {
  const { rpcCall, bot, groups, onClose, configPanes, connectionPane, onConfigSaved } = props;
  useLocale();
  const [selected, setSelected] = React.useState("overview");
  const [expanded, setExpanded] = React.useState<Set<string>>(() => new Set());
  /** 群聊管理当前选中的群：切到别的菜单再回来仍保留，避免每次重新选群。 */
  const [pickedGroup, setPickedGroup] = React.useState("");
  /** 弹窗顶部悬浮提示：汇聚内部所有功能（群聊/频道/定时/清单等）的错误与成功提示。 */
  const [notice, setNotice] = React.useState<{ text: string; tone: "error" | "success" } | null>(null);
  const notify = React.useCallback((text: string, tone: "error" | "success") => {
    if (!text) return;
    setNotice({ text, tone });
  }, []);
  // 提示 5 秒后自动消失；同一条提示点击即可关掉。
  React.useEffect(() => {
    if (!notice) return undefined;
    const id = window.setTimeout(() => setNotice(null), 5000);
    return () => window.clearTimeout(id);
  }, [notice]);

  const appId = bot?.appId ?? "";
  const counters = bot?.counters ?? { received: 0, sessions: 0, replies: 0, proactive: 0, errors: 0 };
  const daily = bot?.daily ?? {};
  const buffered = Array.isArray(bot?.groupBuffers)
    ? bot!.groupBuffers.reduce((n: number, b: any) => n + Number(b?.buffered ?? 0), 0)
    : 0;
  const pending = Number(bot?.pendingReplies ?? 0);
  const errors = Number(counters.errors ?? 0);

  // 运营总览的归档统计：打开控制台时拉一次，切换机器人/重开弹窗会重新取。
  const [archiveStats, setArchiveStats] = React.useState<any>(null);
  React.useEffect(() => {
    let alive = true;
    rpcCall("archive.stats", appId ? { appId } : {}).then((res) => {
      if (alive && res.ok) setArchiveStats(val(res) ?? null);
    }).catch(() => { /* 归档不可用时空态展示 */ });
    return () => { alive = false; };
  }, [rpcCall, appId]);

  const path = findPath(selected) ?? findPath("overview")!;
  const view: View = path.leaf.view;

  const metric = (label: string, value: string | number, tone: string = "", sub: string = "", glyph: string = "·") =>
    h("div", { className: "qbot-consoleMetric", "data-tone": tone, key: label },
      h("div", { className: "qbot-consoleMetricTop" },
        h("span", { className: "qbot-consoleMetricIcon", "aria-hidden": "true" }, glyph),
        h("span", { className: "qbot-consoleMetricLabel" }, label)),
      h("strong", { className: "qbot-consoleMetricValue" }, String(value)),
      sub ? h("span", { className: "qbot-consoleMetricSub" }, sub) : null);

  const overviewPane = () => {
    const days = lastDays(7);
    const values = days.map((d) => Number(daily[d] ?? 0));
    const max = Math.max(1, ...values);
    const todayCount = values[values.length - 1] ?? 0;
    const weekTotal = values.reduce((sum: number, n: number) => sum + n, 0);
    const peak = Math.max(0, ...values);
    const peakDay = days[values.indexOf(peak)] ?? "";
    const passive = Number(counters.replies ?? 0);
    const proact = Number(counters.proactive ?? 0);
    const total = passive + proact;
    const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);
    const passivePct = pct(passive);
    const proactPct = total > 0 ? 100 - passivePct : 0;
    const wsState = bot?.ws?.state ?? "";
    const conn = bot?.enabled === false
      ? { tone: "muted", text: t("status.disabled") }
      : wsState === "connected"
        ? { tone: "success", text: t("status.connected") }
        : wsState === "connecting"
          ? { tone: "warning", text: t("status.connecting") }
          : { tone: "error", text: t("status.disconnected") };
    const lastConnect = bot?.ws?.lastConnectedAt
      ? new Date(bot.ws.lastConnectedAt).toLocaleString()
      : t("console.ovNever");
    const donut = total > 0
      ? `conic-gradient(var(--qbot-blue, #1677ff) 0 ${passivePct}%, var(--dsw-alias-state-success-primary, #20a162) ${passivePct}% 100%)`
      : "var(--dsw-alias-bg-module-platform, #f7f8fa)";
    const statusRow = (label: string, text: string, tone: string = "") =>
      h("div", { className: "qbot-ovStatusRow", key: label },
        h("span", { className: "qbot-ovStatusLabel" }, label),
        h("strong", { className: "qbot-ovStatusValue", "data-tone": tone }, text));
    const arc = archiveStats ?? {
      total: 0, chats: 0, groups: 0, dmChats: 0,
      kinds: { inbound: 0, reply: 0, proactive: 0 }, scopes: { group: 0, c2c: 0 }, months: [],
    };
    const arcPct = (n: number) => (arc.total > 0 ? Math.round((n / arc.total) * 100) : 0);
    const arcLegend = (css: string, label: string, count: number) =>
      h("span", { key: css },
        h("i", { className: `is-${css}` }), label,
        h("b", null, String(count)), h("em", null, `${arcPct(count)}%`));
    const maxMonth = Math.max(1, ...arc.months.map((m: any) => Number(m.count ?? 0)));
    return h(React.Fragment, null,
      h("div", { className: "qbot-ovHero" },
        h("div", { className: "qbot-ovHeroId" },
          h("div", { className: "qbot-ovAvatar", "aria-hidden": "true" }, "◈"),
          h("div", { className: "qbot-ovHeroMeta" },
            h("strong", null, bot?.appIdMasked ?? "—"),
            h("span", null, bot?.primary ? t("console.ovPrimary") : t("console.ovSecondary")))),
        h("div", { className: `qbot-ovConn is-${conn.tone}` },
          h("i", { "aria-hidden": "true" }), conn.text),
        h("div", { className: "qbot-ovHeroFacts" },
          h("div", null, h("span", null, t("console.ovTodayLabel")), h("strong", null, String(todayCount))),
          h("div", null, h("span", null, t("stats.sessions")), h("strong", null, String(counters.sessions ?? 0))),
          h("div", null, h("span", null, t("console.ovGroups")), h("strong", null, String(groups.length))))),
      h("div", { className: "qbot-consoleMetricGrid" },
        metric(t("stats.received"), counters.received ?? 0, "", fmt("console.ovToday", String(todayCount)), "◉"),
        metric(t("stats.sessions"), counters.sessions ?? 0, "success", "", "◇"),
        metric(t("stats.passive"), passive, "success", fmt("console.ovShare", `${passivePct}%`), "↩"),
        metric(t("stats.proactive"), proact, "", fmt("console.ovShare", `${proactPct}%`), "↗"),
        metric(t("stats.bound"), bot?.boundSessions ?? 0, "", "", "⧉"),
        metric(t("stats.pendingQueue"), pending, pending > 0 ? "warning" : "",
          pending > 0 ? t("console.ovWaiting") : t("console.ovClear"), "◷"),
        metric(t("stats.groupBuffer"), buffered, "", "", "▤"),
        metric(t("stats.errors"), errors, errors > 0 ? "error" : "",
          errors > 0 ? t("console.ovAttention") : t("console.ovNormal"), "!")),
      h("div", { className: "qbot-consoleCharts" },
        h("div", { className: "qbot-consoleChart qbot-ovTrend" },
          h("div", { className: "qbot-ovChartHead" },
            h("div", null,
              h("strong", null, t("console.chartDaily")),
              h("span", null, fmt("console.ovPeakDay", peakDay.slice(5), String(peak)))),
            h("span", { className: "qbot-ovChartTag" }, fmt("console.ovWeekTotal", String(weekTotal)))),
          h("div", { className: "qbot-consoleBars qbot-ovBars" },
            ...days.map((day, i) =>
              h("div", { className: "qbot-consoleBarCol", key: day },
                h("div", { className: "qbot-ovBarArea" },
                  h("span", { className: "qbot-ovBarValue" }, String(values[i])),
                  h("div", {
                    className: `qbot-consoleBar${i === days.length - 1 ? " is-today" : ""}`,
                    style: { height: `${Math.max(2, Math.round((values[i] / max) * 100))}%` },
                    title: fmt("console.barTip", day.slice(5), String(values[i])),
                  })),
                h("span", null, day.slice(5)))))),
        h("div", { className: "qbot-consoleChart qbot-ovDonutChart" },
            h("div", { className: "qbot-ovChartHead" }, h("strong", null, t("console.chartCompose"))),
            h("div", { className: "qbot-ovDonutBody" },
              h("div", { className: "qbot-ovDonut", style: { background: donut } },
                h("div", { className: "qbot-ovDonutInner" },
                  h("strong", null, String(total)),
                  h("span", null, t("console.ovTotalReplies")))),
              h("div", { className: "qbot-consoleComposeLegend" },
                h("span", null, h("i", { className: "is-passive" }), fmt("console.legendPassive", String(passive))),
                h("span", null, h("i", { className: "is-proactive" }), fmt("console.legendProactive", String(proact)))))),
          h("div", { className: "qbot-consoleChart qbot-ovStatus" },
            h("div", { className: "qbot-ovChartHead" }, h("strong", null, t("console.ovStatusTitle"))),
            h("div", { className: "qbot-ovStatusList" },
              statusRow(t("console.ovConnect"), conn.text, conn.tone),
              statusRow(t("console.ovLastConnect"), lastConnect),
              statusRow(t("console.ovGroups"), String(groups.length)),
              statusRow(t("console.ovPeak"), peak > 0 ? `${peakDay.slice(5)} · ${peak}` : t("console.ovNoData")))),
        h("div", { className: "qbot-consoleCharts qbot-ovArchive" },
          h("div", { className: "qbot-consoleChart qbot-ovArcKind" },
            h("div", { className: "qbot-ovChartHead" },
              h("strong", null, t("console.ovArchiveKinds")),
              h("span", null, fmt("console.ovArchiveTotal", String(arc.total)))),
            h("div", { className: "qbot-ovArcBar" },
              h("span", { className: "is-inbound", style: { width: `${arcPct(arc.kinds.inbound)}%` } }),
              h("span", { className: "is-reply", style: { width: `${arcPct(arc.kinds.reply)}%` } }),
              h("span", { className: "is-proactive", style: { width: `${arcPct(arc.kinds.proactive)}%` } })),
            h("div", { className: "qbot-ovArcLegend" },
              arcLegend("inbound", t("stats.received"), arc.kinds.inbound),
              arcLegend("reply", t("stats.passive"), arc.kinds.reply),
              arcLegend("proactive", t("stats.proactive"), arc.kinds.proactive))),
          h("div", { className: "qbot-consoleChart qbot-ovArcScope" },
            h("div", { className: "qbot-ovChartHead" },
              h("strong", null, t("console.ovArchiveScopes")),
              h("span", null, fmt("console.ovArchiveChats", String(arc.chats)))),
            h("div", { className: "qbot-ovArcBar" },
              h("span", { className: "is-group", style: { width: `${arcPct(arc.scopes.group)}%` } }),
              h("span", { className: "is-c2c", style: { width: `${arcPct(arc.scopes.c2c)}%` } })),
            h("div", { className: "qbot-ovArcLegend" },
              arcLegend("group", t("console.ovArchiveGroup"), arc.scopes.group),
              arcLegend("c2c", t("console.ovArchiveC2c"), arc.scopes.c2c))),
          h("div", { className: "qbot-consoleChart qbot-ovArcMonths" },
            h("div", { className: "qbot-ovChartHead" }, h("strong", null, t("console.ovArchiveMonths"))),
            arc.months.length
              ? h("div", { className: "qbot-ovArcMonthList" },
                  ...arc.months.map((m: any) =>
                    h("div", { className: "qbot-ovArcMonth", key: m.month },
                      h("span", null, String(m.month).slice(2)),
                      h("div", { className: "qbot-ovArcMonthTrack" },
                        h("i", { style: { width: `${Math.max(2, Math.round((Number(m.count ?? 0) / maxMonth) * 100))}%` } })),
                      h("strong", null, String(m.count ?? 0)))))
              : h("div", { className: "qbot-ovArcEmpty" }, t("console.ovNoData"))))));
  };

  /** 内嵌独立弹窗类组件：用 qbot-consoleSub 覆写其遮罩/外壳，内容留在控制台内。 */
  const subDialog = (node: React.ReactNode, extra = "") =>
    h("div", { className: `qbot-consoleSub${extra ? ` ${extra}` : ""}` }, node);

  /** 配置分区在控制台里平铺显示：只取 details 的表单主体，丢掉重复的卡片头与折叠箭头。 */
  const flatPane = (node: React.ReactNode) => {
    if (!React.isValidElement(node)) return node;
    const kids = React.Children.toArray((node as React.ReactElement<any>).props.children);
    const body = kids.find((k) =>
      React.isValidElement(k) && String((k as React.ReactElement<any>).props.className ?? "").includes("qbot-sectionBody"));
    return body ?? node;
  };

  /** 归档/配置清单：高度跟随外框、内部滚动，需容器切换为定高 flex 列。 */
  const isFill = view.kind === "archive" || (view.kind === "config" && view.pane === "manifest");

  const content = () => {
    switch (view.kind) {
      case "overview": return h("div", { className: "qbot-consoleOverview" }, overviewPane());
      case "schedule": return h("div", { className: "qbot-consoleEmbed" },
        // 嵌入控制台时不传 onClose，避免内容区再出现一个「关闭」按钮；提示统一走弹窗顶部悬浮条。
        h(ScheduleManager, { rpcCall, detailAppId: appId, toast: (level: "ok" | "info" | "error", msg: string) => notify(msg, level === "ok" ? "success" : "error") }));
      case "archive": return subDialog(h(ArchiveDialog, {
        rpcCall, detailAppId: appId, onClose: () => setSelected("overview"),
      }), "qbot-consoleSubArchive");
      case "config": return view.pane === "manifest"
        ? subDialog(h(ConfigManifestDialog, {
            appId, rpcCall, onClose: () => setSelected("overview"),
            onSaved: () => { void onConfigSaved(); notify(t("manifest.savedNotice"), "success"); },
          }), "qbot-consoleSubManifest")
        : h("div", { className: "qbot-consoleEmbed qbot-consoleConfig" }, flatPane(configPanes[view.pane]));
      case "assistant": return h("div", { className: "qbot-consoleEmbed" },
        h(AiOpsLogPanel, { rpcCall, appId, scope: "group" }));
      case "connection": return h("div", { className: "qbot-consoleEmbed qbot-consoleConfig" }, flatPane(connectionPane));
      case "platform": return h("div", { className: "qbot-consoleEmbed" },
        h(PlatformTools, {
          rpcCall, appId, groups, onNotify: notify, embedded: true, focus: view.focus,
          group: pickedGroup, onGroupChange: setPickedGroup,
        }));
      case "guild": return h("div", { className: "qbot-consoleEmbed" },
        h(GuildManager, {
          rpcCall, appId, onNotify: notify, embedded: true, focus: view.focus,
        }));
      default: return h("div", { className: "qbot-consoleOverview" }, overviewPane());
    }
  };

  const pickLeaf = (item: Leaf) => {
    if (item.children?.length) {
      const willExpand = !expanded.has(item.id);
      setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(item.id)) next.delete(item.id); else next.add(item.id);
        return next;
      });
      if (willExpand) setSelected(item.children[0].id);
    } else {
      setSelected(item.id);
    }
  };

  return h("div", {
    className: "qbot-modalOverlay qbot-consoleOverlay",
  },
    h("div", {
      className: "qbot-modal qbot-consoleModal",
      role: "dialog", "aria-modal": "true", "aria-label": t("console.title"),
    },
      h("div", { className: "qbot-modalHead" },
        h("div", null,
          h("strong", null, fmt("console.titleBot", bot?.appIdMasked ?? "—")),
          h("p", null, t("console.hint"))),
        h("button", {
          className: "qbot-modalClose", type: "button",
          "aria-label": t("common.close"), onClick: onClose,
        }, "×")),
      // 顶部悬浮提示：绝对定位脱离文档流，出现/消失不挤压内容，不抖动。
      notice
        ? h("div", {
            className: `qbot-detailToast qbot-consoleToast is-${notice.tone}`,
            role: notice.tone === "error" ? "alert" : "status",
            onClick: () => setNotice(null),
          }, notice.text)
        : null,
      h("div", { className: "qbot-consoleBody" },
        h("nav", { className: "qbot-consoleMenu", "aria-label": t("console.menuLabel") },
          ...NAV_TREE.map((g) =>
            h("div", { className: "qbot-consoleMenuGroup", key: g.id },
              h("div", { className: "qbot-consoleMenuGroupTitle" },
                h("span", { className: "qbot-consoleMenuIcon", "aria-hidden": "true" }, g.icon),
                h("span", null, t(g.label))),
              ...g.items.map((item) => {
                const hasChildren = !!item.children?.length;
                const isBranchActive = selected === item.id || item.children?.some((c) => c.id === selected);
                const isOpen = expanded.has(item.id);
                return h("div", { className: "qbot-consoleMenuNode", key: item.id },
                  h("button", {
                    type: "button",
                    className: `qbot-consoleMenuItem${isBranchActive ? " is-active" : ""}`,
                    "aria-current": selected === item.id ? "page" : undefined,
                    "aria-expanded": hasChildren ? isOpen : undefined,
                    onClick: () => pickLeaf(item),
                  },
                    h("span", { className: "qbot-consoleMenuIcon", "aria-hidden": "true" }, item.icon),
                    h("span", { className: "qbot-consoleMenuLabel" }, t(item.label)),
                    hasChildren ? h("span", {
                      className: `qbot-consoleMenuCaret${isOpen ? " is-open" : ""}`, "aria-hidden": "true",
                    }, "›") : null),
                  hasChildren && isOpen
                    ? h("div", { className: "qbot-consoleSubMenu" },
                        ...item.children!.map((child) =>
                          h("button", {
                            key: child.id, type: "button",
                            className: `qbot-consoleMenuItem qbot-consoleSubItem${selected === child.id ? " is-active" : ""}`,
                            "aria-current": selected === child.id ? "page" : undefined,
                            onClick: () => setSelected(child.id),
                          }, h("span", null, t(child.label)))))
                    : null);
              })))),
      h("div", { className: `qbot-consoleContent${isFill ? " is-fill" : ""}${view.kind === "overview" ? " is-overview" : ""}` },
        h("div", { className: "qbot-consolePaneHead" },
          h("div", null,
            h("div", { className: "qbot-consoleCrumb" },
              t(path.group.label),
              path.parent ? h("span", null, h("i", null, "›"), t(path.parent.label)) : null,
              path.parent ? h("span", null, h("i", null, "›"), t(path.leaf.label)) : null),
            h("h3", null, t(path.leaf.label)))),
        h("div", { className: "qbot-consolePaneBody" }, content())))));
}
