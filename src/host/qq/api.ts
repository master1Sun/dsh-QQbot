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
 * - 原生引用卡片：quoteMsgId 携带时附 message_reference（可点击定位到用户原消息）。
 *   message_reference.message_id 必须用事件 message_scene.ext 里的 msg_idx（REFIDX_*），
 *   不能用原始 msg id——后者平台无法解析。实测组合矩阵（详见 sendReply 注释）：
 *   与 msg_id 同传时手机端同一条内容出现两次（电脑端正常）；仅 msg_id 两端都不显示引用；
 *   仅 message_reference（主动消息通道）是唯一「有引用且内容只出现一次」的组合。
 *   注意 message_reference 与 Markdown 在部分场景会被平台剥离 Markdown，此时本条转纯文本但引用卡片保留。
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

/**
 * 平台明确拒绝 markdown 消息的错误码（回退纯文本）。
 * 注意：只收录「确定未发送」的拒绝码。500（消息发送异常）是结果不确定的错误——
 * 平台可能已创建消息，自动回退重发会造成两条重复消息，因此不收录（抛给上层走投递出箱）。
 */
const MARKDOWN_REJECTION_CODES = new Set([40_034_090, 400_340_90, 304_003, 304_024, 304_042]);

/**
 * 生成一个随机 msg_seq（与 SDK getNextMsgSeq 同思路）：输入状态等辅助消息
 * 不应占用回复泵 1..5 的被动回复序号，用伪随机值避开冲突。
 */
function randomMsgSeq(): number {
  return ((Date.now() % 100_000_000) ^ Math.floor(Math.random() * 65536)) % 65536;
}

interface QqApiErrorShape {
  code?: unknown;
  message?: unknown;
}

/** 平台用户基本信息（GET /v2/users/{openid}/info）。 */
export interface QqUserInfo {
  username: string;
  avatar: string;
  allowProactiveMsg?: boolean;
}

/** 图文卡片（msg_type=8 card 字段）。标题 1-50 字，描述 1-200 字，链接须 https。 */
export interface QqMessageCard {
  type: "tuwen";
  content: {
    title: string;
    description: string;
    url: string;
    pic_url: string;
  };
}

/** 素材上传完成后的图片引用。 */
export interface QqMaterialImage {
  /** qqbot-media:// 引用（Markdown 里直接使用）。 */
  url: string;
  imageId: string;
}

/** 全局自定义菜单项（PUT /v2/menu）。 */
export interface QqMenuItem {
  name?: string;
  type?: "switch" | "send_message" | "link" | "menu";
  send_message?: string;
  link?: string;
  sub_menu_items?: Array<{
    name?: string;
    type?: "send_message" | "link";
    send_message?: string;
    link?: string;
  }>;
  switch?: { switch_id?: string; default?: boolean };
}

/** 群成员（GET /v2/groups/{openid}/members）。 */
export interface QqGroupMember {
  member_openid: string;
  username: string;
  member_role: string;
  bot?: boolean;
  joined_at?: string;
}

/** 群禁言中的成员（GET /v2/groups/{openid}/restrict_chat_setting）。 */
export interface QqMuteMemberState {
  member_openid: string;
  mute_expire_at: string;
  username?: string;
}

/** 入群申请（GET /v2/groups/{openid}/join_request_list）。 */
export interface QqJoinRequest {
  join_request_id: string;
  member_openid: string;
  username: string;
  apply_at: string;
  apply_source?: string;
  invited_by?: string;
  risk_tips?: string;
  verify_info?: {
    method?: string;
    verify_message?: string;
    review_qa_list?: Array<{ question?: string; answer?: string }>;
  };
  auto_approved?: { strategy_id?: string };
}

/** 入群自动审批策略（GET /v2/groups/join_approval_strategy）。 */
export interface QqJoinApprovalStrategy {
  strategy_id: string;
  is_enable?: string;
  expire_at?: string;
  remark?: string;
  group_openids?: string[];
}

/** 群基本信息（GET /v2/groups/{group_openid}/info）。 */
export interface QqGroupInfo {
  group_openid: string;
  group_name: string;
  group_finger_memo: string;
  group_class_text: string;
  group_tags: string[];
  group_member_num: number;
  union_group_openid?: string;
}

/**
 * 机器人在群内的状态（GET /v2/groups/{group_openid}/bot_state）。
 * member_role: member-普通成员 / admin-管理员 / owner-群主。
 */
export interface QqBotGroupState {
  member_openid: string;
  joined_at: string;
  allow_proactive_msg: boolean;
  recv_msg_setting: string;
  member_role: "member" | "admin" | "owner" | string;
}

/** 群黑名单成员（GET /v2/groups/{group_openid}/member_blacklist）。 */
export interface QqBlacklistUser {
  union_openid?: string;
  member_openid: string;
  username: string;
  banned_at: string;
  bot?: boolean;
}

export class QqApiClient {
  readonly #options: QqApiClientOptions;
  #token = "";
  #tokenExpiresAt = 0;
  #tokenPromise: Promise<string> | null = null;

