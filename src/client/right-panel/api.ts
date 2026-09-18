/**
 * 客户端与 host 通信的桥。
 *
 * 客户端模块 `apply` 时拿到的 `rpcCall`（封装 connection.rpc.call）是闭包，
 * React 组件层只能拿到框架 props，拿不到 ctx。因此用模块级引用把 rpcCall 暴露给
 * 组件层（ScheduleTab / ScheduleManager），与 dsh-hello-panel 的 setOpenTab 桥同一思路。
 *
 * 注：原「右侧面板显隐开关（localStorage 偏好）」与「机器人变化进程内广播」已随右侧面板
 * 注入的移除而删除——定时消息现已迁移到文件工作台（见 workbench/schedule-view.tsx）。
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
