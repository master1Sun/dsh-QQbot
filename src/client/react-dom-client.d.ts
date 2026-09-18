/**
 * 运行时不带类型声明的模块的最小类型桥。
 *
 * 本机未安装 @types/react-dom，且 react-dom 的 client 子入口没有 .d.ts。
 * 定时消息迁移到文件工作台后，需要在 `mount(el, ctx)` 里用 ReactDOM.createRoot
 * 渲染复用的 ScheduleTab，因此只需为 `react-dom/client` 这一窄接口补类型，
 * 让 typecheck（tsc --noEmit）通过。运行期由 esbuild 把 react-dom/client 打入 bundle。
 */
declare module "react-dom/client" {
  import type { ReactNode } from "react";

  export interface Root {
    render(children: ReactNode): void;
    unmount(): void;
  }

  export function createRoot(
    container: Element | DocumentFragment,
    options?: { identifierPrefix?: string; onRecoverableError?: (error: unknown) => void },
  ): Root;
}
