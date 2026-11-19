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
/** 频道管理弹窗外壳：与平台能力弹窗样式统一。 */
export declare function GuildManagerDialog(props: {
    rpcCall: RpcCall;
    appId: string;
    onClose: () => void;
}): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
