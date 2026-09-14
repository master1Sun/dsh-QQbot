/**
 * 消息归档弹窗（archive.days / archive.list / archive.removeDay）。
 * 左栏日期文件 / 右栏记录内容（Markdown 气泡渲染）。状态自包含：
 * 挂载即拉取日期列表并选中最新一天。
 */
import * as React from "react";
import type { RpcCall } from "../types.js";
export declare function ArchiveDialog(props: {
    rpcCall: RpcCall;
    /** 当前详情机器人（归档记录按机器人过滤）。 */
    detailAppId: string;
    onClose: () => void;
}): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
