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

/** QQ 扫码二维码标准有效期（毫秒），到期后 SDK 触发 onQrExpired 自动换码。 */
const QR_TTL_MS = 5 * 60_000;

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

  constructor(options: QrLoginManagerOptions) {
    this.#options = options;
  }

  /** 当前状态快照（含二维码 SVG，供界面渲染）。 */
  snapshot(): QrLoginSnapshot {
    return { ...this.#snapshot };
  }

  /** 启动一次扫码会话；进行中重复调用返回当前状态。 */
  async start(): Promise<QrLoginSnapshot> {
    if (this.#stop) return this.snapshot();
    this.#snapshot = { status: "pending", startedAt: Date.now(), expiresAt: Date.now() + QR_TTL_MS };
    const qrcodeShown = new Promise<void>((resolve) => {
      this.#stop = startQrConnect(
        {
          onQrDisplayed: (url) => {
            this.#snapshot.qrUrl = url;
            // SDK 过期会自动换码并再次回调，这里同步续期，界面倒计时才准。
            this.#snapshot.expiresAt = Date.now() + QR_TTL_MS;
            // 对齐 dsh-im 的 qrDataUrl：PNG DataURL（M 容错 / margin 2 / 320px），
            // 界面直接 <img src> 展示；SVG 仅作 CLI / 旧端点兼容保留。
            QRCode.toDataURL(url, { type: "image/png", errorCorrectionLevel: "M", margin: 2, width: 320 })
              .then((dataUrl) => {
                this.#snapshot.qrCodeDataUrl = dataUrl;
                return QRCode.toString(url, { type: "svg", margin: 1, width: 220 });
              })
              .then((svg) => {
                this.#snapshot.qrSvg = svg;
                resolve();
              })
              .catch(() => resolve());
          },
          onQrExpired: () => {
            this.#snapshot.qrSvg = undefined;
            this.#snapshot.qrCodeDataUrl = undefined;
            this.#snapshot.qrUrl = undefined;
          },
          onSuccess: (credentials) => {
            void this.#finish(credentials);
          },
          onFailure: (error) => {
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
    this.#stop?.();
    this.#stop = null;
    if (this.#snapshot.status === "pending") this.#snapshot = { status: "idle" };
    return this.snapshot();
  }

  dispose(): void {
    this.cancel();
  }
}
