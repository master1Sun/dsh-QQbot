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

/* ── 机器人状态变化通知 ─────────────────────────────────────────────────────
 * 设置页每次增删 / 启停 / 重连机器人后都会调用 refresh()；refresh 拉到最新
 * bots.list 后在这里广播一次，右侧面板 tab 的显隐同步即可**立即**生效，
 * 不必等轮询周期。宿主没有事件总线，这是一条轻量的进程内发布/订阅。 */

const botsListeners = new Set<() => void>();

/** 订阅机器人列表变化（返回取消订阅函数）。 */
export function onBotsChanged(fn: () => void): () => void {
  botsListeners.add(fn);
  return () => botsListeners.delete(fn);
}

/** 广播「机器人列表 / 连接状态可能已变化」。 */
export function notifyBotsChanged(): void {
  for (const fn of botsListeners) {
    try { fn(); } catch { /* 单个监听者异常不影响其余 */ }
  }
}
