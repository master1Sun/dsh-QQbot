/**
 * 右侧面板与 host 通信的桥。
 *
 * 客户端模块 apply 时拿到的 `rpcCall`（封装 connection.rpc.call）是闭包，
 * React 组件层只能拿到的框架 props，拿不到 ctx。因此用模块级引用把 rpcCall 暴露给面板组件，
 * 与 dsh-hello-panel 的 setOpenTab 桥同一思路。
 */

import type { RpcCall } from "../types.js";

let rpcCallRef: RpcCall | null = null;

/** apply 时登记 rpc 调用能力。 */
export function setRpcCall(fn: RpcCall | null): void {
  rpcCallRef = fn;
}

/** 取 rpc 调用能力；宿主未就绪时返回 null。 */
export function getRpcCall(): RpcCall | null {
  return rpcCallRef;
}
