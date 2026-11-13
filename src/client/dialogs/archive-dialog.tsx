/**
 * 消息归档弹窗（archive.chats / archive.chat / archive.removeChat）。
 * 左栏：归档中出现过的会话（个人单聊 + 群聊）按「会话 → 月份」两级折叠分组；
 *       月节点显示图标 + 群名 + 月份日期 + 条数。
 * 右栏：选中「会话 + 月份」的消息记录，按时间倒序（最新在上）、按月分组分隔，
 *       卡片含头像 + 昵称 + 时间 + 正文 + 引用块（被动回复引用同会话最近一条用户消息）。
 * 右栏默认最多显示 300 条，超出可「加载更多」或「显示全部」。状态自包含。
 */
import * as React from "react";
import { fmt, h, t } from "../i18n/index.js";
import { looksLikeMarkdown, renderMarkdown } from "../md.js";
import type { RpcCall } from "../types.js";
import { confirmDlg, errText, formatTime, val } from "../ui.js";

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

/** 左栏/右栏标题用的会话名。 */
function chatTitle(c: ChatSummary): string {
  const tail = String(c.openid ?? "").slice(-6);
  if (c.scope === "c2c") return c.name || `用户 ${tail}`;
  return c.lastSenderName ? `群 · ${c.lastSenderName}` : `群 ${tail}`;
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
  const [records, setRecords] = React.useState<Array<Record<string, any>>>([]);
  const [total, setTotal] = React.useState(0);
  const [moreAvailable, setMoreAvailable] = React.useState(false);

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
        setTotal(0);
        setMoreAvailable(false);
      }
    } catch (error) {
      // RPC 抛错（宿主重启 / 连接断开）时也要复位，否则弹窗会永远停在加载态。
      setError(errText(error));
    } finally {
      setLoadingChats(false);
    }
  }, [rpcCall, detailAppId]);

  /** 读取指定会话+月份的记录（右栏）；order 默认倒序；offset>0 时追加。 */
  const loadRecords = React.useCallback(async (chat: ActiveChat, opts: { limit?: number; offset?: number } = {}) => {
    const limit = opts.limit ?? 300;
    const offset = opts.offset ?? 0;
    setLoadingRecords(true);
    setError("");
    try {
      const res = await rpcCall("archive.chat", {
        chat: chat.key,
        month: chat.month,
        ...(detailAppId ? { appId: detailAppId } : {}),
        limit,
        offset,
        order: "desc",
      });
      if (!res.ok) {
        setError(errText(res.error));
        return;
      }
      const v = val(res) ?? {};
      const incoming = Array.isArray(v.records) ? v.records : [];
      setRecords((prev) => (offset > 0 ? [...prev, ...incoming] : incoming));
      setTotal(Number(v.total) || 0);
      setMoreAvailable(Boolean(v.moreAvailable));
    } catch (error) {
      setError(errText(error));
    } finally {
      setLoadingRecords(false);
    }
  }, [rpcCall, detailAppId]);

  const selectChat = React.useCallback(async (chat: ActiveChat) => {
    setActive(chat);
    setExpanded((prev) => new Set(prev).add(chat.key));
    await loadRecords(chat, { limit: 300, offset: 0 });
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
    setTotal(0);
    setMoreAvailable(false);
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

  // 右栏按月分组：倒序记录里同月连续成组，预扫描出每条被动回复引用的「最近一条用户消息」。
  const quoteByIndex: Array<{ name: string; content: string } | null> = new Array(records.length).fill(null);
  {
    let lastInbound: { name: string; content: string } | null = null;
    for (let i = 0; i < records.length; i += 1) {
      const r = records[i];
      const isBot = r.kind === "reply" || r.kind === "proactive";
      const name = isBot
        ? t("idpick.bot")
        : (r.senderName || r.sender || (active?.scope === "group" ? t("archive.member") : t("archive.them")));
      if (r.kind === "reply") quoteByIndex[i] = lastInbound;
      if (r.kind === "inbound") lastInbound = { name, content: String(r.content ?? "") };
    }
  }

  // 把扁平记录按月份切成分组（保持倒序）。
  const monthGroups: Array<{ month: string; items: Array<Record<string, any>> }> = [];
  for (const r of records) {
    const m = (r.ts || "").slice(0, 7);
    const g = monthGroups[monthGroups.length - 1];
    if (g && g.month === m) g.items.push(r);
    else monthGroups.push({ month: m, items: [r] });
  }

  const shown = records.length;

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
                        c2cList.map((c) => renderConvGroup(c, active, expanded, selectChat, toggleGroup)))
                    : null,
                  groupList.length > 0
                    ? h("div", { className: "qbot-convSection" },
                        h("div", { className: "qbot-convSectionTitle" }, t("archive.groups")),
                        groupList.map((c) => renderConvGroup(c, active, expanded, selectChat, toggleGroup)))
                    : null)),
        // 右栏：选中会话+月份的记录（倒序、按月分组、可翻页）
        h("div", { className: "qbot-archMain" },
          !active
            ? h("div", { className: "qbot-archState" }, h("div", { className: "qbot-modalState" }, t("archive.pickMonth")))
            : h("div", { className: "qbot-archChatHead" },
                h("div", { className: "qbot-archChatTitle" },
                  h("span", { className: `qbot-avatar qbot-avatar-${active.scope === "group" ? "group" : "person"} qbot-avatarSm` },
                    h("svg", { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" },
                      active.scope === "group"
                        ? h("g", null, h("circle", { cx: 9, cy: 9, r: 3 }), h("circle", { cx: 17, cy: 10, r: 2.3 }), h("path", { d: "M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" }), h("path", { d: "M14.5 19c0-2.2 1.4-3.7 3.2-3.9" }))
                        : h("g", null, h("circle", { cx: 12, cy: 8.5, r: 3.4 }), h("path", { d: "M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" })))),
                  h("span", null, `${active.title} · ${fmtMonth(active.month)}`)),
                h("button", {
                  type: "button", className: "qbot-archChatDel",
                  "aria-label": fmt("archive.deleteMonthLabel", active.title, fmtMonth(active.month)), title: t("archive.deleteMonthHint"),
                  onClick: () => void removeChat(active),
                }, h("svg", { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" },
                  h("path", { d: "M4 7h16" }),
                  h("path", { d: "M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" }),
                  h("path", { d: "M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" }),
                  h("path", { d: "M10 11v6M14 11v6" })))),
          h("div", { className: "qbot-msgList" },
            loadingRecords && records.length === 0
              ? h("div", { className: "qbot-modalState" }, h("span", { className: "qbot-spinner", "aria-hidden": "true" }), t("archive.loading"))
              : records.length === 0
                ? h("div", { className: "qbot-modalState" }, t("archive.chatEmpty"))
                : monthGroups.map((group) =>
                    h("div", { className: "qbot-monthGroup", key: group.month },
                      h("div", { className: "qbot-monthDivider" },
                        h("span", { className: "qbot-monthDividerLabel" }, group.month ? fmtMonth(group.month) : t("archive.unknownMonth")),
                        h("span", { className: "qbot-monthDividerCount" }, fmt("archive.monthCount", group.items.length))),
                      group.items.map((r: any, i: number) => {
                        const isBot = r.kind === "reply" || r.kind === "proactive";
                        const name = isBot
                          ? t("idpick.bot")
                          : (r.senderName || r.sender || (active?.scope === "group" ? t("archive.member") : t("archive.them")));
                        const avatarKind: "bot" | "person" | "group" = isBot ? "bot" : (active?.scope === "group" ? "group" : "person");
                        const quote = r.kind === "reply" ? quoteByIndex[i] : null;
                        const content = String(r.content ?? "");
                        const useMd = isBot || looksLikeMarkdown(content);
                        return h("div", { key: `${r.ts ?? ""}-${i}`, className: `qbot-msgCard ${isBot ? "is-bot" : "is-user"}` },
                          h("div", { className: "qbot-msgAvatar" }, h(Avatar, { kind: avatarKind })),
                          h("div", { className: "qbot-msgBody" },
                            h("div", { className: "qbot-msgHead" },
                              h("span", { className: "qbot-msgName" }, name),
                              h("span", { className: "qbot-msgTime" }, formatTime(r.ts))),
                            quote
                              ? h("div", { className: "qbot-msgQuote" },
                                  h("div", { className: "qbot-msgQuoteName" }, quote.name),
                                  h("div", { className: "qbot-msgQuoteText" }, quote.content))
                              : null,
                            useMd
                              ? h("div", {
                                className: "qbot-msgText qbot-md",
                                dangerouslySetInnerHTML: { __html: renderMarkdown(content) },
                              })
                              : h("div", { className: "qbot-msgText" }, content),
                            r.note && r.kind !== "reply"
                              ? h("div", { className: "qbot-msgNote" }, String(r.note))
                              : null));
                      })))),
          active && records.length > 0
            ? h("div", { className: "qbot-archFoot" },
                h("span", { className: "qbot-archFootInfo" }, fmt("archive.shownOf", shown, total)),
                moreAvailable
                  ? h("div", { className: "qbot-archFootMore" },
                      h("button", { type: "button", className: "qbot-archFootLink", disabled: loadingRecords, onClick: () => void loadRecords(active, { offset: shown, limit: 300 }) }, t("archive.loadMore")),
                      h("span", { className: "qbot-archFootSep" }, "·"),
                      h("button", { type: "button", className: "qbot-archFootLink", disabled: loadingRecords, onClick: () => void loadRecords(active, { offset: 0, limit: total }) }, t("archive.showAll")))
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
): React.ReactElement {
  const key = chatKey(c.scope, c.openid);
  const isOpen = expanded.has(key);
  const title = chatTitle(c);
  return h("div", { key, className: `qbot-convGroup${isOpen ? " is-open" : ""}` },
    h("div", { className: "qbot-convGroupHeadRow" },
      h("button", {
        type: "button", className: "qbot-convGroupHead",
        onClick: () => toggleGroup(key),
        "aria-expanded": isOpen,
        title: title,
      },
        h(Avatar, { kind: c.scope === "group" ? "group" : "person", size: 34 }),
        h("span", { className: "qbot-convGroupName" }, title),
        h("span", { className: "qbot-convGroupCount" }, `${c.count}`),
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
                  miniAvatar(c.scope === "group" ? "group" : "person"),
                  h("span", { className: "qbot-convMonthMeta" },
                    h("span", { className: "qbot-convMonthName" }, fmtMonth(m.month)),
                    h("span", { className: "qbot-convMonthSub" }, title)),
                  h("span", { className: "qbot-convMonthCount" }, `${m.count}`));
              })
            : h("div", { className: "qbot-convMonthEmpty" }, t("archive.noMonths")))
      : null);
}
