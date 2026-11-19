import type { ScriptGenLlm } from "../schedule/script-gen.js";
import type { JoinApprovalConfig } from "./store.js";
export interface JoinReviewDeps {
    getLlm: () => ScriptGenLlm | undefined;
    resolveModel: (appId?: string) => {
        provider: string;
        model: string;
    } | undefined;
}
export interface JoinReviewInput {
    username: string;
    /** 入群介绍 / 验证回答。 */
    intro: string;
    /** 官方风险提示（有值则倾向人工复核）。 */
    riskTips: string;
    /** 用户配置的入群要求。 */
    config: JoinApprovalConfig;
}
export interface JoinReviewVerdict {
    /** 是否自动通过。 */
    pass: boolean;
    /** 判定理由（展示在日志 / 提示里）。 */
    reason: string;
}
/** 构造审核 system prompt。 */
export declare function joinReviewSystemPrompt(config: JoinApprovalConfig): string;
/** 从模型输出里鲁棒解析 JSON；解析失败一律 pass=false（保留人工）。 */
export declare function parseJoinVerdict(text: string): JoinReviewVerdict;
/** 审核一条入群申请。模型不可用时抛错（调用方决定如何降级）。 */
export declare function reviewJoinRequest(deps: JoinReviewDeps, appId: string, input: JoinReviewInput): Promise<JoinReviewVerdict>;
