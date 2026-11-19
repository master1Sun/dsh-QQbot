/**
 * AI 操作执行记录（群聊管理 / 频道管理共用）。
 *
 * 触发入口不在本面板：用户在 agent 聊天里直接说人话，宿主工具 qqbot_manage
 * 会执行并把聊天原话 / 识别来源 / 动作 / 结果留痕；这里只做只读展示。
 */
import * as React from "react";
import { fmt, h, t, useLocale } from "../i18n/index.js";
import type { RpcCall } from "../types.js";
import { formatTime, val } from "../ui.js";

export interface AiEntityLite { id: string; name: string; kind: "member" | "channel" | "role"; }

interface AiLogEntry {
  id: number;
  at: string;
  appId: string;
  scope: "group" | "guild";
  groupOpenid?: string;
  guildId?: string;
  channelId?: string;
  text: string;
  action?: string;
  actionLabel?: string;
  ok: boolean;
  source?: string;
  reply: string;
  error?: string;
  usedLlm: boolean;
}

interface Usage { local: number; cache: number; llm: number; savedTokens: number; }

/** 复用的只读记录面板。context 变化时（换群 / 换频道）由调用方传 key 重挂。 */
export function AiOpsLogPanel(props: {
  rpcCall: RpcCall;
  appId: string;
  scope: "group" | "guild";
  groupOpenid?: string;
  guildId?: string;
  channelId?: string;
  /** 兼容旧调用点；记录由宿主直接生成，不再需要客户端传实体表。 */
  entities?: AiEntityLite[];
}) {
  const { rpcCall, appId, scope, groupOpenid, guildId } = props;
  useLocale();
  const [logs, setLogs] = React.useState<AiLogEntry[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [usage, setUsage] = React.useState<Usage>({ local: 0, cache: 0, llm: 0, savedTokens: 0 });

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const [logRes, statRes] = await Promise.all([
        rpcCall("ai.logs", { appId, scope, groupOpenid, guildId, limit: 30 }),
        rpcCall("ai.stats", { scope }),
      ]);
      if (logRes.ok) {
        const rows = val(logRes)?.logs;
        setLogs(Array.isArray(rows) ? (rows as AiLogEntry[]).slice(0, 30) : []);
      }
      if (statRes.ok) {
        const s = val(statRes)?.stats ?? {};
        setUsage({
          local: Number(s.local) || 0, cache: Number(s.cache) || 0,
          llm: Number(s.llm) || 0, savedTokens: Number(s.savedTokens) || 0,
        });
      }
    } catch { /* 记录查询失败保持空列表，不影响弹窗其它 Tab */ }
    finally { setLoading(false); }
  }, [rpcCall, appId, scope, groupOpenid, guildId]);

  React.useEffect(() => {
    let alive = true;
    void load();
    const timer = setInterval(() => { if (alive) void load(); }, 15_000);
    return () => { alive = false; clearInterval(timer); };
  }, [load]);

  const sourceLabel = (s?: string) =>
    s === "local" ? t("ai.srcLocal") : s === "llm" ? t("ai.srcLlm") :
    s === "cache" ? t("ai.srcCache") : s === "none" ? t("ai.srcNone") : "";

  const targetOf = (row: AiLogEntry) => {
    if (row.scope === "group") return row.groupOpenid;
    return row.channelId || row.guildId;
  };

  return h("div", { className: "qbot-aiPanel" },
    h("div", { className: "qbot-aiHead" },
      h("div", null,
        h("strong", null, t(scope === "guild" ? "ai.titleGuild" : "ai.titleGroup")),
        h("p", { className: "qbot-aiSub" }, t(scope === "guild" ? "ai.subtitleGuild" : "ai.subtitleGroup"))),
      h("button", {
        className: "qbot-btn", type: "button", disabled: loading,
        onClick: () => void load(),
      }, loading ? t("common.refreshing") : t("ai.refresh"))),

    h("p", { className: "qbot-aiDisclaimer" }, t(scope === "guild" ? "ai.disclaimerGuild" : "ai.disclaimerGroup")),

    h("div", { className: "qbot-aiBody" },
      h("div", { className: "qbot-aiTimeline" },
        logs.length === 0
          ? h("div", { className: "qbot-aiTlRow is-empty" },
              h("div", { className: "qbot-aiTlTime" }, "—"),
              h("div", { className: "qbot-aiTlNode" }),
              h("div", { className: "qbot-aiTlContent" },
                h("div", { className: "qbot-aiEmpty" }, t("ai.logEmpty"))))
          : logs.map((row) => {
              const target = targetOf(row);
              return h("div", {
                key: row.id,
                className: `qbot-aiTlRow is-${row.ok ? "ok" : "fail"}`,
              },
                h("div", { className: "qbot-aiTlTime" }, formatTime(row.at)),
                h("div", { className: "qbot-aiTlNode" }),
                h("div", { className: "qbot-aiTlContent" },
                  h("div", {
                    className: `qbot-aiLog is-${row.ok ? "ok" : "fail"}`,
                  },
                    h("div", { className: "qbot-aiLogHead" },
                      row.source ? h("span", { className: `qbot-aiSrc is-${row.source}` }, sourceLabel(row.source)) : null,
                      h("span", { className: "qbot-aiLogState" }, row.ok ? t("ai.logOk") : t("ai.logFail"))),
                    h("div", { className: "qbot-aiLogAction" }, row.actionLabel || row.action || "—"),
                    h("div", { className: "qbot-aiLogText" }, row.text),
                    h("div", { className: "qbot-aiBubble" }, row.reply || row.error || ""),
                    target ? h("div", { className: "qbot-aiLogTarget" }, fmt("ai.logTarget", target)) : null)));
            }))),

    h("div", { className: "qbot-aiUsage" },
      h("span", null, t("ai.usage")),
      h("span", null, fmt("ai.usageStat", usage.local, usage.cache, usage.llm, usage.savedTokens))));
}

/** 兼容旧 import 名。 */
export const AiChatPanel = AiOpsLogPanel;