  constructor(options: QqApiClientOptions) {
    this.#options = options;
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

  /** 通用平台 API 请求（GET/POST/PUT/DELETE，自动带 access_token）。返回解析后的 JSON（无响应体时返回 {}）。 */
  async #request(method: string, path: string, body?: unknown): Promise<Record<string, unknown>> {
    const token = await this.#accessToken();
    const res = await fetch(`${this.#options.getApiBase()}${path}`, {
      method,
      headers: { "content-type": "application/json", authorization: `QQBot ${token}` },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    const text = await res.text().catch(() => "");
    if (!res.ok && res.status !== 204) {
      const err = new Error(`QQ API ${method} ${path} 失败: HTTP ${res.status} ${text.slice(0, 300)}`);
      try {
        const parsed = JSON.parse(text) as QqApiErrorShape;
        (err as Error & { code?: number }).code = Number(parsed?.code);
      } catch { /* 保留 HTTP 状态即可 */ }
      throw err;
    }
    if (!text) return {};
    try {
      const parsed = JSON.parse(text) as unknown;
      return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
    } catch {
      return {};
    }
  }

  /**
   * 供 agent 白名单调用的低层请求：自动带 token，支持 query。
   * 路径由调用方校验白名单，本方法不拼接外部 host。
   */
  async request(
    method: string,
    path: string,
    body?: unknown,
    query?: Record<string, string | number | boolean>,
  ): Promise<Record<string, unknown>> {
    const parts = new URLSearchParams();
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value === undefined || value === null) continue;
        parts.set(key, String(value));
      }
    }
    const qs = parts.toString();
    return this.#request(method, qs ? `${path}?${qs}` : path, body);
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
    let id: string | undefined;
    try {
      const body = (await res.json()) as { id?: unknown } | null;
      id = typeof body?.id === "string" && body.id ? body.id : undefined;
    } catch {
      // 204 或响应体不是 JSON：无消息 id 可用。
    }
    // 诊断日志：逐次记录实际发出的 payload 关键字段（msg_id / message_reference / msg_seq），
    // 用于把「手机端两条重复内容」等平台端表现与实际 API 调用精确关联。
    const ref = payload.message_reference as { message_id?: unknown } | undefined;
    this.#options.logger.info(
      `[dsh-qqbot] QQ API HTTP ${res.status} msg_type=${String(payload.msg_type)}`
      + ` msg_id=${payload.msg_id ? String(payload.msg_id) : "-"} msg_seq=${payload.msg_seq ?? "-"}`
      + ` 引用=${ref ? String(ref.message_id ?? "") : "-"} 返回id=${id ?? "-"}`,
    );
    return id;
  }

  /** 发送一条文本消息。msgId 省略则为主动消息；msgSeq 被动回复序号从 1 开始。quoteMsgId 携带时附 message_reference 引用卡片。eventId 为事件被动回复（与 msgId 二选一）。 */
  async sendText(
    target: ReplyTarget,
    content: string,
    { msgId, msgSeq, quoteMsgId, eventId }: { msgId?: string; msgSeq?: number; quoteMsgId?: string; eventId?: string } = {},
  ): Promise<string | undefined> {
    const text = content.trim();
    if (!text || !target.openid) return undefined;
    const payload: Record<string, unknown> = { content: text, msg_type: 0 };
    if (msgId) {
      payload.msg_id = msgId;
      payload.msg_seq = msgSeq ?? 1;
    } else if (eventId) {
      payload.event_id = eventId;
    }
    if (quoteMsgId) payload.message_reference = { message_id: quoteMsgId };
    return await this.#send(target, payload);
  }

  /**
   * 发送「正在输入」状态（C2C 专用，msg_type=6 input_notify）。
   * 参考 @tencent-connect/qqbot-nodejs 的 sendInputNotify / oc-src typingIndicator：
   * input_second 为状态持续秒数（平台窗口约 60s，超过需由调用方周期性重发）。
   * msgId 携带时为被动输入状态；msg_seq 用伪随机值，不占用回复泵的被动回复序号。
   * 平台对群聊不支持输入状态：非 c2c 目标直接跳过。
   */
  async sendTyping(
    target: ReplyTarget,
    { msgId, seconds = 60 }: { msgId?: string; seconds?: number } = {},
  ): Promise<void> {
    if (target.scope !== "c2c" || !target.openid) return;
    const payload: Record<string, unknown> = {
      msg_type: 6,
      input_notify: { input_type: 1, input_second: Math.min(60, Math.max(1, Math.round(seconds))) },
      msg_seq: randomMsgSeq(),
    };
    if (msgId) payload.msg_id = msgId;
    await this.#send(target, payload);
  }

  /** 发送一条 Markdown 消息（需机器人有 markdown 权限）。quoteMsgId 携带时附 message_reference 引用卡片；
   *  keyboard 携带时附内嵌按钮（InlineKeyboard，点击触发 INTERACTION_CREATE 回调）。 */
  async sendMarkdown(
    target: ReplyTarget,
    content: string,
    {
      msgId, msgSeq, quoteMsgId, keyboard, forceVerifyImage, eventId,
    }: {
      msgId?: string; msgSeq?: number; quoteMsgId?: string; eventId?: string;
      keyboard?: { content: { rows: Array<{ buttons: Array<Record<string, unknown>> }> } };
      /** 开启后 Markdown 图片转存失败即中断发送（平台 force_verify_image_resource 参数）。 */
      forceVerifyImage?: boolean;
    } = {},
  ): Promise<string | undefined> {
    const text = content.trim();
    if (!text || !target.openid) return undefined;
    const payload: Record<string, unknown> = { markdown: { content: text }, msg_type: 2 };
    if (msgId) {
      payload.msg_id = msgId;
      payload.msg_seq = msgSeq ?? 1;
    } else if (eventId) {
      payload.event_id = eventId;
    }
    if (quoteMsgId) payload.message_reference = { message_id: quoteMsgId };
    if (keyboard) payload.keyboard = keyboard;
    if (forceVerifyImage) payload.force_verify_image_resource = true;
    return await this.#send(target, payload);
  }

  /**
   * 回调确认（INTERACTION_CREATE 必答）：平台要求收到按钮点击后在数秒内回 ACK，
   * 否则客户端按钮转圈超时。code=0 表示成功；data.prompt 作为按钮反馈文案展示。
   */
  async acknowledgeInteraction(interactionId: string, prompt?: string): Promise<void> {
    const sdk = this.#sdk;
    if (!sdk) throw new Error("QQ SDK 未就绪（机器人未连接），无法确认按钮回调");
    await sdk.acknowledgeInteraction(interactionId, 0, prompt ? { prompt } : undefined);
  }

  /**
   * 回复一条消息：按配置尝试 Markdown，单条被平台拒绝时回退纯文本（引用卡片保留）。
   * 其他错误（网络/限流/凭据）视为结果不确定，直接抛出由上层处理。
   *
   * ⚠️ 引用（quoteMsgId）与 msg_id 不可同传——实测组合矩阵：
   *   msg_id + message_reference → 引用显示，但手机端同一条内容出现两次（电脑端正常）；
   *   仅 msg_id                  → 两端都不显示引用；
   *   仅 message_reference       → 唯一「有引用且内容只出现一次」的组合（走主动消息通道，不传 msg_id）。
   * 调用方带 quoteMsgId 时应省略 msgId/msgSeq（由上层 reply.ts 保证）。
   */
  async sendReply(
    target: ReplyTarget,
    content: string,
    { msgId, msgSeq, markdown, quoteMsgId, forceVerifyImage }: { msgId?: string; msgSeq?: number; markdown: boolean; quoteMsgId?: string; forceVerifyImage?: boolean },
  ): Promise<{ mode: "markdown" | "text"; id?: string }> {
    const text = content.trim();
    if (!text) return { mode: "text" };
    if (markdown) {
      try {
        const id = await this.sendMarkdown(target, text, { msgId, msgSeq, quoteMsgId, forceVerifyImage });
        return { mode: "markdown", id };
      } catch (error) {
        const code = (error as Error & { code?: number }).code;
        if (!MARKDOWN_REJECTION_CODES.has(Number(code)) && code !== undefined) throw error;
        this.#options.logger.warn?.(
          `[dsh-qqbot] Markdown 回复被平台拒绝（code=${String(code)}），本条回退纯文本（引用卡片保留）`,
        );
      }
    }
    const id = await this.sendText(target, text, { msgId, msgSeq, quoteMsgId });
    return { mode: "text", id };
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

  // ── 用户信息（20261116：GET /v2/users/{openid}/info，10 QPS） ────────────────

  /** 用户信息内存缓存：openid → { 信息, 过期时刻 }。 */
  #userInfoCache = new Map<string, { info: QqUserInfo; expiresAt: number }>();
  static readonly #USER_INFO_TTL = 10 * 60 * 1000;

  /** 获取用户基本信息（昵称/头像/是否接收主动推送），带 10 分钟内存缓存。 */
  async getUserInfo(openid: string): Promise<QqUserInfo> {
    const key = String(openid || "").trim();
    if (!key) throw new Error("openid 不能为空");
    const cached = this.#userInfoCache.get(key);
    if (cached && Date.now() < cached.expiresAt) return cached.info;
    const data = await this.#request("GET", `/v2/users/${encodeURIComponent(key)}/info`);
    const info: QqUserInfo = {
      username: typeof data.username === "string" ? data.username : "",
      avatar: typeof data.avatar === "string" ? data.avatar : "",
      ...(typeof data.allow_proactive_msg === "boolean" ? { allowProactiveMsg: data.allow_proactive_msg } : {}),
    };
    this.#userInfoCache.set(key, { info, expiresAt: Date.now() + QqApiClient.#USER_INFO_TTL });
    return info;
  }

  /** 批量解析用户信息：成功返回映射，单个失败静默跳过（供归档头像等非关键场景）。 */
  async getUserInfoBatch(openids: string[]): Promise<Record<string, QqUserInfo>> {
    const out: Record<string, QqUserInfo> = {};
    const uniq = [...new Set(openids.map((o) => String(o || "").trim()).filter(Boolean))].slice(0, 30);
    const results = await Promise.allSettled(uniq.map((o) => this.getUserInfo(o)));
    uniq.forEach((o, i) => {
      const r = results[i];
      if (r.status === "fulfilled" && (r.value.username || r.value.avatar)) out[o] = r.value;
    });
    return out;
  }

  // ── 图文卡片消息（20261028：msg_type=8 card，群/单聊） ──────────────────────

  /**
   * 发送图文卡片消息（msg_type=8）。
   * 平台约束：标题 1-50 字、描述 1-200 字，url/pic_url 必须为 https 且 ≤1024 字。
   */
  async sendCard(
    target: ReplyTarget,
    card: { title: string; description: string; url: string; picUrl: string },
    { msgId, msgSeq, eventId }: { msgId?: string; msgSeq?: number; eventId?: string } = {},
  ): Promise<string | undefined> {
    const title = card.title.trim();
    const description = card.description.trim();
    const url = card.url.trim();
    const picUrl = card.picUrl.trim();
    if (!target.openid) return undefined;
    if (!title || !description || !url || !picUrl) throw new Error("图文卡片必须填写标题、描述、跳转链接与封面图 URL");
    if (title.length > 50) throw new Error("卡片标题过长（上限 50 字）");
    if (description.length > 200) throw new Error("卡片描述过长（上限 200 字）");
    if (!/^https:\/\//.test(url) || url.length > 1024) throw new Error("跳转链接必须以 https:// 开头且不超过 1024 字");
    if (!/^https:\/\//.test(picUrl) || picUrl.length > 1024) throw new Error("封面图必须以 https:// 开头且不超过 1024 字");
    const payload: Record<string, unknown> = {
      msg_type: 8,
      card: { type: "tuwen", content: { title, description, url, pic_url: picUrl } },
    };
    if (msgId) {
      payload.msg_id = msgId;
      payload.msg_seq = msgSeq ?? 1;
    } else if (eventId) {
      payload.event_id = eventId;
    }
    return await this.#send(target, payload);
  }

  // ── 素材管理（20261021：prepare → PUT 直传 → complete，得 qqbot-media:// 引用） ─

  /** 通过素材管理上传一张图片（url 或 buffer），返回 Markdown 可直接引用的 qqbot-media:// 地址。 */
  async uploadMaterialImage(
    source: { url?: string; buffer?: Buffer; fileName?: string },
  ): Promise<QqMaterialImage> {
    let buffer: Buffer;
    let fileName: string;
    if (source.buffer) {
      buffer = source.buffer;
      fileName = source.fileName || "image.png";
    } else if (source.url) {
      const res = await fetch(source.url);
      if (!res.ok) throw new Error(`下载图片失败: HTTP ${res.status}`);
      buffer = Buffer.from(await res.arrayBuffer());
      let fromUrl: RegExpExecArray | null = /\.(png|jpe?g|gif|webp)(?:[?#]|$)/i.exec(new URL(source.url).pathname || "");
      fileName = source.fileName || (fromUrl ? (fromUrl[1]!.toLowerCase() === "jpeg" ? "image.jpg" : `image.${fromUrl[1]!.toLowerCase()}`) : "image.png");
      fromUrl = null;
    } else {
      throw new Error("必须提供图片 url 或 buffer");
    }
    if (buffer.length > 10 * 1024 * 1024) throw new Error("图片超过 10MB（素材管理单张上限）");
    const ext = /\.([a-z0-9]+)$/i.exec(fileName)?.[1]?.toLowerCase() ?? "png";
    const contentType = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : ext === "gif" ? "image/gif" : ext === "webp" ? "image/webp" : "image/png";
    const { createHash } = await import("node:crypto");
    const md5 = createHash("md5").update(buffer).digest("hex");
    const sha1 = createHash("sha1").update(buffer).digest("hex");
    // ① 申请预签名 URL
    const prepared = await this.#request("POST", "/v2/media-images/prepare", {
      file_name: fileName,
      file_size: buffer.length,
      content_type: contentType,
      md5,
      sha1,
    });
    const uploadId = typeof prepared.upload_id === "string" ? prepared.upload_id : "";
    const presignedUrl = typeof prepared.presigned_url === "string" ? prepared.presigned_url : "";
    if (!uploadId || !presignedUrl) throw new Error(`素材上传 prepare 失败: ${JSON.stringify(prepared).slice(0, 200)}`);
    // ② PUT 直传二进制（预签名 URL，不带鉴权头）
    const put = await fetch(presignedUrl, {
      method: "PUT",
      headers: { "content-type": contentType },
      body: new Uint8Array(buffer),
    });
    if (!put.ok) throw new Error(`素材直传失败: HTTP ${put.status}`);
    // ③ 完成登记：md5 必须是 PUT 响应 ETag（去引号 / 弱标记），否则平台报 40093006 请求参数错误。
    const etagRaw = put.headers.get("etag") ?? "";
    const etag = etagRaw.replace(/^W\//i, "").replace(/^"|"$/g, "").trim();
    const done = await this.#request("POST", "/v2/media-images/complete", {
      upload_id: uploadId,
      md5: etag || md5,
    });
    const url = typeof done.url === "string" ? done.url : "";
    const imageId = typeof done.image_id === "string" ? done.image_id : "";
    if (!url) throw new Error(`素材上传 complete 失败: ${JSON.stringify(done).slice(0, 200)}`);
    return { url, imageId };
  }

  // ── 分享链接（POST /v2/generate_url_link） ─────────────────────────────────

  /** 生成机器人好友分享链接（callback_data ≤32 字符，添加好友时透传回 FRIEND_ADD 事件）。 */
  async generateShareLink(callbackData?: string): Promise<string> {
    const data = await this.#request("POST", "/v2/generate_url_link", callbackData ? { callback_data: callbackData.slice(0, 32) } : {});
    // 兼容两种响应壳：裸 { url } 与 { data: { url } }（部分端点外层还有 retcode 壳）。
    const shell = (data.data && typeof data.data === "object" ? data.data : data) as Record<string, unknown>;
    const url = typeof shell.url === "string" ? shell.url : "";
    if (!url) throw new Error(`生成分享链接失败: ${JSON.stringify(data).slice(0, 200)}`);
    return url;
  }

  // ── 自定义菜单 / 指令面板（20260812） ──────────────────────────────────────

  /** 查询全局自定义菜单（仅 C2C 单聊场景展示）。 */
  async getMenu(): Promise<{ items: QqMenuItem[]; version?: number }> {
    const data = await this.#request("GET", "/v2/menu");
    const menu = (data.menu && typeof data.menu === "object" ? data.menu : {}) as Record<string, unknown>;
    const items = Array.isArray(menu.items) ? (menu.items as QqMenuItem[]) : [];
    return { items, ...(typeof data.version === "number" ? { version: data.version } : {}) };
  }

  /** 修改全局自定义菜单（整份覆盖；传空 items 即清空菜单）。返回新版本号。 */
  async putMenu(items: QqMenuItem[]): Promise<number> {
    const data = await this.#request("PUT", "/v2/menu", { menu: { items } });
    return typeof data.version === "number" ? data.version : 0;
  }

  /** 查询指令面板列表（GET /v2/panels）。scope 必填：c2c/group/channel/dm。 */
  async listPanels(scope = "c2c"): Promise<Array<Record<string, unknown>>> {
    const safeScope = ["c2c", "group", "channel", "dm"].includes(scope) ? scope : "c2c";
    const data = await this.#request("GET", `/v2/panels?scope=${encodeURIComponent(safeScope)}&limit=50`);
    const list = data.records ?? data.panels ?? data.list ?? data.items;
    return Array.isArray(list) ? (list as Array<Record<string, unknown>>) : [];
  }

  /** 创建指令面板（POST /v2/panels）。body 直接透传平台字段（scope/target_type/panel）。 */
  async createPanel(body: Record<string, unknown>): Promise<string> {
    const data = await this.#request("POST", "/v2/panels", body);
    const id = typeof data.panel_id === "string" ? data.panel_id : "";
    if (!id) throw new Error(`创建指令面板失败: ${JSON.stringify(data).slice(0, 200)}`);
    return id;
  }

  /** 查询单个指令面板详情（GET /v2/panels/{panel_id}）。 */
  async getPanel(panelId: string): Promise<Record<string, unknown>> {
    return await this.#request("GET", `/v2/panels/${encodeURIComponent(panelId)}`);
  }

  /** 修改指令面板配置（PUT /v2/panels/{panel_id}）。body 透传 {panel:{items,remark,version?}}。返回版本号。 */
  async updatePanel(panelId: string, body: Record<string, unknown>): Promise<number> {
    const data = await this.#request("PUT", `/v2/panels/${encodeURIComponent(panelId)}`, body);
    return typeof data.version === "number" ? data.version : 0;
  }

  /** 删除指令面板（DELETE /v2/panels/{panel_id}）。 */
  async deletePanel(panelId: string): Promise<void> {
    await this.#request("DELETE", `/v2/panels/${encodeURIComponent(panelId)}`);
  }

  /**
   * 修改指令面板关联对象（PUT /v2/panels/{panel_id}/target）。
   * op=add/del；group 场景用 groupOpenids，c2c 场景用 userOpenids。仅 specific 面板可用。
   */
  async setPanelTarget(
    panelId: string,
    op: "add" | "del",
    { groupOpenids, userOpenids }: { groupOpenids?: string[]; userOpenids?: string[] } = {},
  ): Promise<void> {
    const body: Record<string, unknown> = { op };
    if (groupOpenids?.length) body.group_openids = groupOpenids.slice(0, 20);
    if (userOpenids?.length) body.user_openids = userOpenids.slice(0, 20);
    await this.#request("PUT", `/v2/panels/${encodeURIComponent(panelId)}/target`, body);
  }

  /** 获取机器人自身详情（GET /users/@me）：id / username / avatar / bot。 */
  async getSelfInfo(): Promise<{ id: string; username: string; avatar: string; bot: boolean; shareUrl?: string; welcomeMsg?: string }> {
    const data = await this.#request("GET", "/users/@me");
    return {
      id: typeof data.id === "string" ? data.id : "",
      username: typeof data.username === "string" ? data.username : "",
      avatar: typeof data.avatar === "string" ? data.avatar : "",
      bot: data.bot === true,
      ...(typeof data.share_url === "string" ? { shareUrl: data.share_url } : {}),
      ...(typeof data.welcome_msg === "string" ? { welcomeMsg: data.welcome_msg } : {}),
    };
  }

  // ── 群管理（20260810/20260903） ────────────────────────────────────────────

  /** 获取群成员列表（分页，每页最多 30 条；需接口白名单权限）。 */
  async listGroupMembers(groupOpenid: string, cursor = ""): Promise<{ members: QqGroupMember[]; nextCursor: string }> {
    const q = cursor ? `?cursor=${encodeURIComponent(cursor)}` : "";
    const data = await this.#request("GET", `/v2/groups/${encodeURIComponent(groupOpenid)}/members${q}`);
    const members = Array.isArray(data.members) ? (data.members as QqGroupMember[]) : [];
    return { members, nextCursor: typeof data.next_cursor === "string" ? data.next_cursor : "" };
  }

  /** 群成员批量移除（单次最多 20 个；机器人需管理员且群主开启权限）。 */
  async batchRemoveMembers(groupOpenid: string, memberOpenids: string[]): Promise<void> {
    const list = memberOpenids.map((o) => String(o).trim()).filter(Boolean).slice(0, 20);
    if (!list.length) throw new Error("未选择要移除的成员");
    await this.#request("POST", `/v2/groups/${encodeURIComponent(groupOpenid)}/batch_remove_members`, { member_openids: list });
  }

  /** 查询群禁言状态（全员禁言规则 + 成员级禁言列表；机器人需管理员）。 */
  async getMuteState(groupOpenid: string): Promise<{ globalMode: string; members: QqMuteMemberState[] }> {
    const data = await this.#request("GET", `/v2/groups/${encodeURIComponent(groupOpenid)}/restrict_chat_setting`);
    const global = (data.global_rule && typeof data.global_rule === "object" ? data.global_rule : {}) as Record<string, unknown>;
    return {
      globalMode: typeof global.mode === "string" ? global.mode : "none",
      members: Array.isArray(data.members) ? (data.members as QqMuteMemberState[]) : [],
    };
  }

  /**
   * 设置成员禁言 / 解除禁言（单次 ≤20 人；机器人需管理员）。
   * `minutes` ≤0 或省略表示立即解除（op=del）；否则按当前时间 + minutes 计算 RFC3339 到期时间。
   */
  async setMemberMute(groupOpenid: string, memberOpenids: string[], minutes = 0): Promise<void> {
    const list = memberOpenids.map((o) => String(o).trim()).filter(Boolean).slice(0, 20);
    if (!list.length) throw new Error("未选择要操作的成员");
    const op = minutes > 0 ? "add" : "del";
    const expire = minutes > 0 ? new Date(Date.now() + minutes * 6e4).toISOString() : "";
    await this.#request("POST", `/v2/groups/${encodeURIComponent(groupOpenid)}/restrict_chat_setting`, {
      members: list.map((member_openid) => ({ op, member_openid, mute_expire_at: expire })),
    });
  }

  /**
   * 全员禁言 / 全员解禁。
   *
   * ⚠️ 官方 POST /v2/groups/{id}/restrict_chat_setting 请求体仅支持 members（成员级），
   * global_rule 只在 GET 里返回（只读）。因此这里用「分页拉全群成员 → 每批 20 人
   * add/del」的方式近似实现全员效果；机器人自己/群主/管理员会被平台跳过（官方限制
   * 只能操作普通成员）。minutes≤0 表示全员解禁。返回实际处理的普通成员数量。
   */
  async setGlobalMute(groupOpenid: string, minutes = 10): Promise<{ affected: number }> {
    // 先分页拉全群成员
    const members: string[] = [];
    let cursor = "";
    for (let page = 0; page < 50; page += 1) {
      const { members: batch, nextCursor } = await this.listGroupMembers(groupOpenid, cursor);
      for (const m of batch) {
        const id = typeof m.member_openid === "string" ? m.member_openid : "";
        if (id) members.push(id);
      }
      if (!nextCursor || nextCursor === cursor) break;
      cursor = nextCursor;
    }
    // 全量解禁时，以「当前禁言列表」为准更准（避免对未禁言成员重复 del）
    const targets = minutes > 0
      ? members
      : (await this.getMuteState(groupOpenid)).members
          .map((m) => m.member_openid).filter(Boolean);
    const expire = minutes > 0 ? new Date(Date.now() + minutes * 6e4).toISOString() : "";
    const op = minutes > 0 ? "add" : "del";
    let affected = 0;
    for (let i = 0; i < targets.length; i += 20) {
      const chunk = targets.slice(i, i + 20);
      if (!chunk.length) continue;
      await this.#request("POST", `/v2/groups/${encodeURIComponent(groupOpenid)}/restrict_chat_setting`, {
        members: chunk.map((member_openid) => ({ op, member_openid, mute_expire_at: expire })),
      });
      affected += chunk.length;
    }
    return { affected };
  }

  /**
   * 更新已禁言成员的到期时间（op=update，单次 ≤20 人；机器人需管理员）。
   * 用于「续费禁言」（延长到期）与「减轻禁言」（缩短到期）：传入按成员计算好的绝对到期时间。
   */
  async updateMemberMuteExpire(
    groupOpenid: string,
    entries: Array<{ member_openid: string; mute_expire_at: string }>,
  ): Promise<void> {
    const list = entries
      .map((e) => ({ member_openid: String(e.member_openid).trim(), mute_expire_at: e.mute_expire_at }))
      .filter((e) => e.member_openid && !!e.mute_expire_at)
      .slice(0, 20);
    if (!list.length) throw new Error("未选择要操作的成员");
    await this.#request("POST", `/v2/groups/${encodeURIComponent(groupOpenid)}/restrict_chat_setting`, {
      members: list.map((e) => ({ op: "update", ...e })),
    });
  }

  // ── 入群申请与自动审批策略（20260810/20260903） ────────────────────────────

  /** 拉取入群申请列表（分页，默认 20 条/页；机器人需管理员）。 */
  async listJoinRequests(groupOpenid: string, { cursor = "", limit = 20 } = {}): Promise<{ list: QqJoinRequest[]; nextCursor: string }> {
    const q = new URLSearchParams();
    if (cursor) q.set("cursor", cursor);
    q.set("limit", String(Math.min(50, Math.max(1, Math.round(limit)))));
    const data = await this.#request("GET", `/v2/groups/${encodeURIComponent(groupOpenid)}/join_request_list?${q.toString()}`);
    const list = Array.isArray(data.list) ? (data.list as QqJoinRequest[]) : [];
    return { list, nextCursor: typeof data.next_cursor === "string" ? data.next_cursor : "" };
  }

  /** 审批入群申请（op=approve 通过 / decline 拒绝；机器人需管理员）。 */
  async approveJoinRequest(
    groupOpenid: string,
    memberOpenid: string,
    { approve, joinRequestId = "", rejectReason = "", addToBlacklist = false }: { approve: boolean; joinRequestId?: string; rejectReason?: string; addToBlacklist?: boolean },
  ): Promise<void> {
    const body: Record<string, unknown> = { op: approve ? "approve" : "decline" };
    if (joinRequestId) body.join_request_id = joinRequestId;
    if (!approve && rejectReason) body.reject_reason = rejectReason.slice(0, 200);
    if (!approve && addToBlacklist) body.add_to_member_blacklist = true;
    await this.#request("POST", `/v2/groups/${encodeURIComponent(groupOpenid)}/approval_join_request/${encodeURIComponent(memberOpenid)}`, body);
  }

  /** 查询入群自动审批策略列表（GET /v2/groups/join_approval_strategy）。 */
  async listJoinStrategies(): Promise<QqJoinApprovalStrategy[]> {
    const data = await this.#request("GET", "/v2/groups/join_approval_strategy");
    const list = data.strategies ?? data.list ?? data.items;
    return Array.isArray(list) ? (list as QqJoinApprovalStrategy[]) : [];
  }

  /** 创建入群自动审批策略（关联群 openid 列表；仅启用「平台策略」——规则细节由平台侧配置）。 */
  async createJoinStrategy(groupOpenids: string[], remark = ""): Promise<string> {
    const openids = groupOpenids.map((o) => String(o).trim()).filter(Boolean).slice(0, 100);
    if (!openids.length) throw new Error("未选择要关联的群");
    const body: Record<string, unknown> = { group_openids: openids, is_enable: "on" };
    if (remark) body.remark = remark.slice(0, 255);
    const data = await this.#request("POST", "/v2/groups/join_approval_strategy", body);
    const id = typeof data.strategy_id === "string" ? data.strategy_id : "";
    if (!id) throw new Error(`创建审批策略失败: ${JSON.stringify(data).slice(0, 200)}`);
    return id;
  }

  /** 删除入群自动审批策略。 */
  async deleteJoinStrategy(strategyId: string): Promise<void> {
    await this.#request("DELETE", `/v2/groups/join_approval_strategy/${encodeURIComponent(strategyId)}`);
  }

  // ── 群信息 / 机器人群内状态（20261116 / 群管理） ───────────────────────────

  /** 获取群基本信息（群名 / 简介 / 分类 / 标签 / 人数）。 */
  async getGroupInfo(groupOpenid: string): Promise<QqGroupInfo> {
    const data = await this.#request("GET", `/v2/groups/${encodeURIComponent(groupOpenid)}/info`);
    return {
      group_openid: typeof data.group_openid === "string" ? data.group_openid : groupOpenid,
      group_name: typeof data.group_name === "string" ? data.group_name : "",
      group_finger_memo: typeof data.group_finger_memo === "string" ? data.group_finger_memo : "",
      group_class_text: typeof data.group_class_text === "string" ? data.group_class_text : "",
      group_tags: Array.isArray(data.group_tags) ? (data.group_tags as string[]) : [],
      group_member_num: typeof data.group_member_num === "number" ? data.group_member_num : 0,
      union_group_openid: typeof data.union_group_openid === "string" ? data.union_group_openid : undefined,
    };
  }

  /**
   * 获取机器人在群内的状态——用于判定管理员权限（member_role=admin/owner）。
   * 禁言 / 移除成员 / 入群审批等接口都要求机器人为管理员。
   */
  async getBotGroupState(groupOpenid: string): Promise<QqBotGroupState> {
    const data = await this.#request("GET", `/v2/groups/${encodeURIComponent(groupOpenid)}/bot_state`);
    return {
      member_openid: typeof data.member_openid === "string" ? data.member_openid : "",
      joined_at: typeof data.joined_at === "string" ? data.joined_at : "",
      allow_proactive_msg: data.allow_proactive_msg === true,
      recv_msg_setting: typeof data.recv_msg_setting === "string" ? data.recv_msg_setting : "",
      member_role: typeof data.member_role === "string" ? data.member_role : "member",
    };
  }

  /** 获取单个群成员信息（内邀接口）。 */
  async getGroupMember(groupOpenid: string, memberOpenid: string): Promise<QqGroupMember | null> {
    const data = await this.#request(
      "GET",
      `/v2/groups/${encodeURIComponent(groupOpenid)}/members/${encodeURIComponent(memberOpenid)}`,
    );
    if (!data || typeof data.member_openid !== "string") return null;
    return data as unknown as QqGroupMember;
  }

  // ── 群黑名单（20260903，内邀接口） ────────────────────────────────────────

  /** 查询群黑名单（分页，limit 1~100）。 */
  async listBlacklist(groupOpenid: string, { cursor = "", limit = 20 } = {}): Promise<{ users: QqBlacklistUser[]; nextCursor: string }> {
    const q = new URLSearchParams();
    if (cursor) q.set("cursor", cursor);
    q.set("limit", String(Math.min(100, Math.max(1, Math.round(limit)))));
    const data = await this.#request("GET", `/v2/groups/${encodeURIComponent(groupOpenid)}/member_blacklist?${q.toString()}`);
    const users = Array.isArray(data.users) ? (data.users as QqBlacklistUser[]) : [];
    return { users, nextCursor: typeof data.next_cursor === "string" ? data.next_cursor : "" };
  }

  /**
   * 群黑名单操作（add 加入 / del 移出，单次 ≤20 人）。
   * 注意：目标成员在群中时无法加入黑名单（需先移除成员）。
   * @returns 操作失败的 openid 列表
   */
  async modifyBlacklist(groupOpenid: string, op: "add" | "del", memberOpenids: string[]): Promise<string[]> {
    const list = memberOpenids.map((o) => String(o).trim()).filter(Boolean).slice(0, 20);
    if (!list.length) throw new Error("未选择要操作的成员");
    const data = await this.#request("POST", `/v2/groups/${encodeURIComponent(groupOpenid)}/member_blacklist`, {
      op, member_openids: list,
    });
    return Array.isArray(data.fail_openids) ? (data.fail_openids as string[]) : [];
  }

  // ── 入群审批策略：修改 / 执行 / 白名单（2026） ─────────────────────────────

  /**
   * 修改入群自动审批策略（启停 / 过期时间 / 增删关联群 / 备注）。
   * groupAction.op=add|del；group_openids 与 group_ids 互斥，这里统一用 openid。
   */
  async patchJoinStrategy(
    strategyId: string,
    body: {
      isEnable?: "on" | "off";
      expireAt?: string;
      remark?: string;
      groupAction?: { op: "add" | "del"; groupOpenids: string[] };
    } = {},
  ): Promise<{ isEnable: string; expireAt: string }> {
    const payload: Record<string, unknown> = {};
    if (body.isEnable) payload.is_enable = body.isEnable;
    if (body.expireAt) payload.expire_at = body.expireAt;
    if (body.remark !== undefined) payload.remark = body.remark.slice(0, 255);
    if (body.groupAction) {
      payload.group_action = {
        op: body.groupAction.op,
        group_openids: body.groupAction.groupOpenids.map((o) => String(o).trim()).filter(Boolean),
      };
    }
    const data = await this.#request("PATCH", `/v2/groups/join_approval_strategy/${encodeURIComponent(strategyId)}`, payload);
    return {
      isEnable: typeof data.is_enable === "string" ? data.is_enable : "",
      expireAt: typeof data.expire_at === "string" ? data.expire_at : "",
    };
  }

  /** 执行入群自动审批策略（对关联群全量扫描，异步约 10 分钟完成）。 */
  async executeJoinStrategy(strategyId: string): Promise<void> {
    await this.#request("POST", `/v2/groups/join_approval_strategy/${encodeURIComponent(strategyId)}/execute`, {});
  }

  /**
   * 修改入群自动审批策略的白名单号码（单次 ≤10000 个，字符串避免精度丢失）。
   * @returns 操作后的白名单号码数（估算）
   */
  async setStrategyWhitelist(strategyId: string, op: "add" | "del", qqNumbers: string[]): Promise<number> {
    const users = qqNumbers.map((n) => String(n).trim()).filter((n) => /^\d+$/.test(n)).slice(0, 10000);
    if (!users.length) throw new Error("未填写有效的 QQ 号码");
    const data = await this.#request(
      "POST",
      `/v2/groups/join_approval_strategy/${encodeURIComponent(strategyId)}/whitelist_users`,
      { op, whitelist_users: users },
    );
    return typeof data.whitelist_user_count === "number" ? data.whitelist_user_count : 0;
  }

  // ── QQ 频道（Guild）：autogen 频道管理 + 频道模块（成员 / 身份组 / 消息） ──
  // 频道接口路径不带 /v2 前缀，与现有群接口共用 apiBase 与 QQBot access_token。

  /** GET /users/@me/guilds：机器人已加入的频道列表。 */
  async listGuilds(): Promise<Array<Record<string, unknown>>> {
    const data = await this.#request("GET", "/users/@me/guilds");
    return Array.isArray(data) ? (data as unknown as Array<Record<string, unknown>>) : [];
  }

  /** GET /guilds/{guild_id}：频道详情（名称 / 头像 / 创建者 / 人数 / 简介）。 */
  async getGuild(guildId: string): Promise<Record<string, unknown>> {
    return await this.#request("GET", `/guilds/${encodeURIComponent(guildId)}`);
  }

  /** GET /guilds/{guild_id}/channels：子频道列表。 */
  async listGuildChannels(guildId: string): Promise<Array<Record<string, unknown>>> {
    const data = await this.#request("GET", `/guilds/${encodeURIComponent(guildId)}/channels`);
    return Array.isArray(data) ? (data as unknown as Array<Record<string, unknown>>) : [];
  }

  /** GET /channels/{channel_id}：子频道详情。 */
  async getGuildChannel(channelId: string): Promise<Record<string, unknown>> {
    return await this.#request("GET", `/channels/${encodeURIComponent(channelId)}`);
  }

  /** POST /guilds/{guild_id}/channels：创建子频道（私域接口，需管理员）。 */
  async createGuildChannel(guildId: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return await this.#request("POST", `/guilds/${encodeURIComponent(guildId)}/channels`, body);
  }

  /** PATCH /channels/{channel_id}：修改子频道。 */
  async patchGuildChannel(channelId: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return await this.#request("PATCH", `/channels/${encodeURIComponent(channelId)}`, body);
  }

  /** DELETE /channels/{channel_id}：删除子频道。 */
  async deleteGuildChannel(channelId: string): Promise<void> {
    await this.#request("DELETE", `/channels/${encodeURIComponent(channelId)}`);
  }

  /**
   * GET /guilds/{guild_id}/members：频道成员列表（仅私域机器人）。
   * 平台可能重复返回上一页成员，调用方按 user.id 自行去重；next 取最后一位 user.id。
   */
  async listGuildMembers(guildId: string, { after = "0", limit = 100 } = {}): Promise<{
    members: Array<Record<string, unknown>>; next: string;
  }> {
    const q = new URLSearchParams();
    q.set("after", after || "0");
    q.set("limit", String(Math.min(400, Math.max(1, Math.round(limit)))));
    const data = await this.#request("GET", `/guilds/${encodeURIComponent(guildId)}/members?${q.toString()}`);
    const members = Array.isArray(data)
      ? (data as unknown as Array<Record<string, unknown>>)
      : (Array.isArray(data.members) ? (data.members as Array<Record<string, unknown>>) : []);
    const last = members[members.length - 1]?.user as { id?: unknown } | undefined;
    return { members, next: typeof last?.id === "string" ? last.id : "" };
  }

  /** GET /guilds/{guild_id}/members/{user_id}：频道成员详情（仅私域机器人）。 */
  async getGuildMember(guildId: string, userId: string): Promise<Record<string, unknown>> {
    return await this.#request(
      "GET",
      `/guilds/${encodeURIComponent(guildId)}/members/${encodeURIComponent(userId)}`,
    );
  }

  /** GET /guilds/{guild_id}/roles：频道身份组列表（含 1=全体成员 / 2=管理员 / 4=创建者 / 5=子频道管理员）。 */
  async listGuildRoles(guildId: string): Promise<Array<Record<string, unknown>>> {
    const data = await this.#request("GET", `/guilds/${encodeURIComponent(guildId)}/roles`);
    const roles = data.roles ?? data.guild_roles ?? data.list;
    return Array.isArray(roles)
      ? (roles as Array<Record<string, unknown>>)
      : (Array.isArray(data) ? (data as unknown as Array<Record<string, unknown>>) : []);
  }

  /** POST /guilds/{guild_id}/roles：创建身份组（需管理员）。 */
  async createGuildRole(guildId: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return await this.#request("POST", `/guilds/${encodeURIComponent(guildId)}/roles`, body);
  }

  /** PATCH /guilds/{guild_id}/roles/{role_id}：修改身份组。 */
  async patchGuildRole(guildId: string, roleId: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return await this.#request("PATCH", `/guilds/${encodeURIComponent(guildId)}/roles/${encodeURIComponent(roleId)}`, body);
  }

  /** DELETE /guilds/{guild_id}/roles/{role_id}：删除身份组。 */
  async deleteGuildRole(guildId: string, roleId: string): Promise<void> {
    await this.#request("DELETE", `/guilds/${encodeURIComponent(guildId)}/roles/${encodeURIComponent(roleId)}`);
  }

  /**
   * 增删频道身份组成员：PUT / DELETE /guilds/{guild_id}/members/{user_id}/roles/{role_id}。
   * 身份组 5（子频道管理员）需带 channel.id 指定子频道。
   */
  async setGuildMemberRole(
    guildId: string, userId: string, roleId: string, add: boolean, channelId = "",
  ): Promise<void> {
    const path = `/guilds/${encodeURIComponent(guildId)}/members/${encodeURIComponent(userId)}/roles/${encodeURIComponent(roleId)}`;
    const body = add && channelId ? { channel: { id: channelId } } : undefined;
    await this.#request(add ? "PUT" : "DELETE", path, body);
  }

  /**
   * POST /channels/{channel_id}/messages：向子频道发送文本消息（需子频道发言权限）。
   * msgId/eventId 二选一即变为被动回复（有效期 5 分钟，不占主动消息额度）。
   */
  async sendChannelMessage(
    channelId: string,
    content: string,
    opts: { msgId?: string; eventId?: string } = {},
  ): Promise<Record<string, unknown>> {
    const text = String(content ?? "").trim();
    if (!text) throw new Error("消息内容不能为空");
    return await this.#request("POST", `/channels/${encodeURIComponent(channelId)}/messages`, {
      content: text.slice(0, 2000),
      ...(opts.msgId ? { msg_id: opts.msgId } : {}),
      ...(opts.eventId ? { event_id: opts.eventId } : {}),
    });
  }

  // ── 频道发言管理 / 内容管理（server-inter/channel/speak、message） ──────────
  /** 把分钟转成禁言秒串；0 传 "0" 表示解除。平台两个字段二选一，统一用 mute_seconds。 */
  static muteSeconds(minutes: number): string {
    const n = Math.max(0, Math.round(Number(minutes) || 0));
    return String(n * 60);
  }

  /** PATCH /guilds/{guild_id}/mute：全员禁言（非管理员）；传 0 解除。 */
  async muteGuildAll(guildId: string, minutes: number): Promise<void> {
    await this.#request("PATCH", `/guilds/${encodeURIComponent(guildId)}/mute`, {
      mute_seconds: QqApiClient.muteSeconds(minutes),
    });
  }

  /** PATCH /guilds/{guild_id}/members/{user_id}/mute：禁言指定成员；传 0 解除。 */
  async muteGuildMember(guildId: string, userId: string, minutes: number): Promise<void> {
    await this.#request("PATCH",
      `/guilds/${encodeURIComponent(guildId)}/members/${encodeURIComponent(userId)}/mute`,
      { mute_seconds: QqApiClient.muteSeconds(minutes) });
  }

  /** PATCH /guilds/{guild_id}/mute：批量禁言；传 user_ids，0 解除。 */
  async muteGuildMembers(guildId: string, userIds: string[], minutes: number): Promise<unknown> {
    const ids = (userIds ?? []).map((id) => String(id).trim()).filter(Boolean).slice(0, 100);
    if (!ids.length) return [];
    return await this.#request("PATCH", `/guilds/${encodeURIComponent(guildId)}/mute`, {
      user_ids: ids,
      mute_seconds: QqApiClient.muteSeconds(minutes),
    });
  }

  /** GET /guilds/{guild_id}/message/setting：机器人消息频率设置。 */
  async getGuildMessageSetting(guildId: string): Promise<Record<string, unknown>> {
    return await this.#request("GET", `/guilds/${encodeURIComponent(guildId)}/message/setting`);
  }

  /** PUT /guilds/{guild_id}/message/setting：修改消息频率设置（官方参数原样透传）。 */
  async putGuildMessageSetting(guildId: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return await this.#request("PUT", `/guilds/${encodeURIComponent(guildId)}/message/setting`, body);
  }

  /** DELETE /channels/{channel_id}/messages/{message_id}：撤回子频道消息；hideTip 控制小灰条。 */
  async deleteGuildMessage(channelId: string, messageId: string, hideTip = true): Promise<void> {
    const q = new URLSearchParams();
    q.set("hide_tip", hideTip ? "true" : "false");
    await this.#request("DELETE",
      `/channels/${encodeURIComponent(channelId)}/messages/${encodeURIComponent(messageId)}?${q.toString()}`);
  }

  /** GET /channels/{channel_id}/roles/{role_id}：查询子频道身份组权限。 */
  async getGuildChannelRolePermission(channelId: string, roleId: string): Promise<Record<string, unknown>> {
    return await this.#request("GET",
      `/channels/${encodeURIComponent(channelId)}/roles/${encodeURIComponent(roleId)}`);
  }

  /** PATCH /channels/{channel_id}/roles/{role_id}：修改子频道身份组权限（add/remove 权限位）。 */
  async patchGuildChannelRolePermission(
    channelId: string, roleId: string, add?: Record<string, unknown>, remove?: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    const body: Record<string, unknown> = {};
    if (add && typeof add === "object") body.add = add;
    if (remove && typeof remove === "object") body.remove = remove;
    return await this.#request("PATCH",
      `/channels/${encodeURIComponent(channelId)}/roles/${encodeURIComponent(roleId)}`, body);
  }

  /** GET /guilds/{guild_id}/members/{user_id}/roles：查询成员身份组（授权关系）。 */
  async getGuildMemberRoles(guildId: string, userId: string): Promise<Record<string, unknown>> {
    return await this.#request("GET",
      `/guilds/${encodeURIComponent(guildId)}/members/${encodeURIComponent(userId)}/roles`);
  }

  // ── 频道成员 / 内容管理 / 权限（server-inter/channel，全量补齐） ─────────────
  /** GET /channels/{channel_id}/online_nums：子频道在线成员数。 */
  async getGuildChannelOnlineNums(channelId: string): Promise<unknown> {
    return await this.#request("GET", `/channels/${encodeURIComponent(channelId)}/online_nums`);
  }

  /** GET /guilds/{guild_id}/roles/{role_id}/members：身份组成员列表（start_index / limit）。 */
  async getGuildRoleMembers(guildId: string, roleId: string, startIndex = 0, limit = 100): Promise<unknown> {
    const q = new URLSearchParams();
    q.set("start_index", String(startIndex));
    q.set("limit", String(limit));
    return await this.#request("GET",
      `/guilds/${encodeURIComponent(guildId)}/roles/${encodeURIComponent(roleId)}/members?${q.toString()}`);
  }

  /** DELETE /guilds/{guild_id}/members/{user_id}：踢出频道成员。 */
  async deleteGuildMember(guildId: string, userId: string): Promise<void> {
    await this.#request("DELETE",
      `/guilds/${encodeURIComponent(guildId)}/members/${encodeURIComponent(userId)}`);
  }

  /** GET /guilds/{guild_id}/api_permission：机器人可用接口权限列表。 */
  async getGuildApiPermission(guildId: string): Promise<unknown> {
    return await this.#request("GET", `/guilds/${encodeURIComponent(guildId)}/api_permission`);
  }

  /** POST /guilds/{guild_id}/api_permission：申请接口权限授权（返回授权链接）。 */
  async demandGuildApiPermission(guildId: string, body: Record<string, unknown>): Promise<unknown> {
    return await this.#request("POST", `/guilds/${encodeURIComponent(guildId)}/api_permission`, body);
  }

  /**
   * 注意：QQ 官方没有「获取公告列表」接口，GET /guilds/{id}/announces 会返回 405。
   * 保留此方法仅为兼容，不再被 RPC 调用；公告仅支持 POST 创建 / DELETE 删除。
   */
  async getGuildAnnounces(guildId: string): Promise<unknown> {
    return await this.#request("GET", `/guilds/${encodeURIComponent(guildId)}/announces`);
  }

  /** POST /guilds/{guild_id}/announces：发布频道公告。 */
  async createGuildAnnounce(guildId: string, body: Record<string, unknown>): Promise<unknown> {
    return await this.#request("POST", `/guilds/${encodeURIComponent(guildId)}/announces`, body);
  }

  /** DELETE /guilds/{guild_id}/announces/{message_id}：删除频道公告；messageId=all 删全部。 */
  async deleteGuildAnnounce(guildId: string, messageId: string): Promise<void> {
    await this.#request("DELETE",
      `/guilds/${encodeURIComponent(guildId)}/announces/${encodeURIComponent(messageId)}`);
  }

  /** PUT /channels/{channel_id}/pins/{message_id}：添加精华消息（单频道最多 20 条）。 */
  async addGuildPin(channelId: string, messageId: string): Promise<unknown> {
    return await this.#request("PUT",
      `/channels/${encodeURIComponent(channelId)}/pins/${encodeURIComponent(messageId)}`);
  }

  /** DELETE /channels/{channel_id}/pins/{message_id}：删除精华消息。 */
  async deleteGuildPin(channelId: string, messageId: string): Promise<unknown> {
    return await this.#request("DELETE",
      `/channels/${encodeURIComponent(channelId)}/pins/${encodeURIComponent(messageId)}`);
  }

  /** GET /channels/{channel_id}/pins：获取精华消息列表。 */
  async getGuildPins(channelId: string): Promise<unknown> {
    return await this.#request("GET", `/channels/${encodeURIComponent(channelId)}/pins`);
  }

  /**
   * GET /channels/{channel_id}/messages：拉取子频道消息列表，用于拿到真实 message_id
   * （精华 / 撤回 / 引用回复都需要它，不能用子频道 ID 代替）。
   * limit 1-100；before/after 为消息 ID 游标，官方按 msg_id 分页。
   */
  async getChannelMessages(
    channelId: string,
    opts: { limit?: number; before?: string; after?: string } = {},
  ): Promise<unknown> {
    const q = new URLSearchParams();
    q.set("limit", String(Math.max(1, Math.min(100, Math.round(Number(opts.limit) || 50)))));
    if (opts.before) q.set("before", opts.before);
    if (opts.after) q.set("after", opts.after);
    return await this.#request("GET",
      `/channels/${encodeURIComponent(channelId)}/messages?${q.toString()}`);
  }

  /** GET /channels/{channel_id}/schedules：日程列表。 */
  async getGuildSchedules(channelId: string): Promise<unknown> {
    return await this.#request("GET", `/channels/${encodeURIComponent(channelId)}/schedules`);
  }

  /** GET /channels/{channel_id}/schedules/{schedule_id}：日程详情。 */
  async getGuildSchedule(channelId: string, scheduleId: string): Promise<unknown> {
    return await this.#request("GET",
      `/channels/${encodeURIComponent(channelId)}/schedules/${encodeURIComponent(scheduleId)}`);
  }

  /** POST /channels/{channel_id}/schedules：创建日程。 */
  async createGuildSchedule(channelId: string, body: Record<string, unknown>): Promise<unknown> {
    return await this.#request("POST", `/channels/${encodeURIComponent(channelId)}/schedules`, body);
  }

  /** PATCH /channels/{channel_id}/schedules/{schedule_id}：修改日程。 */
  async patchGuildSchedule(channelId: string, scheduleId: string, body: Record<string, unknown>): Promise<unknown> {
    return await this.#request("PATCH",
      `/channels/${encodeURIComponent(channelId)}/schedules/${encodeURIComponent(scheduleId)}`, body);
  }

  /** DELETE /channels/{channel_id}/schedules/{schedule_id}：删除日程。 */
  async deleteGuildSchedule(channelId: string, scheduleId: string): Promise<void> {
    await this.#request("DELETE",
      `/channels/${encodeURIComponent(channelId)}/schedules/${encodeURIComponent(scheduleId)}`);
  }

  /** POST /channels/{channel_id}/audio：音频控制（上麦/下麦等，参数原样透传）。 */
  async guildAudioControl(channelId: string, body: Record<string, unknown>): Promise<unknown> {
    return await this.#request("POST", `/channels/${encodeURIComponent(channelId)}/audio`, body);
  }

  /**
   * 论坛帖子接口（官方 server-inter/channel/content/forum + 官方 SDK botpy）：
   * 路径只需要 channel_id，没有 forum_id（旧文档里的 /forums/{forum_id}/ 已废弃）。
   * 下面方法保留 forumId 入参以兼容旧调用方，但实际忽略——一律走新路径。
   */
  /** GET /channels/{channel_id}/threads：帖子列表。 */
  async getGuildForumThreads(channelId: string, _forumId?: string): Promise<unknown> {
    return await this.#request("GET", `/channels/${encodeURIComponent(channelId)}/threads`);
  }

  /** GET /channels/{channel_id}/threads/{thread_id}：帖子详情。 */
  async getGuildForumThread(channelId: string, _forumIdOrThreadId: string, threadId?: string): Promise<unknown> {
    const tid = threadId ?? _forumIdOrThreadId;
    return await this.#request("GET",
      `/channels/${encodeURIComponent(channelId)}/threads/${encodeURIComponent(tid)}`);
  }

  /** PUT /channels/{channel_id}/threads：发表帖子。 */
  async createGuildForumThread(channelId: string, _forumId: string, body: Record<string, unknown>): Promise<unknown> {
    return await this.#request("PUT", `/channels/${encodeURIComponent(channelId)}/threads`, body);
  }

  /** DELETE /channels/{channel_id}/threads/{thread_id}：删除帖子。 */
  async deleteGuildForumThread(channelId: string, _forumIdOrThreadId: string, threadId?: string): Promise<void> {
    const tid = threadId ?? _forumIdOrThreadId;
    await this.#request("DELETE",
      `/channels/${encodeURIComponent(channelId)}/threads/${encodeURIComponent(tid)}`);
  }

  /** GET /channels/{channel_id}/permissions：子频道权限。 */
  async getGuildChannelPermissions(channelId: string): Promise<unknown> {
    return await this.#request("GET", `/channels/${encodeURIComponent(channelId)}/permissions`);
  }

  /** PUT /channels/{channel_id}/permissions/all：修改子频道全员权限。 */
  async putGuildChannelPermissionAll(channelId: string, body: Record<string, unknown>): Promise<unknown> {
    return await this.#request("PUT", `/channels/${encodeURIComponent(channelId)}/permissions/all`, body);
  }
}
