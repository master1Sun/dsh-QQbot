/**
 * 平台能力弹窗：详情页「管理」Tab 的入口卡点击后打开，承载 PlatformTools
 * （群聊管理 / 通用能力两大类，含选群、AI 审核、入群审批等子标签）。
 *
 * 操作结果（报错 / 成功）在弹窗头部下方吸顶显示 5 秒，不再需要回到详情页顶部看提示；
 * 群选择器等内部 fixed 弹层通过 z-index 提升到弹窗之上（但仍在全局确认框之下）。
 */
import * as React from "react";
import { h, t, useLocale } from "../i18n/index.js";
import type { RpcCall } from "../types.js";
import { PlatformTools } from "./platform-tools.js";

export function PlatformToolsDialog(props: {
  rpcCall: RpcCall;
  appId: string;
  groups: string[];
  onClose: () => void;
}) {
  const { rpcCall, appId, groups, onClose } = props;
  useLocale(); // 跟随宿主语言切换
  const [notice, setNotice] = React.useState<{ text: string; tone: "error" | "success" } | null>(null);

  React.useEffect(() => {
    if (!notice) return;
    const id = window.setTimeout(() => setNotice(null), 5000);
    return () => window.clearTimeout(id);
  }, [notice]);

  return h("div", {
    className: "qbot-modalOverlay",
    onMouseDown: (e: any) => { if (e.target === e.currentTarget) onClose(); },
  },
    h("div", {
      className: "qbot-modal qbot-modalWide qbot-ptModal",
      role: "dialog", "aria-modal": "true", "aria-label": t("pt.tabTitle"),
    },
      h("div", { className: "qbot-modalHead" },
        h("div", null,
          h("strong", null, t("pt.tabTitle")),
          h("p", null, t("pt.tabHint"))),
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

      h("div", { className: "qbot-ptDialogBody" },
        h(PlatformTools, {
          key: appId || "default",
          rpcCall,
          appId,
          groups,
          onNotify: (text: string, tone: "error" | "success") => setNotice({ text, tone }),
        })),

      h("div", { className: "qbot-modalFoot qbot-ptDialogFoot" },
        h("span", { className: "qbot-hint" }, t("pt.tabSummary")),
        h("button", {
          className: "qbot-btn qbot-btnPrimary", type: "button", onClick: onClose,
        }, t("common.close")))));
}
