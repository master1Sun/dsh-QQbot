/**
 * 回复排版判定：这段内容到底需不需要 Markdown。
 *
 * 背景：QQ 群 / 单聊的 Markdown（msg_type=2）既需要平台权限，纯闲聊用 Markdown 渲染
 * 也不如纯文本自然。以前是全局开关 `markdownReply` 一刀切（默认全开），连「好的，我看一下」
 * 都按 Markdown 发。现在改成**按内容判定**：模型写出来的东西本身带 Markdown 语法才用
 * Markdown，否则走纯文本。
 *
 * 为什么用「检测」而不是「再问一次模型」：模型已经把内容写出来了，它写下的语法本身就是
 * 它的排版决定——再补一次模型调用只会增加延迟和费用，判定结果却不会更准。
 *
 * 判定口径：**只要出现 Markdown 语法就用 Markdown**。原因是纯文本通道不会渲染语法，
 * `**重点**` 会原样显示成星号、表格会塌成一行——与其在纯文本里露出记号，不如切到
 * Markdown 让它正确渲染。真正走纯文本的是「不含任何 Markdown 语法」的日常聊天。
 */
export interface MarkdownSignals {
  /** 结构性语法：代码块 / 表格 / 标题 / 列表 / 引用。 */
  structural: boolean;
  /** 行内语法：粗体 / 行内代码 / 链接 / 删除线。 */
  inline: boolean;
}

/** 抽出内容里出现的 Markdown 语法信号（供判定与日志使用）。 */
export function markdownSignals(text: string): MarkdownSignals {
  const clean = String(text ?? "").replace(/\r\n/g, "\n");
  if (!clean.trim()) return { structural: false, inline: false };
  const structural =
    /^\s*(?:```|~~~)\S*/m.test(clean)          // 代码块围栏
    || /^#{1,6}\s+\S/m.test(clean)             // 标题
    || /^\s*>\s+\S/m.test(clean)               // 引用
    || /^\s*(?:[-*+]|\d+[.)])\s+\S/m.test(clean) // 有序 / 无序列表
    || /^\s*\|.*\|\s*$/m.test(clean);          // 表格（含表头分隔行）
  const inline =
    /\*\*[^*\n]+\*\*/.test(clean)              // **粗体**
    || /__[^_\n]+__/.test(clean)               // __粗体__
    || /`[^`\n]+`/.test(clean)                 // `行内代码`
    || /\[[^\]\n]+\]\([^)\s]+\)/.test(clean)   // [链接](url)
    || /~~[^~\n]+~~/.test(clean);              // ~~删除线~~
  return { structural, inline };
}

/** 该内容是否需要按 Markdown 发送。 */
export function looksLikeMarkdown(text: string): boolean {
  const { structural, inline } = markdownSignals(text);
  return structural || inline;
}

/**
 * 疑似凭据 / 私钥的文件路径（自动外发交付文件前的闸门）。
 *
 * 群聊里可能不止你一个人：模型一旦把 `.env`、私钥或证书当成「产出文件」声明成交付物，
 * 文件就会直接发进群里。命中即跳过外发并记日志。
 * 只匹配「路径末段整体就是凭据文件」，`environment.md`、`credentials-notes.md` 这类正常文件不受影响。
 */
export function isSensitiveFilePath(path: string): boolean {
  return /(?:^|[\\/])(?:\.env(?:\..+)?|\.git|id_rsa|id_ed25519|credentials(?:\..+)?|[^\\/]+\.(?:pem|key|p12|pfx|jks|keystore))$/i
    .test(String(path ?? "").trim());
}
