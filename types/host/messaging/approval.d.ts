/**
 * 按钮审批（参考 oc-src features/approval-handler 的 Inline Keyboard 模式）：
 *
 * AI 在执行敏感操作（命令、外发、删除等）前调用 qqbot_request_approval 工具，
 * 机器人向当前聊天发一条带「允许 / 拒绝」按钮的 Markdown 消息（msg_type=2 + keyboard）：
 *
 *   - 按钮 action.type=1（Callback）：点击后平台推 INTERACTION_CREATE，
 *     data.resolved.button_data = `qqbot-approval:<id>:allow|deny`；
 *   - group_id 相同 → 点一个后其余变灰（二选一语义）；click_limit=1 每人只能点一次；
 *   - permission.type=2 → 所有群成员可点（管理员约束由调用方自行评估）；
 *   - 收到回调先 acknowledgeInteraction（平台要求的数秒内 ACK），再唤醒等待中的工具；
 *   - 超时未点击 → 决议为 timeout（等同拒绝），工具带着明确结论返回给模型。
 *
 * 会话键匹配：回调里的 chat（c2c: openid / group: group_openid）必须与请求时一致，
 * 防止别的聊天点到了别处的审批按钮。
 */
/** INTERACTION_CREATE 事件体（SDK InteractionEvent 的结构化子集）。 */
export interface ApprovalInteractionEvent {
    id: string;
    user_openid?: string;
    group_openid?: string;
    group_member_openid?: string;
    data?: {
        resolved?: {
            button_data?: string;
            button_id?: string;
        };
    };
}
export type ApprovalDecision = "allow" | "deny" | "timeout";
/** 审批依赖的客户端能力子集（QqApiClient 满足此形状）。 */
export interface ApprovalClient {
    sendMarkdown: (target: {
        scope: "c2c" | "group";
        openid: string;
    }, content: string, opts?: Record<string, unknown>) => Promise<string | undefined>;
    acknowledgeInteraction: (interactionId: string, prompt?: string) => Promise<void>;
}
export declare class ApprovalManager {
    #private;
    constructor(client: ApprovalClient, logger: Pick<Console, "info" | "warn">);
    /** 当前等待中的审批数量（调试/观测）。 */
    get pendingCount(): number;
    /**
     * 发送审批按钮消息并等待用户点击。解析为 allow / deny / timeout；
     * 消息发送失败直接抛错（工具返回错误，模型不会误以为已获批）。
     */
    request(target: {
        scope: "c2c" | "group";
        openid: string;
    }, { title, description, timeoutSeconds }: {
        title: string;
        description?: string;
        timeoutSeconds?: number;
    }): Promise<ApprovalDecision>;
    /**
     * 处理 INTERACTION_CREATE 事件：命中本管理器的待决审批时回 ACK 并唤醒等待方。
     * 返回 true 表示事件已消费（index.ts 不再记未处理告警）。
     */
    handleInteraction(event: ApprovalInteractionEvent): Promise<boolean>;
    /** 机器人移除/停机时清理全部等待（等待方收到 timeout）。 */
    dispose(): void;
}
