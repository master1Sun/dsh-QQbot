import type { CSSProperties, ReactNode } from "react";
import { t, useLocale } from "../i18n/index.js";
import { QqBotGlyph } from "../glyphs.js";

const wrap: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  overflow: "hidden",
  whiteSpace: "nowrap",
};

/**
 * 右侧面板 tab 的 chip 标题（注册于 `sidebar.right.pane.tab.title`，key = 包名）。
 * 不注册时 chip 显示注册表在打开时捕获的 title(address) 文本。
 *
 * 图标用插件统一的 QQ 机器人 glyph（与设置页导航/品牌区同源），
 * 取色交给 `.qbot-panelMark` 的品牌令牌，深浅色自适应、不写死颜色。
 * 文案走 i18n 字段名；`useLocale()` 保证宿主切换语言后 chip 同步刷新
 * （右侧面板不在设置页的重渲染链路内）。
 */
export function TitleView(): ReactNode {
  useLocale();
  return (
    <span style={wrap}>
      <QqBotGlyph uid="panel-chip" size={15} className="qbot-panelMark" />
      {t("panel.title")}
    </span>
  );
}
