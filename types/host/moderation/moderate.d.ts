import type { ScriptGenLlm } from "../schedule/script-gen.js";
import { type ModerationConfig, type MuteLevel } from "./store.js";
/** 分类中文名（群内 @ 通知与日志用；与客户端 pt.modCat.* 文案对应）。 */
export declare const CATEGORY_LABELS: Readonly<Record<string, string>>;
/** 构造审核 system prompt。 */
export declare function moderationSystemPrompt(config: ModerationConfig): string;
export interface ModerationVerdict {
    level: MuteLevel;
    category: string;
    reason: string;
}
/**
 * 从模型输出里鲁棒解析 JSON。支持包 ```json``` 围栏、前后解释文字。
 * 解析失败一律返回 none（绝不误禁言）。
 */
export declare function parseVerdict(text: string): ModerationVerdict;
/** 从配置里取该等级对应的禁言分钟数（0 = 不禁言）。 */
export declare function minutesForLevel(config: ModerationConfig, level: MuteLevel): number;
export interface ModerateDeps {
    getLlm: () => ScriptGenLlm | undefined;
    resolveModel: (appId?: string) => {
        provider: string;
        model: string;
    } | undefined;
}
/** 审核一条消息；返回判定结果。模型不可用时抛错（调用方决定如何降级）。 */
export declare function moderateMessage(deps: ModerateDeps, appId: string, content: string, config: ModerationConfig): Promise<ModerationVerdict>;
