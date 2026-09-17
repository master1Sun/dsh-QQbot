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
export const QBOT_SETTINGS_NAV_MARKER = "data-qbot-settings-nav";

/**
 * 机器人图标（描边式）：天线 + 圆角方头 + 实心双眼 + 微笑，
 * URL 编码后作为 CSS mask 数据。
 */
const NAV_ICON_MASK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3.5v2.5'/%3E%3Ccircle cx='12' cy='2.5' r='.9' fill='black' stroke='none'/%3E%3Crect x='5' y='6' width='14' height='12' rx='3.5'/%3E%3Ccircle cx='9.4' cy='11.5' r='.9' fill='black' stroke='none'/%3E%3Ccircle cx='14.6' cy='11.5' r='.9' fill='black' stroke='none'/%3E%3Cpath d='M9.5 14.8q2.5 1.8 5 0'/%3E%3C/svg%3E";

/** 注入到 document.head 的样式：隐藏默认齿轮，按标记替换为机器人图标。 */
export const QBOT_SETTINGS_NAV_CSS = `
[${QBOT_SETTINGS_NAV_MARKER}] > svg:first-child {
  display: none;
}
[${QBOT_SETTINGS_NAV_MARKER}]::before {
  content: '';
  flex: none;
  width: 16px;
  height: 16px;
  background: currentColor;
  -webkit-mask: url("${NAV_ICON_MASK}") center / contain no-repeat;
  mask: url("${NAV_ICON_MASK}") center / contain no-repeat;
}
`;

/**
 * 在设置导航按钮（文本等于指定 section 标签）上打标记，供 CSS 替换图标。
 * @param label 设置 section 的当前标签解析器（跟随语言切换）。
 * @returns 清理函数：断开观察并移除已打上的标记。
 */
export function registerQbotSettingsNavIcon(label: () => string): () => void {
  let disposed = false;

  const sync = (): void => {
    if (disposed) return;
    const currentLabel = label().trim();
    const buttons = document.querySelectorAll<HTMLButtonElement>(
      '[role="dialog"] nav button',
    );
    for (const button of Array.from(buttons)) {
      const matches =
        currentLabel.length > 0 && button.textContent?.trim() === currentLabel;
      if (matches) button.setAttribute(QBOT_SETTINGS_NAV_MARKER, "");
      else button.removeAttribute(QBOT_SETTINGS_NAV_MARKER);
    }
  };

  sync();
  const observer = new MutationObserver(sync);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  return () => {
    disposed = true;
    observer.disconnect();
    document.querySelectorAll(`[${QBOT_SETTINGS_NAV_MARKER}]`).forEach((element) => {
      element.removeAttribute(QBOT_SETTINGS_NAV_MARKER);
    });
  };
}
