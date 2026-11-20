/**
 * QQ 机器人扫码登录（官方 @tencent-connect/qqbot-connector SDK）。
 *
 * 两种登录入口共用本管理器：
 *  - TUI：`dsh-qqbot login`（bin CLI，终端打印二维码，qrConnect Promise 风格）；
 *  - 界面：设置页「QQ 机器人」→ 扫码卡片（POST /qr 启动 → 轮询 GET /qr → 展示二维码 SVG）。
 *
 * 扫码成功后凭据写入 credentials.json 并通过 onCredentials 回调热更新运行配置。
 */
import { startQrConnect, type QrConnectCredentials } from "@tencent-connect/qqbot-connector";
import QRCode from "qrcode";
import { saveCredentials, type StoredCredentials } from "../infra/store-file.js";
import { toShanghaiISO } from "../../shared/time.js";

export type QrLoginStatus = "idle" | "pending" | "success" | "failure";

export interface QrLoginSnapshot {
  status: QrLoginStatus;
  qrUrl?: string;
  /** 二维码 PNG DataURL（对齐 dsh-im：errorCorrectionLevel=M / margin=2 / width=320）。 */
  qrCodeDataUrl?: string;
  /** 二维码 SVG（兼容 CLI / 旧 HTTP 消费方）。 */
  qrSvg?: string;
  /** 二维码过期时间戳（毫秒），pending 时提供，驱动界面倒计时进度条。 */
  expiresAt?: number;
  appId?: string;
  userOpenid?: string;
  error?: string;
  startedAt?: number;
}

/**
 * 二维码有效期（毫秒），仅用于界面倒计时。
 * 实测 @tencent-connect/qqbot-connector 1.2.0 的服务端 bind task 3 分钟即返回 EXPIRED
 * 并自动换码，倒计时按 5 分钟显示会让用户对一张已过期的码误判为「还有效」。
 */
const QR_TTL_MS = 3 * 60_000;

export interface QrLoginManagerOptions {
  source: string;
  logger: Pick<Console, "info" | "warn" | "error">;
  /** 凭据落盘 + 热更新回调。 */
  onCredentials: (credentials: StoredCredentials) => Promise<void> | void;
}

export class QrLoginManager {
  readonly #options: QrLoginManagerOptions;
  #snapshot: QrLoginSnapshot = { status: "idle" };
  #stop: (() => void) | null = null;
  /** 会话序号：取消/重启后旧会话的延迟回调（含 onFailure("已取消")）一律丢弃。 */
  #session = 0;
  /** 放行上一次 start() 的 await，避免重复生成时旧请求永久挂起。 */
  #resolveShown: (() => void) | null = null;

  constructor(options: QrLoginManagerOptions) {
    this.#options = options;
  }

  /** 当前状态快照（含二维码 SVG，供界面渲染）。 */
  snapshot(): QrLoginSnapshot {
    return { ...this.#snapshot };
  }

  /**
   * 启动一次扫码会话。进行中重复调用会先中止旧会话再重新生成（界面「重新生成」按钮依赖此行为）。
   * 旧会话被 stop 时 SDK 会异步触发 onFailure("已取消")，用 #session 隔离，避免覆盖新会话状态。
   */
  async start(): Promise<QrLoginSnapshot> {
    if (this.#stop) {
      // 放行上一次 start() 的 await，避免旧 RPC 请求永久挂起。
      this.#resolveShown?.();
      this.#resolveShown = null;
      this.#stop();
      this.#stop = null;
    }
    const session = ++this.#session;
    const isCurrent = () => session === this.#session;
    this.#snapshot = { status: "pending", startedAt: Date.now(), expiresAt: Date.now() + QR_TTL_MS };
    const qrcodeShown = new Promise<void>((resolve) => {
      this.#resolveShown = () => {
        if (isCurrent()) resolve();
      };
      const stop = startQrConnect(
        {
          onQrDisplayed: (url) => {
            if (!isCurrent()) return;
            this.#snapshot.qrUrl = url;
            // SDK 过期会自动换码并再次回调，这里同步续期，界面倒计时才准。
            this.#snapshot.expiresAt = Date.now() + QR_TTL_MS;
            // 对齐 dsh-im 的 qrDataUrl：PNG DataURL（M 容错 / margin 2 / 320px），
            // 界面直接 <img src> 展示；SVG 仅作 CLI / 旧端点兼容保留。
            QRCode.toDataURL(url, { type: "image/png", errorCorrectionLevel: "M", margin: 2, width: 320 })
              .then((dataUrl) => {
                if (!isCurrent()) return undefined;
                this.#snapshot.qrCodeDataUrl = dataUrl;
                return QRCode.toString(url, { type: "svg", margin: 1, width: 220 });
              })
              .then((svg) => {
                if (!isCurrent()) return;
                if (svg) this.#snapshot.qrSvg = svg;
                resolve();
              })
              .catch(() => resolve());
          },
          onQrExpired: () => {
            if (!isCurrent()) return;
            this.#snapshot.qrSvg = undefined;
            this.#snapshot.qrCodeDataUrl = undefined;
            this.#snapshot.qrUrl = undefined;
          },
          onSuccess: (credentials) => {
            if (!isCurrent()) return;
            void this.#finish(credentials);
          },
          onFailure: (error) => {
            if (!isCurrent()) return;
            this.#snapshot = {
              status: "failure",
              error: error?.message ?? "扫码登录失败",
              startedAt: this.#snapshot.startedAt,
            };
            this.#stop = null;
            this.#options.logger.warn("[dsh-qqbot] 扫码登录失败:", error?.message);
          },
        },
        { displayQrCodeToConsole: false, source: this.#options.source },
      );
      this.#stop = stop;
    });
    await qrcodeShown;
    return this.snapshot();
  }

  async #finish(credentials: QrConnectCredentials[]): Promise<void> {
    this.#stop = null;
    const first = credentials[0];
    if (!first?.appId || !first?.appSecret) {
      this.#snapshot = { status: "failure", error: "扫码结果缺少凭据", startedAt: this.#snapshot.startedAt };
      return;
    }
    const stored: StoredCredentials = {
      appId: first.appId,
      appSecret: first.appSecret,
      ...(first.userOpenid ? { userOpenid: first.userOpenid } : {}),
      savedAt: toShanghaiISO(),
      source: "qr",
    };
    try {
      await saveCredentials(stored);
      await this.#options.onCredentials(stored);
      this.#snapshot = {
        status: "success",
        appId: stored.appId,
        ...(stored.userOpenid ? { userOpenid: stored.userOpenid } : {}),
        startedAt: this.#snapshot.startedAt,
      };
      this.#options.logger.info(`[dsh-qqbot] 扫码登录成功，AppID ${stored.appId} 已保存并生效`);
    } catch (error) {
      this.#snapshot = { status: "failure", error: error instanceof Error ? error.message : "凭据保存失败" };
      this.#options.logger.error("[dsh-qqbot] 扫码凭据保存失败:", error);
    }
  }

  /** 取消进行中的扫码。 */
  cancel(): QrLoginSnapshot {
    // 先失效旧会话回调（stop 会异步触发 onFailure("已取消")，否则会覆盖下面的 idle）。
    this.#session++;
    this.#resolveShown?.();
    this.#resolveShown = null;
    this.#stop?.();
    this.#stop = null;
    this.#snapshot = { status: "idle" };
    return this.snapshot();
  }

  dispose(): void {
    this.cancel();
  }
}
