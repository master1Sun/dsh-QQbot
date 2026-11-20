/**
 * 消息归档弹窗（archive.chats / archive.chat / archive.removeChat）。
 * 左栏：归档中出现过的会话（个人单聊 + 群聊）按「会话 → 月份」两级折叠分组；
 *       月节点显示图标 + 群名 + 月份日期 + 条数。
 * 右栏：选中「会话 + 月份」的消息记录，按时间倒序（最新在上）、按月分组分隔，
 *       卡片含头像 + 昵称 + 时间 + 正文 + 引用块（被动回复引用同会话最近一条用户消息）。
 * 右栏默认最多显示 300 条，超出可「加载更多」或「显示全部」。状态自包含。
 */
import * as React from "react";
import { useGroupInfos, type GroupInfo } from "../group-info.js";
import { fmt, h, t, useLocale } from "../i18n/index.js";
import { looksLikeMarkdown, renderMarkdown } from "../md.js";
import type { RpcCall } from "../types.js";
import { confirmDlg, errText, formatTime, val } from "../ui.js";
import { ArchivedMediaView } from "./archive-media.js";

type ChatScope = "group" | "c2c";

interface MonthSummary {
  month: string;
  count: number;
  lastTs: string;
  lastContent: string;
}

interface ChatSummary {
  scope: ChatScope;
  openid: string;
  name: string;
  lastSenderName: string;
  lastTs: string;
  lastContent: string;
  count: number;
  months: MonthSummary[];
}

interface ActiveChat {
  scope: ChatScope;
  openid: string;
  key: string;
  title: string;
  month: string;
}

function chatKey(scope: ChatScope, openid: string): string {
  return `${scope}:${openid}`;
}

/** "YYYY-MM" -> "YYYY年M月" */
function fmtMonth(month: string): string {
  const [y, m] = month.split("-");
  if (y && m) return `${y}年${Number(m)}月`;
  return month;
}

/** 左栏/右栏标题用的会话名：群聊优先用官方群资料里的真实群名，失败回退旧逻辑。 */
function chatTitle(c: ChatSummary, info?: GroupInfo): string {
  const tail = String(c.openid ?? "").slice(-6);
  if (c.scope === "c2c") return c.name || `用户 ${tail}`;
  if (info?.group_name) return info.group_name;
  return c.lastSenderName ? `群 · ${c.lastSenderName}` : `群 ${tail}`;
}

/** QQ 表情/表情包标签（平台只下发 <faceType=...> 元数据，无图片可回显）。 */
const FACE_TAG_RE = /<faceType=[^>]*>/g;

/** 把正文拆成 文本 / 表情包 两类片段，表情包片段回显为「表情包」徽章（原始记录不改）。 */
function faceSegments(content: string): Array<{ face: boolean; text: string }> {
  const out: Array<{ face: boolean; text: string }> = [];
  let last = 0;
  for (const m of content.matchAll(FACE_TAG_RE)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push({ face: false, text: content.slice(last, idx) });
    out.push({ face: true, text: "" });
    last = idx + m[0].length;
  }
  if (last < content.length) out.push({ face: false, text: content.slice(last) });
  return out;
}

/** 引用块/搜索用的纯文本降级：标签整体替换为指定占位文字。 */
function faceClean(content: string, label: string): string {
  return content.replace(FACE_TAG_RE, label);
}

/** 圆形头像（无真实头像图，用图标占位）。 */
function Avatar(p: { kind: "bot" | "person" | "group"; size?: number }) {
  const s = p.size ?? 40;
  const common = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  let glyph: React.ReactNode;
  if (p.kind === "bot") {
    glyph = h("g", null,
      h("rect", { x: 5, y: 7, width: 14, height: 11, rx: 3 }),
      h("path", { d: "M12 4v3" }),
      h("circle", { cx: 12, cy: 3, r: 0.9, fill: "currentColor", stroke: "none" }),
      h("circle", { cx: 9.3, cy: 12.5, r: 1, fill: "currentColor", stroke: "none" }),
      h("circle", { cx: 14.7, cy: 12.5, r: 1, fill: "currentColor", stroke: "none" }));
  } else if (p.kind === "group") {
    glyph = h("g", null,
      h("circle", { cx: 9, cy: 9, r: 3 }),
      h("circle", { cx: 17, cy: 10, r: 2.3 }),
      h("path", { d: "M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" }),
      h("path", { d: "M14.5 19c0-2.2 1.4-3.7 3.2-3.9" }));
  } else {
    glyph = h("g", null,
      h("circle", { cx: 12, cy: 8.5, r: 3.4 }),
      h("path", { d: "M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" }));
  }
  return h("span", { className: `qbot-avatar qbot-avatar-${p.kind}` },
    h("svg", { ...common, "aria-hidden": "true" }, glyph));
}

