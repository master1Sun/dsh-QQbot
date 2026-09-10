/**
 * 基础 UI 原语与工具：状态标签 / 输入控件 / 设置行 / 弹窗表单行 /
 * 错误规整 / RPC 取值 / 时间与倒计时格式化 / Preset 下拉选项 / 全局自定义确认框。
 */
import * as React from "react";
import { SHANGHAI_TZ } from "../shared/time.js";
import { h, t } from "./i18n/index.js";
import type { Option, Reply, Tone } from "./types.js";

/** 在线状态胶囊 */
export function OnlineBadge(props: { tone: Tone; text: string }) {
  return h("span", { className: "qbot-onlineBadge" },
    h("span", { className: "qbot-stateDot", "data-tone": props.tone }),
    props.text);
}

/** 状态标签：圆点 + 文案（dim-stateLabel）。 */
export function StateLabel(props: { tone: Tone; text: string }) {
  return h("span", { className: "qbot-stateLabel" },
    h("span", { className: "qbot-stateDot", "data-tone": props.tone }),
    props.text);
}

export function Field(props: { label: string }, children: any) {
  return h("label", { className: "qbot-field" },
    h("span", { className: "qbot-fieldLabel" }, props.label),
    children);
}

export function TextInput(props: any) {
  return h("input", { className: "qbot-input", ...props });
}

/** 多行文本输入：长文案 / 列表类设置项使用，避免单行 input 截断长文本。 */
export function TextArea(props: any) {
  return h("textarea", { className: "qbot-textarea", ...props });
}

/**
 * 设置行：标题 + 说明 + 控件 三段式。
 * 说明（desc）必须回答「这项配置影响什么、什么时候生效」，不让用户靠猜。
 * wide=true 时控件通栏独占一行（置于标题/说明下方），供 textarea 等宽控件使用。
 */
export function SettingRow(props: { label: string; desc: string; control: any; rowKey?: string; wide?: boolean }) {
  return h("div", { className: `qbot-settingRow${props.wide ? " is-wide" : ""}`, key: props.rowKey },
    h("div", { className: "qbot-settingCopy" },
      h("span", { className: "qbot-settingTitle" }, props.label),
      h("span", { className: "qbot-settingDesc" }, props.desc)),
    h("div", { className: `qbot-settingControl${props.wide ? " is-wide" : ""}` }, props.control));
}

/**
 * 提示条自动消失倒计时：返回「剩余秒数」，到 0 时调用 onExpire。
 * 依赖 key 变化（提示内容更新）会重新开始计时——同一条文案重复设置时不会重置，
 * 需要重置可在调用方把带计数的文本作为 key 传入。
 */
