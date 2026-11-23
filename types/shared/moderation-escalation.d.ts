/**
 * 违规叠加（累进）惩罚的纯计算逻辑，宿主与客户端共用一份，避免两处公式跑偏。
 *
 * 背景：早期版本「本次禁言 = 该等级基础时长 × 近 30 天第 N 次违规」写死，
 * 既不能关，也不能调。这里把它做成可开关、可选算法、可设封顶与清零窗口的机制。
 *
 * 三种方式：
 *  - linear    线性递增：base × (1 + 系数 × (第 N 次 - 1))。系数 1 即原来的 base × N。
 *  - geometric 倍数递增：base × 系数 ^ (第 N 次 - 1)。系数 2 即逐次翻倍。
 *  - custom    自定义阶梯：直接按第 N 次取「每次分钟数」列表的第 N 项，超出取最后一项；
 *              列表为空时回退到 linear（系数按 1 算），保证不会因漏填而禁言 0 分钟。
 *
 * 关闭叠加（enabled=false）时每次都只按基础时长，连封顶也不再干预（基础时长本身已在配置里 clamp 过）。
 */
/** 叠加惩罚算法。 */
export type EscalateMode = "linear" | "geometric" | "custom";
/** 计算叠加惩罚所需的最小配置；宿主 ModerationConfig 与客户端草稿都满足此接口。 */
export interface EscalationSettings {
    /** 叠加惩罚总开关。 */
    escalateEnabled: boolean;
    /** 叠加算法。 */
    escalateMode: EscalateMode;
    /** linear / geometric 的递增系数。 */
    escalateFactor: number;
    /** custom 的阶梯分钟数（第 N 项 = 第 N 次违规的禁言分钟数）。 */
    escalateSteps: number[];
    /** 叠加后的禁言上限（分钟，最大 43200 = 30 天平台限制）。 */
    escalateCap: number;
}
/** 默认叠加配置：保持旧行为（按次数线性递增、封顶 30 天）。 */
export declare const DEFAULT_ESCALATION: EscalationSettings;
/** 单次禁言上限（分钟）：QQ 平台 30 天限制。 */
export declare const MUTE_MAX_MINUTES = 43200;
/** 归一化阶梯列表：只留有效的 1..43200 整数（非法值直接丢弃，不补成 1 分钟），最多 20 项。 */
export declare function normalizeEscalateSteps(raw: unknown): number[];
/**
 * 计算第 offense 次违规的禁言分钟数。
 * @param baseMinutes 该违规等级的基础时长（分钟），0 表示不禁言
 * @param settings 叠加配置
 * @param offense 本次是近窗口内第几次违规（从 1 开始）
 */
export declare function escalateDuration(baseMinutes: number, settings: EscalationSettings, offense: number): number;
