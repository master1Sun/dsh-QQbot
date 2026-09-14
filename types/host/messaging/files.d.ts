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
/** 注入 prompt 的正文上限（字符）。 */
export declare const FILE_TEXT_MAX_CHARS = 6000;
/** 是否值得读取内容的文本类文件：扩展名命中，或 content_type 以 text/ 或 JSON 开头。 */
export declare function isIngestibleTextFile(fileName: string, contentType: string | undefined): boolean;
/**
 * 下载文本文件并截取正文预览；任何一步失败返回 null（调用方回退为仅列文件名）。
 * 返回值保证非空字符串（空文件返回说明文字）。
 */
export declare function fetchFileTextPreview(rawUrl: string, logger: Pick<Console, "warn">): Promise<string | null>;