/** 会话头像（小号，供左栏月节点 / 右栏标题复用）。 */
function miniAvatar(kind: "bot" | "person" | "group") {
  return h("span", { className: `qbot-avatar qbot-avatar-${kind} qbot-avatarXs` },
    h("svg", { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" },
      kind === "group"
        ? h("g", null, h("circle", { cx: 9, cy: 9, r: 3 }), h("circle", { cx: 17, cy: 10, r: 2.3 }), h("path", { d: "M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" }), h("path", { d: "M14.5 19c0-2.2 1.4-3.7 3.2-3.9" }))
        : h("g", null, h("circle", { cx: 12, cy: 8.5, r: 3.4 }), h("path", { d: "M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" }))));
}

const pad2 = (n: number) => String(n).padStart(2, "0");
/** 右栏消息默认显示条数（分页大小）；「加载更多」按此步长追加。 */
const RECORDS_PAGE = 300;
const isoOf = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const dispDate = (iso: string) => iso.replaceAll("-", "/");
const DATE_WD: Record<"cn" | "en", string[]> = {
  cn: ["一", "二", "三", "四", "五", "六", "日"],
  en: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
};
const DATE_MON: Record<"cn" | "en", string[]> = {
  cn: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

/** 自定义日期范围选择器：触发按钮 + 弹出日历。有消息的日子在日历上打点标记。 */
function DateRangePicker(props: {
  from: string;
  to: string;
  /** 有消息的日期集合（ISO "YYYY-MM-DD"，来自已加载记录）。 */
  marked: Set<string>;
  /** 打开面板时默认展示的月份（"YYYY-MM"，通常为当前会话月份）。 */
  defaultMonth: string;
  onChange: (from: string, to: string) => void;
  label: string;
}) {
  const { from, to, marked, defaultMonth, onChange, label } = props;
  const locale = useLocale();
  const [open, setOpen] = React.useState(false);
  const [view, setView] = React.useState(() => {
    const now = new Date();
    return { y: now.getFullYear(), m: now.getMonth() + 1 };
  });
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  // 每次展开把视图跳到当前范围/会话所在月份；点外面收起。
  React.useEffect(() => {
    if (!open) return;
    const base = (from || defaultMonth || "").slice(0, 7);
    const parts = base.split("-").map(Number);
    if (parts.length === 2 && parts.every((n) => Number.isFinite(n))) setView({ y: parts[0], m: parts[1] });
    const onDoc = (e: any) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDoc, true);
    return () => document.removeEventListener("pointerdown", onDoc, true);
  }, [open, from, defaultMonth]);

  const shiftMonth = (delta: number) => {
    setView((v) => {
      const d = new Date(v.y, v.m - 1 + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() + 1 };
    });
  };
  // 点选：无起点或已完成范围 → 重新选起点；有起点未选终点 → 补终点（自动保证 from<=to；同日=只看当天）。
  const pick = (iso: string) => {
    if (!from || (from && to)) { onChange(iso, ""); return; }
    if (iso < from) onChange(iso, from);
    else onChange(from, iso);
  };
  const active = Boolean(from || to);
  const btnLabel = from && to
    ? `${dispDate(from)} ~ ${dispDate(to)}`
    : from
      ? `${dispDate(from)} ~ …`
      : t("archive.dateAll");

  // 当月日历网格：周一起始，前后补齐其它月份的占位日。
  const lead = (new Date(view.y, view.m - 1, 1).getDay() + 6) % 7;
  const daysIn = new Date(view.y, view.m, 0).getDate();
  const cells: Array<{ iso: string; day: number; out: boolean }> = [];
  for (let i = lead; i >= 1; i -= 1) {
    const d = new Date(view.y, view.m - 1, 1 - i);
    cells.push({ iso: isoOf(d), day: d.getDate(), out: true });
  }
  for (let d = 1; d <= daysIn; d += 1) cells.push({ iso: `${view.y}-${pad2(view.m)}-${pad2(d)}`, day: d, out: false });
  {
    const tail = (7 - (cells.length % 7)) % 7;
    for (let i = 1; i <= tail; i += 1) {
      const d = new Date(view.y, view.m, i);
      cells.push({ iso: isoOf(d), day: d.getDate(), out: true });
    }
  }

  return h("div", { className: "qbot-archDateWrap", ref: rootRef },
    h("button", {
      type: "button",
      className: `qbot-archDateBtn${active ? " is-on" : ""}`,
      onClick: () => setOpen((v) => !v),
      "aria-label": label,
      "aria-expanded": open,
      title: label,
    },
      h("svg", { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" },
        h("rect", { x: 3.5, y: 5, width: 17, height: 15.5, rx: 3 }),
        h("path", { d: "M3.5 9.5h17" }),
        h("path", { d: "M8 3v3M16 3v3" })),
      h("span", { className: "qbot-archDateBtnText" }, btnLabel)),
    open
      ? h("div", { className: "qbot-archDatePanel", role: "dialog", "aria-label": label },
          h("div", { className: "qbot-archDateHead" },
            h("button", { type: "button", className: "qbot-archDateNav", "aria-label": "‹", onClick: () => shiftMonth(-1) }, "‹"),
            h("span", { className: "qbot-archDateTitle" }, locale === "en" ? `${DATE_MON[locale][view.m - 1]} ${view.y}` : `${view.y}年${DATE_MON[locale][view.m - 1]}`),
            h("button", { type: "button", className: "qbot-archDateNav", "aria-label": "›", onClick: () => shiftMonth(1) }, "›")),
          h("div", { className: "qbot-archDateGrid" },
            DATE_WD[locale].map((w) => h("span", { key: `wd-${w}`, className: "qbot-archDateWd" }, w)),
            cells.map((c) => {
              const cls = [
                "qbot-archDateCell",
                c.out ? "is-out" : "",
                marked.has(c.iso) ? "is-marked" : "",
                (c.iso === from || c.iso === to) ? "is-edge" : "",
                (from && to && c.iso > from && c.iso < to) ? "is-inrange" : "",
              ].filter(Boolean).join(" ");
              return h("button", {
                key: c.iso, type: "button", className: cls,
                disabled: c.out,
                onClick: () => pick(c.iso),
              }, String(c.day));
            })),
          h("div", { className: "qbot-archDateFoot" },
            h("button", {
              type: "button", className: "qbot-archDateClear",
              onClick: () => { onChange("", ""); },
            }, t("archive.dateClear")),
            h("span", { className: "qbot-archDateHint" }, from && !to ? t("archive.dateHint") : t("archive.dateMarkHint"))))
      : null);
}

/** 自定义成员下拉：按钮 + 弹出选项列表（原生 select 的下拉样式不可控，这里自绘高亮）。 */
function MemberPicker(props: {
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (v: string) => void;
  label: string;
  allText: string;
}) {
  const { value, options, onChange, label, allText } = props;
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  // 点外面收起。
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: any) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDoc, true);
    return () => document.removeEventListener("pointerdown", onDoc, true);
  }, [open]);
  const pick = (v: string) => { onChange(v); setOpen(false); };
  const current = options.find((o) => o.value === value);
  return h("div", { className: "qbot-archMemberWrap", ref: rootRef },
    h("button", {
      type: "button",
      className: `qbot-archMemberBtn${value ? " is-on" : ""}`,
      onClick: () => setOpen((v) => !v),
      "aria-label": label,
      "aria-expanded": open,
      title: value ? (current?.label ?? value) : label,
    },
      h("span", { className: "qbot-archMemberBtnText" }, value ? (current?.label ?? value) : allText),
      h("svg", { className: "qbot-archMemberCaret", width: 12, height: 12, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" },
        h("path", { d: "M6 9l6 6 6-6" }))),
    open
      ? h("div", { className: "qbot-archMemberPanel", role: "listbox", "aria-label": label },
          h("button", {
            type: "button", role: "option", "aria-selected": !value,
            className: `qbot-archMemberItem${!value ? " is-on" : ""}`,
            title: allText,
            onClick: () => pick(""),
          }, allText),
          options.map((o) => h("button", {
            key: o.value, type: "button", role: "option", "aria-selected": o.value === value,
            className: `qbot-archMemberItem${o.value === value ? " is-on" : ""}`,
            title: o.label,
            onClick: () => pick(o.value),
          }, o.label)))
      : null);
}

