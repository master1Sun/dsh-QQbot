/**
 * 定时消息管理弹窗（设置页入口）——**弹窗外壳**。
 *
 * 业务逻辑（列表 / 编辑双视图、四种定时条件、三种执行方式、增删改查与测试）
 * 全部由无外壳管理器 `ScheduleManager` 提供，本文件只负责：
 *   ① 遮罩 + 对话框容器 + 标题栏；
 *   ② 把 rpcCall / detailAppId / onClose 透传给管理器。
 *
 * 这样右侧面板（ScheduleTab）与设置页弹窗共用**同一份**实现，
 * 布局、深浅色、国际化、校验规则不会再出现两边不一致的问题。
 */
import { h, t, useLocale } from "../i18n/index.js";
import type { RpcCall } from "../types.js";
import { ScheduleManager } from "../schedule-manager.js";

export function ScheduleDialog(props: {
  rpcCall: RpcCall;
  /** 当前详情机器人：任务归属与新任务默认归属。 */
  detailAppId: string;
  onClose: () => void;
}) {
  const { rpcCall, detailAppId, onClose } = props;
  // 订阅语言切换，保证弹窗标题/提示与内部管理器同步刷新。
  useLocale();

  return h(
    "div",
    { className: "qbot-modalOverlay" },
    h(
      "div",
      { className: "qbot-modal qbot-modalWide", role: "dialog", "aria-modal": "true", "aria-label": t("sched.title") },
      h(
        "div",
        { className: "qbot-modalHead" },
        h("div", null, h("strong", null, t("sched.title")), h("p", null, t("sched.hint"))),
        h(
          "button",
          { className: "qbot-modalClose", type: "button", "aria-label": t("common.close"), onClick: onClose },
          "×",
        ),
      ),
      h(ScheduleManager, { rpcCall, detailAppId, onClose }),
    ),
  );
}
