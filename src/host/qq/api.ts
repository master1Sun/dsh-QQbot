/**
 * QQ OpenAPI 客户端：access_token 获取（带缓存）+ 单聊/群聊消息发送。
 *
 * - token：POST tokenUrl，JSON { appId, clientSecret } → { access_token, expires_in }。
 * - 发送：POST {apiBase}/v2/users/{openid}/messages 或 /v2/groups/{openid}/messages。
 *   Authorization 头使用 QQ 机器人 OpenAPI v2 约定的 `QQBot <access_token>`（注意是 QQBot，不是 QQ）。
 * - 被动回复携带 msg_id + msg_seq（群 5 分钟窗口内 5 次 / 单聊 60 分钟 4 次）；
 *   主动消息省略 msg_id（需开启「机器人主动在群聊内发言」）。
 * - sendReply：优先 Markdown（msg_type=2），单条被平台拒绝（40034090 等）时
 *   该分片回退纯文本（msg_type=0），避免无 Markdown 权限的机器人回复失败。
 * - 原生引用：被动回复可携带 message_reference（v2 接口透传字段，官方文档未列出但被接受），
 *   QQ 客户端据此把回复渲染为可点击定位的原生引用气泡；平台拒绝时自动去掉该字段重发，
 *   并熔断（本次运行不再尝试），后续回复回退为普通被动回复。
 */
import type { ReplyTarget } from "../../shared/types.js";
import { QQBot, type MediaFileType } from "@tencent-connect/qqbot-nodejs";

export interface QqApiClientOptions {
  /** 每次发消息时读取当前凭据（支持扫码后热更新）。 */
  getCredentials: () => { appId: string; appSecret: string };
  getApiBase: () => string;
  getTokenUrl: () => string;
  logger: Pick<Console, "info" | "warn" | "error">;
  /** 延迟取底层 SDK 实例（ws 连接建立后才可用，用于媒体/撤回）。 */
  getSdk?: () => QQBot | null;
}

/** QQ 官方被动回复次数上限。 */
export const PASSIVE_REPLY_LIMIT: Record<ReplyTarget["scope"], number> = Object.freeze({
  c2c: 4,
  group: 5,
});

/** 平台明确拒绝 markdown 消息的错误码（回退纯文本；其余错误视为结果不确定，不重试）。 */
const MARKDOWN_REJECTION_CODES = new Set([40_034_090, 400_340_90, 304_003, 304_024, 304_042, 500]);

interface QqApiErrorShape {
  code?: unknown;
  message?: unknown;
}

export class QqApiClient {
  readonly #options: QqApiClientOptions;
  #token = "";
  #tokenExpiresAt = 0;
  #tokenPromise: Promise<string> | null = null;
  /** 原生引用（message_reference）可用性熔断：平台拒绝一次后本次运行内不再尝试。 */
  #nativeQuoteEnabled = true;

  constructor(options: QqApiClientOptions) {
    this.#options = options;
  }

  /** 平台是否仍接受原生引用（熔断后为 false，调用方可回退文本引用）。 */
  get nativeQuoteAvailable(): boolean {
    return this.#nativeQuoteEnabled;
  }

  /** 扫码/配置更新后重置 token 缓存。 */
  resetAuthCache(): void {
    this.#token = "";
    this.#tokenExpiresAt = 0;
    this.#tokenPromise = null;
  }

