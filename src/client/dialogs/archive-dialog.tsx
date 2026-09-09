/**
 * 消息归档弹窗（archive.days / archive.list / archive.removeDay）。
 * 左栏日期文件 / 右栏记录内容（Markdown 气泡渲染）。状态自包含：
 * 挂载即拉取日期列表并选中最新一天。
 */
import * as React from "react";
import { h } from "../i18n.js";
import { looksLikeMarkdown, renderMarkdown } from "../md.js";
import type { RpcCall } from "../types.js";
import { confirmDlg, errText, formatTime, val } from "../ui.js";
import { localizeText } from "../i18n.js";

export function ArchiveDialog(props: {
  rpcCall: RpcCall;
  /** 当前详情机器人（归档记录按机器人过滤）。 */
  detailAppId: string;
  onClose: () => void;
}) {
  const { rpcCall, detailAppId, onClose } = props;

  const [archiveModal, setArchiveModal] = React.useState<{
    loading: boolean;
    error: string;
    records: Array<Record<string, any>>;
    moreAvailable: boolean;
    daysRead: number;
    /** 归档日期文件列表（日期倒序，含该机器人记录条数）。 */
    days: Array<{ day: string; count: number }>;
    /** 当前选中的日期（右栏内容来源）。 */
    activeDay: string;
  }>({
    loading: true,
    error: "",
    records: [],
    moreAvailable: false,
    daysRead: 0,
    days: [],
    activeDay: "",
  });

  /** 读取指定日期的记录（双栏右栏）。 */
  const loadArchiveRecords = async (day: string) => {
    if (!day) {
      setArchiveModal((prev) => (prev ? { ...prev, loading: false, activeDay: "", records: [], moreAvailable: false, daysRead: 0 } : prev));
      return;
    }
    setArchiveModal((prev) => (prev ? { ...prev, loading: true, activeDay: day, error: "" } : prev));
    // 120 条上限：再多前端渲染 Markdown 气泡会明显卡顿；更早记录在归档文件里按天翻看。
    const res = await rpcCall("archive.list", { day, ...(detailAppId ? { appId: detailAppId } : {}), limit: 120 });
    if (res.ok) {
      const v = val(res) ?? {};
      setArchiveModal((prev) => (prev
        ? {
            ...prev,
            loading: false,
            error: "",
            records: Array.isArray(v.records) ? v.records : [],
            moreAvailable: Boolean(v.moreAvailable),
            daysRead: Number(v.daysRead ?? 0),
          }
        : prev));
    } else {
      setArchiveModal((prev) => (prev ? { ...prev, loading: false, error: errText(res.error) } : prev));
    }
  };

  /** 拉取日期文件列表并选中（优先 prefer，否则最新一天）。 */
  const loadArchiveDays = async (prefer = "") => {
    setArchiveModal((prev) => (prev ? { ...prev, loading: true, error: "" } : prev));
    const res = await rpcCall("archive.days", detailAppId ? { appId: detailAppId } : {});
    if (!res.ok) {
      setArchiveModal((prev) => (prev ? { ...prev, loading: false, error: errText(res.error) } : prev));
      return;
    }
    const v = val(res) ?? {};
    const days = Array.isArray(v.days)
      ? (v.days as Array<Record<string, any>>).map((d) => ({ day: String(d.day ?? ""), count: Number(d.count ?? 0) }))
      : [];
    const next = days.some((d) => d.day === prefer) ? prefer : (days[0]?.day ?? "");
    setArchiveModal((prev) => (prev ? { ...prev, days } : prev));
    await loadArchiveRecords(next);
  };

  /** 删除某天归档：仅清除当前机器人该天的记录（其他机器人的记录保留）。 */
  const removeArchiveDayFile = async (day: string) => {
    if (!(await confirmDlg({ message: localizeText(`确定删除 ${day} 的归档记录？此机器人该天的记录将被清除，其他机器人的记录保留。`), danger: true }))) return;
    const res = await rpcCall("archive.removeDay", { day, ...(detailAppId ? { appId: detailAppId } : {}) });
    if (!res.ok) {
      setArchiveModal((prev) => (prev ? { ...prev, error: errText(res.error) } : prev));
      return;
    }
    const v = val(res) ?? {};
    const days = Array.isArray(v.days)
      ? (v.days as Array<Record<string, any>>).map((d) => ({ day: String(d.day ?? ""), count: Number(d.count ?? 0) }))
      : [];
    const next = days.some((d) => d.day === day) ? day : (days[0]?.day ?? "");
    setArchiveModal((prev) => (prev ? { ...prev, days } : prev));
    await loadArchiveRecords(next);
  };

  // 挂载即拉取（初始化 + 首次加载）。
  React.useEffect(() => {
    void loadArchiveDays("");
  }, []);

    return h("div", { className: "qbot-modalOverlay" },
          h("div", { className: "qbot-modal qbot-modalWide", role: "dialog", "aria-modal": "true", "aria-label": "消息归档" },
            h("div", { className: "qbot-modalHead" },
              h("div", null,
                h("strong", null, "消息归档"),
                h("p", null, "本地落盘的收发记录（按当前机器人过滤）：左栏选日期查看内容，× 删除该天归档")),
              h("button", { className: "qbot-modalClose", type: "button", "aria-label": "关闭", onClick: onClose }, "×")),
            // 报错固定条：常驻弹窗头部下方（读取/删除失败时不随内容滚动）。
            archiveModal.error
              ? h("div", { className: "qbot-modalAlert", role: "alert" }, archiveModal.error)
              : null,
            h("div", { className: `qbot-archSplit${archiveModal.loading && archiveModal.records.length > 0 ? " is-refreshing" : ""}` },
              // 左栏：归档日期文件（点击切换内容，× 删除该天归档）
              h("div", { className: "qbot-archSide", "aria-label": "归档日期文件" },
                archiveModal.days.length === 0 && !archiveModal.loading
                  ? h("div", { className: "qbot-archSideEmpty" }, "暂无归档文件")
                  : archiveModal.days.map((d) => {
                      const active = d.day === archiveModal.activeDay;
                      return h("div", { key: d.day, className: `qbot-archMonth${active ? " is-active" : ""}` },
                        h("button", {
                          type: "button", className: "qbot-archMonthBtn",
                          onClick: () => void loadArchiveRecords(d.day),
                          title: `${d.count} 条记录`,
                        },
                          h("span", { className: "qbot-archMonthName" }, d.day),
                          h("span", { className: "qbot-archMonthCount" }, `${d.count}`)),
                        h("button", {
                          type: "button", className: "qbot-archMonthDel",
                          "aria-label": `删除 ${d.day} 归档`, title: "删除该天归档（仅此机器人的记录）",
                          onClick: () => void removeArchiveDayFile(d.day),
                        }, "×"));
                    })),
              // 右栏：选中日期的记录内容
              h("div", { className: "qbot-archMain" },
                archiveModal.loading && archiveModal.records.length === 0
                  ? h("div", { className: "qbot-modalState" }, h("span", { className: "qbot-spinner", "aria-hidden": "true" }), "正在读取归档…")
                  : archiveModal.records.length === 0
                      ? h("div", { className: "qbot-modalState" }, "该天没有记录。开启「消息本地归档」并收到消息后，这里会出现记录。")
                      : h("div", { className: "qbot-timeline" },
                          archiveModal.records.map((r: any, i: number) => {
                            const key = `${r.ts ?? ""}-${i}`;
                            // 会话事件：不进气泡，作居中系统节点；note（如引用降级原因）一并显示。
                            if (r.kind === "session") {
                              return h("div", { key, className: "qbot-tlSystem" },
                                `会话 ${formatTime(r.ts)}${r.content ? ` · ${String(r.content)}` : ""}${r.note ? ` · ${String(r.note)}` : ""}`);
                            }
                            const isUser = r.kind === "inbound";
                            const content = String(r.content ?? "");
                            // 机器人回复/主动消息一律按 Markdown 可视化；用户消息含 Markdown 特征时同样渲染。
                            const useMd = !isUser || looksLikeMarkdown(content);
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
                                useMd
                                  ? h("div", {
                                      className: "qbot-tlBubble qbot-md",
                                      // renderMarkdown 内部先整体 HTML 转义再叠加受控标签，URL 仅放行 http/https。
                                      dangerouslySetInnerHTML: { __html: renderMarkdown(content) },
                                    })
                                  : h("div", { className: "qbot-tlBubble" }, content),
                                r.note ? h("div", { className: "qbot-tlNote" }, String(r.note)) : null));
                          })))),
            h("div", { className: "qbot-modalFoot" },
              h("span", { className: "qbot-hint" },
                archiveModal.moreAvailable
                  ? `已显示最近 ${archiveModal.records.length} 条（更早记录仍在归档文件里）`
                  : `共 ${archiveModal.records.length} 条记录`),
              h("div", { className: "qbot-viewActions" },
                h("button", { className: "qbot-btn", type: "button", disabled: archiveModal.loading, onClick: () => void loadArchiveDays(archiveModal.activeDay) }, "刷新"),
                h("button", { className: "qbot-btn qbot-btnPrimary", type: "button", onClick: onClose }, "关闭")))));
}
