/**
 * 归档媒体落地（图片 / 视频 / 文件的本地副本）。
 *
 * 背景：QQ 平台下发的附件地址是带签名的临时链接（数分钟即失效），直接存进
 * 归档 JSONL 的话，事后回看只能看到「曾经有张图」，看不到图本身。因此
 * 收到媒体时把它下载一份到本地，按类型分目录：
 *
 *   ~/.dsh/qqbot/archive/images/<hash>.<ext>
 *   ~/.dsh/qqbot/archive/videos/<hash>.<ext>
 *   ~/.dsh/qqbot/archive/files/<hash>.<ext>
 *
 * 是否落地由配置 archiveMedia 决定（off / image / imageVideo / all）：
 * 默认 off —— 不保存任何媒体文件，避免无意占满磁盘。
 *
 * 设计要点：
 *  - 按 URL 哈希命名：同一份媒体重复到达不会重复落盘（幂等）；
 *  - 落地失败（网络/超限）不抛错，只是不产生 media 记录——归档是审计轨迹，
 *    绝不能因为一个附件下载失败而丢整条消息；
 *  - 单个体积上限：图片 8MB、视频 64MB、文件 32MB；超时 15s/30s；
 *  - 语音不落地（只留文件名与类型，见 note），语音内容无回看价值且体积大。
 */
import { createHash } from "node:crypto";
import { mkdir, readFile, stat, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pluginDataDir } from "./store-file.js";

/** 归档媒体保存级别。 */
export type ArchiveMediaMode = "off" | "image" | "imageVideo" | "all";

/** 媒体类别。 */
export type ArchiveMediaKind = "image" | "video" | "file";

/**
 * 归档媒体体积上限（MB）。仅 bots.json 可配（设置页不展示）：
 * 修改 bots.json 里的 archiveMediaMaxImageMB / archiveMediaMaxVideoMB /
 * archiveMediaMaxFileMB 后重启生效。
 * 键名与 QqbotConfig 对应字段一致，bot.config 可直接作为 limits 传入。
 */
export interface ArchiveMediaLimits {
  archiveMediaMaxImageMB?: number;
  archiveMediaMaxVideoMB?: number;
  archiveMediaMaxFileMB?: number;
}

/** 默认体积上限：图 8MB / 视频 64MB / 文件 32MB。 */
export const DEFAULT_MEDIA_LIMITS: Required<ArchiveMediaLimits> = {
  archiveMediaMaxImageMB: 8,
  archiveMediaMaxVideoMB: 64,
  archiveMediaMaxFileMB: 32,
};

/** 类别对应的体积上限（字节）；limits 缺省或非法时回退默认值。 */
export function maxBytesFor(kind: ArchiveMediaKind, limits?: Partial<ArchiveMediaLimits>): number {
  const n = Number(
    kind === "image" ? limits?.archiveMediaMaxImageMB
      : kind === "video" ? limits?.archiveMediaMaxVideoMB
        : limits?.archiveMediaMaxFileMB,
  );
  const def = DEFAULT_MEDIA_LIMITS[kind === "image" ? "archiveMediaMaxImageMB" : kind === "video" ? "archiveMediaMaxVideoMB" : "archiveMediaMaxFileMB"];
  const mb = Number.isSafeInteger(n) && n >= 1 ? Math.min(n, 2048) : def;
  return mb * 1024 * 1024;
}

/** 各类媒体的下载超时（毫秒）。 */
const TIMEOUT_MS: Record<ArchiveMediaKind, number> = {
  image: 15_000,
  video: 60_000,
  file: 30_000,
};

/** 归档里记录的一份媒体。 */
export interface ArchivedMedia {
  /** 媒体类别（image / video / file）。 */
  kind: ArchiveMediaKind;
  /** 本地文件名（对应类别目录内），用于回查与删除。 */
  file: string;
  /** 展示名（原始文件名或推导名）。 */
  name: string;
  /** MIME 类型。 */
  mime: string;
  /** 字节数。 */
  size: number;
  /** 平台原始地址（可能已失效，仅作追溯）。 */
  url?: string;
}

/** 类别 → 目录名。 */
const KIND_DIR: Record<ArchiveMediaKind, string> = {
  image: "images",
  video: "videos",
  file: "files",
};

