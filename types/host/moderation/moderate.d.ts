import type { ScriptGenLlm } from "../schedule/script-gen.js";
import { type ModerationConfig, type MuteLevel } from "./store.js";
/** 内置分类的可读定义（注入模型，中文，与客户端 dict 文案对应）。 */
export declare const CATEGORY_DEFS: Record<string, string>;
/** 审核尺度：宽松（默认，只判明确违规）/ 标准 / 严格。老配置缺省视为宽松。 */
export type Strictness = "lenient" | "normal" | "strict";
/** 分类中文名（群内 @ 通知与日志用；与客户端 pt.modCat.* 文案对应）。 */
export declare const CATEGORY_LABELS: Readonly<Record<string, string>>;
/** 构造审核 system prompt。 */
export declare function moderationSystemPrompt(config: ModerationConfig): string;
export interface ModerationVerdict {
    level: MuteLevel;
    category: string;
    reason: string;
    /** 命中的那一条规则（内置分类名或自定义规则原文）；群内通知的「依据群规」只显示这一条。 */
    rule?: string;
}
/**
 * 审核语境：帮模型分辨「玩笑/互怼/引用讨论」与「真违规」。
 * 全部是外部聊天数据，注入时显式标注，且明确告知只审最后一条当前消息。
 */
export interface ModerationContext {
    /** 当前消息之前的最近群聊（旧 → 新），不含当前消息本身。 */
    recent?: Array<{
        sender: string;
        content: string;
    }>;
    /** 当前消息引用/回复的那条原话（能恢复时才有）。 */
    quoted?: {
        sender: string;
        content: string;
    };
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
export declare function moderateMessage(deps: ModerateDeps, appId: string, content: string, config: ModerationConfig, context?: ModerationContext): Promise<ModerationVerdict>;
