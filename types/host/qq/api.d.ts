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
/** 平台用户基本信息（GET /v2/users/{openid}/info）。 */
export interface QqUserInfo {
    username: string;
    avatar: string;
    allowProactiveMsg?: boolean;
}
/** 图文卡片（msg_type=8 card 字段）。标题 1-50 字，描述 1-200 字，链接须 https。 */
export interface QqMessageCard {
    type: "tuwen";
    content: {
        title: string;
        description: string;
        url: string;
        pic_url: string;
    };
}
/** 素材上传完成后的图片引用。 */
export interface QqMaterialImage {
    /** qqbot-media:// 引用（Markdown 里直接使用）。 */
    url: string;
    imageId: string;
}
/** 全局自定义菜单项（PUT /v2/menu）。 */
export interface QqMenuItem {
    name?: string;
    type?: "switch" | "send_message" | "link" | "menu";
    send_message?: string;
    link?: string;
    sub_menu_items?: Array<{
        name?: string;
        type?: "send_message" | "link";
        send_message?: string;
        link?: string;
    }>;
    switch?: {
        switch_id?: string;
        default?: boolean;
    };
}
/** 群成员（GET /v2/groups/{openid}/members）。 */
export interface QqGroupMember {
    member_openid: string;
    username: string;
    member_role: string;
    bot?: boolean;
    joined_at?: string;
}
/** 群禁言中的成员（GET /v2/groups/{openid}/restrict_chat_setting）。 */
export interface QqMuteMemberState {
    member_openid: string;
    mute_expire_at: string;
    username?: string;
}
/** 入群申请（GET /v2/groups/{openid}/join_request_list）。 */
export interface QqJoinRequest {
    join_request_id: string;
    member_openid: string;
    username: string;
    apply_at: string;
    apply_source?: string;
    invited_by?: string;
    risk_tips?: string;
    verify_info?: {
        method?: string;
        verify_message?: string;
        review_qa_list?: Array<{
            question?: string;
            answer?: string;
        }>;
    };
    auto_approved?: {
        strategy_id?: string;
    };
}
/** 入群自动审批策略（GET /v2/groups/join_approval_strategy）。 */
export interface QqJoinApprovalStrategy {
    strategy_id: string;
    is_enable?: string;
    expire_at?: string;
    remark?: string;
    group_openids?: string[];
}
/** 群基本信息（GET /v2/groups/{group_openid}/info）。 */
export interface QqGroupInfo {
    group_openid: string;
    group_name: string;
    group_finger_memo: string;
    group_class_text: string;
    group_tags: string[];
    group_member_num: number;
    union_group_openid?: string;
}
/**
 * 机器人在群内的状态（GET /v2/groups/{group_openid}/bot_state）。
 * member_role: member-普通成员 / admin-管理员 / owner-群主。
 */
