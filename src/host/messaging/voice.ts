/**
 * 语音转文字（STT）与文字转语音（TTS）——OpenAI 兼容实现（参考 oc-src）：
 *
 *  STT（voiceTranscription=stt）：
 *    下载语音（优先 voice_wav_url）→ SILK/AMR 用 SDK 协议层转 WAV
 *    （依赖 silk-wasm，非 SILK 直传格式跳过转码）→ POST {base}/audio/transcriptions
 *    → { text }。失败返回 null（调用方回退平台 asr_refer_text / 占位说明）。
 *
 *  TTS（ttsReply=true）：
 *    POST {base}/audio/speech { model, input, voice, response_format: "wav" }
 *    → 音频字节写盘 → 交 client.sendVoice 发送。WAV 是 QQ 原生直传格式，
 *    无需 SILK 转码；合成失败返回 null（回复泵回退文字）。
 *
 *  下载仅允许 https（QQ 媒体地址均为 https），限制大小与超时，防挂死。
 */
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { join, extname } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { pluginDataDir } from "../infra/store-file.js";
import { convertSilkToWav } from "@tencent-connect/qqbot-nodejs/protocol";

type Logger = Pick<Console, "warn">;

export interface SttConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

export interface TtsConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
  voice: string;
}

/** 语音附件最小形状（QqAttachment 的子集，便于测试）。 */
export interface VoiceAttachmentLike {
  content_type?: string;
  url?: string;
  filename?: string;
  voice_wav_url?: string;
}

const DOWNLOAD_MAX_BYTES = 30 * 1024 * 1024;
const DOWNLOAD_TIMEOUT_MS = 90_000;
/** TTS 单条输入上限：QQ 语音消息有平台时长限制，超长文本合并发送意义不大。 */
export const TTS_MAX_INPUT_CHARS = 400;

/** STT 配置是否可用（baseUrl + apiKey 齐备）。 */
export function sttReady(config: { sttBaseUrl?: string; sttApiKey?: string }): boolean {
  return Boolean(config.sttBaseUrl?.trim() && config.sttApiKey?.trim());
}

function mediaDir(): string {
  return join(pluginDataDir(), "media");
}

function normalizeUrl(url: string | undefined): string {
  if (!url) return "";
  return url.startsWith("//") ? `https:${url}` : url;
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_") || "audio";
}

function guessMime(fileName: string): string {
  const ext = extname(fileName).toLowerCase();
  const map: Record<string, string> = {
    ".wav": "audio/wav", ".mp3": "audio/mpeg", ".ogg": "audio/ogg", ".flac": "audio/flac",
    ".m4a": "audio/mp4", ".aac": "audio/aac", ".silk": "audio/silk", ".amr": "audio/amr",
    ".slk": "audio/silk", ".slac": "audio/silk", ".pcm": "audio/pcm",
  };
  return map[ext] ?? "application/octet-stream";
}

function isSilkLike(fileName: string): boolean {
  return [".silk", ".slk", ".slac", ".amr"].includes(extname(fileName).toLowerCase());
}

