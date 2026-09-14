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
    getCredentials: () => {
        appId: string;
        appSecret: string;
    };
    getApiBase: () => string;
    getTokenUrl: () => string;
    logger: Pick<Console, "info" | "warn" | "error">;
    /** 延迟取底层 SDK 实例（ws 连接建立后才可用，用于媒体/撤回）。 */
    getSdk?: () => QQBot | null;
}
/** QQ 官方被动回复次数上限。 */
export declare const PASSIVE_REPLY_LIMIT: Record<ReplyTarget["scope"], number>;
export declare class QqApiClient {
    #private;
    constructor(options: QqApiClientOptions);
    /** 扫码/配置更新后重置 token 缓存。 */
    resetAuthCache(): void;
    /** 发送一条文本消息。msgId 省略则为主动消息；msgSeq 被动回复序号从 1 开始。quoteMsgId 携带时附 message_reference 引用卡片。 */
    sendText(target: ReplyTarget, content: string, { msgId, msgSeq, quoteMsgId }?: {
        msgId?: string;
        msgSeq?: number;
        quoteMsgId?: string;
    }): Promise<string | undefined>;
    /**
     * 发送「正在输入」状态（C2C 专用，msg_type=6 input_notify）。
     * 参考 @tencent-connect/qqbot-nodejs 的 sendInputNotify / oc-src typingIndicator：
     * input_second 为状态持续秒数（平台窗口约 60s，超过需由调用方周期性重发）。
     * msgId 携带时为被动输入状态；msg_seq 用伪随机值，不占用回复泵的被动回复序号。
     * 平台对群聊不支持输入状态：非 c2c 目标直接跳过。
     */
    sendTyping(target: ReplyTarget, { msgId, seconds }?: {
        msgId?: string;
        seconds?: number;
    }): Promise<void>;
    /** 发送一条 Markdown 消息（需机器人有 markdown 权限）。quoteMsgId 携带时附 message_reference 引用卡片；
     *  keyboard 携带时附内嵌按钮（InlineKeyboard，点击触发 INTERACTION_CREATE 回调）。 */
    sendMarkdown(target: ReplyTarget, content: string, { msgId, msgSeq, quoteMsgId, keyboard, }?: {
        msgId?: string;
        msgSeq?: number;
        quoteMsgId?: string;
        keyboard?: {
            content: {
                rows: Array<{
                    buttons: Array<Record<string, unknown>>;
                }>;
            };
        };
    }): Promise<string | undefined>;
    /**
     * 回调确认（INTERACTION_CREATE 必答）：平台要求收到按钮点击后在数秒内回 ACK，
     * 否则客户端按钮转圈超时。code=0 表示成功；data.prompt 作为按钮反馈文案展示。
     */
    acknowledgeInteraction(interactionId: string, prompt?: string): Promise<void>;
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
    sendReply(target: ReplyTarget, content: string, { msgId, msgSeq, markdown, quoteMsgId }: {
        msgId?: string;
        msgSeq?: number;
        markdown: boolean;
        quoteMsgId?: string;
    }): Promise<{
        mode: "markdown" | "text";
        id?: string;
    }>;
    /** 撤回一条消息（机器人自己发的，或有权撤回的群消息）。 */
    recall(target: ReplyTarget, messageId: string): Promise<void>;
    /**
     * 发送一张图片（URL / 本地路径 / 内存 buffer）。
     * 走 SDK 的媒体上传（含大文件分块 + COS），msgId 存在则作为被动回复。
     */
    sendImage(target: ReplyTarget, source: {
        url?: string;
        buffer?: Buffer;
        localPath?: string;
    }, { msgId, content }?: {
        msgId?: string;
        content?: string;
    }): Promise<void>;
    /** 发送一个文件（含图片以外的任意富媒体）。 */
    sendFile(target: ReplyTarget, source: {
        url?: string;
        buffer?: Buffer;
        localPath?: string;
    }, { msgId, fileName, content }?: {
        msgId?: string;
        fileName?: string;
        content?: string;
    }): Promise<void>;
    /** 发送一条语音消息。 */
    sendVoice(target: ReplyTarget, source: {
        url?: string;
        buffer?: Buffer;
        localPath?: string;
    }, { msgId }?: {
        msgId?: string;
    }): Promise<void>;
    /** 按媒体类型发送（image/video/voice/file），由调用方指定 fileType。 */
    sendMedia(target: ReplyTarget, fileType: MediaFileType, source: {
        url?: string;
        buffer?: Buffer;
        localPath?: string;
    }, { msgId, content, fileName }?: {
        msgId?: string;
        content?: string;
        fileName?: string;
    }): Promise<void>;
}
