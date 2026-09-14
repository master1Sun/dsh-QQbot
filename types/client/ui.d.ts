/**
 * 基础 UI 原语与工具：状态标签 / 输入控件 / 设置行 / 弹窗表单行 /
 * 错误规整 / RPC 取值 / 时间与倒计时格式化 / Preset 下拉选项 / 全局自定义确认框。
 */
import * as React from "react";
import type { Option, Reply, Tone } from "./types.js";
/** 在线状态胶囊 */
export declare function OnlineBadge(props: {
    tone: Tone;
    text: string;
}): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
/** 状态标签：圆点 + 文案（dim-stateLabel）。 */
export declare function StateLabel(props: {
    tone: Tone;
    text: string;
}): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
export declare function Field(props: {
    label: string;
}, children: any): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
export declare function TextInput(props: any): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
/** 多行文本输入：长文案 / 列表类设置项使用，避免单行 input 截断长文本。 */
export declare function TextArea(props: any): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
/**
 * 设置行：标题 + 说明 + 控件 三段式。
 * 说明（desc）必须回答「这项配置影响什么、什么时候生效」，不让用户靠猜。
 * wide=true 时控件通栏独占一行（置于标题/说明下方），供 textarea 等宽控件使用。
 */
export declare function SettingRow(props: {
    label: string;
    desc: string;
    control: any;
    rowKey?: string;
    wide?: boolean;
}): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
/**
 * 提示条自动消失倒计时：返回「剩余秒数」，到 0 时调用 onExpire。
 * 依赖 key 变化（提示内容更新）会重新开始计时——同一条文案重复设置时不会重置，
 * 需要重置可在调用方把带计数的文本作为 key 传入。
 */
export declare function useCountdown(activeKey: unknown, seconds: number, onExpire: () => void): number;
/** 提示条右侧的倒计时胶囊（纯数字 + s，无需翻译）。 */
export declare function countdownBadge(left: number): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
/**
 * RPC 层在通道未响应时会返回结构化错误 { code, message, details } 而非字符串。
 * 统一转成可安全渲染的字符串，避免把对象当 React 子节点（React #31）。
 */
export declare function errText(err: unknown): string;
export declare const val: (res: Reply) => any;
export declare function formatTime(raw: unknown): string;
/** 倒计时 mm:ss（对齐 dsh-im formatRemaining）。 */
export declare function formatRemaining(ms: number): string;
export declare const presetOptions: (list: Array<{
    id: string;
    label: string;
}>) => Option[];
/** 弹窗编辑表单行：标签 + 控件 + 提示（提示写清「怎么填、影响什么」）。 */
export declare function editRow(label: string, hint: string, control: any): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
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
/** 任意组件内可调用的 Promise 化确认框；ConfirmHost 未挂载时回退原生 confirm。 */
export declare function confirmDlg(opts: ConfirmOptions): Promise<boolean>;
/** 全局确认框挂载点：根组件渲染一次（overlay 置顶，盖过所有弹窗）。Esc = 取消。 */
export declare function ConfirmHost(): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> | null;