/** 扩展名 → MIME（覆盖常见图片/视频类型）。 */
const MIME_BY_EXT: Record<string, string> = {
  // 图片
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  bmp: "image/bmp",
  svg: "image/svg+xml",
  heic: "image/heic",
  heif: "image/heif",
  avif: "image/avif",
  ico: "image/x-icon",
  tif: "image/tiff",
  tiff: "image/tiff",
  // 视频
  mp4: "video/mp4",
  mov: "video/quicktime",
  avi: "video/x-msvideo",
  mkv: "video/x-matroska",
  webm: "video/webm",
  flv: "video/x-flv",
  m4v: "video/x-m4v",
  wmv: "video/x-ms-wmv",
  "3gp": "video/3gpp",
  // 文件
  pdf: "application/pdf",
  txt: "text/plain",
  md: "text/markdown",
  json: "application/json",
  csv: "text/csv",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  zip: "application/zip",
  rar: "application/vnd.rar",
  "7z": "application/x-7z-compressed",
  log: "text/plain",
  amr: "audio/amr",
  silk: "audio/silk",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  m4a: "audio/mp4",
  ogg: "audio/ogg",
};

/** 从文件名/URL 推导扩展名（小写，不含点）。 */
export function extOf(name: string): string {
  const m = /\.([A-Za-z0-9]{1,8})(?:\?|#|$)/.exec(name);
  return m ? m[1].toLowerCase() : "";
}

/** 图片 / 视频 / 音频的判定扩展名集合。 */
const IMAGE_EXTS = new Set(["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg", "heic", "heif", "avif", "ico", "tif", "tiff"]);
const VIDEO_EXTS = new Set(["mp4", "mov", "avi", "mkv", "webm", "flv", "m4v", "wmv", "3gp"]);
const AUDIO_EXTS = new Set(["amr", "silk", "mp3", "wav", "m4a", "ogg"]);

/**
 * 判定一个附件的类别。
 *
 * 语音（audio 前缀 MIME 或 .amr/.silk 等）一律归为「不落地」：返回 null。
 * 判定次序：明确的 MIME（audio/image/video 打头的斜杠型）→ 扩展名 → 裸词 MIME
 * （如 QQ 下发的 "video"，不带斜杠）→ 其余按 file。扩展名优先于泛型
 * content_type（如 octet-stream），否则 QQ 群视频会被误判成普通文件。
 */
export function mediaKindOf(contentType: string | undefined, name: string | undefined): ArchiveMediaKind | null {
  const ct = (contentType ?? "").toLowerCase();
  if (ct.startsWith("audio/") || ct === "voice" || ct === "audio") return null;
  if (ct.startsWith("image/")) return "image";
  if (ct.startsWith("video/")) return "video";
  const ext = extOf(name ?? "");
  if (ext) {
    if (IMAGE_EXTS.has(ext)) return "image";
    if (VIDEO_EXTS.has(ext)) return "video";
    if (AUDIO_EXTS.has(ext)) return null;
  }
  if (ct.startsWith("image")) return "image";
  if (ct.startsWith("video")) return "video";
  return "file";
}

/** 该保存级别下是否保存指定类别的媒体。 */
export function mediaModeAllows(mode: ArchiveMediaMode, kind: ArchiveMediaKind): boolean {
  if (mode === "off") return false;
  if (mode === "image") return kind === "image";
  if (mode === "imageVideo") return kind === "image" || kind === "video";
  return true;
}

/** 由 content_type / 文件名推导 MIME。 */
function mimeOf(contentType: string | undefined, name: string | undefined, kind: ArchiveMediaKind): string {
  const ct = (contentType ?? "").toLowerCase();
  if (ct.includes("/")) return ct;
  const ext = extOf(name ?? "");
  const byExt = MIME_BY_EXT[ext];
  if (byExt) return byExt;
  if (kind === "image") return "image/png";
  if (kind === "video") return "video/mp4";
  return "application/octet-stream";
}

/** 平台偶尔下发 `//host/path` 形式，补成 https。 */
function normalizeUrl(url: string): string {
  return url.startsWith("//") ? `https:${url}` : url;
}

/** 本地文件名的合法形态：16 位十六进制哈希 + 扩展名。 */
const MEDIA_FILE_RE = /^[a-f0-9]{16}\.[a-z0-9]{1,8}$/;

/** 类别目录（~/.dsh/qqbot/archive/<images|videos|files>）。 */
function kindDir(kind: ArchiveMediaKind): string {
  return join(pluginDataDir(), "archive", KIND_DIR[kind]);
}

/** URL → 稳定的本地文件名（哈希前 16 位 + 扩展名）。 */
function mediaFileName(url: string, mime: string, kind: ArchiveMediaKind): string {
  const hash = createHash("sha1").update(url).digest("hex").slice(0, 16);
  const ext = extOf(url) || Object.keys(MIME_BY_EXT).find((k) => MIME_BY_EXT[k] === mime) || (kind === "image" ? "img" : kind === "video" ? "mp4" : "bin");
  return `${hash}.${ext.replace(/[^a-z0-9]/g, "")}`;
}

/** 缓冲区 → 媒体描述；超限或为空返回 null。 */
async function writeMedia(
  buffer: Buffer,
  key: string | Buffer,
  kind: ArchiveMediaKind,
  mime: string,
  name: string,
  url?: string,
  maxBytes?: number,
): Promise<ArchivedMedia | null> {
  const limit = maxBytes ?? maxBytesFor(kind);
  if (buffer.byteLength === 0) return null;
  if (buffer.byteLength > limit) return null;
  const hash = createHash("sha1").update(key).digest("hex").slice(0, 16);
  const ext = extOf(name) || extOf(url ?? "") || Object.keys(MIME_BY_EXT).find((k) => MIME_BY_EXT[k] === mime) || "bin";
  const file = `${hash}.${ext.replace(/[^a-z0-9]/g, "")}`;
  const path = join(kindDir(kind), file);
  try {
    await mkdir(kindDir(kind), { recursive: true });
    await writeFile(path, buffer);
  } catch {
    return null;
  }
  return { kind, file, name: name || file, mime, size: buffer.byteLength, ...(url ? { url } : {}) };
}

/**
 * 把一份远程媒体落地到本地，返回 media 描述（已存在则直接复用）。
 * 任何失败都返回 null（调用方据此跳过 media 记录，不影响归档主流程）。
 */
export async function saveArchivedMedia(
  rawUrl: string,
  opts: {
    kind: ArchiveMediaKind;
    name?: string;
    contentType?: string;
    logger?: Pick<Console, "warn">;
    /** 下载/落地失败原因回调（诊断用，成功时不回调）。 */
    onError?: (reason: string) => void;
    /** 单个体积上限（字节）；缺省用默认上限（可由 bots.json 配置覆盖）。 */
    maxBytes?: number;
  },
): Promise<ArchivedMedia | null> {
  const url = normalizeUrl(rawUrl);
  if (!url.startsWith("https://")) {
    opts.onError?.(`非 https 地址（${url.slice(0, 60)}）`);
    return null;
  }
  const mime = mimeOf(opts.contentType, opts.name ?? url, opts.kind);
  const file = mediaFileName(url, mime, opts.kind);
  const path = join(kindDir(opts.kind), file);
  const maxBytes = opts.maxBytes ?? maxBytesFor(opts.kind);

  // 已落地过（同一 URL 再次到达）：直接复用，不再下载。
  try {
    const info = await stat(path);
    if (info.isFile() && info.size > 0) {
      return { kind: opts.kind, file, name: opts.name || file, mime, size: info.size, url };
    }
  } catch {
    // 不存在：继续下载。
  }

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS[opts.kind]) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const declared = Number(res.headers.get("content-length") ?? 0);
    if (Number.isFinite(declared) && declared > maxBytes) {
      throw new Error(`体积超限 ${Math.round(declared / 1024)}KB`);
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    const saved = await writeMedia(buffer, url, opts.kind, mime, opts.name ?? "", url, maxBytes);
    if (!saved) throw new Error("落地失败（体积超限或写入失败）");
    return saved;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    opts.logger?.warn(
      `[dsh-qqbot] 归档${KIND_DIR[opts.kind]}落地失败（已跳过该附件，不影响消息归档）: ${reason}`,
    );
    opts.onError?.(reason);
    return null;
  }
}