export function ArchiveDialog(props: {
  rpcCall: RpcCall;
  /** 当前详情机器人（归档记录按机器人过滤）。 */
  detailAppId: string;
  onClose: () => void;
}) {
  const { rpcCall, detailAppId, onClose } = props;

  const [loadingChats, setLoadingChats] = React.useState(true);
  const [error, setError] = React.useState("");
  const [chats, setChats] = React.useState<ChatSummary[]>([]);
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());
  const [active, setActive] = React.useState<ActiveChat | null>(null);
  const [loadingRecords, setLoadingRecords] = React.useState(false);
  // records = 当前会话+月份的全量记录（一次性拉取）；分页显示由 visibleCount 控制。
  const [records, setRecords] = React.useState<Array<Record<string, any>>>([]);
  const [visibleCount, setVisibleCount] = React.useState(RECORDS_PAGE);
  // 右栏筛选（对全量记录过滤）：关键词 / 群成员 / 日期范围。
  const [search, setSearch] = React.useState("");
  const [member, setMember] = React.useState("");
  const [rangeFrom, setRangeFrom] = React.useState("");
  const [rangeTo, setRangeTo] = React.useState("");
  // 展开的媒体（`<记录下标>:<媒体下标>`），同一时刻只展开一个，避免拉取过多大文件。
  const [expandedMedia, setExpandedMedia] = React.useState("");
  // 用户资料（昵称/头像，openid → { name, avatar }）：宿主从消息事件学习 + 平台接口兜底，
  // 供右栏消息气泡显示真实头像。
  const [profiles, setProfiles] = React.useState<Record<string, { name?: string; avatar?: string }>>({});
  // 机器人自身资料（GET /users/@me）：右栏机器人消息用它显示真实头像+昵称，失败回退默认图标。
  const [selfInfo, setSelfInfo] = React.useState<{ name?: string; avatar?: string }>({});

  // 加载机器人自身资料（昵称/头像）。归档里的机器人消息此前写死默认图标，现改用 @me 的真实资料。
  React.useEffect(() => {
    let alive = true;
    void Promise.resolve(rpcCall("platform.selfInfo", detailAppId ? { appId: detailAppId } : {}))
      .then((res) => {
        if (!alive || !res.ok) return;
        const data = (val(res) ?? {}) as { username?: string; avatar?: string };
        if (data.username || data.avatar) setSelfInfo({ name: data.username, avatar: data.avatar });
      })
      .catch(() => undefined);
    return () => { alive = false; };
  }, [rpcCall, detailAppId]);
  // 群资料（群名/人数/简介/分类/标签）：openid → GroupInfo。
  // 与平台能力群选择器共用缓存，会话列表变化后批量补齐（最多 30 个，失败静默）。
  const groupInfoMap = useGroupInfos(
    rpcCall,
    detailAppId ?? "",
    [...new Set(chats.filter((c) => c.scope === "group").map((c) => c.openid))],
  );

  // 批量解析资料（失败静默，头像只是增强展示）：左栏个人会话 openid + 当前记录里出现过的发送者。
  React.useEffect(() => {
    const openids = [...new Set([
      ...chats.filter((c) => c.scope === "c2c" && c.openid).map((c) => c.openid),
      ...records
        .filter((r) => r.kind === "inbound" && typeof r.sender === "string" && r.sender)
        .map((r) => String(r.sender)),
    ])].slice(0, 30);
    const missing = openids.filter((o) => !profiles[o]);
    if (!missing.length) return;
    let alive = true;
    rpcCall("platform.userInfo", { ...(detailAppId ? { appId: detailAppId } : {}), openids: missing })
      .then((res) => {
        if (!alive || !res.ok) return;
        const users = (val(res)?.users ?? {}) as Record<string, { name?: string; avatar?: string }>;
        if (Object.keys(users).length) {
          setProfiles((prev) => ({ ...prev, ...users }));
        } else {
          // 全部失败也占位，避免每次渲染都重试。
          setProfiles((prev) => ({ ...prev, ...Object.fromEntries(missing.map((o) => [o, {}])) }));
        }
      })
      .catch(() => undefined);
    return () => { alive = false; };
  }, [chats, records, rpcCall, detailAppId]);

  /** 读取会话列表并自动选中（优先指定 key+month，否则最近活动会话的最近月份）。 */
  const loadChats = React.useCallback(async (preferKey = "", preferMonth = "") => {
    setLoadingChats(true);
    setError("");
    try {
      const res = await rpcCall("archive.chats", detailAppId ? { appId: detailAppId } : {});
      if (!res.ok) {
        setError(errText(res.error));
        return;
      }
      const v = val(res) ?? {};
      const list = Array.isArray(v.chats) ? (v.chats as ChatSummary[]) : [];
      setChats(list);
      const pick = list.find((c) => chatKey(c.scope, c.openid) === preferKey)
        ?? list[0]
        ?? null;
      if (pick) {
        const key = chatKey(pick.scope, pick.openid);
        const month = (preferKey && preferMonth) ? preferMonth : (pick.months?.[0]?.month ?? "");
        setExpanded((prev) => new Set(prev).add(key));
        await selectChat({ scope: pick.scope, openid: pick.openid, key, title: chatTitle(pick), month });
      } else {
        // 列表已空：清掉右栏残留记录，否则会出现「左栏无会话、右栏仍显示上一条消息」。
        setActive(null);
        setRecords([]);
      }
    } catch (error) {
      // RPC 抛错（宿主重启 / 连接断开）时也要复位，否则弹窗会永远停在加载态。
      setError(errText(error));
    } finally {
      setLoadingChats(false);
    }
  }, [rpcCall, detailAppId]);

  /** 读取指定会话+月份的全量记录（右栏，倒序）；筛选与分页（visibleCount）都在客户端做。 */
  const loadRecords = React.useCallback(async (chat: ActiveChat) => {
    setLoadingRecords(true);
    setError("");
    try {
      const res = await rpcCall("archive.chat", {
        chat: chat.key,
        month: chat.month,
        ...(detailAppId ? { appId: detailAppId } : {}),
        limit: 100000,
        offset: 0,
        order: "desc",
      });
      if (!res.ok) {
        setError(errText(res.error));
        return;
      }
      const v = val(res) ?? {};
      setRecords(Array.isArray(v.records) ? v.records : []);
    } catch (error) {
      setError(errText(error));
    } finally {
      setLoadingRecords(false);
    }
  }, [rpcCall, detailAppId]);

  const selectChat = React.useCallback(async (chat: ActiveChat) => {
    setActive(chat);
    setSearch(""); setMember(""); setRangeFrom(""); setRangeTo("");
    setVisibleCount(RECORDS_PAGE);
    setExpanded((prev) => new Set(prev).add(chat.key));
    await loadRecords(chat);
  }, [loadRecords]);

  /** 删除当前会话当前月份的归档：先确认，成功后全量刷新左栏列表与右栏记录。 */
  const removeChat = async (chat: ActiveChat) => {
    const month = chat.month || "";
    // 月份为空时宿主会按「删除整个会话」处理（跨所有月份）——UI 的删除入口语义是
    // 「只删当前月份」，所以宁可不删也不能退化成整段删除。
    if (!month) {
      setError(t("archive.deleteMonthRequired"));
      return;
    }
    if (!(await confirmDlg({ message: fmt("archive.deleteMonthConfirm", chat.title, fmtMonth(month)), danger: true }))) return;
    setError("");
    const res = await rpcCall("archive.removeChat", { chat: chat.key, month, ...(detailAppId ? { appId: detailAppId } : {}) });
    if (!res.ok) {
      setError(errText(res.error));
      return;
    }
    // 清空右栏旧记录后立即重新拉取会话列表：不依赖删除响应里的 chats 结构，
    // 保证月份节点/条数、选中态、消息内容都随删除同步更新。
    setRecords([]);
    setVisibleCount(RECORDS_PAGE);
    await loadChats(chat.key, "");
  };

  const toggleGroup = React.useCallback((key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  React.useEffect(() => {
    void loadChats("", "");
  }, [loadChats]);

  const c2cList = chats.filter((c) => c.scope === "c2c");
  const groupList = chats.filter((c) => c.scope === "group");
  /** 当前群聊的真实群资料（用于右栏标题与资料条）。 */
  const activeGroupInfo = active?.scope === "group" ? groupInfoMap[active.openid] : undefined;
  /** 右栏标题：群聊优先真实群名（与左栏一致），单聊沿用 selectChat 时的标题。 */
  const activeTitle = active
    ? (activeGroupInfo?.group_name || active.title)
    : "";
  /** 右栏标题下的群资料条：人数 / 分类 / 标签 / 简介（官方接口字段）。 */
  const groupMeta = activeGroupInfo && (
    activeGroupInfo.group_member_num || activeGroupInfo.group_class_text
    || (activeGroupInfo.group_tags?.length ?? 0) > 0 || activeGroupInfo.group_finger_memo
  )
    ? h("div", { className: "qbot-archGroupMeta" },
        activeGroupInfo.group_member_num
          ? h("span", null, fmt("archive.groupMemberNum", String(activeGroupInfo.group_member_num))) : null,
        activeGroupInfo.group_class_text
          ? h("span", null, fmt("archive.groupClass", activeGroupInfo.group_class_text)) : null,
        (activeGroupInfo.group_tags?.length ?? 0) > 0
          ? h("span", null, fmt("archive.groupTags", (activeGroupInfo.group_tags ?? []).join("、"))) : null,
        activeGroupInfo.group_finger_memo
          ? h("span", { title: activeGroupInfo.group_finger_memo }, fmt("archive.groupMemo", activeGroupInfo.group_finger_memo)) : null)
    : null;

  // 客户端筛选（只作用于「已加载」的记录）：关键词匹配内容/发送者/备注，成员精确匹配，日期落在 [from, to] 区间。
  // 谓词单独抽出：导出 CSV 时对全量记录复用同一套筛选条件。
  const kw = search.trim().toLowerCase();
  const filtersActive = Boolean(kw || member || rangeFrom || rangeTo);
  const matchRecord = React.useCallback((r: any) => {
    const sender = String(r.senderName || r.sender || "");
    if (member && sender !== member) return false;
    if (rangeFrom || rangeTo) {
      const d = String(r.ts ?? "").slice(0, 10);
      if (rangeFrom && d < rangeFrom) return false;
      if (rangeTo && d > rangeTo) return false;
    }
    if (kw) {
      const hay = `${sender}\n${faceClean(String(r.content ?? ""), t("archive.sticker"))}\n${String(r.note ?? "")}`.toLowerCase();
      if (!hay.includes(kw)) return false;
    }
    return true;
  }, [member, rangeFrom, rangeTo, kw]);
  // 筛选对全量记录生效；显示按 visibleCount 分页切片。
  const matched = filtersActive ? records.filter(matchRecord) : records;
  const visible = matched.slice(0, visibleCount);

  // 导出 CSV：对全量记录（已在内存）套用当前筛选条件，按时间正序生成 CSV 下载。
  const exportCsv = (chat: ActiveChat) => {
    try {
      const all = filtersActive ? records.filter(matchRecord) : records;
      const rows = [...all].reverse(); // records 是倒序，导出按时间正序更易读
      // CSV 转义：值整体包引号，内部引号翻倍；带 BOM 保证 Excel 直开中文不乱码。
      const esc = (s: string) => `"${s.replaceAll("\"", "\"\"")}"`;
      const lines: string[] = [
        [t("archive.colTime"), t("archive.colType"), t("archive.colSender"), t("archive.colContent"), t("archive.colNote")].map(esc).join(","),
      ];
      for (const r of rows) {
        const isBot = r.kind === "reply" || r.kind === "proactive";
        const kindLabel = r.kind === "reply"
          ? t("archive.kindReply")
          : r.kind === "proactive" ? t("archive.kindProactive") : t("archive.kindInbound");
        const name = isBot
          ? t("idpick.bot")
          : (String(r.senderName || r.sender || "") || (chat.scope === "group" ? t("archive.member") : t("archive.them")));
        lines.push([
          String(r.ts ?? ""),
          kindLabel,
          name,
          String(r.content ?? ""),
          String(r.note ?? ""),
        ].map(esc).join(","));
      }
      const blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${chat.title}-${chat.month}.csv`.replace(/[\\/:*?"<>|]/g, "_");
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      setError(errText(error));
    }
  };
  // 有消息的日期集合（供日期选择器打点标记）：来自全部已加载记录（不受当前筛选影响）。
  const markedDays = React.useMemo(() => {
    const s = new Set<string>();
    for (const r of records) {
      const d = String(r.ts ?? "").slice(0, 10);
      if (/^\d{4}-\d{2}-\d{2}$/.test(d)) s.add(d);
    }
    return s;
  }, [records]);
  // 群成员候选：从已加载记录里收集出现过的发送者（去重 + 按名称排序）。
  const memberOptions: Array<{ value: string; label: string }> = [];
  if (active?.scope === "group") {
    const seen = new Set<string>();
    for (const r of records) {
      const name = String(r.senderName || r.sender || "").trim();
      if (!name || seen.has(name)) continue;
      seen.add(name);
      memberOptions.push({ value: name, label: name });
    }
    memberOptions.sort((a, b) => a.label.localeCompare(b.label));
  }

  // 右栏按月分组：倒序记录里同月连续成组，预扫描出每条被动回复引用的「最近一条用户消息」。
  // records 是 order=desc（索引 0 最新），触发某条回复的用户消息在时间上更早、索引更大，
  // 因此必须从后往前（最旧→最新）遍历：回复取到的是它之前刚出现过的最近一条入站消息。
  const quoteByIndex: Array<{ name: string; content: string } | null> = new Array(visible.length).fill(null);
  {
    let lastInbound: { name: string; content: string } | null = null;
    for (let i = visible.length - 1; i >= 0; i -= 1) {
      const r = visible[i];
      const isBot = r.kind === "reply" || r.kind === "proactive";
      const name = isBot
        ? t("idpick.bot")
        : (r.senderName || r.sender || (active?.scope === "group" ? t("archive.member") : t("archive.them")));
      if (r.kind === "reply") quoteByIndex[i] = lastInbound;
      if (r.kind === "inbound") lastInbound = { name, content: faceClean(String(r.content ?? ""), t("archive.sticker")) };
    }
  }

  // 把扁平记录按月份切成分组（保持倒序）。
  const monthGroups: Array<{ month: string; items: Array<Record<string, any>> }> = [];
  for (const r of visible) {
    const m = (r.ts || "").slice(0, 7);
    const g = monthGroups[monthGroups.length - 1];
    if (g && g.month === m) g.items.push(r);
    else monthGroups.push({ month: m, items: [r] });
  }

  return h("div", { className: "qbot-modalOverlay" },
    h("div", { className: "qbot-modal qbot-modalWide", role: "dialog", "aria-modal": "true", "aria-label": t("archive.tab") },
      h("div", { className: "qbot-modalHead" },
        h("div", null,
          h("strong", null, t("archive.tab")),
          h("p", null, t("archive.subtitle2"))),
        h("button", { className: "qbot-modalClose", type: "button", "aria-label": t("common.close"), onClick: onClose }, "×")),
      error
        ? h("div", { className: "qbot-modalAlert", role: "alert" }, error)
        : null,
      h("div", { className: `qbot-archSplit${loadingRecords ? " is-refreshing" : ""}` },
        // 左栏：会话 → 月份 两级折叠树
        h("div", { className: "qbot-archSide", "aria-label": t("archive.chatsList") },
          loadingChats
            ? h("div", { className: "qbot-modalState qbot-modalStateInline" }, h("span", { className: "qbot-spinner", "aria-hidden": "true" }), t("archive.loadingChats"))
            : chats.length === 0
              ? h("div", { className: "qbot-archSideEmpty" }, t("archive.noChats"))
              : h("div", { className: "qbot-archChats" },
                  c2cList.length > 0
                    ? h("div", { className: "qbot-convSection" },
                        h("div", { className: "qbot-convSectionTitle" }, t("archive.people")),
                        c2cList.map((c) => renderConvGroup(c, active, expanded, selectChat, toggleGroup, groupInfoMap, profiles)))
                    : null,
                  groupList.length > 0
                    ? h("div", { className: "qbot-convSection" },
                        h("div", { className: "qbot-convSectionTitle" }, t("archive.groups")),
                        groupList.map((c) => renderConvGroup(c, active, expanded, selectChat, toggleGroup, groupInfoMap, profiles)))
                    : null)),
        // 右栏：选中会话+月份的记录（倒序、按月分组、可翻页）
        h("div", { className: "qbot-archMain" },
          !active
            ? h("div", { className: "qbot-archState" }, h("div", { className: "qbot-modalState" }, t("archive.pickMonth")))
            : h("div", { className: "qbot-archChatHead" },
                h("div", { className: "qbot-archChatTitleWrap" },
                  h("div", { className: "qbot-archChatTitle" },
                    active.scope === "c2c" && profiles[active.openid]?.avatar
                      ? h("img", { className: "qbot-avatarImg qbot-convMonthAvatarImg", src: profiles[active.openid].avatar, alt: "", loading: "lazy", referrerPolicy: "no-referrer" })
                      : h("span", { className: `qbot-avatar qbot-avatar-${active.scope === "group" ? "group" : "person"} qbot-avatarSm` },
                          h("svg", { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" },
                            active.scope === "group"
                              ? h("g", null, h("circle", { cx: 9, cy: 9, r: 3 }), h("circle", { cx: 17, cy: 10, r: 2.3 }), h("path", { d: "M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" }), h("path", { d: "M14.5 19c0-2.2 1.4-3.7 3.2-3.9" }))
                              : h("g", null, h("circle", { cx: 12, cy: 8.5, r: 3.4 }), h("path", { d: "M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" })))),
                    h("span", null, `${activeTitle} · ${fmtMonth(active.month)}`)),
                  groupMeta),
                h("div", { className: "qbot-archChatActions" },
                  h("button", {
                    type: "button", className: "qbot-archChatDel",
                    "aria-label": t("archive.exportCsv"), title: t("archive.exportCsvHint"),
                    disabled: false,
                    onClick: () => void exportCsv(active),
                  }, h("svg", { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" },
                    h("path", { d: "M12 4v11" }),
                    h("path", { d: "M7.5 11.5 12 16l4.5-4.5" }),
                    h("path", { d: "M4.5 19.5h15" }))),
                  h("button", {
                    type: "button", className: "qbot-archChatDel",
                    "aria-label": fmt("archive.deleteMonthLabel", active.title, fmtMonth(active.month)), title: t("archive.deleteMonthHint"),
                    onClick: () => void removeChat(active),
                  }, h("svg", { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" },
                    h("path", { d: "M4 7h16" }),
                    h("path", { d: "M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" }),
                    h("path", { d: "M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" }),
                    h("path", { d: "M10 11v6M14 11v6" }))))),
          // 筛选栏（仿聊天记录搜索）：关键词 / 群成员（仅群聊且有候选）/ 日期，客户端过滤已加载记录。
          // 筛选栏（仿聊天记录搜索）：关键词 / 群成员（仅群聊且有候选）/ 日期，客户端过滤已加载记录。
          active
            ? h("div", { className: "qbot-archSearchBar" },
                h("div", { className: "qbot-archSearchBox" },
                  h("svg", { className: "qbot-archSearchIcon", width: 15, height: 15, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" },
                    h("circle", { cx: 11, cy: 11, r: 7 }),
                    h("path", { d: "M20 20l-3.5-3.5" })),
                  h("input", {
                    type: "text",
                    className: "qbot-archSearchInput",
                    placeholder: t("archive.searchPlaceholder"),
                    value: search,
                    onChange: (ev: any) => setSearch(ev.target.value),
                    "aria-label": t("archive.searchPlaceholder"),
                  }),
                  // ×常驻占位（visibility 切换）：有无文字都不增减节点，避免布局抖动。
                  h("button", {
                    type: "button", className: "qbot-archSearchX",
                    "aria-label": t("archive.clearFilters"),
                    style: { visibility: search ? "visible" : "hidden" },
                    tabIndex: search ? 0 : -1,
                    disabled: !search,
                    onClick: () => setSearch(""),
                  }, "×")),
                active.scope === "group" && memberOptions.length > 0
                  ? h(MemberPicker, {
                      value: member,
                      options: memberOptions,
                      onChange: (v: string) => setMember(v),
                      label: t("archive.memberFilter"),
                      allText: t("archive.memberAll"),
                    })
                  : null,
                h(DateRangePicker, {
                  from: rangeFrom,
                  to: rangeTo,
                  marked: markedDays,
                  defaultMonth: active?.month || "",
                  onChange: (f: string, tt: string) => { setRangeFrom(f); setRangeTo(tt); },
                  label: t("archive.dayFilter"),
                }))
            : null,
          h("div", { className: "qbot-msgList" },
            loadingRecords && records.length === 0
              ? h("div", { className: "qbot-modalState" }, h("span", { className: "qbot-spinner", "aria-hidden": "true" }), t("archive.loading"))
              : matched.length === 0
                ? h("div", { className: "qbot-modalState" }, filtersActive ? t("archive.filterNoMatch") : t("archive.chatEmpty"))
                : monthGroups.map((group) =>
                    h("div", { className: "qbot-monthGroup", key: group.month },
                      h("div", { className: "qbot-monthDivider" },
                        h("span", { className: "qbot-monthDividerLabel" }, group.month ? fmtMonth(group.month) : t("archive.unknownMonth")),
                        h("span", { className: "qbot-monthDividerCount" }, fmt("archive.monthCount", group.items.length))),
                      group.items.map((r: any, i: number) => {
                        const isBot = r.kind === "reply" || r.kind === "proactive";
                        const profile = !isBot && typeof r.sender === "string" ? profiles[r.sender] : undefined;
                        // 机器人消息用 @me 的真实昵称（失败回退「机器人」）；用户消息沿用原优先级。
                        const name = isBot
                          ? (selfInfo.name || t("idpick.bot"))
                          : (r.senderName || profile?.name || r.sender || (active?.scope === "group" ? t("archive.member") : t("archive.them")));
                        const avatarKind: "bot" | "person" | "group" = isBot ? "bot" : (active?.scope === "group" ? "group" : "person");
                        // 机器人消息优先 @me 头像，用户消息优先事件学习的头像，都缺省回落占位图标。
                        const avatarUrl = isBot ? selfInfo.avatar : profile?.avatar;
                        const quote = r.kind === "reply" ? quoteByIndex[i] : null;
                        const content = String(r.content ?? "");
                        const useMd = isBot || looksLikeMarkdown(content);
                        // 表情包标签（<faceType=...>）回显为「表情包」徽章，避免展示平台元数据乱码。
                        const faceSegs = faceSegments(content);
                        const hasFace = faceSegs.some((s) => s.face);
                        // 随消息落地的媒体（图片 / 视频 / 文件）：受「归档媒体保存」设置控制，
                        // 未开启保存时记录里没有 media 字段，这里自然不渲染任何东西。
                        const media: Array<Record<string, any>> = Array.isArray(r.media) ? r.media : [];
                        // 未保存的附件及原因（诊断用：平台无地址 / 语音 / 超限 / 下载失败）。
                        const mediaSkipped: Array<Record<string, any>> = Array.isArray(r.mediaSkipped) ? r.mediaSkipped : [];
                        return h("div", { key: `${r.ts ?? ""}-${i}`, className: `qbot-msgCard ${isBot ? "is-bot" : "is-user"}` },
                          h("div", { className: "qbot-msgAvatar" },
                            avatarUrl
                              ? h("img", { className: "qbot-avatarImg", src: avatarUrl, alt: "", loading: "lazy", referrerPolicy: "no-referrer" })
                              : h(Avatar, { kind: avatarKind })),
                          h("div", { className: "qbot-msgBody" },
                            h("div", { className: "qbot-msgHead" },
                              h("span", { className: "qbot-msgName" }, name),
                              h("span", { className: "qbot-msgTime" }, formatTime(r.ts))),
                            quote
                              ? h("div", { className: "qbot-msgQuote" },
                                  h("div", { className: "qbot-msgQuoteName" }, quote.name),
                                  h("div", { className: "qbot-msgQuoteText" }, quote.content))
                              : null,
                            hasFace
                              ? h("div", { className: "qbot-msgText" },
                                  faceSegs.map((s, si) => s.face
                                    ? h("span", { className: "qbot-msgFace", key: `f${si}` }, t("archive.sticker"))
                                    : (s.text ? h("span", { key: `t${si}` }, s.text) : null)))
                              : useMd
                              ? h("div", {
                                className: "qbot-msgText qbot-md",
                                dangerouslySetInnerHTML: { __html: renderMarkdown(content) },
                              })
                              : h("div", { className: "qbot-msgText" }, content),
                            media.length > 0
                              ? h("div", { className: "qbot-archMediaList" },
                                  media.map((m, mi) => h(ArchivedMediaView, {
                                    key: `${String(m.file ?? "")}-${mi}`,
                                    rpcCall,
                                    item: m,
                                    expanded: expandedMedia === `${i}:${mi}`,
                                    onToggle: () => setExpandedMedia((prev) => (prev === `${i}:${mi}` ? "" : `${i}:${mi}`)),
                                  })))
                              : null,
                            mediaSkipped.length > 0
                              ? h("div", { className: "qbot-msgNote" },
                                  mediaSkipped.map((s, si) => h("div", { key: `s${si}` },
                                    fmt("archive.mediaSkippedItem", String(s?.name ?? "(未命名)"), String(s?.reason ?? "未知原因")))))
                              : null,
                            r.note && r.kind !== "reply"
                              ? h("div", { className: "qbot-msgNote" }, String(r.note))
                              : null));
                      })))),
          // 底栏：统计 + 分页动作（分页基于筛选后的结果；数据已是全量，无需提示加载限制）。
          active && records.length > 0
            ? h("div", { className: "qbot-archFoot" },
                h("span", { className: "qbot-archFootInfo" }, fmt("archive.shownOf", visible.length, matched.length)),
                visibleCount < matched.length
                  ? h("div", { className: "qbot-archFootMore" },
                      h("button", { type: "button", className: "qbot-archFootLink", disabled: loadingRecords, onClick: () => setVisibleCount(visibleCount + RECORDS_PAGE) }, t("archive.loadMore")),
                      h("span", { className: "qbot-archFootSep" }, "·"),
                      h("button", { type: "button", className: "qbot-archFootLink", disabled: loadingRecords, onClick: () => setVisibleCount(matched.length) }, t("archive.showAll")))
                  : null)
            : null)),
      h("div", { className: "qbot-modalFoot" },
        h("span", { className: "qbot-hint" }, ""),
        h("div", { className: "qbot-viewActions" },
          h("button", { className: "qbot-btn", type: "button", disabled: loadingChats || loadingRecords, onClick: () => void loadChats(active?.key ?? "", active?.month ?? "") }, t("common.refresh")),
          h("button", { className: "qbot-btn qbot-btnPrimary", type: "button", onClick: onClose }, t("common.close"))))));
}

/** 左栏单个会话分组（会话头 + 其下月份）。 */
function renderConvGroup(
  c: ChatSummary,
  active: ActiveChat | null,
  expanded: Set<string>,
  selectChat: (chat: ActiveChat) => void,
  toggleGroup: (key: string) => void,
  groupInfoMap: Record<string, GroupInfo>,
  profiles: Record<string, { name?: string; avatar?: string }>,
): React.ReactElement {
  const key = chatKey(c.scope, c.openid);
  const isOpen = expanded.has(key);
  const info = c.scope === "group" ? groupInfoMap[c.openid] : undefined;
  const title = chatTitle(c, info);
  const memberNum = info?.group_member_num;
  // 个人会话的 openid 即对方用户，拿到头像就显示真图；群聊官方无群头像接口，保留默认图标。
  const personAvatar = c.scope === "c2c" ? profiles[c.openid]?.avatar : undefined;
  return h("div", { key, className: `qbot-convGroup${isOpen ? " is-open" : ""}` },
    h("div", { className: "qbot-convGroupHeadRow" },
      h("button", {
        type: "button", className: "qbot-convGroupHead",
        onClick: () => toggleGroup(key),
        "aria-expanded": isOpen,
        title: title,
      },
        personAvatar
          ? h("img", { className: "qbot-avatarImg qbot-convAvatarImg", src: personAvatar, alt: "", loading: "lazy", referrerPolicy: "no-referrer" })
          : h(Avatar, { kind: c.scope === "group" ? "group" : "person", size: 34 }),
        h("span", { className: "qbot-convGroupName" }, title),
        memberNum && memberNum > 0
          ? h("span", { className: "qbot-convGroupMembers", title: fmt("archive.groupMemberNum", String(memberNum)) }, fmt("archive.groupMembersShort", String(memberNum))) : null,
        h("span", { className: "qbot-convGroupCount", title: t("archive.monthCountTotal") }, `${c.count}`),
        h("svg", { className: "qbot-chevron", width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" },
          h("path", { d: "M9 6l6 6-6 6" })))),
    isOpen
      ? h("div", { className: "qbot-convMonths" },
          (c.months?.length ?? 0) > 0
            ? c.months.map((m) => {
                const isActive = active?.key === key && active.month === m.month;
                return h("button", {
                  type: "button", key: m.month,
                  className: `qbot-convMonth${isActive ? " is-active" : ""}`,
                  onClick: () => void selectChat({ scope: c.scope, openid: c.openid, key, title, month: m.month }),
                  title: fmtMonth(m.month),
                },
                  personAvatar
                    ? h("img", { className: "qbot-avatarImg qbot-convMonthAvatarImg", src: personAvatar, alt: "", loading: "lazy", referrerPolicy: "no-referrer" })
                    : miniAvatar(c.scope === "group" ? "group" : "person"),
                  h("span", { className: "qbot-convMonthMeta" },
                    h("span", { className: "qbot-convMonthName" }, fmtMonth(m.month)),
                    h("span", { className: "qbot-convMonthSub" }, title)),
                  h("span", { className: "qbot-convMonthCount" }, `${m.count}`));
              })
            : h("div", { className: "qbot-convMonthEmpty" }, t("archive.noMonths")))
      : null);
}
