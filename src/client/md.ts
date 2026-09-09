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

const escapeHtml = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** 行内标记：输入须是已转义文本。 */
function inline(text: string): string {
  let out = text;
  // 行内代码：先抠出来占位，避免内部再被其他规则命中。
  const codes: string[] = [];
  out = out.replace(/`([^`\n]+)`/g, (_m, c: string) => {
    codes.push(c);
    return `\u0000${codes.length - 1}\u0000`;
  });
  // 链接 [text](url)：仅 http/https。
  out = out.replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g, (_m, label: string, url: string) =>
    `<a href="${url}" target="_blank" rel="noreferrer noopener">${label}</a>`);
  out = out.replace(/\*\*([^*\n][^*\n]*?)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");
  out = out.replace(/~~([^~\n]+)~~/g, "<del>$1</del>");
  // 还原行内代码（已转义内容）。
  out = out.replace(/\u0000(\d+)\u0000/g, (_m, i: string) => `<code>${codes[Number(i)]}</code>`);
  return out;
}

/** 把连续文本行拼成段（段内换行 → <br>）。 */
function para(lines: string[]): string {
  return `<p>${lines.map(inline).join("<br>")}</p>`;
}

export function renderMarkdown(src: string): string {
  const rawLines = String(src ?? "").replace(/\r\n?/g, "\n").split("\n");
  const out: string[] = [];
  let i = 0;
  while (i < rawLines.length) {
    const line = rawLines[i];
    const trimmed = line.trim();

    // 围栏代码块 ```（空行也照收，直到闭合或文末）
    if (/^```/.test(trimmed)) {
      const body: string[] = [];
      i += 1;
      while (i < rawLines.length && !/^```/.test(rawLines[i].trim())) {
        body.push(rawLines[i]);
        i += 1;
      }
      i += 1; // 跳过闭合 ```
      out.push(`<pre><code>${escapeHtml(body.join("\n"))}</code></pre>`);
      continue;
    }

    // 空行：段落分隔
    if (!trimmed) {
      i += 1;
      continue;
    }

    // 标题 # ~ ######
    const heading = /^(#{1,6})\s+(.+)$/.exec(trimmed);
    if (heading) {
      const level = Math.min(heading[1].length + 2, 6); // h3 起，避免弹窗内过大
      out.push(`<h${level}>${inline(escapeHtml(heading[2]))}</h${level}>`);
      i += 1;
      continue;
    }

    // 引用 >（连续行合并）
    if (/^&gt;|^>/.test(trimmed)) {
      const body: string[] = [];
      while (i < rawLines.length && /^\s*&gt;?\s?|^\s*>\s?/.test(rawLines[i]) && rawLines[i].trim()) {
        body.push(rawLines[i].replace(/^\s*&gt;\s?|^\s*>\s?/, ""));
        i += 1;
      }
      out.push(`<blockquote>${para(body)}</blockquote>`);
      continue;
    }

    // 列表：- /* 或 1. （连续行合并为一组）
    const bullet = /^[-*]\s+(.+)$/;
    const ordered = /^\d+[.)]\s+(.+)$/;
    if (bullet.test(trimmed) || ordered.test(trimmed)) {
      const isOrdered = ordered.test(trimmed);
      const items: string[] = [];
      while (i < rawLines.length) {
        const cur = rawLines[i].trim();
        const m = isOrdered ? ordered.exec(cur) : bullet.exec(cur);
        if (!m) break;
        items.push(`<li>${inline(escapeHtml(m[1]))}</li>`);
        i += 1;
      }
      out.push(isOrdered ? `<ol>${items.join("")}</ol>` : `<ul>${items.join("")}</ul>`);
      continue;
    }

    // 普通段落：连续非空、非特殊行
    const paraLines: string[] = [];
    while (i < rawLines.length) {
      const cur = rawLines[i];
      const t = cur.trim();
      if (!t || /^```/.test(t) || /^(#{1,6})\s/.test(t) || /^[-*]\s/.test(t) || /^\d+[.)]\s/.test(t) || /^>\s?/.test(t)) break;
      paraLines.push(escapeHtml(cur));
      i += 1;
    }
    if (paraLines.length) out.push(para(paraLines));
  }
  return out.join("");
}

/** 内容是否疑似含 Markdown（用于「用户消息默认纯文本」判断）。 */
export function looksLikeMarkdown(src: string): boolean {
  return /```|^#{1,6}\s|\*\*[^*\n]+\*\*|~~[^~\n]+~~|\[[^\]\n]+\]\(https?:\/\/|^\s*[-*]\s+\S|^\s*\d+[.)]\s+\S/m.test(String(src ?? ""));
}