export interface QqBotGroupState {
    member_openid: string;
    joined_at: string;
    allow_proactive_msg: boolean;
    recv_msg_setting: string;
    member_role: "member" | "admin" | "owner" | string;
}
/** 群黑名单成员（GET /v2/groups/{group_openid}/member_blacklist）。 */
export interface QqBlacklistUser {
    union_openid?: string;
    member_openid: string;
    username: string;
    banned_at: string;
    bot?: boolean;
}
export declare class QqApiClient {
    #private;
    constructor(options: QqApiClientOptions);
    /** 扫码/配置更新后重置 token 缓存。 */
    resetAuthCache(): void;
    /**
     * 供 agent 白名单调用的低层请求：自动带 token，支持 query。
     * 路径由调用方校验白名单，本方法不拼接外部 host。
     */
    request(method: string, path: string, body?: unknown, query?: Record<string, string | number | boolean>): Promise<Record<string, unknown>>;
    /** 发送一条文本消息。msgId 省略则为主动消息；msgSeq 被动回复序号从 1 开始。quoteMsgId 携带时附 message_reference 引用卡片。eventId 为事件被动回复（与 msgId 二选一）。 */
    sendText(target: ReplyTarget, content: string, { msgId, msgSeq, quoteMsgId, eventId }?: {
        msgId?: string;
        msgSeq?: number;
        quoteMsgId?: string;
        eventId?: string;
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
    sendMarkdown(target: ReplyTarget, content: string, { msgId, msgSeq, quoteMsgId, keyboard, forceVerifyImage, eventId, }?: {
        msgId?: string;
        msgSeq?: number;
        quoteMsgId?: string;
        eventId?: string;
        keyboard?: {
            content: {
                rows: Array<{
                    buttons: Array<Record<string, unknown>>;
                }>;
            };
        };
        /** 开启后 Markdown 图片转存失败即中断发送（平台 force_verify_image_resource 参数）。 */
        forceVerifyImage?: boolean;
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
     * ⚠️ 引用（quoteMsgId）与 msg_id 必须同传——实测组合矩阵（详见用户手册 8.5）：
     *   仅 message_reference       → 手机端同一条内容出现两次；
     *   仅 msg_id                  → 两端都不显示引用；
     *   msg_id + message_reference → 唯一「有引用且内容只出现一次」的组合（当前做法）。
     * 调用方带 quoteMsgId 时必须同时传 msgId/msgSeq（由上层 reply.ts 保证）。
     */
    sendReply(target: ReplyTarget, content: string, { msgId, msgSeq, markdown, quoteMsgId, forceVerifyImage }: {
        msgId?: string;
        msgSeq?: number;
        markdown: boolean;
        quoteMsgId?: string;
        forceVerifyImage?: boolean;
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
    /** 获取用户基本信息（昵称/头像/是否接收主动推送），带 10 分钟内存缓存。 */
    getUserInfo(openid: string): Promise<QqUserInfo>;
    /** 批量解析用户信息：成功返回映射，单个失败静默跳过（供归档头像等非关键场景）。 */
    getUserInfoBatch(openids: string[]): Promise<Record<string, QqUserInfo>>;
    /**
     * 发送图文卡片消息（msg_type=8）。
     * 平台约束：标题 1-50 字、描述 1-200 字，url/pic_url 必须为 https 且 ≤1024 字。
     */
    sendCard(target: ReplyTarget, card: {
        title: string;
        description: string;
        url: string;
        picUrl: string;
    }, { msgId, msgSeq, eventId }?: {
        msgId?: string;
        msgSeq?: number;
        eventId?: string;
    }): Promise<string | undefined>;
    /** 通过素材管理上传一张图片（url 或 buffer），返回 Markdown 可直接引用的 qqbot-media:// 地址。 */
    uploadMaterialImage(source: {
        url?: string;
        buffer?: Buffer;
        fileName?: string;
    }): Promise<QqMaterialImage>;
    /** 生成机器人好友分享链接（callback_data ≤32 字符，添加好友时透传回 FRIEND_ADD 事件）。 */
    generateShareLink(callbackData?: string): Promise<string>;
    /** 查询全局自定义菜单（仅 C2C 单聊场景展示）。 */
    getMenu(): Promise<{
        items: QqMenuItem[];
        version?: number;
    }>;
    /** 修改全局自定义菜单（整份覆盖；传空 items 即清空菜单）。返回新版本号。 */
    putMenu(items: QqMenuItem[]): Promise<number>;
    /** 查询指令面板列表（GET /v2/panels）。scope 必填：c2c/group/channel/dm。 */
    listPanels(scope?: string): Promise<Array<Record<string, unknown>>>;
    /** 创建指令面板（POST /v2/panels）。body 直接透传平台字段（scope/target_type/panel）。 */
    createPanel(body: Record<string, unknown>): Promise<string>;
    /** 查询单个指令面板详情（GET /v2/panels/{panel_id}）。 */
    getPanel(panelId: string): Promise<Record<string, unknown>>;
    /** 修改指令面板配置（PUT /v2/panels/{panel_id}）。body 透传 {panel:{items,remark,version?}}。返回版本号。 */
    updatePanel(panelId: string, body: Record<string, unknown>): Promise<number>;
    /** 删除指令面板（DELETE /v2/panels/{panel_id}）。 */
    deletePanel(panelId: string): Promise<void>;
    /**
     * 修改指令面板关联对象（PUT /v2/panels/{panel_id}/target）。
     * op=add/del；group 场景用 groupOpenids，c2c 场景用 userOpenids。仅 specific 面板可用。
     */
    setPanelTarget(panelId: string, op: "add" | "del", { groupOpenids, userOpenids }?: {
        groupOpenids?: string[];
        userOpenids?: string[];
    }): Promise<void>;
    /** 获取机器人自身详情（GET /users/@me）：id / username / avatar / bot。 */
    getSelfInfo(): Promise<{
        id: string;
        username: string;
        avatar: string;
        bot: boolean;
        shareUrl?: string;
        welcomeMsg?: string;
    }>;
    /** 获取群成员列表（分页，每页最多 30 条；需接口白名单权限）。 */
    listGroupMembers(groupOpenid: string, cursor?: string): Promise<{
        members: QqGroupMember[];
        nextCursor: string;
    }>;
    /** 群成员批量移除（单次最多 20 个；机器人需管理员且群主开启权限）。 */
    batchRemoveMembers(groupOpenid: string, memberOpenids: string[]): Promise<void>;
    /** 查询群禁言状态（全员禁言规则 + 成员级禁言列表；机器人需管理员）。 */
    getMuteState(groupOpenid: string): Promise<{
        globalMode: string;
        members: QqMuteMemberState[];
    }>;
    /**
     * 设置成员禁言 / 解除禁言（单次 ≤20 人；机器人需管理员）。
     * `minutes` ≤0 或省略表示立即解除（op=del）；否则按当前时间 + minutes 计算 RFC3339 到期时间。
     */
    setMemberMute(groupOpenid: string, memberOpenids: string[], minutes?: number): Promise<void>;
    /**
     * 全员禁言 / 全员解禁。
     *
     * ⚠️ 官方 POST /v2/groups/{id}/restrict_chat_setting 请求体仅支持 members（成员级），
     * global_rule 只在 GET 里返回（只读）。因此这里用「分页拉全群成员 → 每批 20 人
     * add/del」的方式近似实现全员效果；机器人自己/群主/管理员会被平台跳过（官方限制
     * 只能操作普通成员）。minutes≤0 表示全员解禁。返回实际处理的普通成员数量。
     */
    setGlobalMute(groupOpenid: string, minutes?: number): Promise<{
        affected: number;
    }>;
    /**
     * 更新已禁言成员的到期时间（op=update，单次 ≤20 人；机器人需管理员）。
     * 用于「续费禁言」（延长到期）与「减轻禁言」（缩短到期）：传入按成员计算好的绝对到期时间。
     */
    updateMemberMuteExpire(groupOpenid: string, entries: Array<{
        member_openid: string;
        mute_expire_at: string;
    }>): Promise<void>;
    /** 拉取入群申请列表（分页，默认 20 条/页；机器人需管理员）。 */
    listJoinRequests(groupOpenid: string, { cursor, limit }?: {
        cursor?: string | undefined;
        limit?: number | undefined;
    }): Promise<{
        list: QqJoinRequest[];
        nextCursor: string;
    }>;
    /** 审批入群申请（op=approve 通过 / decline 拒绝；机器人需管理员）。 */
    approveJoinRequest(groupOpenid: string, memberOpenid: string, { approve, joinRequestId, rejectReason, addToBlacklist }: {
        approve: boolean;
        joinRequestId?: string;
        rejectReason?: string;
        addToBlacklist?: boolean;
    }): Promise<void>;
    /** 查询入群自动审批策略列表（GET /v2/groups/join_approval_strategy）。 */
    listJoinStrategies(): Promise<QqJoinApprovalStrategy[]>;
    /** 创建入群自动审批策略（关联群 openid 列表；仅启用「平台策略」——规则细节由平台侧配置）。 */
    createJoinStrategy(groupOpenids: string[], remark?: string): Promise<string>;
    /** 删除入群自动审批策略。 */
    deleteJoinStrategy(strategyId: string): Promise<void>;
    /** 获取群基本信息（群名 / 简介 / 分类 / 标签 / 人数）。 */
    getGroupInfo(groupOpenid: string): Promise<QqGroupInfo>;
    /**
     * 获取机器人在群内的状态——用于判定管理员权限（member_role=admin/owner）。
     * 禁言 / 移除成员 / 入群审批等接口都要求机器人为管理员。
     */
    getBotGroupState(groupOpenid: string): Promise<QqBotGroupState>;
    /** 获取单个群成员信息（内邀接口）。 */
    getGroupMember(groupOpenid: string, memberOpenid: string): Promise<QqGroupMember | null>;
    /** 查询群黑名单（分页，limit 1~100）。 */
    listBlacklist(groupOpenid: string, { cursor, limit }?: {
        cursor?: string | undefined;
        limit?: number | undefined;
    }): Promise<{
        users: QqBlacklistUser[];
        nextCursor: string;
    }>;
    /**
     * 群黑名单操作（add 加入 / del 移出，单次 ≤20 人）。
     * 注意：目标成员在群中时无法加入黑名单（需先移除成员）。
     * @returns 操作失败的 openid 列表
     */
    modifyBlacklist(groupOpenid: string, op: "add" | "del", memberOpenids: string[]): Promise<string[]>;
    /**
     * 修改入群自动审批策略（启停 / 过期时间 / 增删关联群 / 备注）。
     * groupAction.op=add|del；group_openids 与 group_ids 互斥，这里统一用 openid。
     */
    patchJoinStrategy(strategyId: string, body?: {
        isEnable?: "on" | "off";
        expireAt?: string;
        remark?: string;
        groupAction?: {
            op: "add" | "del";
            groupOpenids: string[];
        };
    }): Promise<{
        isEnable: string;
        expireAt: string;
    }>;
    /** 执行入群自动审批策略（对关联群全量扫描，异步约 10 分钟完成）。 */
    executeJoinStrategy(strategyId: string): Promise<void>;
    /**
     * 修改入群自动审批策略的白名单号码（单次 ≤10000 个，字符串避免精度丢失）。
     * @returns 操作后的白名单号码数（估算）
     */
    setStrategyWhitelist(strategyId: string, op: "add" | "del", qqNumbers: string[]): Promise<number>;
    /** GET /users/@me/guilds：机器人已加入的频道列表。 */
    listGuilds(): Promise<Array<Record<string, unknown>>>;
    /** GET /guilds/{guild_id}：频道详情（名称 / 头像 / 创建者 / 人数 / 简介）。 */
    getGuild(guildId: string): Promise<Record<string, unknown>>;
    /** GET /guilds/{guild_id}/channels：子频道列表。 */
    listGuildChannels(guildId: string): Promise<Array<Record<string, unknown>>>;
    /** GET /channels/{channel_id}：子频道详情。 */
    getGuildChannel(channelId: string): Promise<Record<string, unknown>>;
    /** POST /guilds/{guild_id}/channels：创建子频道（私域接口，需管理员）。 */
    createGuildChannel(guildId: string, body: Record<string, unknown>): Promise<Record<string, unknown>>;
    /** PATCH /channels/{channel_id}：修改子频道。 */
    patchGuildChannel(channelId: string, body: Record<string, unknown>): Promise<Record<string, unknown>>;
    /** DELETE /channels/{channel_id}：删除子频道。 */
    deleteGuildChannel(channelId: string): Promise<void>;
    /**
     * GET /guilds/{guild_id}/members：频道成员列表（仅私域机器人）。
     * 平台可能重复返回上一页成员，调用方按 user.id 自行去重；next 取最后一位 user.id。
     */
    listGuildMembers(guildId: string, { after, limit }?: {
        after?: string | undefined;
        limit?: number | undefined;
    }): Promise<{
        members: Array<Record<string, unknown>>;
        next: string;
    }>;
    /** GET /guilds/{guild_id}/members/{user_id}：频道成员详情（仅私域机器人）。 */
    getGuildMember(guildId: string, userId: string): Promise<Record<string, unknown>>;
    /** GET /guilds/{guild_id}/roles：频道身份组列表（含 1=全体成员 / 2=管理员 / 4=创建者 / 5=子频道管理员）。 */
    listGuildRoles(guildId: string): Promise<Array<Record<string, unknown>>>;
    /** POST /guilds/{guild_id}/roles：创建身份组（需管理员）。 */
    createGuildRole(guildId: string, body: Record<string, unknown>): Promise<Record<string, unknown>>;
    /** PATCH /guilds/{guild_id}/roles/{role_id}：修改身份组。 */
    patchGuildRole(guildId: string, roleId: string, body: Record<string, unknown>): Promise<Record<string, unknown>>;
    /** DELETE /guilds/{guild_id}/roles/{role_id}：删除身份组。 */
    deleteGuildRole(guildId: string, roleId: string): Promise<void>;
    /**
     * 增删频道身份组成员：PUT / DELETE /guilds/{guild_id}/members/{user_id}/roles/{role_id}。
     * 身份组 5（子频道管理员）需带 channel.id 指定子频道。
     */
    setGuildMemberRole(guildId: string, userId: string, roleId: string, add: boolean, channelId?: string): Promise<void>;
    /**
     * POST /channels/{channel_id}/messages：向子频道发送文本消息（需子频道发言权限）。
     * msgId/eventId 二选一即变为被动回复（有效期 5 分钟，不占主动消息额度）。
     */
    sendChannelMessage(channelId: string, content: string, opts?: {
        msgId?: string;
        eventId?: string;
    }): Promise<Record<string, unknown>>;
    /** 把分钟转成禁言秒串；0 传 "0" 表示解除。平台两个字段二选一，统一用 mute_seconds。 */
    static muteSeconds(minutes: number): string;
    /** PATCH /guilds/{guild_id}/mute：全员禁言（非管理员）；传 0 解除。 */
    muteGuildAll(guildId: string, minutes: number): Promise<void>;
    /** PATCH /guilds/{guild_id}/members/{user_id}/mute：禁言指定成员；传 0 解除。 */
    muteGuildMember(guildId: string, userId: string, minutes: number): Promise<void>;
    /** PATCH /guilds/{guild_id}/mute：批量禁言；传 user_ids，0 解除。 */
    muteGuildMembers(guildId: string, userIds: string[], minutes: number): Promise<unknown>;
    /** GET /guilds/{guild_id}/message/setting：机器人消息频率设置。 */
    getGuildMessageSetting(guildId: string): Promise<Record<string, unknown>>;
    /** PUT /guilds/{guild_id}/message/setting：修改消息频率设置（官方参数原样透传）。 */
    putGuildMessageSetting(guildId: string, body: Record<string, unknown>): Promise<Record<string, unknown>>;
    /** DELETE /channels/{channel_id}/messages/{message_id}：撤回子频道消息；hideTip 控制小灰条。 */
    deleteGuildMessage(channelId: string, messageId: string, hideTip?: boolean): Promise<void>;
    /** GET /channels/{channel_id}/roles/{role_id}：查询子频道身份组权限。 */
    getGuildChannelRolePermission(channelId: string, roleId: string): Promise<Record<string, unknown>>;
    /** PATCH /channels/{channel_id}/roles/{role_id}：修改子频道身份组权限（add/remove 权限位）。 */
    patchGuildChannelRolePermission(channelId: string, roleId: string, add?: Record<string, unknown>, remove?: Record<string, unknown>): Promise<Record<string, unknown>>;
    /** GET /guilds/{guild_id}/members/{user_id}/roles：查询成员身份组（授权关系）。 */
    getGuildMemberRoles(guildId: string, userId: string): Promise<Record<string, unknown>>;
    /** GET /channels/{channel_id}/online_nums：子频道在线成员数。 */
    getGuildChannelOnlineNums(channelId: string): Promise<unknown>;
    /** GET /guilds/{guild_id}/roles/{role_id}/members：身份组成员列表（start_index / limit）。 */
    getGuildRoleMembers(guildId: string, roleId: string, startIndex?: number, limit?: number): Promise<unknown>;
    /** DELETE /guilds/{guild_id}/members/{user_id}：踢出频道成员。 */
    deleteGuildMember(guildId: string, userId: string): Promise<void>;
    /** GET /guilds/{guild_id}/api_permission：机器人可用接口权限列表。 */
    getGuildApiPermission(guildId: string): Promise<unknown>;
    /** POST /guilds/{guild_id}/api_permission：申请接口权限授权（返回授权链接）。 */
    demandGuildApiPermission(guildId: string, body: Record<string, unknown>): Promise<unknown>;
    /**
     * 注意：QQ 官方没有「获取公告列表」接口，GET /guilds/{id}/announces 会返回 405。
     * 保留此方法仅为兼容，不再被 RPC 调用；公告仅支持 POST 创建 / DELETE 删除。
     */
    getGuildAnnounces(guildId: string): Promise<unknown>;
    /** POST /guilds/{guild_id}/announces：发布频道公告。 */
    createGuildAnnounce(guildId: string, body: Record<string, unknown>): Promise<unknown>;
    /** DELETE /guilds/{guild_id}/announces/{message_id}：删除频道公告；messageId=all 删全部。 */
    deleteGuildAnnounce(guildId: string, messageId: string): Promise<void>;
    /** PUT /channels/{channel_id}/pins/{message_id}：添加精华消息（单频道最多 20 条）。 */
    addGuildPin(channelId: string, messageId: string): Promise<unknown>;
    /** DELETE /channels/{channel_id}/pins/{message_id}：删除精华消息。 */
    deleteGuildPin(channelId: string, messageId: string): Promise<unknown>;
    /** GET /channels/{channel_id}/pins：获取精华消息列表。 */
    getGuildPins(channelId: string): Promise<unknown>;
    /**
     * GET /channels/{channel_id}/messages：拉取子频道消息列表，用于拿到真实 message_id
     * （精华 / 撤回 / 引用回复都需要它，不能用子频道 ID 代替）。
     * limit 1-100；before/after 为消息 ID 游标，官方按 msg_id 分页。
     */
    getChannelMessages(channelId: string, opts?: {
        limit?: number;
        before?: string;
        after?: string;
    }): Promise<unknown>;
    /** GET /channels/{channel_id}/schedules：日程列表。 */
    getGuildSchedules(channelId: string): Promise<unknown>;
    /** GET /channels/{channel_id}/schedules/{schedule_id}：日程详情。 */
    getGuildSchedule(channelId: string, scheduleId: string): Promise<unknown>;
    /** POST /channels/{channel_id}/schedules：创建日程。 */
    createGuildSchedule(channelId: string, body: Record<string, unknown>): Promise<unknown>;
    /** PATCH /channels/{channel_id}/schedules/{schedule_id}：修改日程。 */
    patchGuildSchedule(channelId: string, scheduleId: string, body: Record<string, unknown>): Promise<unknown>;
    /** DELETE /channels/{channel_id}/schedules/{schedule_id}：删除日程。 */
    deleteGuildSchedule(channelId: string, scheduleId: string): Promise<void>;
    /** POST /channels/{channel_id}/audio：音频控制（上麦/下麦等，参数原样透传）。 */
    guildAudioControl(channelId: string, body: Record<string, unknown>): Promise<unknown>;
    /**
     * 论坛帖子接口（官方 server-inter/channel/content/forum + 官方 SDK botpy）：
     * 路径只需要 channel_id，没有 forum_id（旧文档里的 /forums/{forum_id}/ 已废弃）。
     * 下面方法保留 forumId 入参以兼容旧调用方，但实际忽略——一律走新路径。
     */
    /** GET /channels/{channel_id}/threads：帖子列表。 */
    getGuildForumThreads(channelId: string, _forumId?: string): Promise<unknown>;
    /** GET /channels/{channel_id}/threads/{thread_id}：帖子详情。 */
    getGuildForumThread(channelId: string, _forumIdOrThreadId: string, threadId?: string): Promise<unknown>;
    /** PUT /channels/{channel_id}/threads：发表帖子。 */
    createGuildForumThread(channelId: string, _forumId: string, body: Record<string, unknown>): Promise<unknown>;
    /** DELETE /channels/{channel_id}/threads/{thread_id}：删除帖子。 */
    deleteGuildForumThread(channelId: string, _forumIdOrThreadId: string, threadId?: string): Promise<void>;
    /** GET /channels/{channel_id}/permissions：子频道权限。 */
    getGuildChannelPermissions(channelId: string): Promise<unknown>;
    /** PUT /channels/{channel_id}/permissions/all：修改子频道全员权限。 */
    putGuildChannelPermissionAll(channelId: string, body: Record<string, unknown>): Promise<unknown>;
}
