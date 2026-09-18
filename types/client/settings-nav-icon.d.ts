/**
 * 设置导航图标 — 让 DSH 原生设置界面中「QQ 机器人」导航行的图标
 * 显示为本插件的机器人 glyph，而不是宿主对外部 section 的默认齿轮。
 *
 * DSH 0.1.x 的 settings.section 契约只透传 id / order / label（label 为纯文本），
 * 外部插件都会渲染同一个通用齿轮图标。这里参照 dsh-prompt-library 的做法：
 * MutationObserver 按文本匹配导航按钮并打标记，注入 CSS 隐藏默认齿轮、
 * 用 mask 方式渲染机器人图标（跟随原生 hover/active 变色）。
 *
 * 注意：CSS mask-image 按 alpha 通道取样，QqBotGlyph 的「黑底白洞」镂空画法
 * 无法直接序列化为 mask，这里用描边风格重画一份等义图标（双眼/天线为实心，
 * 其余为描边），与宿主 outline 系导航图标风格一致。
 */
/** QQ 机器人导航行标记。 */
export declare const QBOT_SETTINGS_NAV_MARKER = "data-qbot-settings-nav";
/** 注入到 document.head 的样式：隐藏默认齿轮，按标记替换为机器人图标。 */
export declare const QBOT_SETTINGS_NAV_CSS = "\n[data-qbot-settings-nav] > svg:first-child {\n  display: none;\n}\n[data-qbot-settings-nav]::before {\n  content: '';\n  flex: none;\n  width: 16px;\n  height: 16px;\n  background: currentColor;\n  -webkit-mask: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3.5v2.5'/%3E%3Ccircle cx='12' cy='2.5' r='.9' fill='black' stroke='none'/%3E%3Crect x='5' y='6' width='14' height='12' rx='3.5'/%3E%3Ccircle cx='9.4' cy='11.5' r='.9' fill='black' stroke='none'/%3E%3Ccircle cx='14.6' cy='11.5' r='.9' fill='black' stroke='none'/%3E%3Cpath d='M9.5 14.8q2.5 1.8 5 0'/%3E%3C/svg%3E\") center / contain no-repeat;\n  mask: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3.5v2.5'/%3E%3Ccircle cx='12' cy='2.5' r='.9' fill='black' stroke='none'/%3E%3Crect x='5' y='6' width='14' height='12' rx='3.5'/%3E%3Ccircle cx='9.4' cy='11.5' r='.9' fill='black' stroke='none'/%3E%3Ccircle cx='14.6' cy='11.5' r='.9' fill='black' stroke='none'/%3E%3Cpath d='M9.5 14.8q2.5 1.8 5 0'/%3E%3C/svg%3E\") center / contain no-repeat;\n}\n";
/**
 * 在设置导航按钮（文本等于指定 section 标签）上打标记，供 CSS 替换图标。
 * @param label 设置 section 的当前标签解析器（跟随语言切换）。
 * @returns 清理函数：断开观察并移除已打上的标记。
 */
export declare function registerQbotSettingsNavIcon(label: () => string): () => void;
