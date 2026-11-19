/** 单群自动审批配置。 */
export interface JoinApprovalConfig {
    /** 是否启用（未启用时「AI 自动审批」按钮不可用）。 */
    enabled: boolean;
    /** 入群介绍要求（自然语言，逐条；AI 判断申请介绍是否符合）。 */
    requirements: string[];
    /** 介绍为空时是否仍放行（默认 false：信息不足一律保留人工）。 */
    allowEmpty: boolean;
    /** 免审批名单：这些昵称的申请直接通过，不走 AI 判断。 */
    whitelist: string[];
}
/** 单条自动审批结果日志。 */
export interface JoinApprovalLog {
    at: string;
    appId: string;
    groupId: string;
    memberOpenid: string;
    username: string;
    /** pass=通过 / keep=保留人工 / decline=自动拒绝 / error=处理失败。 */
    action: "pass" | "keep" | "decline" | "error";
    /** AI 判定理由。 */
    reason: string;
    /** 入群介绍原文（截断）。 */
    intro: string;
    /** 失败原因（调用 QQ 接口异常时）。 */
    error?: string;
}
/** 配置键：机器人 + 群。 */
export declare function joinKey(appId: string, groupId: string): string;
/** 默认配置：关闭，无要求，信息不足不放行，无白名单。 */
export declare function defaultJoinConfig(): JoinApprovalConfig;
export declare class JoinApprovalStore {
    #private;
    /** 读取单群配置（未配置时返回全默认副本）。 */
    getConfig(appId: string, groupId: string): Promise<JoinApprovalConfig>;
    /** 保存单群配置（归一化后写入）。 */
    setConfig(appId: string, groupId: string, raw: unknown): Promise<JoinApprovalConfig>;
    /** 追加一条审批日志（仅保留最近 LOG_CAP 条）。 */
    appendLog(log: JoinApprovalLog): Promise<void>;
    /** 查询日志（可按机器人 / 群过滤）。 */
    listLogs(filter: {
        appId?: string;
        groupId?: string;
        limit?: number;
    }): Promise<JoinApprovalLog[]>;
    /** 列出所有开启了自动审批的「机器人 + 群」，供后台定时调度遍历。 */
    listEnabledGroups(): Promise<Array<{
        appId: string;
        groupId: string;
    }>>;
    /** 读取某群已处理过的申请 ID（定时轮询跳过它们，避免重复审核）。 */
    listSeenIds(appId: string, groupId: string): Promise<Set<string>>;
    /** 标记一批申请已处理；配置变更后由 setConfig 清空。 */
    markSeenIds(appId: string, groupId: string, ids: string[]): Promise<void>;
}
