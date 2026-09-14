/**
 * 定时任务动作注册表（tool 模式的确定性动作）：send_message / send_image /
 * send_file / send_voice。动作不开 LLM，直接调用 BotRuntime 的发送 API 把
 * 内容送到目标聊天；媒体发送前过 SSRF / 本地路径白名单守卫。
 */
import type { BotRuntime } from "../bots.js";
interface ActionContext {
    bot: BotRuntime;
    scope: "group" | "c2c";
    openid: string;
    logger: Pick<Console, "info" | "warn" | "error">;
}
interface ActionArgSpec {
    key: string;
    type: "content" | "url" | "localPath" | "fileName";
    label: string;
    required?: boolean;
    placeholder?: string;
}
export interface ScheduledAction {
    id: string;
    label: string;
    description: string;
    args: ActionArgSpec[];
    execute(args: Record<string, unknown>, ctx: ActionContext): Promise<void>;
}
export declare const SCHEDULED_ACTIONS: ScheduledAction[];
export declare const SCHEDULED_ACTION_IDS: string[];
/** 按名称执行定时动作：先校验必填参数，再交由动作实现。 */
export declare function runScheduledAction(tool: string, args: Record<string, unknown> | undefined, ctx: ActionContext): Promise<void>;
export {};
