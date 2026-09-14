/**
 * 右侧面板与 host 通信的桥。
 *
 * 客户端模块 apply 时拿到的 `rpcCall`（封装 connection.rpc.call）是闭包，
 * React 组件层只能拿到的框架 props，拿不到 ctx。因此用模块级引用把 rpcCall 暴露给面板组件，
 * 与 dsh-hello-panel 的 setOpenTab 桥同一思路。
 */
import type { RpcCall } from "../types.js";
/** apply 时登记 rpc 调用能力。 */
export declare function setRpcCall(fn: RpcCall | null): void;
/** 取 rpc 调用能力；宿主未就绪时返回 null。 */
export declare function getRpcCall(): RpcCall | null;
/** 订阅机器人列表变化（返回取消订阅函数）。 */
export declare function onBotsChanged(fn: () => void): () => void;
/** 广播「机器人列表 / 连接状态可能已变化」。 */
export declare function notifyBotsChanged(): void;
/** 右侧面板是否允许显示（默认开）。 */
export declare function getPanelVisible(): boolean;
/** 写入显隐开关并广播重判。 */
export declare function setPanelVisible(v: boolean): void;
