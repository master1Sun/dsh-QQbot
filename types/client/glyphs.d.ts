/** QQ 企鹅 glyph */
export declare function QqLogoGlyph(): import("react").DetailedReactHTMLElement<import("react").InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
/** 文件夹 glyph，用于目录选择弹窗的行图标。 */
export declare function FolderGlyph(): import("react").DetailedReactHTMLElement<import("react").InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
/** 上一级 glyph。 */
export declare function FolderUpGlyph(): import("react").DetailedReactHTMLElement<import("react").InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
/**
 * QQ 机器人 glyph（圆角方头 + 天线 + 双眼 + 微笑）。
 * 黑白配色：头身 currentColor 跟随主题文字色，眼嘴镂空透出背景。
 * size 缺省时按 1em 渲染（跟随字号），显式传值则用像素——右侧面板 chip 等
 * 需要精确控制图标尺寸的场景使用后者。
 */
export declare function QqBotGlyph(props: {
    className?: string;
    uid: string;
    size?: number;
}): import("react").DetailedReactHTMLElement<import("react").InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
/**
 * 引导页入口图标适配器。
 * 宿主 `sidebarRightTabs` 的 `guide[].icon` 契约为 `ComponentType<{ size?; className? }>`，
 * 会在 22/26px 两种尺寸下调用；这里补上 QqBotGlyph 需要的固定 uid（mask id 必须唯一）。
 */
export declare function QqBotGuideIcon(props: {
    size?: number;
    className?: string;
    uid?: string;
}): import("react").DetailedReactHTMLElement<import("react").InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
