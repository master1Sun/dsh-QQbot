/**
 * dsh-qqbot — 把多个 QQ 官方机器人（WebSocket 长连接）接入本机 DeepSeek Harness。
 *
 * 多机器人架构：
 *  - bots.json 保存多个机器人（各自凭据 + 独立行为配置），全部 enabled 的机器人**同时连接**；
 *  - 每个机器人各自持一套运行状态 / API 客户端 / WebSocket 连接 / 归档器，互不干扰；
 *  - 同一条群消息会被每个在该群里的机器人各自判定、各自回复（冷却与群缓冲也各自独立）；
 *  - 主动消息 / 定时消息按归属机器人发送，未指定时落入「主机器人」。
 *
 * 能力：
 *  - QQ WebSocket 接收源（本机主动拨出网关，无需公网回调）→ webhookRuntime 会话；
 *  - 群全量消息（价值过滤）+ 群 AT + 单聊，统一会话入口；
 *  - 会话复用、聊天内命令、回复泵（Markdown 优先）；
 *  - 扫码 / 手动登录，凭据落盘并热生效（热重建对应 WS 连接）；
 *  - 设置界面：dsh 设置页「QQ 机器人」（connection.rpc 通道）。
 */
import type { Context } from "@deepseek-ai/cordis";
import type { QqbotConfig } from "../shared/config.js";
export declare const name = "qqbot";
export declare const inject: string[];
export declare function apply(ctx: Context, entryConfig: Partial<QqbotConfig>): Promise<() => Promise<void>>;
