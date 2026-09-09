/**
 * 媒体发送安全防护（对齐 openclaw ssrf-guard / local-file-router 的思路）：
 *
 * AI 可以通过 qqbot_send_image / qqbot_send_file / qqbot_send_voice 传入任意
 * URL 或本地路径，底层 SDK 会直接请求 / 读取该来源。没有防护时意味着：
 *  - SSRF：AI 可让本机请求内网地址（169.254 元数据、127.0.0.1 管理端口、内网服务）；
 *  - 任意文件读取：AI 可把 ~/.ssh、~/.dsh 等敏感文件直接发给聊天对象。
 *
 * 两道防线（都可通过配置关闭，默认开启）：
 *  1. ssrfGuard：http(s) URL → 协议白名单 + IP 字面量/保留段判定 + QQ 信任域直通
 *     + 域名 DNS 解析全记录校验（解析出任何私有/保留 IP 即拒绝）；
 *  2. localPathWhitelist：本地路径 → resolve + realpath 后必须落在允许根内
 *     （会话工作区 / 插件数据目录），realpath 防符号链接穿越。
 */

import { lookup } from "node:dns/promises";
import { realpath, stat } from "node:fs/promises";
import path from "node:path";
import { pluginDataDir } from "./store-file.js";

export interface MediaGuardOptions {
  /** SSRF 防护开关（config.ssrfGuard，默认开）。 */
  ssrfGuard: boolean;
  /** 本地路径白名单开关（config.localPathWhitelist，默认开）。 */
  localPathWhitelist: boolean;
  /** 本地路径允许根（工作区等；ssrfGuard 无关）。 */
  allowedRoots: string[];
  logger?: Pick<Console, "warn">;
}

// ── IP 保留段判定 ─────────────────────────────────────────────────────────────

/** IPv4 是否落在私有/保留段（含元数据、链路本地、CGNAT、测试段）。 */
export function isReservedIPv4(ip: string): boolean {
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(ip);
  if (!m) return false;
  const [a, b] = [Number(m[1]), Number(m[2])];
  if ([a, b, Number(m[3]), Number(m[4])].some((n) => n > 255)) return true;
  if (a === 0 || a === 10 || a === 127) return true; // 本网段 / 私有 / 回环
  if (a === 169 && b === 254) return true; // 链路本地（云元数据 169.254.169.254）
  if (a === 172 && b >= 16 && b <= 31) return true; // 私有
  if (a === 192 && b === 168) return true; // 私有
  if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
  if (a === 198 && (b === 18 || b === 19)) return true; // 基准测试
  if (a >= 224) return true; // 组播 / 保留 / 广播
  return false;
}

/** IPv6 是否落在私有/保留段（含 IPv4 映射地址）。 */
export function isReservedIPv6(ip: string): boolean {
  const lower = ip.toLowerCase().replace(/^\[|\]$/g, "");
  // IPv4 映射/兼容地址（::ffff:10.0.0.1、::127.0.0.1）→ 按 v4 判定。
  const mapped = /^::(?:ffff:)?(\d{1,3}(?:\.\d{1,3}){3})$/.exec(lower)
    ?? /^::(\d{1,3}(?:\.\d{1,3}){3})$/.exec(lower);
  if (mapped) return isReservedIPv4(mapped[1]!);
  if (lower === "::" || lower === "::1") return true; // 未指定 / 回环
  if (/^f[cd]/.test(lower)) return true; // fc00::/7 唯一本地
  if (/^fe[89ab]/.test(lower)) return true; // fe80::/10 链路本地
  if (/^ff/.test(lower)) return true; // 组播
  return false;
}

/** 判定一个 IP 字面量（v4/v6）是否私有/保留。 */
export function isReservedIp(ip: string): boolean {
  return ip.includes(":") ? isReservedIPv6(ip) : isReservedIPv4(ip);
}

// ── URL 校验（SSRF） ──────────────────────────────────────────────────────────

/** QQ 官方媒体/接口信任域后缀：这些域名的媒体地址是平台自己下发的，直通不查 DNS。 */
const TRUSTED_SUFFIXES = [
  ".qq.com",
  ".gtimg.com",
  ".qcloud.com",
  ".myqcloud.com",
] as const;

function isTrustedHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return TRUSTED_SUFFIXES.some((suffix) => host === suffix.slice(1) || host.endsWith(suffix));
}

/**
 * 校验一个媒体 URL 是否可安全请求（SDK 会从本机发起下载/上传）。
 * 通过时静默返回；不通过时抛出带中文原因的 Error（工具层转为可读错误）。
 * ssrfGuard 关闭时仅做协议检查（http/https），不做内网判定。
 */
export async function assertSafeMediaUrl(rawUrl: string, guard: Pick<MediaGuardOptions, "ssrfGuard" | "logger">): Promise<void> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error(`非法 URL：${rawUrl.slice(0, 120)}`);
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`不允许的协议 ${url.protocol.replace(":", "")}：只支持 http/https 媒体地址`);
  }
  const host = url.hostname;
  if (!host) throw new Error("URL 缺少主机名");
  if (isTrustedHost(host)) return;

  // IP 字面量：直接判定保留段。
  if (isReservedIp(host)) {
    if (!guard.ssrfGuard) return;
    throw new Error(`拒绝请求内网/保留地址 ${host}：媒体 URL 不允许指向私有网络（SSRF 防护，可在设置中调整）`);
  }
  if (!guard.ssrfGuard) return;

  // 域名：解析出的所有记录都必须非保留段（防止 DNS 指向内网）。
  try {
    const records = await lookup(host, { all: true, verbatim: true });
    const bad = records.find((r) => isReservedIp(r.address));
    if (bad) {
      throw new Error(`域名 ${host} 解析到内网/保留地址 ${bad.address}，已拒绝（SSRF 防护，可在设置中调整）`);
    }
  } catch (error) {
    if (error instanceof Error && /内网|保留地址/.test(error.message)) throw error;
    throw new Error(`域名解析失败 ${host}：${error instanceof Error ? error.message : String(error)}`);
  }
}

// ── 本地路径白名单 ─────────────────────────────────────────────────────────────

/** 默认允许根：插件数据目录（AI 生成的临时文件常落在 ~/.dsh/qqbot 下）。 */
export function defaultAllowedRoots(workspacePath: string): string[] {
  const roots = [workspacePath, pluginDataDir()];
  return [...new Set(roots.map((r) => path.resolve(r)).filter((r) => r.length > 0))];
}

/** 路径是否在允许根内（已 realpath 的双方比较，Windows 大小写不敏感）。 */
function insideRoot(child: string, root: string): boolean {
  const c = process.platform === "win32" ? child.toLowerCase() : child;
  const r = process.platform === "win32" ? root.toLowerCase() : root;
  return c === r || c.startsWith(r.endsWith(path.sep) ? r : r + path.sep);
}

/**
 * 校验本地媒体路径是否可读并发送。通过时返回规范化后的绝对路径。
 * 允许根按 realpath 归一（目录不存在时按 resolve 结果比对）；文件必须存在。
 * localPathWhitelist 关闭时只要求路径是绝对路径（SDK 自身要求）。
 */
export async function assertLocalMediaPath(
  rawPath: string,
  guard: Pick<MediaGuardOptions, "localPathWhitelist" | "allowedRoots" | "logger">,
): Promise<string> {
  const resolved = path.resolve(rawPath.trim());
  if (!guard.localPathWhitelist) return resolved;

  // 文件必须存在（SDK 发送同样要求），存在则 realpath 归一防符号链接穿越。
  let target = resolved;
  try {
    const info = await stat(resolved);
    if (info.isFile()) target = await realpath(resolved);
  } catch {
    throw new Error(`文件不存在：${resolved}`);
  }
  const roots = guard.allowedRoots.map((r) => path.resolve(r));
  const realRoots = await Promise.all(roots.map(async (r) => {
    try {
      return await realpath(r);
    } catch {
      return r; // 允许根尚不存在（例如空工作区）按字面路径比对
    }
  }));
  if (realRoots.some((root) => insideRoot(target, root))) return target;
  guard.logger?.warn(`[dsh-qqbot] 本地路径白名单拦截: ${target}（允许根: ${realRoots.join(" ; ")}）`);
  throw new Error(
    `本地路径不在允许范围内：${target}。允许的根目录：${realRoots.join(" ; ")}`
    + "（把文件放到工作区目录下，或在设置中调整工作区/关闭路径白名单）",
  );
}
