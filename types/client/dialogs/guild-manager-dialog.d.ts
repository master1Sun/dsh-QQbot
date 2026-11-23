/**
 * QQ 频道管理弹窗：与「平台能力」弹窗同一外壳（遮罩 / 头部 / 吸顶提示 / 底部关闭），
 * 内部改为**竖向 Tab**（左侧导航 + 右侧内容），把官方频道 OpenAPI 能力按功能分组：
 *   频道列表 → 频道详情 → 子频道 → 频道成员 → 身份组 → 发消息 → 事件说明
 *
 * 接口对应：GET /users/@me/guilds、GET /guilds/{id}、GET|POST|PATCH|DELETE /channels/{id}、
 * GET /guilds/{id}/members、GET /guilds/{id}/members/{user}、GET|POST|PATCH|DELETE /guilds/{id}/roles、
 * PUT|DELETE /guilds/{id}/members/{user}/roles/{role}、POST /channels/{id}/messages。
 * 功能需要新宿主 RPC（guild.*），宿主旧版本会返回 unknown endpoint — 提示里给出重启指引。
 */
import * as React from "react";
import type { RpcCall } from "../types.js";
export type GuildTab = "guilds" | "info" | "channels" | "members" | "roles" | "message" | "speak" | "content" | "ai" | "apiPerm" | "events" | "assistant";
/** 由外层控制台单棵导航树驱动的焦点：指定要显示的二级 Tab 及其三级子 Tab。 */
export interface GuildFocus {
    tab: GuildTab;
    speakTab?: "all" | "member" | "frequency" | "keyword";
    kwTab?: "config" | "logs";
    contentTab?: "recall" | "announce" | "pin" | "schedule" | "audio" | "forum";
    aiTab?: "config" | "logs" | "reply" | "replyLogs";
}
export declare function GuildManager(props: {
    rpcCall: RpcCall;
    appId: string;
    onNotify: (text: string, tone: "error" | "success") => void;
    /** 首次进入时定位的二级 Tab（独立弹窗默认「频道列表」）。 */
    initialTab?: GuildTab;
    /** 由外层控制台单棵导航树驱动的焦点；传入后隐藏本组件自带导航。 */
    focus?: GuildFocus;
    /** 嵌入控制台内容区：隐藏一级 Tab 导航，仅渲染焦点对应内容。 */
    embedded?: boolean;
}): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
/** 频道管理弹窗外壳：与平台能力弹窗样式统一。 */
export declare function GuildManagerDialog(props: {
    rpcCall: RpcCall;
    appId: string;
    onClose: () => void;
    /** 嵌入控制台时指定初始二级 Tab；独立弹窗默认「频道列表」。 */
    initialTab?: GuildTab;
}): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
