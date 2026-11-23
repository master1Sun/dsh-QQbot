import { type StoredCredentials } from "../infra/store-file.js";
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
export interface QrLoginManagerOptions {
    source: string;
    logger: Pick<Console, "info" | "warn" | "error">;
    /** 凭据落盘 + 热更新回调。 */
    onCredentials: (credentials: StoredCredentials) => Promise<void> | void;
}
export declare class QrLoginManager {
    #private;
    constructor(options: QrLoginManagerOptions);
    /** 当前状态快照（含二维码 SVG，供界面渲染）。 */
    snapshot(): QrLoginSnapshot;
    /**
     * 启动一次扫码会话。进行中重复调用会先中止旧会话再重新生成（界面「重新生成」按钮依赖此行为）。
     * 旧会话被 stop 时 SDK 会异步触发 onFailure("已取消")，用 #session 隔离，避免覆盖新会话状态。
     */
    start(): Promise<QrLoginSnapshot>;
    /** 取消进行中的扫码。 */
    cancel(): QrLoginSnapshot;
    dispose(): void;
}
