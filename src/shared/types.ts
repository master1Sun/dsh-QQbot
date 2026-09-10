/**
 * QQ 开放平台 Webhook 事件与插件共享类型。
 *
 * 参考文档：
 *  - 事件回调与签名：https://bot.qq.com/wiki/develop/api-v2/dev-prepare/interface-framework/sign.html
 *  - Webhook 接入：https://bot.qq.com/wiki/develop/api-v2/dev-prepare/event-emit/webhook.html
 *  - 消息收发概述：https://bot.qq.com/wiki/develop/api-v2/server-inter/message/overview.html
 */

/** 回复目标：scope 决定调用 /v2/users（单聊）还是 /v2/groups（群聊）发消息接口。 */
export interface ReplyTarget {
  scope: "c2c" | "group";
  openid: string;
}

/** 被动回复凭据：收到的那条用户消息的 msg_id 与已用回复序号。 */
export interface PassiveReplyRecord {
  target: ReplyTarget;
  /** 聊天键 `${scope}:${openid}`（会话绑定用）。 */
  chatKey: string;
  /** QQ 消息事件体里的 id（被动回复凭证）。 */
  msgId: string;
  /**
   * 事件 message_scene.ext 里的 msg_idx（REFIDX_*，本条消息的引用索引）。
   * 出站引用卡片（message_reference.message_id）必须用它：官方文档规定非机器人消息的
   * 引用 id 取自事件 ext 的 msg_idx 字段，传原始 msg id 平台无法解析。缺失时不带引用卡片。
   */
  selfIdx?: string;
  /** 下一次被动回复使用的 msg_seq（从 1 开始）。 */
  nextSeq: number;
  /** 收到时间（epoch ms），用于判断被动回复窗口（群 5 分钟 / 单聊 60 分钟）。 */
  receivedAt: number;
  /**
   * 该回复是否源于 @/单聊（而非群全量价值过滤）。
   * quoteReply=at 时只有这类回复才带原生引用卡片，避免群全量刷屏。
   */
  quoteMention: boolean;
  /**
   * 该回复由定时任务（调度器合成事件）产生。
   * 主动消息配额已在调度层预扣，回复泵不再逐片重复扣费；
   * 若最终未投递（静默 / 全部片失败），由跳过方归还这份预扣额度。
   */
  scheduled?: boolean;
  /**
   * 允许静默：AI 输出仅含静默标记时视为「本次无需发送」，
   * 不投递、不占主动消息配额（预扣额度由回复泵归还）。
   * 仅定时任务开启——正常对话里用户总在等一个回复。
   */
  silentOk?: boolean;
  /** 产生本条回复的定时任务 id（静默时用于把跳过原因写回任务条目）。 */
  scheduleId?: string;
}

/** 群全量消息缓冲条目（供 AT 消息附带上下文）。 */
export interface GroupBufferEntry {
  senderId: string;
  senderName: string;
  content: string;
  /** 事件里的 timestamp 原文（RFC3339），展示取 HH:mm。 */
  timestamp: string;
}

/** 运行计数（/api/qqbot/status 展示）。 */
export interface BotCounters {
  received: number;
  sessions: number;
  replies: number;
  proactive: number;
  errors: number;
}