export function useCountdown(activeKey: unknown, seconds: number, onExpire: () => void): number {
  const [left, setLeft] = React.useState(0);
  React.useEffect(() => {
    if (!activeKey) { setLeft(0); return; }
    let remain = seconds;
    setLeft(remain);
    const id = setInterval(() => {
      remain -= 1;
      if (remain <= 0) { clearInterval(id); setLeft(0); onExpire(); return; }
      setLeft(remain);
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey, seconds]);
  return left;
}

/** 提示条右侧的倒计时胶囊（纯数字 + s，无需翻译）。 */
export function countdownBadge(left: number) {
  return h("span", { className: "qbot-noticeCount", key: "countdown" }, `${left}s`);
}

/**
 * RPC 层在通道未响应时会返回结构化错误 { code, message, details } 而非字符串。
 * 统一转成可安全渲染的字符串，避免把对象当 React 子节点（React #31）。
 */
export function errText(err: unknown): string {
  if (err == null) return t("common.unknownError");
  if (typeof err === "string") return err;
  if (typeof err === "object") {
    const e = err as { message?: unknown; code?: unknown };
    if (typeof e.message === "string" && e.message) return e.message;
    if (typeof e.code === "string" && e.code) return e.code;
    try {
      const json = JSON.stringify(err);
      if (json && json !== "{}") return json;
    } catch { /* 不可序列化 */ }
  }
  return String(err);
}

export const val = (res: Reply): any => (res && typeof res === "object" ? res.value ?? res.data : undefined);

export function formatTime(raw: unknown): string {
  let ts: number;
  if (typeof raw === "number") ts = raw;
  else if (typeof raw === "string" && raw) ts = Date.parse(raw);
  else return "—";
  if (Number.isNaN(ts)) return typeof raw === "string" ? raw : "—";
  // 始终以上海时间（Asia/Shanghai）呈现，与查看者本地时区无关；
  // 日期文案语言跟随浏览器语言（配合界面 i18n）。
  return new Date(ts).toLocaleString(undefined, { timeZone: SHANGHAI_TZ });
}

/** 倒计时 mm:ss（对齐 dsh-im formatRemaining）。 */
export function formatRemaining(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export const presetOptions = (list: Array<{ id: string; label: string }>): Option[] => [
    { value: "", label: t("session.followHostDefault") },
    ...list
      .filter((p) => p && typeof p.id === "string" && p.id)
      .map((p) => ({ value: p.id, label: typeof p.label === "string" && p.label ? p.label : p.id })),
  ];

/** 弹窗编辑表单行：标签 + 控件 + 提示（提示写清「怎么填、影响什么」）。 */
export function editRow(label: string, hint: string, control: any) {
  return h("div", { className: "qbot-editRow" },
    h("span", { className: "qbot-editLabel" }, label),
    control,
    h("span", { className: "qbot-editHint" }, hint));
}

// ── 全局自定义确认框（替代原生 window.confirm） ─────────────────────────────

export interface ConfirmOptions {
  /** 说明文字（动态串由调用方先用 localizeText 处理）。 */
  message: string;
  /** 确认按钮文案（danger 默认「确认删除」，否则「确定」）。 */
  confirmLabel?: string;
  /** 取消按钮文案（默认「取消」）。 */
  cancelLabel?: string;
  /** 危险操作：确认按钮红色。 */
  danger?: boolean;
}

type PendingConfirm = ConfirmOptions & { resolve: (ok: boolean) => void };
let confirmDispatcher: ((opts: PendingConfirm) => void) | null = null;

/** 任意组件内可调用的 Promise 化确认框；ConfirmHost 未挂载时回退原生 confirm。 */
export function confirmDlg(opts: ConfirmOptions): Promise<boolean> {
  if (typeof confirmDispatcher !== "function") {
    return Promise.resolve(window.confirm(opts.message));
  }
  return new Promise((resolve) => confirmDispatcher!({ ...opts, resolve }));
}

/** 全局确认框挂载点：根组件渲染一次（overlay 置顶，盖过所有弹窗）。Esc = 取消。 */
export function ConfirmHost() {
  const [pending, setPending] = React.useState<PendingConfirm | null>(null);
  React.useEffect(() => {
    confirmDispatcher = (opts) => setPending(opts);
    return () => {
      confirmDispatcher = null;
    };
  }, []);
  React.useEffect(() => {
    if (!pending) return;
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key !== "Escape") return;
      ev.stopPropagation();
      setPending((cur) => {
        cur?.resolve(false);
        return null;
      });
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [pending !== null]);
  if (!pending) return null;
  const done = (ok: boolean) => {
    setPending(null);
    pending.resolve(ok);
  };
  return h("div", { className: "qbot-confirmOverlay", role: "alertdialog", "aria-modal": "true", "aria-label": t("common.confirmTitle") },
    h("div", { className: "qbot-confirmBox" },
      h("div", { className: "qbot-confirmMsg" }, pending.message),
      h("div", { className: "qbot-confirmFoot" },
        h("button", { type: "button", className: "qbot-btn", onClick: () => done(false) },
          pending.cancelLabel ?? t("common.cancel")),
        h("button", {
          type: "button",
          autoFocus: true,
          className: `qbot-btn ${pending.danger ? "qbot-btnDanger" : "qbot-btnPrimary"}`,
          onClick: () => done(true),
        }, pending.confirmLabel ?? t(pending.danger ? "common.confirmDelete" : "common.ok")))));
}
