/**
 * 文件内容识别（文本类附件 → 模型上下文）：
 *
 * 用户发文件给 AI 时，平台只给文件名与下载 URL。对「文本类」文件
 * （txt/md/json/csv/日志/代码等）这里直接下载并截取正文注入 prompt，
 * 让模型不借助任何外部工具就能读懂文件内容并给出针对性回复；
 * 二进制类（docx/pdf/图片等）不读内容，仅列文件名与地址（交给多模态/插件处理）。
 *
 * 安全约束：仅 https（QQ 媒体地址均为 https）、大小上限 1MB、超时 15s、
 * 内容按「外部未信任数据」标注（由调用方 rule.ts 添加框架语）。
 */

const DOWNLOAD_MAX_BYTES = 1024 * 1024;
const DOWNLOAD_TIMEOUT_MS = 15_000;
/** 注入 prompt 的正文上限（字符）。 */
export const FILE_TEXT_MAX_CHARS = 6000;

/** 文本类扩展名（小写，含点）。 */
const TEXT_EXTENSIONS = new Set([
  ".txt", ".md", ".markdown", ".json", ".csv", ".tsv", ".log", ".yml", ".yaml",
  ".xml", ".html", ".htm", ".ini", ".conf", ".toml", ".env", ".srt", ".vtt",
  ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".py", ".rb", ".go", ".rs",
  ".java", ".kt", ".c", ".h", ".cpp", ".hpp", ".cs", ".php", ".swift", ".sql",
  ".sh", ".bat", ".ps1", ".psm1", ".lua", ".r", ".pl", ".css", ".scss",
]);

function extensionOf(name: string): string {
  const idx = name.lastIndexOf(".");
  return idx >= 0 ? name.slice(idx).toLowerCase() : "";
}

/** 是否值得读取内容的文本类文件：扩展名命中，或 content_type 以 text/ 或 JSON 开头。 */
export function isIngestibleTextFile(fileName: string, contentType: string | undefined): boolean {
  if (TEXT_EXTENSIONS.has(extensionOf(fileName))) return true;
  const ct = (contentType ?? "").toLowerCase();
  return ct.startsWith("text/") || ct.includes("json") || ct.includes("xml");
}

/**
 * 下载文本文件并截取正文预览；任何一步失败返回 null（调用方回退为仅列文件名）。
 * 返回值保证非空字符串（空文件返回说明文字）。
 */
export async function fetchFileTextPreview(
  rawUrl: string,
  logger: Pick<Console, "warn">,
): Promise<string | null> {
  const url = rawUrl.startsWith("//") ? `https:${rawUrl}` : rawUrl;
  if (!url.startsWith("https://")) {
    logger.warn(`[dsh-qqbot] 文件内容识别跳过非 https 地址: ${url.slice(0, 80)}`);
    return null;
  }
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const declared = Number(res.headers.get("content-length") ?? 0);
    if (Number.isFinite(declared) && declared > DOWNLOAD_MAX_BYTES) {
      logger.warn(`[dsh-qqbot] 文件内容识别跳过超限文件（${Math.round(declared / 1024)}KB > 1MB）`);
      return null;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.byteLength > DOWNLOAD_MAX_BYTES) {
      logger.warn(`[dsh-qqbot] 文件内容识别跳过超限文件（实际 ${Math.round(buffer.byteLength / 1024)}KB > 1MB）`);
      return null;
    }
    // 嗅探二进制：含 NUL 字节即视为二进制，不注入。
    if (buffer.includes(0)) return null;
    const text = buffer.toString("utf8");
    if (!text.trim()) return "（文件内容为空）";
    if (text.length > FILE_TEXT_MAX_CHARS) {
      return `${text.slice(0, FILE_TEXT_MAX_CHARS)}…\n（内容过长已截断：共约 ${text.length} 字符）`;
    }
    return text;
  } catch (error) {
    logger.warn(`[dsh-qqbot] 文件内容识别失败: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}
