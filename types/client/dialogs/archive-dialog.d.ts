/**
 * 消息归档弹窗（archive.chats / archive.chat / archive.removeChat）。
 * 左栏：归档中出现过的会话（个人单聊 + 群聊）按「会话 → 月份」两级折叠分组；
 *       月节点显示图标 + 群名 + 月份日期 + 条数。
 * 右栏：选中「会话 + 月份」的消息记录，按时间倒序（最新在上）、按月分组分隔，
 *       卡片含头像 + 昵称 + 时间 + 正文 + 引用块（被动回复引用同会话最近一条用户消息）。
 * 右栏默认最多显示 300 条，超出可「加载更多」或「显示全部」。状态自包含。
 */
import * as React from "react";
import type { RpcCall } from "../types.js";
export declare function ArchiveDialog(props: {
    rpcCall: RpcCall;
    /** 当前详情机器人（归档记录按机器人过滤）。 */
    detailAppId: string;
    onClose: () => void;
}): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
