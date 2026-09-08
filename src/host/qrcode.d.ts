/**
 * qrcode 的最小本地类型声明（该包未随附类型，且安装 @types/qrcode 需要联网）。
 * 仅声明插件实际用到的 toString（生成 SVG 字符串）。
 */
declare module "qrcode" {
  export interface QrCodeToStringOptions {
    type?: "svg" | "terminal" | "utf8";
    margin?: number;
    width?: number;
    errorCorrectionLevel?: "L" | "M" | "Q" | "H";
    color?: { dark?: string; light?: string };
  }

  export function toString(text: string, options?: QrCodeToStringOptions): Promise<string>;
  export function toDataURL(text: string, options?: Record<string, unknown>): Promise<string>;
  export function toBuffer(text: string, options?: Record<string, unknown>): Promise<Buffer>;

  const QRCode: {
    toString: typeof toString;
    toDataURL: typeof toDataURL;
    toBuffer: typeof toBuffer;
  };

  export default QRCode;
}
