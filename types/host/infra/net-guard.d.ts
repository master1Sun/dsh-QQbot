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
export interface MediaGuardOptions {
    /** SSRF 防护开关（config.ssrfGuard，默认开）。 */
    ssrfGuard: boolean;
    /** 本地路径白名单开关（config.localPathWhitelist，默认开）。 */
    localPathWhitelist: boolean;
    /** 本地路径允许根（工作区等；ssrfGuard 无关）。 */
    allowedRoots: string[];
    logger?: Pick<Console, "warn">;
}
/** IPv4 是否落在私有/保留段（含元数据、链路本地、CGNAT、测试段）。 */
export declare function isReservedIPv4(ip: string): boolean;
/** IPv6 是否落在私有/保留段（含 IPv4 映射地址）。 */
export declare function isReservedIPv6(ip: string): boolean;
/** 判定一个 IP 字面量（v4/v6）是否私有/保留。 */
export declare function isReservedIp(ip: string): boolean;
/**
 * 校验一个媒体 URL 是否可安全请求（SDK 会从本机发起下载/上传）。
 * 通过时静默返回；不通过时抛出带中文原因的 Error（工具层转为可读错误）。
 * ssrfGuard 关闭时仅做协议检查（http/https），不做内网判定。
 */
export declare function assertSafeMediaUrl(rawUrl: string, guard: Pick<MediaGuardOptions, "ssrfGuard" | "logger">): Promise<void>;
/** 默认允许根：插件数据目录（AI 生成的临时文件常落在 ~/.dsh/qqbot 下）。 */
export declare function defaultAllowedRoots(workspacePath: string): string[];
/**
 * 校验本地媒体路径是否可读并发送。通过时返回规范化后的绝对路径。
 * 允许根按 realpath 归一（目录不存在时按 resolve 结果比对）；文件必须存在。
 * localPathWhitelist 关闭时只要求路径是绝对路径（SDK 自身要求）。
 */
export declare function assertLocalMediaPath(rawPath: string, guard: Pick<MediaGuardOptions, "localPathWhitelist" | "allowedRoots" | "logger">): Promise<string>;
