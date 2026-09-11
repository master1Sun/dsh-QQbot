/**
 * 右侧面板「定时消息」tab 主体（注册于 `sidebar.right.pane.tab`，key = 包名）。
 *
 * 与设置页的定时弹窗共用同一个无外壳管理器组件 ScheduleManager，
 * 因此具备完整的增删改查 + 测试能力（而非只读概览）。
 *
 * 本 tab 仅负责「机器人作用域」选择（所有机器人 / 指定机器人），
 * 并把它转译为 ScheduleManager 的 forceScope：
 *   - 选「所有机器人」→ forceScope="all"，ScheduleManager 拉取所有机器人聚合列表；
 *   - 选某个机器人   → forceScope="current" + detailAppId=该机器人，
 *     列表只显示该机器人名下任务，且新增任务默认归属该机器人。
 *
 * 样式说明：全部复用全局注入的 qbot-* 类与 --dsw-alias-* 设计令牌
 * （installStyles 在 apply 时已注入 document.head），因此深浅色主题自动适配，
 * 不在此写死任何颜色。文案全部走 i18n 字段名，并由 useLocale() 订阅语言切换。
 */
import * as React from "react";
import type { CSSProperties } from "react";
import { h, t, useLocale } from "../i18n/index.js";
import { errText, val } from "../ui.js";
import { getRpcCall } from "./api.js";
import { ScheduleManager } from "../schedule-manager.js";

interface BotSummary {
  appId: string;
  appIdMasked?: string;
  primary?: boolean;
  enabled?: boolean;
}

const root: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  minHeight: 0,
  boxSizing: "border-box",
  color: "inherit",
};

const body: CSSProperties = {
  flex: "1 1 auto",
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
};

export function ScheduleTab(): React.ReactNode {
  // 订阅宿主语言切换：右侧面板不在设置页的重渲染链路内，需自行刷新文案。
  useLocale();

  const [bots, setBots] = React.useState<BotSummary[]>([]);
  /** "" = 所有机器人；否则具体 appId。 */
  const [scopeAppId, setScopeAppId] = React.useState<string>("");
  const [loadingBots, setLoadingBots] = React.useState(true);
  const [botError, setBotError] = React.useState("");

  const loadBots = React.useCallback(async () => {
    const call = getRpcCall();
    if (!call) return;
    setLoadingBots(true);
    setBotError("");
    try {
      const res = await call("bots.list");
      if (res.ok) {
        const v = (val(res) ?? {}) as { bots?: BotSummary[] };
        setBots(Array.isArray(v.bots) ? v.bots : []);
      } else {
        setBotError(errText(res.error));
      }
    } catch (e) {
      setBotError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoadingBots(false);
    }
  }, []);

  React.useEffect(() => {
    void loadBots();
  }, [loadBots]);

  const forceScope: "current" | "all" = scopeAppId ? "current" : "all";
  const detailAppId = scopeAppId || "";

  const rpc = getRpcCall();

  return h(
    "div",
    // .qbot-schedPanel 声明容器查询作用域：面板拖拽宽度时按实际宽度响应式降级/升级布局。
    { className: "qbot-schedPanel", style: root },
    h(
      "div",
      { className: "qbot-schedToolbar" },
      h(
        "label",
        { className: "qbot-fieldInline", htmlFor: "qbot-sched-scope" },
        h("span", { className: "qbot-fieldInlineLabel" }, t("panel.scope")),
        h(
          "select",
          {
            id: "qbot-sched-scope",
            className: "qbot-settingSelect",
            value: scopeAppId,
            disabled: loadingBots && bots.length === 0,
            onChange: (ev: any) => setScopeAppId(String(ev.target.value)),
            "aria-label": t("panel.scope"),
          },
          h("option", { value: "" }, t("sched.scopeAllBots")),
          bots.map((b) =>
            h("option", { key: b.appId, value: b.appId }, `${b.appIdMasked ?? b.appId}${b.primary ? " ★" : ""}`),
          ),
        ),
      ),
      h(
        "button",
        {
          className: "qbot-btn qbot-schedRefresh",
          type: "button",
          onClick: () => void loadBots(),
          disabled: loadingBots,
        },
        loadingBots ? t("panel.loading") : t("common.refresh"),
      ),
    ),
    botError
      ? h("div", { className: "qbot-schedPanelError" }, botError)
      : rpc
        ? h(
            "div",
            { style: body, key: scopeAppId || "all" },
            h(ScheduleManager, { rpcCall: rpc, detailAppId, forceScope }),
          )
        : h("div", { className: "qbot-modalState" }, t("panel.loading")),
  );
}
