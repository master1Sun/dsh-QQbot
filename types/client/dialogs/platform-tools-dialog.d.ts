/**
 * 平台能力弹窗：详情页「管理」Tab 的入口卡点击后打开，承载 PlatformTools
 * （群聊管理 / 通用能力两大类，含选群、AI 审核、入群审批等子标签）。
 *
 * 操作结果（报错 / 成功）在弹窗头部下方吸顶显示 5 秒，不再需要回到详情页顶部看提示；
 * 群选择器等内部 fixed 弹层通过 z-index 提升到弹窗之上（但仍在全局确认框之下）。
 */
import * as React from "react";
import type { RpcCall } from "../types.js";
export declare function PlatformToolsDialog(props: {
    rpcCall: RpcCall;
    appId: string;
    groups: string[];
    onClose: () => void;
}): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
