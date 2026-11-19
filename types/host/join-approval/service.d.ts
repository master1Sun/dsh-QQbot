/**
 * 入群 AI 自动审批服务：把「读取申请 → AI 判定 → 通过的自动审批 → 日志」串起来，供 RPC 调用。
 *
 * 启用配置后由后台定时器定期自动执行（默认 5 分钟一轮），无需手动点击；
 * 默认只自动通过明显符合要求的申请，不符合 / 信息不足 / 判定失败的一律保留给人工处理，
 * 绝不自动拒绝真实用户。已处理的申请会记 ID，避免定时轮询对同一批 pending 反复审核、重复烧 token。
 */
import type { BotRuntime } from "../bots.js";
import { JoinApprovalStore, type JoinApprovalConfig, type JoinApprovalLog } from "./store.js";
import { type JoinReviewDeps } from "./review.js";
export interface JoinApprovalRunResult {
    /** 本次检查的申请总数。 */
    total: number;
    /** AI 自动通过数。 */
    passed: number;
    /** 保留人工数（不符合 / 信息不足 / 风险提示 / 判定失败）。 */
    kept: number;
    /** 审批接口调用失败数。 */
    failed: number;
    /** 逐条结果明细（含昵称、理由，供界面展示；最多 30 条）。 */
    details: Array<{
        username: string;
        action: JoinApprovalLog["action"];
        reason: string;
    }>;
}
export declare class JoinApprovalService {
    #private;
    readonly store: JoinApprovalStore;
    constructor(deps: JoinReviewDeps, logger: Pick<Console, "info" | "warn" | "error">);
    /**
     * 启动后台定时审批：每隔 intervalMs 扫描所有已启用配置的「机器人 + 群」各跑一轮。
     * 启动 20 秒后先跑一轮（等机器人连接建立），避免刚配好要等满一个周期。
     * 返回停止函数，供插件卸载时清理定时器。
     */
    startAuto(bots: {
        get(appId: string): BotRuntime | undefined;
    }, intervalMs?: number): () => void;
    getConfig(appId: string, groupId: string): Promise<JoinApprovalConfig>;
    saveConfig(appId: string, groupId: string, raw: unknown): Promise<JoinApprovalConfig>;
    /** 从申请里提取可审核的介绍文本（入群回答 + 验证问答）。 */
    static extractIntro(req: {
        verify_info?: {
            verify_message?: string;
            review_qa_list?: Array<{
                question?: string;
                answer?: string;
            }>;
        };
    }): string;
    /** 对某个群执行一轮自动审批。 */
    run(bot: BotRuntime, groupId: string, limit: number): Promise<JoinApprovalRunResult>;
}