/** rule / routes / reply pump 共享的运行状态。 */
export interface BotState {
  /** deliveryId → 被动回复记录（rule 写入，绑定会话后由 reply pump 消费）。 */
  pending: Map<string, PassiveReplyRecord>;
  /** deliveryId → 绑定的 DSH 会话 id。 */
  sessionByDelivery: Map<string, string>;
  /** 聊天键 `${scope}:${openid}` → 最近使用的 DSH 会话 id（会话复用）。 */
  chatSession: Map<string, string>;
  /** 会话 id → 最近一条被动回复记录（用于事件门控；回复时以 recordQueue 为准）。 */
  recordBySession: Map<string, PassiveReplyRecord>;
  /**
   * 会话 id → 待回复记录队列（FIFO）。
   * 同一聊天并发多条消息时，后到的消息若只覆盖 recordBySession，会把仍在等
   * LLM 的前一条（如 @ 消息）的记录挤掉 → 回复时读错引用门控字段（quoteMention
   * /selfIdx/msgId）导致卡片丢失。turn/end 严格按 turn 顺序，与队列出队一一对应，
   * 因此队列能精确还原「这条回复属于哪条入站消息」。
   */
  recordQueue: Map<string, PassiveReplyRecord[]>;
  /** 会话 id → turn → 已收集的助手文本（turn/end 时统一发送）。 */
  turnText: Map<string, Map<number, string>>;
  /** 群全量消息环形缓冲：groupOpenid → 最近消息。 */
  groupBuffer: Map<string, GroupBufferEntry[]>;
  /** 跨事件指纹去重（GROUP_AT 与 GROUP_MESSAGE 双推送）：`群:发送者:内容` → 时间。 */
  incomingFingerprints: Map<string, number>;
  /**
   * 群 @ 消息孪生事件富化表：`群:发送者:内容` → 首事件创建的被动回复记录。
   * 群里 @ 一条消息会同时推 GROUP_MESSAGE_CREATE（带 msg_idx/selfIdx）与
   * GROUP_AT_MESSAGE_CREATE（带可靠 @ 信号），去重后只有一个事件建会话。
   * 另一个孪生事件到达时（turn/end 之前）就地更新记录的 quoteMention / selfIdx，
   * 使 quoteReply=at 的引用门控拿到完整数据，不受到达顺序影响。
   */
  mergeRecords: Map<string, { record: PassiveReplyRecord; at: number }>;
  /** 已处理事件 id 去重（QQ 可能重推），key → 收到时间。 */
  seenEvents: Map<string, number>;
  /** AI 报错提示限流：chatKey → 上次提示时间（60 秒窗口内同一聊天只提示一次）。 */
  errorNoticeAt: Map<string, number>;
  /** 机器人自己发出的消息 id（chatKey → 环形缓冲），供表情撤回 / /撤回 命令使用。 */
  sentByChat: Map<string, string[]>;
  counters: BotCounters;
}

/** QQ 事件信封（WebSocket 接收源组装，与官方 webhook 推送体同构）。 */
export interface QqEnvelope {
  op?: number;
  id?: string;
  t?: string;
  d?: unknown;
}

/** QQ 消息附件（图片/文件/语音），来自 WebSocket 事件的 attachments 字段。 */
export interface QqAttachment {
  content_type?: string;
  url?: string;
  filename?: string;
  /** 语音消息的 wav 转码地址（平台提供）。 */
  voice_wav_url?: string;
  /** 语音消息的官方转写文本（平台自带 ASR，可能为空）。 */
  asr_refer_text?: string;
}

/** 消息类事件体（C2C_MESSAGE_CREATE / GROUP_AT_MESSAGE_CREATE / GROUP_MESSAGE_CREATE）。 */
export interface QqMessagePayload {
  id?: string;
  content?: string;
  timestamp?: string;
  group_openid?: string;
  author?: {
    id?: string;
    username?: string;
    bot?: boolean;
    member_openid?: string;
    user_openid?: string;
  };
  /** @ 的用户列表（GROUP_MESSAGE_CREATE 携带）。bot=true 为旧字段；QQ 平台官方用 is_you 标记「@ 的是本机器人」。 */
  mentions?: Array<{
    id?: string;
    bot?: boolean;
    /** QQ 官方标记：本条消息 @ 的是「你」（本机器人）。GROUP_MESSAGE_CREATE 全量事件靠它判定 @，而非 bot 字段。 */
    is_you?: boolean;
    username?: string;
  }>;
  /** 消息附件（图片/文件/语音）。 */
  attachments?: QqAttachment[];
  /**
   * 调度器合成事件标记：__scheduled=true 表示这是定时任务派发的内部事件，
   * 允许没有 msg_id（回复走主动消息通道并消耗配额）。
   */
  __scheduled?: boolean;
  /**
   * 允许静默：定时任务允许 AI 判定「本次没有值得发送的内容」并就此收手。
   * AI 只输出 {@link SILENT_MARKER} 时，回复泵不投递、不占主动消息配额。
   */
  __silentOk?: boolean;
  /**
   * 产生本条合成事件的定时任务 id。
   * 静默被拦下时据此把「跳过原因」写回对应任务（设置页可见）。
   */
  __scheduleId?: string;
  /**
   * 消息场景（引用消息的关键字段）：QQ 客户端引用/回复时在此带索引键，
   * ext 元素形如 `msg_idx=REFIDX_xxx`（本条）与 `ref_msg_idx=REFIDX_yyy`（被引用那条）。
   * 平台不回传被引用原文，需要插件自己建索引恢复（见 ref-index.ts）。
   */
  message_scene?: {
    source?: string;
    ext?: string[];
  };
}

