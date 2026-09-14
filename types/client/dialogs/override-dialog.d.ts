/**
 * 按群配置（群级覆盖）编辑弹窗：每个字段空 = 跟随机器人默认。
 * 草稿状态自包含（每次打开重新挂载、按 overrides 初始化）；保存时组装
 * 整份 groupOverrides 并回调 onSave(next, openid)，由父组件落盘并提示。
 */
import * as React from "react";
import type { RpcCall } from "../types.js";
/** 保存结果：ok=false 时弹窗保持打开并把 error 内联显示（顶部提示条在长页面滚动后可能不可见）。 */
export interface OverrideSaveResult {
    ok: boolean;
    error?: string;
}
export declare function OverrideDialog(props: {
    /** 机器人级 groupOverrides（保存时基于它组装整份新值）。 */
    overrides: Record<string, Record<string, unknown>>;
    /** 编辑中的群 openid；空串=新增覆盖。 */
    editOpenid: string;
    /** RPC（拉取归档会话聚合做 openid 下拉候选）。 */
    rpcCall: RpcCall;
    /** 当前详情机器人（归档候选按机器人过滤）。 */
    appId: string;
    onClose: () => void;
    /** 保存：next 为整份 groupOverrides（空覆盖=删除该群键）；返回结果供弹窗决定是否关闭。 */
    onSave: (next: Record<string, Record<string, unknown>>, openid: string) => Promise<OverrideSaveResult> | OverrideSaveResult;
}): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
