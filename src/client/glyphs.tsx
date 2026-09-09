/**
 * SVG 图标组件：QQ 企鹅 / 目录 / 上一级 / QQ 机器人品牌 glyph。
 */
import { h } from "./i18n.js";

/** QQ 企鹅 glyph */
export function QqLogoGlyph() {
  return h("svg", { viewBox: "0 0 24 24", focusable: "false", "aria-hidden": "true" },
    h("path", {
      fill: "currentColor",
      d: "M21.395 15.035a40 40 0 0 0-.803-2.264l-1.079-2.695c.001-.032.014-.562.014-.836C19.526 4.632 17.351 0 12 0S4.474 4.632 4.474 9.241c0 .274.013.804.014.836l-1.08 2.695a39 39 0 0 0-.802 2.264c-1.021 3.283-.69 4.643-.438 4.673.54.065 2.103-2.472 2.103-2.472 0 1.469.756 3.387 2.394 4.771-.612.188-1.363.479-1.845.835-.434.32-.379.646-.301.778.343.578 5.883.369 7.482.189 1.6.18 7.14.389 7.483-.189.078-.132.132-.458-.301-.778-.483-.356-1.233-.646-1.846-.836 1.637-1.384 2.393-3.302 2.393-4.771 0 0 1.563 2.537 2.103 2.472.251-.03.581-1.39-.438-4.673",
    }));
}

/** 文件夹 glyph，用于目录选择弹窗的行图标。 */
export function FolderGlyph() {
  return h("svg", { viewBox: "0 0 24 24", focusable: "false", "aria-hidden": "true" },
    h("path", {
      fill: "currentColor",
      d: "M3 6.5A1.5 1.5 0 0 1 4.5 5h4.1c.47 0 .91.22 1.2.6L11 7h8.5A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11Z",
    }));
}

/** 上一级 glyph。 */
export function FolderUpGlyph() {
  return h("svg", { viewBox: "0 0 24 24", focusable: "false", "aria-hidden": "true" },
    h("path", {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M11 19l-7-7 7-7M4 12h16",
    }));
}

/** QQ 机器人 glyph（圆角方头 + 天线 + 双眼 + 微笑）。黑白配色：头身 currentColor 跟随主题文字色，眼嘴镂空透出背景。 */
export function QqBotGlyph(props: { className?: string; uid: string }) {
  return h("svg", {
    viewBox: "0 0 24 24",
    width: "1em",
    height: "1em",
    focusable: "false",
    "aria-hidden": "true",
    className: props.className,
  },
    h("circle", { cx: 12, cy: 2.9, r: 1.2, fill: "currentColor" }),
    h("line", { x1: 12, y1: 4, x2: 12, y2: 6.2, stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" }),
    h("mask", { id: `qbot-face-${props.uid}` },
      h("rect", { x: 0, y: 0, width: 24, height: 24, fill: "#fff" }),
      h("circle", { cx: 9.3, cy: 12, r: 1.6, fill: "#000" }),
      h("circle", { cx: 14.7, cy: 12, r: 1.6, fill: "#000" }),
      h("path", { d: "M9.4 15.1 Q12 17.1 14.6 15.1", fill: "none", stroke: "#000", strokeWidth: 1.5, strokeLinecap: "round" })),
    h("rect", { x: 4.5, y: 6, width: 15, height: 13, rx: 4.5, fill: "currentColor", mask: `url(#qbot-face-${props.uid})` }));
}