  /** 延迟取底层 SDK 实例（ws 连接建立后才可用）。 */
  get #sdk(): QQBot | null {
    return this.#options.getSdk?.() ?? null;
  }

  /** 把本插件的 ReplyTarget 转成 SDK 的 ReplyTarget（字段名差异）。 */
  #sdkTarget(target: ReplyTarget, msgId?: string): { scope: "c2c" | "group"; targetId: string; msgId?: string } {
    return { scope: target.scope, targetId: target.openid, ...(msgId ? { msgId } : {}) };
  }

  async #accessToken(): Promise<string> {
    const now = Date.now();
    if (this.#token && now < this.#tokenExpiresAt) return this.#token;
    if (!this.#tokenPromise) {
      this.#tokenPromise = this.#fetchToken().finally(() => {
        this.#tokenPromise = null;
      });
    }
    return this.#tokenPromise;
  }

  async #fetchToken(): Promise<string> {
    const { appId, appSecret } = this.#options.getCredentials();
    if (!appId || !appSecret) throw new Error("QQ 凭据未配置：请先扫码登录或在设置中填写 AppID/AppSecret");
    const res = await fetch(this.#options.getTokenUrl(), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ appId, clientSecret: appSecret }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`QQ token 请求失败: HTTP ${res.status} ${text.slice(0, 200)}`);
    }
    const body = (await res.json()) as { access_token?: unknown; expires_in?: unknown };
    if (typeof body.access_token !== "string" || !body.access_token) {
      throw new Error(`QQ token 响应缺少 access_token: ${JSON.stringify(body).slice(0, 200)}`);
    }
    const ttl = Number(body.expires_in);
    this.#token = body.access_token;
    this.#tokenExpiresAt = Date.now() + (Number.isFinite(ttl) && ttl > 120 ? (ttl - 60) * 1000 : 5 * 60 * 1000);
    return this.#token;
  }

  /** 发送一条消息（底层）。msgType 0=文本 2=Markdown。返回平台生成的消息 id（撤回用）。 */
  async #send(
    target: ReplyTarget,
    payload: Record<string, unknown>,
  ): Promise<string | undefined> {
    const token = await this.#accessToken();
    const scopePath = target.scope === "group" ? "groups" : "users";
    const res = await fetch(
      `${this.#options.getApiBase()}/v2/${scopePath}/${encodeURIComponent(target.openid)}/messages`,
      {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `QQBot ${token}` },
        body: JSON.stringify(payload),
      },
    );
    if (!res.ok && res.status !== 204) {
      const text = await res.text().catch(() => "");
      const err = new Error(`QQ 发送失败: HTTP ${res.status} ${text.slice(0, 300)}`);
      try {
        const parsed = JSON.parse(text) as QqApiErrorShape;
        (err as Error & { code?: number }).code = Number(parsed?.code);
      } catch { /* 保留 HTTP 状态即可 */ }
      throw err;
    }
    // 成功响应体是创建的消息对象（含 id）；204 或解析失败时无 id。
    try {
      const body = (await res.json()) as { id?: unknown } | null;
      return typeof body?.id === "string" && body.id ? body.id : undefined;
    } catch {
      return undefined;
    }
  }

  /** 发送一条文本消息。msgId 省略则为主动消息；msgSeq 被动回复序号从 1 开始；quoteMsgId 传原生引用。 */
  async sendText(
    target: ReplyTarget,
    content: string,
    { msgId, msgSeq, quoteMsgId }: { msgId?: string; msgSeq?: number; quoteMsgId?: string } = {},
  ): Promise<string | undefined> {
    const text = content.trim();
    if (!text || !target.openid) return undefined;
    const payload: Record<string, unknown> = { content: text, msg_type: 0 };
    if (msgId) {
      payload.msg_id = msgId;
      payload.msg_seq = msgSeq ?? 1;
    }
    if (quoteMsgId) payload.message_reference = { message_id: quoteMsgId };
    return await this.#send(target, payload);
  }

  /** 发送一条 Markdown 消息（需机器人有 markdown 权限）。 */
  async sendMarkdown(
    target: ReplyTarget,
    content: string,
    { msgId, msgSeq, quoteMsgId }: { msgId?: string; msgSeq?: number; quoteMsgId?: string } = {},
  ): Promise<string | undefined> {
    const text = content.trim();
    if (!text || !target.openid) return undefined;
    const payload: Record<string, unknown> = { markdown: { content: text }, msg_type: 2 };
    if (msgId) {
      payload.msg_id = msgId;
      payload.msg_seq = msgSeq ?? 1;
    }
    if (quoteMsgId) payload.message_reference = { message_id: quoteMsgId };
    return await this.#send(target, payload);
  }

  /**
   * 回复一条消息：按配置尝试 Markdown，单条被平台拒绝时回退纯文本。
   * 其他错误（网络/限流/凭据）视为结果不确定，直接抛出由上层处理。
   * quoteMsgId 存在时携带原生引用（message_reference）；平台拒绝引用则去掉重发并熔断。
   */
  async sendReply(
    target: ReplyTarget,
    content: string,
    {
      msgId,
      msgSeq,
      markdown,
      quoteMsgId,
    }: { msgId?: string; msgSeq?: number; markdown: boolean; quoteMsgId?: string },
  ): Promise<{ mode: "markdown" | "text"; id?: string; nativeQuote: boolean }> {
    const text = content.trim();
    if (!text) return { mode: "text", nativeQuote: false };
    const useRef = Boolean(quoteMsgId) && this.#nativeQuoteEnabled;
    const quote = useRef ? quoteMsgId : undefined;
    if (markdown) {
      try {
        const id = await this.sendMarkdown(target, text, { msgId, msgSeq, quoteMsgId: quote });
        return { mode: "markdown", id, nativeQuote: Boolean(quote) };
      } catch (error) {
        const code = (error as Error & { code?: number }).code;
        if (!MARKDOWN_REJECTION_CODES.has(Number(code)) && code !== undefined) {
          // 带 message_reference 被平台拒绝且非 Markdown 原因 → 去掉引用重试一次并熔断。
          if (quote && code !== undefined) {
            this.#disableNativeQuote(error);
            const id = await this.sendMarkdown(target, text, { msgId, msgSeq });
            return { mode: "markdown", id, nativeQuote: false };
          }
          throw error;
        }
        this.#options.logger.warn?.(
          `[dsh-qqbot] Markdown 回复被平台拒绝（code=${String(code)}），本条回退纯文本`,
        );
      }
    }
    if (quote) {
      try {
        const id = await this.sendText(target, text, { msgId, msgSeq, quoteMsgId: quote });
        return { mode: "text", id, nativeQuote: true };
      } catch (error) {
        const code = (error as Error & { code?: number }).code;
        if (code === undefined) throw error;
        this.#disableNativeQuote(error);
      }
    }
    const id = await this.sendText(target, text, { msgId, msgSeq });
    return { mode: "text", id, nativeQuote: false };
  }

  /** 原生引用被平台拒绝：熔断 + 记日志（本次运行内不再尝试 message_reference）。 */
  #disableNativeQuote(error: unknown): void {
    this.#nativeQuoteEnabled = false;
    this.#options.logger.warn?.(
      `[dsh-qqbot] 平台拒绝原生引用（message_reference），已降级并熔断:`,
      error instanceof Error ? error.message : error,
    );
  }

  /** 撤回一条消息（机器人自己发的，或有权撤回的群消息）。 */
  async recall(target: ReplyTarget, messageId: string): Promise<void> {
    if (!this.#sdk) throw new Error("QQ SDK 未就绪（机器人未连接），无法撤回");
    await this.#sdk.recallMessage(this.#sdkTarget(target), messageId);
  }

  /**
   * 发送一张图片（URL / 本地路径 / 内存 buffer）。
   * 走 SDK 的媒体上传（含大文件分块 + COS），msgId 存在则作为被动回复。
   */
  async sendImage(
    target: ReplyTarget,
    source: { url?: string; buffer?: Buffer; localPath?: string },
    { msgId, content }: { msgId?: string; content?: string } = {},
  ): Promise<void> {
    if (!this.#sdk) throw new Error("QQ SDK 未就绪（机器人未连接），无法发送图片");
    const { message } = await this.#sdk.sendImage(this.#sdkTarget(target, msgId), source, { content });
    if (!message) throw new Error("QQ 图片发送未返回消息（可能配额/权限受限）");
  }

  /** 发送一个文件（含图片以外的任意富媒体）。 */
  async sendFile(
    target: ReplyTarget,
    source: { url?: string; buffer?: Buffer; localPath?: string },
    { msgId, fileName, content }: { msgId?: string; fileName?: string; content?: string } = {},
  ): Promise<void> {
    if (!this.#sdk) throw new Error("QQ SDK 未就绪（机器人未连接），无法发送文件");
    const { message } = await this.#sdk.sendFile(this.#sdkTarget(target, msgId), source, { fileName, content });
    if (!message) throw new Error("QQ 文件发送未返回消息（可能配额/权限受限）");
  }

  /** 发送一条语音消息。 */
  async sendVoice(
    target: ReplyTarget,
    source: { url?: string; buffer?: Buffer; localPath?: string },
    { msgId }: { msgId?: string } = {},
  ): Promise<void> {
    if (!this.#sdk) throw new Error("QQ SDK 未就绪（机器人未连接），无法发送语音");
    const { message } = await this.#sdk.sendVoice(this.#sdkTarget(target, msgId), source);
    if (!message) throw new Error("QQ 语音发送未返回消息（可能配额/权限受限）");
  }

  /** 按媒体类型发送（image/video/voice/file），由调用方指定 fileType。 */
  async sendMedia(
    target: ReplyTarget,
    fileType: MediaFileType,
    source: { url?: string; buffer?: Buffer; localPath?: string },
    { msgId, content, fileName }: { msgId?: string; content?: string; fileName?: string } = {},
  ): Promise<void> {
    if (!this.#sdk) throw new Error("QQ SDK 未就绪（机器人未连接），无法发送媒体");
    const { message } = await this.#sdk.sendMedia({ target: this.#sdkTarget(target, msgId), fileType, ...source, content, fileName });
    if (!message) throw new Error("QQ 媒体发送未返回消息（可能配额/权限受限）");
  }
}
