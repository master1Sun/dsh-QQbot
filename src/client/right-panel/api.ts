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

/* ── 右侧面板显隐开关（客户端本地偏好，localStorage 持久化） ─────────────────
 * 设置页的开关写这里，apply() 的 syncPanelTab 读取；写入后复用广播通道
 * 让 tab 显隐立即重判。
 *
 * 语义：**默认关闭，显式开启才生效**。因此判定是「存的值 === "1"」而不是
 *「不等于 "0"」——没写过的用户看到的是关闭，写过的用户不受影响。
 * 该偏好同时也是入口显隐的**唯一**依据：一旦开启就常驻显示，不再随机器人
 * 连接状态反复出现/消失（QQ 掉线、插件重载都不会把它关回去）。 */

export const PANEL_VISIBLE_KEY = "dsh-qqbot.panel.visible";

/** 右侧面板入口是否显示（默认关闭）。 */
export function getPanelVisible(): boolean {
  try { return localStorage.getItem(PANEL_VISIBLE_KEY) === "1"; } catch { return false; }
}

/** 写入显隐开关并广播重判。 */
export function setPanelVisible(v: boolean): void {
  try { localStorage.setItem(PANEL_VISIBLE_KEY, v ? "1" : "0"); } catch { /* 存储不可用时仅本次会话生效 */ }
  notifyBotsChanged();
}
