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
export declare const DEFAULT_MEDIA_LIMITS: Required<ArchiveMediaLimits>;
/** 类别对应的体积上限（字节）；limits 缺省或非法时回退默认值。 */
export declare function maxBytesFor(kind: ArchiveMediaKind, limits?: Partial<ArchiveMediaLimits>): number;
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
/** 从文件名/URL 推导扩展名（小写，不含点）。 */
export declare function extOf(name: string): string;
/**
 * 判定一个附件的类别。
 *
 * 语音（audio 前缀 MIME 或 .amr/.silk 等）一律归为「不落地」：返回 null。
 * 判定次序：明确的 MIME（audio/image/video 打头的斜杠型）→ 扩展名 → 裸词 MIME
 * （如 QQ 下发的 "video"，不带斜杠）→ 其余按 file。扩展名优先于泛型
 * content_type（如 octet-stream），否则 QQ 群视频会被误判成普通文件。
 */
export declare function mediaKindOf(contentType: string | undefined, name: string | undefined): ArchiveMediaKind | null;
/** 该保存级别下是否保存指定类别的媒体。 */
export declare function mediaModeAllows(mode: ArchiveMediaMode, kind: ArchiveMediaKind): boolean;
/**
 * 把一份远程媒体落地到本地，返回 media 描述（已存在则直接复用）。
 * 任何失败都返回 null（调用方据此跳过 media 记录，不影响归档主流程）。
 */
export declare function saveArchivedMedia(rawUrl: string, opts: {
    kind: ArchiveMediaKind;
    name?: string;
    contentType?: string;
    logger?: Pick<Console, "warn">;
    /** 下载/落地失败原因回调（诊断用，成功时不回调）。 */
    onError?: (reason: string) => void;
    /** 单个体积上限（字节）；缺省用默认上限（可由 bots.json 配置覆盖）。 */
    maxBytes?: number;
}): Promise<ArchivedMedia | null>;
/**
 * 把本机文件作为归档媒体落地（AI 用本地路径发图/发文件时用）。
 * 非目标类别或超限返回 null。
 */
export declare function saveArchivedLocalMedia(localPath: string, opts: {
    kind: ArchiveMediaKind;
    name?: string;
    contentType?: string;
    logger?: Pick<Console, "warn">;
    /** 单个体积上限（字节）；缺省用默认上限（可由 bots.json 配置覆盖）。 */
    maxBytes?: number;
}): Promise<ArchivedMedia | null>;
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
export declare function collectArchivedMedia(attachments: Array<{
    content_type?: string;
    url?: string;
    filename?: string;
}> | undefined, mode: ArchiveMediaMode, logger?: Pick<Console, "warn">, limits?: Partial<ArchiveMediaLimits>): Promise<{
    saved: ArchivedMedia[];
    skipped: SkippedAttachment[];
}>;
/**
 * 读取已落地的媒体，返回 base64 与 MIME。
 * 宿主通过 RPC 返回给前端渲染；文件不存在返回 null。
 */
export declare function readArchivedMedia(kind: ArchiveMediaKind, file: string): Promise<{
    mime: string;
    base64: string;
} | null>;
/** 删除已落地的媒体（归档记录删除时顺带清理，避免残留占盘）。 */
export declare function removeArchivedMedia(kind: ArchiveMediaKind, file: string): Promise<void>;
