/**
 * 定时发送 → 后台任务面板桥接。
 *
 * 宿主调度器每次到点触发（成功 / 失败 / 门控跳过）都会经
 * `ws://<host>/qqbot-settings/events` 广播 `sched-send` 事件（见宿主 ws-hub.ts
 * 与 schedule.ts 的 onSendEvent）。本模块维持一条带退避重连的 WebSocket 长连接，
 * 收到事件后用文件工作台的 `backgroundTasks` 贡献点（apiVersion 3）登记一条
 * 已完结的后台任务，用户在底部状态栏任务按钮里统一可见、可追溯。
 *
 * 行为要点：
 *  - 工作台后台任务 API 不可用（没装文件工作台 / 版本低于 v3）时事件静默丢弃；
 *  - WebSocket 断开后按 1s→2s→…→30s 退避重连，连上即复位；
 *  - 全模块单例，重复 install 幂等。
 */
import { t } from "../i18n/index.js";
import { getBackgroundTasks } from "./bg-tasks.js";

/** sched-send 事件载荷（与宿主 ScheduleSendEvent 同构）。 */
interface SchedSendEvent {
  summary: string;
  appId: string;
  ok: boolean;
  skipped: boolean;
  reason?: string;
}

const WS_PATH = "/qqbot-settings/events";
const RECONNECT_MAX_MS = 30_000;

let installed = false;

export function installSchedSendTasks(): void {
  if (installed || typeof window === "undefined") return;
  installed = true;
  connectWithBackoff();
}

/** 带退避重连的 WebSocket：指数退避至 30s 封顶，连上成功即复位退避。 */
function connectWithBackoff(): void {
  let backoff = 1_000;
  const open = (): void => {
    let ws: WebSocket;
    try {
      ws = new WebSocket(`${location.protocol === "https:" ? "wss:" : "ws:"}//${location.host}${WS_PATH}`);
    } catch {
      scheduleReconnect();
      return;
    }
    ws.onopen = () => {
      backoff = 1_000;
    };
    ws.onmessage = (ev) => {
      handleFrame(typeof ev.data === "string" ? ev.data : "");
    };
    ws.onclose = () => scheduleReconnect();
    ws.onerror = () => {
      try {
        ws.close();
      } catch { /* 已关闭 */ }
    };
  };
  const scheduleReconnect = (): void => {
    setTimeout(open, backoff);
    backoff = Math.min(backoff * 2, RECONNECT_MAX_MS);
  };
  open();
}

/** 解析一帧广播：只认 sched-send；登记后台任务时工作台不可用则丢弃。 */
function handleFrame(text: string): void {
  if (!text) return;
  let event = "";
  let data: unknown = null;
  try {
    const parsed = JSON.parse(text) as { event?: unknown; data?: unknown };
    event = typeof parsed.event === "string" ? parsed.event : "";
    data = parsed.data ?? null;
  } catch {
    return;
  }
  if (event !== "sched-send") return;
  const info = data as Partial<SchedSendEvent> | null;
  if (!info || typeof info.summary !== "string") return;
  const api = getBackgroundTasks();
  if (!api) return;
  const detail = info.appId ? `${info.appId} · ${info.summary}` : info.summary;
  const task = api.start(t("sched.bg.send"), { detail });
  if (info.skipped) {
    // 门控拦下 / AI 判定静默：没有投递但属正常收尾，用 done 承载原因。
    task.done(info.reason ?? t("sched.bg.skipped"));
  } else if (info.ok) {
    task.done(t("sched.bg.sent"));
  } else {
    task.fail(info.reason ?? "failed");
  }
}
