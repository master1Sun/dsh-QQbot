/**
 * 客户端共享类型：RPC 信封 / 服务端数据形状 / 通用小类型。
 */

export type RpcCall = (
  endpoint: string,
  payload?: Record<string, unknown>,
  signal?: AbortSignal,
) => Promise<Reply>;

/** 服务端信封：{ok, value}（新版）/ {ok, data}（兼容旧版）；error 为 {code,message} 或字符串。 */
export interface Reply {
  ok: boolean;
  value?: any;
  data?: any;
  error?: unknown;
}

export interface QrSnapshot {
  status: "idle" | "pending" | "success" | "failure";
  qrUrl?: string;
  /** PNG DataURL，对齐 dsh-im 的 qrCodeDataUrl（<img> 直接展示）。 */
  qrCodeDataUrl?: string;
  qrSvg?: string;
  /** 二维码过期时间戳（毫秒），驱动倒计时进度条。 */
  expiresAt?: number;
  appId?: string;
  error?: string;
}

export interface BotInfo {
  appId: string;
  appIdMasked: string;
  source: string;
  savedAt: string;
  enabled: boolean;
  primary: boolean;
  ws: { state: string; lastConnectedAt: number | null; lastError: string | null };
  counters: { received: number; sessions: number; replies: number; proactive: number; errors: number };
  pendingReplies: number;
  boundSessions: number;
  groupBuffers: Array<{ openid: string; buffered: number }>;
  /** 该机器人独立的行为配置（设置界面编辑对象）。 */
  config: Record<string, any>;
}

export interface BotsData {
  primaryAppId: string;
  runtimeReady: boolean;
  bots: BotInfo[];
}

export interface Catalogs {
  /** 已配置的模型目录（宿主 llm 运行时服务，settings.yaml 兜底）。 */
  models: Array<{ id: string; label: string; group?: string }>;
  /** 宿主 Agent Preset 目录（agentPresets 服务）。 */
  agentPresets: Array<{ id: string; label: string }>;
}

export const EMPTY_CATALOGS: Catalogs = { models: [], agentPresets: [] };

export interface Option {
  value: string;
  label: string;
}

/** 状态语义色（状态圆点 / 胶囊 / 指标卡共用）。 */
export type Tone = "success" | "warning" | "error" | "neutral";
