/**
 * 把「定时消息」注册进文件工作台（dsh-file-workbench）左侧 Activity Bar。
 *
 * 这是把原本注入 DSH 右侧面板的定时消息功能迁移到文件工作台：改用文件工作台开放的
 * 框架无关挂载契约 `window.__dshFileWorkbenchWorkbench__.activityBar.register(view)`，
 * 在 `mount(el, ctx)` 里用 React 渲染复用的 ScheduleTab（含机器人作用域选择 +
 * ScheduleManager 完整 CRUD）。右侧面板注入已整体移除（见 src/client/index.tsx）。
 *
 * 契约要点（见 dsh-file-workbench-lib/docs/activity-bar-plugin.md）：
 *   - 注册表模块级存活，同 id 覆盖（幂等，支持热更新）。
 *   - 图标用工作台内置 icon 集（icons.ts）的字符串名；非法名回退到 title 首字符。
 *   - 文件工作台全局可能晚于本插件加载：全局缺失时轮询等待，最多约 30s。
 */
import { createRoot, type Root } from "react-dom/client";
import { h } from "../i18n/index.js";
import { ScheduleTab } from "../right-panel/ScheduleTab.js";

/** 文件工作台扩展视图 id（带插件命名空间，避免与其它插件冲突）。 */
export const QQBOT_WORKBENCH_VIEW_ID = "@sunjuntao/dsh-qqbot.schedule";

/** 读取文件工作台注入 API（全局可能尚未就绪，返回 null 表示需等待）。 */
function getWorkbenchApi(): { apiVersion: number; activityBar: { register: (v: any) => void; unregister: (id: string) => void } } | null {
  try {
    const w = window as unknown as Record<string, any>;
    const api = w.__dshFileWorkbenchWorkbench__;
    if (api && api.activityBar && typeof api.activityBar.register === "function") return api;
  } catch { /* 非浏览器 / 访问受限时忽略 */ }
  return null;
}

let installed = false;

/**
 * 安装文件工作台扩展视图。全局未就绪时轮询等待（插件加载顺序不确定）。
 * 幂等：模块级 `installed` 守卫 + 同 id 覆盖，重复调用不会重复注册。
 */
export function installScheduleWorkbenchView(): void {
  if (installed) return;
  installed = true;

  const attempt = (n: number): void => {
    const api = getWorkbenchApi();
    if (api) {
      api.activityBar.register({
        id: QQBOT_WORKBENCH_VIEW_ID,
        title: { zh: "QQ 定时消息", en: "QQ Scheduled Messages" },
        icon: "clock",
        order: 60,
        mount(el: HTMLElement, ctx?: any) {
          // el 是文件工作台的 Pane 内容容器，宿主已用 flex + 定高父级给了它确定高度，且自带
          // overflow-y:auto（见 .fw-exp-ext-view / .vs-ext-view），它就是本视图的滚动容器。
          // 工具栏 position:sticky 常驻顶部；无论内层 flex 高度链是否生效，内容都在 el 内滚动、
          // 底部按钮恒定可达。设置页弹窗用独立的 .qbot-modal，不在此列。
          el.style.minHeight = "0";
          el.style.overflowY = "auto";
          el.style.overflowX = "hidden";
          el.style.position = "relative";
          el.style.boxSizing = "border-box";

          // 该视图内浏览器原生滚轮滚动不可用（实测滚轮滚不动，宿主对 el 的 wheel 未走原生默认），
          // 故在 el 上挂「捕获 + 非 passive」wheel 监听，手动按滚轮增量滚动 el 本容器。
          // 始终只滚动 el（确定的滚动容器），不再向上查找内层滚动元素——那样会偶发滚动内层列表、
          // 与整页滚动比例不一致，表现为「滚动不线性」。deltaMode 统一换算成像素（行=18px、页=一屏），
          // 跨设备比例一致。仅当内容确实溢出且未到边界时拦截；到顶/底放行，让父级继续滚动。
          const onWheel = (e: WheelEvent): void => {
            if (!e.deltaY) return;
            const max = el.scrollHeight - el.clientHeight;
            if (max <= 1) return; // 内容未溢出，交给宿主 / 父级原生滚动
            const atTop = el.scrollTop <= 0;
            const atBottom = el.scrollTop >= max - 1;
            if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) return; // 边界放行
            const unit = e.deltaMode === 1 ? 18 : e.deltaMode === 2 ? el.clientHeight : 1;
            el.scrollTop += e.deltaY * unit;
            e.preventDefault();
            e.stopPropagation();
          };
          el.addEventListener("wheel", onWheel, { passive: false, capture: true });

          // 在宿主提供的 el 内创建「专属于 React 的子容器」，把 React 的 DOM 完全隔离在 container 中：
          // 宿主会在切走视图时调用 el.replaceChildren()、并在重挂载时复用同一个 el 反复挂载，
          // 直接 createRoot(el) 会让 React 与宿主对 el 的子节点产生归属冲突（表现为
          // removeChild: node is not a child of this node）。隔离到子容器后，宿主对 el 的
          // 任何增删（replaceChildren）都只作用于 el 直接子级，不会破坏 React 内部 DOM 记账。
          // 同时用 expando 记住 root，防止同一 el 被重复 createRoot（双 root 同容器必崩）。
          const KEY = "__qbotSchedReact__";
          type SchedReactEntry = { root: Root; container: HTMLElement };
          const store = el as unknown as Record<string, SchedReactEntry | undefined>;
          let entry = store[KEY];
          let container: HTMLElement;
          let root: Root;
          if (entry && entry.root) {
            // 防御：同一 el 被重复挂载（宿主某些卸载路径未跑清理）时复用既有 root，而非再建一个。
            container = entry.container;
            root = entry.root;
          } else {
            container = document.createElement("div");
            container.className = "qbot-schedReactRoot";
            container.style.cssText = "min-height:100%;width:100%;box-sizing:border-box";
            el.appendChild(container);
            root = createRoot(container);
            store[KEY] = { root, container };
          }
          root.render(
            h(ScheduleTab, {
              toast: typeof ctx?.toast === "function" ? (lvl: string, msg: string) => ctx.toast(lvl, msg) : undefined,
            }),
          );
          return () => {
            el.removeEventListener("wheel", onWheel, { capture: true });
            try { store[KEY] = undefined; } catch { /* 容器已脱离文档 */ }
            try { root.unmount(); } catch { /* 已卸载 */ }
            try { container.remove(); } catch { /* 容器已脱离文档 */ }
          };
        },
      });
      return;
    }
    // 未就绪：200ms 后重试，最多约 30s（150 次）。
    if (n < 150) window.setTimeout(() => attempt(n + 1), 200);
  };
  attempt(0);
}
