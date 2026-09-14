/**
 * QQ 机器人会话工具：把定时消息与主动发送暴露给 DSH Agent，
 * 让用户直接用自然语言「每天九点提醒我喝水」时由 AI 调用完成。
 *
 * 工具通过 exec.agent.id（= 会话 id）反查绑定的 QQ 聊天与来源机器人，
 * 因此 AI 在哪个群/单聊里被调用，操作的就是哪个聊天的定时消息、由哪个机器人发送。
 *
 * 注册为全局工具（ctx.tools.register）；未绑定聊天的会话调用会收到明确错误。
 */
import type { Context } from "@deepseek-ai/cordis";
import type { ToolDefinition } from "@deepseek-ai/dsh-tools";
import { ScheduleStore } from "../schedule/schedule.js";
import type { BotRuntimeManager } from "../bots.js";
import type { ChatMemoryStore } from "../infra/memory.js";
import type { ScriptGenerator } from "../schedule/script-gen.js";
export interface QqbotToolsContext {
    /** 多机器人运行时：按会话反查来源机器人（各自独立的状态 / 客户端）。 */
    bots: BotRuntimeManager;
    store: ScheduleStore;
    /** AI 脚本生成器：tool 模式含 genPrompt 的任务保存后入队生成。 */
    scriptGen?: ScriptGenerator;
    /** 每聊天长期记忆（qqbot_memory_* 工具）。 */
    memory?: ChatMemoryStore;
    logger: Pick<Console, "info" | "warn" | "error">;
}
export declare function buildQqbotTools({ bots, store, scriptGen, memory, logger }: QqbotToolsContext): ToolDefinition[];
/** 把工具注册到 host（全局）；返回卸载函数。 */
export declare function registerQqbotTools(ctx: Context, deps: QqbotToolsContext): () => void;
