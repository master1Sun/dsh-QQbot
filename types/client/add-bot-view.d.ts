/**
 * 添加机器人视图：分段 Tab（扫码登录 | 手动填写）。
 *
 * 状态自包含：二维码快照与轮询、手动凭据表单、倒计时心跳。
 * 扫码确认 / 凭据保存成功后回调 onBotReady(appId)，由父组件刷新数据
 * 并跳转机器人详情页（本组件随之卸载，状态自动复位）。
 */
import * as React from "react";
import type { RpcCall } from "./types.js";
export declare function AddBotView(props: {
    rpcCall: RpcCall;
    /** 顶部提示条（notice 由父组件持有，跨视图延续显示）。 */
    notice: string;
    setNotice: (text: string) => void;
    /** 接入成功（扫码确认或手动保存）：父组件刷新并跳转详情。 */
    onBotReady: (appId: string) => Promise<void> | void;
    /** 返回列表。 */
    onBack: () => void;
}): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