/**
 * 静默标记：AI 判定「本次无需发送」时只输出它。
 * 用方括号包裹的纯 ASCII 记号，模型不容易在正常文本里误写；
 * 仅当整条回复去掉标记后为空时才判定为静默（见 isSilentReply）。
 */
export const SILENT_MARKER = "[[NO_SEND]]";

/**
 * 是否是一条「静默」回复：去掉首尾空白与静默标记后没有任何实质内容。
 * 有实质内容时（哪怕正文里提到标记）一律按正常回复处理，避免误吞内容。
 */
export function isSilentReply(text: string): boolean {
  const stripped = (text ?? "").split(SILENT_MARKER).join("").trim();
  return stripped.length === 0;
}

/** 是否 @ 了机器人：mentions 里出现 bot 用户（兼容旧字段）或 is_you=true（QQ 官方标记）即视为 AT。 */
export function atBot(payload: QqMessagePayload): boolean {
  return Array.isArray(payload.mentions)
    && payload.mentions.some((m) => m?.bot === true || m?.is_you === true);
}

/**
 * 提供给 dsh-webhook 的 QQ 事件值。
 * 通过 declaration merging 挂到 WebhookEventMap['qq']。
 */
export interface QqWebhookEvent {
  /** QQ 事件名，如 C2C_MESSAGE_CREATE / GROUP_AT_MESSAGE_CREATE / GROUP_MESSAGE_CREATE。 */
  readonly eventType: string;
  /** QQ 推送的完整信封（含 op/id/t/d）。 */
  readonly payload: QqEnvelope;
  /**
   * 来源机器人 AppID：多个机器人同时连接时，规则据此路由到对应机器人的
   * 配置 / 运行状态 / API 客户端（各自独立判定与回复）。
   */
  readonly botAppId?: string;
}

declare module "@deepseek-ai/dsh-webhook" {
  interface WebhookEventMap {
    qq: QqWebhookEvent;
  }
}

/** 支持接入的消息事件类型。 */
export const MESSAGE_EVENT_TYPES = new Set([
  "C2C_MESSAGE_CREATE",
  "GROUP_AT_MESSAGE_CREATE",
  "GROUP_MESSAGE_CREATE",
]);

/** 解析消息事件体；结构不符返回 null。 */
export function parseMessagePayload(event: QqWebhookEvent): {
  eventType: string;
  payload: QqMessagePayload;
} | null {
  if (!MESSAGE_EVENT_TYPES.has(event.eventType)) return null;
  const d = event.payload?.d as QqMessagePayload | undefined;
  if (!d || typeof d !== "object") return null;
  return { eventType: event.eventType, payload: d };
}

/** 消息发送者 openid（群聊为 member_openid，单聊为 user_openid，兼容 author.id）。 */
export function senderIdOf(payload: QqMessagePayload): string {
  const a = payload.author ?? {};
  return a.id || a.member_openid || a.user_openid || "";
}

/** 消息回复目标（群聊 / 单聊）。 */
export function replyTargetOf(eventType: string, payload: QqMessagePayload): ReplyTarget | null {
  if (eventType === "C2C_MESSAGE_CREATE") {
    const openid = payload.author?.user_openid || payload.author?.id || "";
    return openid ? { scope: "c2c", openid } : null;
  }
  const group = payload.group_openid ?? "";
  return group ? { scope: "group", openid: group } : null;
}
