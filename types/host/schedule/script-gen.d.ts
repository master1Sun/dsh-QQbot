import type { ScheduleEntry, ScheduleStore } from "./schedule.js";
/** 宿主 LLM 流式服务的最小接口（避免直接依赖宿主类型）。 */
export interface ScriptGenLlm {
    stream(request: {
        provider: string;
        model: string;
        system: string;
        messages: unknown[];
        temperature?: number;
    }): AsyncIterable<{
        type: string;
        text?: string;
    }>;
}
export interface ScriptGeneratorDeps {
    store: ScheduleStore;
    /** 按机器人 appId 解析当前选择的模型（设置页配置）。 */
    resolveModel: (appId?: string) => {
        provider: string;
        model: string;
    } | undefined;
    /** 取宿主 LLM 服务（可能未就绪）。 */
    getLlm: () => ScriptGenLlm | undefined;
    logger: Pick<Console, "info" | "warn" | "error">;
}
export interface ScriptGenerator {
    /** 有新 pending 任务时入队生成（去重：同一任务同时只跑一次）。 */
    enqueue(entry: ScheduleEntry): void;
    /** 启动时扫描全部任务，把遗留的 pending 重新入队。 */
    flushPending(): void;
}
export declare function createScriptGenerator(deps: ScriptGeneratorDeps): ScriptGenerator;
