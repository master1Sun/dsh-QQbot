/**
 * 归档查看用的极简 Markdown 渲染器（零依赖、安全优先）。
 *
 * 安全策略：
 *  1. 先对整段文本做 HTML 转义（& < > " '），后续所有标签都是本模块拼出的受控 HTML；
 *  2. 链接 URL 仅放行 http/https，其余协议（javascript: 等）降级为纯文本；
 *  3. 不支持 HTML 直写、图片外链、事件属性——归档内容来自用户与 AI，绝不信任。
 *
 * 支持语法（QQ/AI 回复常见子集）：
 *  围栏代码块、标题、无序与有序列表、引用、
 *  **粗体**、*斜体*、~~删除线~~、`行内代码`、[文本](http…)、段落内换行 → <br>。
 */
export declare function renderMarkdown(src: string): string;
/** 内容是否疑似含 Markdown（用于「用户消息默认纯文本」判断）。 */
export declare function looksLikeMarkdown(src: string): boolean;