/**
 * 把本机文件作为归档媒体落地（AI 用本地路径发图/发文件时用）。
 * 非目标类别或超限返回 null。
 */
export async function saveArchivedLocalMedia(
  localPath: string,
  opts: {
    kind: ArchiveMediaKind;
    name?: string;
    contentType?: string;
    logger?: Pick<Console, "warn">;
    /** 单个体积上限（字节）；缺省用默认上限（可由 bots.json 配置覆盖）。 */
    maxBytes?: number;
  },
): Promise<ArchivedMedia | null> {
  try {
    const buffer = await readFile(localPath);
    const mime = mimeOf(opts.contentType, opts.name ?? localPath, opts.kind);
    return await writeMedia(
      buffer,
      buffer,
      opts.kind,
      mime,
      opts.name ?? localPath.split(/[\\/]/).pop() ?? "",
      undefined,
      opts.maxBytes,
    );
  } catch (error) {
    opts.logger?.warn(
      `[dsh-qqbot] 归档${KIND_DIR[opts.kind]}落地失败（本地文件）: ${error instanceof Error ? error.message : String(error)}`,
    );
    return null;
  }
}

/** 附件被跳过的原因（写入归档记录 mediaSkipped，便于事后诊断）。 */
export interface SkippedAttachment {
  name: string;
  reason: string;
}