/** 下载音频到插件媒体目录，返回本地路径；失败返回 null。 */
async function downloadAudio(url: string, filename: string | undefined, logger: Logger): Promise<string | null> {
  if (!url.startsWith("https://")) {
    logger.warn(`[dsh-qqbot] 语音下载跳过非 https 地址: ${url.slice(0, 80)}`);
    return null;
  }
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS) });
    if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
    const len = Number(res.headers.get("content-length") ?? 0);
    if (len > DOWNLOAD_MAX_BYTES) throw new Error(`文件过大（${Math.round(len / 1024 / 1024)}MB）`);
    const dir = mediaDir();
    await mkdir(dir, { recursive: true });
    const hash = createHash("sha1").update(url).digest("hex").slice(0, 16);
    const name = `${hash}-${sanitizeFileName(filename ?? "voice")}`;
    const path = join(dir, name);
    // 流式写盘 + 截断保护：超过上限中止（content-length 缺失时兜底）。
    let total = 0;
    const chunks: Buffer[] = [];
    const reader = Readable.fromWeb(res.body as never);
    for await (const chunk of reader) {
      const buf = chunk as Buffer;
      total += buf.length;
      if (total > DOWNLOAD_MAX_BYTES) throw new Error("文件超过大小上限");
      chunks.push(buf);
    }
    await writeFile(path, Buffer.concat(chunks));
    return path;
  } catch (error) {
    logger.warn(`[dsh-qqbot] 语音下载失败: ${url.slice(0, 80)} — ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

/**
 * 语音附件 → 本地可转写音频路径（WAV 等）。SILK/AMR 先转 WAV；
 * voice_wav_url 优先（平台已转码，无需本地处理）。失败返回 null。
 */
async function prepareLocalAudio(att: VoiceAttachmentLike, logger: Logger): Promise<string | null> {
  const wavUrl = normalizeUrl(att.voice_wav_url);
  if (wavUrl) {
    const path = await downloadAudio(wavUrl, undefined, logger);
    if (path) return path;
  }
  const rawUrl = normalizeUrl(att.url);
  if (!rawUrl) return null;
  const path = await downloadAudio(rawUrl, att.filename, logger);
  if (!path) return null;
  if (isSilkLike(path)) {
    try {
      const wav = await convertSilkToWav(path);
      if (wav) return wav.wavPath;
    } catch (error) {
      // 典型原因：silk-wasm 未安装（SDK 动态加载失败）。
      logger.warn(`[dsh-qqbot] SILK→WAV 转码失败: ${error instanceof Error ? error.message : String(error)}`);
    }
    return null;
  }
  return path;
}

/**
 * 语音附件 → STT 转写文本。任何一步失败都返回 null（不抛错），
 * 由调用方回退平台 asr_refer_text / 占位说明。
 */
export async function transcribeVoiceAttachment(
  att: VoiceAttachmentLike,
  config: SttConfig,
  logger: Logger,
): Promise<string | null> {
  const localPath = await prepareLocalAudio(att, logger);
  if (!localPath) return null;
  try {
    const { readFile } = await import("node:fs/promises");
    const buffer = await readFile(localPath);
    const fileName = localPath.split(/[\\/]/).pop() ?? "audio.wav";
    const form = new FormData();
    form.append("file", new Blob([new Uint8Array(buffer)], { type: guessMime(fileName) }), fileName);
    form.append("model", config.model);
    const base = config.baseUrl.replace(/\/+$/, "");
    const res = await fetch(`${base}/audio/transcriptions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${config.apiKey}` },
      body: form,
      signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${detail.slice(0, 200)}`);
    }
    const body = (await res.json()) as { text?: unknown };
    const text = typeof body.text === "string" ? body.text.trim() : "";
    return text || null;
  } catch (error) {
    logger.warn(`[dsh-qqbot] STT 转写失败: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

/**
 * 文本 → TTS 合成 WAV 文件（OpenAI 兼容 /audio/speech，response_format=wav）。
 * 返回本地 WAV 路径；失败返回 null（回复泵回退文字发送）。
 */
export async function synthesizeSpeech(
  text: string,
  config: TtsConfig,
  logger: Logger,
): Promise<string | null> {
  const input = text.slice(0, TTS_MAX_INPUT_CHARS);
  try {
    const base = config.baseUrl.replace(/\/+$/, "");
    const res = await fetch(`${base}/audio/speech`, {
      method: "POST",
      headers: { "content-type": "application/json", Authorization: `Bearer ${config.apiKey}` },
      body: JSON.stringify({ model: config.model, input, voice: config.voice, response_format: "wav" }),
      signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS),
    });
    if (!res.ok || !res.body) {
      const detail = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${detail.slice(0, 200)}`);
    }
    const dir = mediaDir();
    await mkdir(dir, { recursive: true });
    const hash = createHash("sha1").update(`${config.model}:${config.voice}:${input}`).digest("hex").slice(0, 16);
    const path = join(dir, `tts-${hash}.wav`);
    await pipeline(Readable.fromWeb(res.body as never), createWriteStream(path));
    return path;
  } catch (error) {
    logger.warn(`[dsh-qqbot] TTS 合成失败: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}
