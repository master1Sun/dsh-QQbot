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

export const QQBOT_LOCALE_NAMESPACE = "dsh-qqbot";

/** 宿主 locale id → 本模块语言标识。 */
const HOST_TO_OURS: Readonly<Record<string, "cn" | "en">> = Object.freeze({
  zh: "cn",
  "zh-CN": "cn",
  cn: "cn",
  en: "en",
  "en-US": "en",
});

/** 当前语言（默认 cn，与旧实现「中文为源语言」保持一致）。 */
let currentLocale: "cn" | "en" = "cn";

/** 宿主注入的翻译函数：入参字段名，返回当前语言文案；未命中返回 undefined。 */
let lookup: ((key: string) => string | undefined) | undefined;

/** 语言切换订阅者（宿主切语言时刷新界面）。 */
const listeners = new Set<() => void>();

/** 宿主 locale 服务是否可用（不可用时退化为读本地表，便于单测/降级）。 */
let hostBound = false;

/**
 * 注入宿主 locale 绑定（ctx.locale.bind(namespace)）。
 * 传空则退化为直接读本地字典（用于 verify/render 等无宿主的场景）。
 */
export function setTranslator(next?: (key: string) => string | undefined) {
  lookup = typeof next === "function" ? next : undefined;
  hostBound = typeof next === "function";
  emit();
}

/** 设置当前语言（通常由宿主 locale 事件驱动）。 */
export function setLocale(locale: string) {
  const mapped = HOST_TO_OURS[locale] ?? (locale === "en" ? "en" : "cn");
  if (mapped === currentLocale) return;
  currentLocale = mapped;
  emit();
}

/** 读取当前语言。 */
export function getLocale(): "cn" | "en" {
  return currentLocale;
}

/** 订阅语言变化，返回取消订阅函数。 */
export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/**
 * React 侧语言订阅钩子：宿主切换语言后强制当前组件重渲染。
 *
 * 设置页由宿主在语言变化时整体重渲染，但右侧面板这类独立挂载的组件不在该链路内，
 * 必须在组件内自行订阅，否则 chip 标题 / 工具栏文案会停留在切换前的语言。
 * 返回当前语言，可用于同时依赖语言值的渲染分支。
 */
export function useLocale(): "cn" | "en" {
  const [loc, setLoc] = React.useState<"cn" | "en">(getLocale());
  React.useEffect(() => subscribe(() => setLoc(getLocale())), []);
  return loc;
}

function emit() {
  for (const fn of listeners) fn();
}

export function isEnglish(): boolean {
  return currentLocale === "en";
}

/**
 * 按字段名取文案。
 * 命中优先级：宿主翻译（幂等）→ 本地对应语言表 → 字段名本身（兜底，便于排查漏配）。
 */
export function t(key: string): string {
  if (!key) return key;
  if (hostBound && lookup) {
    const hit = lookup(key);
    if (typeof hit === "string" && hit) return hit;
  }
  const table = currentLocale === "en" ? en : cn;
  return table[key] ?? key;
}

/**
 * 带位置参数的文案：`fmt("schedule.totalPrefix", 3)`。
 * 文案里写 {0} {1} …；缺参保持原样，便于暴露问题而不丢内容。
 */
export function fmt(key: string, ...args: Array<string | number>): string {
  const template = t(key);
  if (!args.length) return template;
  return template.replace(/\{(\d+)\}/g, (whole, idx: string) => {
    const i = Number(idx);
    return i < args.length ? String(args[i]) : whole;
  });
}

/**
 * 兼容旧调用点：入参既可是字段名，也可是「中文原文」。
 * 传中文原文时按 cn 表反查字段名（仅在迁移期有用，迁移完成后应全部改传字段名）。
 */
const ZH_TO_KEY: Readonly<Record<string, string>> = Object.freeze(
  Object.fromEntries(Object.entries(cn).map(([key, zh]) => [zh, key])),
);

export function localizeText(value: string): string {
  if (typeof value !== "string" || !value) return value;
  if (keyExists(value)) return t(value);
  const key = ZH_TO_KEY[value];
  if (key) return t(key);
  return value;
}

function keyExists(key: string): boolean {
  return Object.prototype.hasOwnProperty.call(cn, key);
}

/** 需要翻译的属性名（对齐 dsh-im，另加 optgroup 的 label）。 */
export const LOCALIZED_PROPS: ReadonlyArray<string> = Object.freeze([
  "aria-label",
  "alt",
  "placeholder",
  "title",
  "label",
]);

function localizeChild(child: any): any {
  if (typeof child === "string") return localizeText(child);
  if (Array.isArray(child)) return child.map(localizeChild);
  return child;
}

/**
 * React.createElement 的本地化包装：字符串子节点与指定字符串属性
 * 在渲染时翻译。设置界面的所有元素都应通过它创建。
 */
export function h(type: any, props: any = {}, ...children: any[]) {
  let localizedProps = props;
  if (props) {
    for (const key of LOCALIZED_PROPS) {
      if (typeof props[key] === "string") {
        if (localizedProps === props) localizedProps = { ...props };
        localizedProps[key] = localizeText(props[key]);
      }
    }
  }
  return React.createElement(type, localizedProps, ...children.map(localizeChild));
}

/** 供 apply() 注册到宿主的字典：宿主用 zh/en，这里把 cn 映射成 zh。 */
export const hostDictionaries = Object.freeze({ zh: cn, en });

/** 供宿主调用的语言 id 集合。 */
export const HOST_LOCALES: ReadonlyArray<string> = Object.freeze(["zh", "en"]);