/**
 * 收集入站消息里的媒体附件 → 本地落地副本列表。
 *
 * 只处理当前保存级别允许的类别；语音永远不落地。
 * 单个失败只影响这一个，不影响其余附件与整条消息的归档。
 * 返回成功列表与被跳过附件的原因列表（诊断用）。
 */
export async function collectArchivedMedia(
  attachments: Array<{ content_type?: string; url?: string; filename?: string }> | undefined,
  mode: ArchiveMediaMode,
  logger?: Pick<Console, "warn">,
  limits?: Partial<ArchiveMediaLimits>,
): Promise<{ saved: ArchivedMedia[]; skipped: SkippedAttachment[] }> {
  const saved: ArchivedMedia[] = [];
  const skipped: SkippedAttachment[] = [];
  if (mode === "off") return { saved, skipped };
  for (const a of attachments ?? []) {
    const name = a?.filename || a?.content_type || "(未命名附件)";
    if (!a?.url) {
      skipped.push({ name, reason: "平台未提供下载地址" });
      continue;
    }
    const kind = mediaKindOf(a.content_type, a.filename ?? a.url);
    if (!kind) {
      skipped.push({ name, reason: "语音不保存" });
      continue;
    }
    if (!mediaModeAllows(mode, kind)) {
      skipped.push({ name, reason: "保存级别未包含该类型" });
      continue;
    }
    const failure = { reason: "" };
    const savedOne = await saveArchivedMedia(a.url, {
      kind,
      name: a.filename,
      contentType: a.content_type,
      logger,
      onError: (reason) => { failure.reason = reason; },
      maxBytes: maxBytesFor(kind, limits),
    });
    if (savedOne) saved.push(savedOne);
    else skipped.push({ name, reason: failure.reason || "下载失败" });
  }
  return { saved, skipped };
}

/**
 * 读取已落地的媒体，返回 base64 与 MIME。
 * 宿主通过 RPC 返回给前端渲染；文件不存在返回 null。
 */
export async function readArchivedMedia(
  kind: ArchiveMediaKind,
  file: string,
): Promise<{ mime: string; base64: string } | null> {
  // 文件名必须是纯哈希名，杜绝路径穿越（../../ 之类）。
  if (!MEDIA_FILE_RE.test(file)) return null;
  try {
    const buffer = await readFile(join(kindDir(kind), file));
    if (buffer.byteLength === 0) return null;
    const ext = extOf(file);
    return { mime: MIME_BY_EXT[ext] ?? "application/octet-stream", base64: buffer.toString("base64") };
  } catch {
    return null;
  }
}

/** 删除已落地的媒体（归档记录删除时顺带清理，避免残留占盘）。 */
export async function removeArchivedMedia(kind: ArchiveMediaKind, file: string): Promise<void> {
  if (!MEDIA_FILE_RE.test(file)) return;
  try {
    await unlink(join(kindDir(kind), file));
  } catch {
    // 文件不存在：忽略。
  }
}
