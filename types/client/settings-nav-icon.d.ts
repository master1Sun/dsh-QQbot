/**
 * 设置导航图标 — 让 DSH 原生设置界面中「QQ 机器人」导航行的图标
 * 显示为本插件的机器人 glyph，而不是宿主对外部 section 的默认齿轮。
 *
 * DSH 0.1.x 的 settings.section 契约只透传 id / order / label（label 为纯文本），
 * 外部插件都会渲染同一个通用齿轮图标。这里参照 dsh-prompt-library 的做法：
 * MutationObserver 按文本匹配导航按钮并打标记，用 CSS **就地改造原生 svg**
 * 渲染机器人图标（跟随原生 hover/active 变色），不新增、不替换 DOM 节点。
 *
 * 注意：CSS mask-image 按 alpha 通道取样，QqBotGlyph 的「黑底白洞」镂空画法
 * 无法直接序列化为 mask，这里用描边风格重画一份等义图标（双眼/天线为实心，
 * 其余为描边），与宿主 outline 系导航图标风格一致。
 */
/** QQ 机器人导航行标记。 */
export declare const QBOT_SETTINGS_NAV_MARKER = "data-qbot-settings-nav";
/**
 * 注入到 document.head 的样式：把宿主默认 svg **就地改造成**机器人图标。
 *
 * 关键：不新增、不替换 DOM 节点。早先用 ::before 伪元素画图标，伪元素没继承
 * 原生图标与文字之间的间距，导致这一行的间距与「词库设置」等原生项对不齐。
 * 这一版只隐藏原生 svg 内部的 path/circle 等子元素，再给 svg 本身套 mask +
 * background-color: currentColor —— 图标的位置、尺寸、与文字的间距全部沿用
 * 原生按钮布局，因此与其它原生设置项完全一致。
 */
export declare const QBOT_SETTINGS_NAV_CSS = "\n[data-qbot-settings-nav] svg > * {\n  display: none !important;\n}\n[data-qbot-settings-nav] svg {\n  background-color: currentColor;\n  -webkit-mask-position: center;\n  -webkit-mask-size: contain;\n  -webkit-mask-repeat: no-repeat;\n  mask-position: center;\n  mask-size: contain;\n  mask-repeat: no-repeat;\n  -webkit-mask-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3.5v2.5'/%3E%3Ccircle cx='12' cy='2.5' r='.9' fill='black' stroke='none'/%3E%3Crect x='5' y='6' width='14' height='12' rx='3.5'/%3E%3Ccircle cx='9.4' cy='11.5' r='.9' fill='black' stroke='none'/%3E%3Ccircle cx='14.6' cy='11.5' r='.9' fill='black' stroke='none'/%3E%3Cpath d='M9.5 14.8q2.5 1.8 5 0'/%3E%3C/svg%3E\");\n  mask-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3.5v2.5'/%3E%3Ccircle cx='12' cy='2.5' r='.9' fill='black' stroke='none'/%3E%3Crect x='5' y='6' width='14' height='12' rx='3.5'/%3E%3Ccircle cx='9.4' cy='11.5' r='.9' fill='black' stroke='none'/%3E%3Ccircle cx='14.6' cy='11.5' r='.9' fill='black' stroke='none'/%3E%3Cpath d='M9.5 14.8q2.5 1.8 5 0'/%3E%3C/svg%3E\");\n}\n";
/**
 * 在设置导航按钮（文本等于指定 section 标签）上打标记，供 CSS 替换图标。
 * @param label 设置 section 的当前标签解析器（跟随语言切换）。
 * @returns 清理函数：断开观察并移除已打上的标记。
 */
export declare function registerQbotSettingsNavIcon(label: () => string): () => void;
