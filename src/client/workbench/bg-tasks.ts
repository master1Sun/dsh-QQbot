/**
 * 文件工作台「后台任务」贡献点封装（activity-bar-plugin.md apiVersion: 3）。
 * 把定时消息的增删改/测试执行登记进工作台底部状态栏的统一任务面板：
 * 运行中、历史与归档用户统一可见、可追溯。
 * 宿主不可用（设置页弹窗、旧版工作台等场景）时自动降级为直接执行，不登记。
 */

type BgTaskHandle = {
  step: (msg: string, file?: string, detail?: string, fileType?: string, fileSize?: number) => void;
  updateLabel: (label: string) => void;
  done: (msg?: string) => void;
  fail: (msg?: string) => void;
};

type BgTasksApi = {
  start: (label: string, opts?: { detail?: string; fileType?: string; fileSize?: number }) => BgTaskHandle;
  clearFinished?: () => Promise<void>;
  clearAll?: () => Promise<void>;
};

declare global {
  interface Window {
    __dshFileWorkbenchWorkbench__?: {
      apiVersion?: number;
      backgroundTasks?: BgTasksApi;
    };
  }
}

/** 探测后台任务 API：宿主未就绪 / apiVersion < 3（无该贡献点）时返回 null。 */
export function getBackgroundTasks(): BgTasksApi | null {
  const wb = window.__dshFileWorkbenchWorkbench__;
  if (wb && typeof wb.apiVersion === "number" && wb.apiVersion >= 3 && wb.backgroundTasks && typeof wb.backgroundTasks.start === "function") {
    return wb.backgroundTasks;
  }
  return null;
}

/** runAsBackgroundTask 回调结果：ok=false 时任务标记失败（message 为原因）；message 省略时静默收尾。 */
export type BgTaskOutcome = { ok: boolean; message?: string };

/**
 * 在后台任务面板登记一个操作并执行 fn：
 * - 宿主可用：start → fn → done/fail（fn 抛错同样归为 fail，不向上冒泡中断调用方）。
 * - 宿主不可用：直接执行 fn，行为与登记前完全一致。
 */
export async function runAsBackgroundTask(label: string, fn: () => Promise<BgTaskOutcome | void>, detail?: string): Promise<void> {
  const api = getBackgroundTasks();
  if (!api) {
    await fn();
    return;
  }
  const task = api.start(label, detail ? { detail } : undefined);
  let outcome: BgTaskOutcome = { ok: true };
  try {
    const r = await fn();
    if (r && typeof r === "object") outcome = r;
  } catch (e) {
    outcome = { ok: false, message: e instanceof Error ? e.message : String(e) };
  }
  if (outcome.ok) task.done(outcome.message);
  else task.fail(outcome.message);
}
