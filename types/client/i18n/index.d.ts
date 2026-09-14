/**
 * dsh-qqbot 设置界面国际化（运行时）。
 *
 * 结构（2026-09-10 起）：
 *  - 文案表按「字段名 → 文案」组织，cn / en 两张独立的表（见 ./dict.ts）。
 *  - 取值一律走字段名：`t("common.ok")`、`localizeText("session.title")`，
 *    不再把中文原文当 key。
 *  - 含插值走 `fmt("notice.savedAtPrefix", time)`，占位符用 {0} {1} …
 *    （文案表里统一写 {0}，与旧实现的 {nick} 区别开）。
 *  - apply() 经 ctx.locale.register(namespace, { zh: cn, en }) 注册进宿主；
 *    宿主 locale id 是 zh/en，本项目内部字段叫 cn/en，注册处做一次映射。
 */
import * as React from "react";
import { cn, en } from "./dict.js";
export type { LocaleId } from "./dict.js";
export { cn, en };
export declare const QQBOT_LOCALE_NAMESPACE = "dsh-qqbot";
/**
 * 注入宿主 locale 绑定（ctx.locale.bind(namespace)）。
 * 传空则退化为直接读本地字典（用于 verify/render 等无宿主的场景）。
 */
export declare function setTranslator(next?: (key: string) => string | undefined): void;
/** 设置当前语言（通常由宿主 locale 事件驱动）。 */
export declare function setLocale(locale: string): void;
/** 读取当前语言。 */
export declare function getLocale(): "cn" | "en";
/** 订阅语言变化，返回取消订阅函数。 */
export declare function subscribe(fn: () => void): () => void;
/**
 * React 侧语言订阅钩子：宿主切换语言后强制当前组件重渲染。
 *
 * 设置页由宿主在语言变化时整体重渲染，但右侧面板这类独立挂载的组件不在该链路内，
 * 必须在组件内自行订阅，否则 chip 标题 / 工具栏文案会停留在切换前的语言。
 * 返回当前语言，可用于同时依赖语言值的渲染分支。
 */
export declare function useLocale(): "cn" | "en";
export declare function isEnglish(): boolean;
/**
 * 按字段名取文案。
 * 命中优先级：宿主翻译（幂等）→ 本地对应语言表 → 字段名本身（兜底，便于排查漏配）。
 */
export declare function t(key: string): string;
/**
 * 带位置参数的文案：`fmt("schedule.totalPrefix", 3)`。
 * 文案里写 {0} {1} …；缺参保持原样，便于暴露问题而不丢内容。
 */
export declare function fmt(key: string, ...args: Array<string | number>): string;
export declare function localizeText(value: string): string;
/** 需要翻译的属性名（对齐 dsh-im，另加 optgroup 的 label）。 */
export declare const LOCALIZED_PROPS: ReadonlyArray<string>;
/**
 * React.createElement 的本地化包装：字符串子节点与指定字符串属性
 * 在渲染时翻译。设置界面的所有元素都应通过它创建。
 */
export declare function h(type: any, props?: any, ...children: any[]): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
/** 供 apply() 注册到宿主的字典：宿主用 zh/en，这里把 cn 映射成 zh。 */
export declare const hostDictionaries: Readonly<{
    zh: Readonly<Record<string, string>>;
    en: Readonly<Record<string, string>>;
}>;
/** 供宿主调用的语言 id 集合。 */
export declare const HOST_LOCALES: ReadonlyArray<string>;
