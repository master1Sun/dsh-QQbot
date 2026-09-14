/**
 * 保存时规范化 tool 命令：若命令里出现脚本文件而解释器缺失/不匹配
 * （如 powershell -File xxx.vbs），改写为正确解释器前缀；
 * 命令已可执行（自带解释器或无需解释器）时返回 null（无需改写）。
 */
export declare function normalizeScriptCommand(command: string): string | null;
/** 由脚本绝对路径生成执行命令（AI 脚本生成完成后的回填）。 */
export declare function scriptCommandFor(absPath: string): string | null;
export interface CommandRunOptions {
    timeoutMs?: number;
    cwd?: string;
    env?: Record<string, string>;
}
export interface CommandRunResult {
    ok: boolean;
    exitCode: number | null;
    command: string;
    stdout: string;
    stderr: string;
    durationMs: number;
    timedOut: boolean;
    error?: string;
}
/** 执行一条命令：统一超时/缓冲/windowsHide，输出按 UTF-8 → GBK 解码。 */
export declare function runCommand(command: string, options?: CommandRunOptions): Promise<CommandRunResult>;
/**
 * 把命令执行结果格式化为可直接发送的文本（resultMode=raw 用）。
 * **只发输出内容本身**：不带「定时任务」标题、不带命令行/耗时/退出码等工具元信息，
 * 用户在 QQ 里看到的就是脚本的输出。
 */
export declare function formatCommandResult(result: CommandRunResult, limit?: number): string;
/**
 * 组装【任务契约】文本块（goal / notifyWhen），供 AI 模式与 tool 加工/校验复用。
 * 两者都为空时返回空串，便于调用方 `.filter(Boolean)` 拼接。
 */
export declare function composeContractBlock(contract: {
    goal?: string;
    notifyWhen?: string;
}): string;
/**
 * 生成「命令输出 → AI 播报」的整理用 prompt（resultMode=ai 用）。
 *
 * options.instruction 非空时用它替代内置的「整理成简洁播报」默认要求，
 * 让使用者能规定「把数据处理成什么样」（筛选 / 排序 / 限行 / 固定格式 / 阈值判断）。
 * options.contract 非空时注入【任务契约】，让模型在加工的同时按「通知条件」做分诊。
 * options.allowSilent=true 时额外授权模型「本次不发送」——
 * 只输出 {@link SILENT_MARKER} 即不投递、不占主动消息配额。
 */
export declare function composeParsePrompt(entryTitle: string, result: CommandRunResult, options?: {
    instruction?: string;
    allowSilent?: boolean;
    contract?: string;
    limit?: number;
}): string;
/**
 * 生成「发送前自校验」prompt：由独立模型复核草稿是否满足任务契约。
 * 只需输出最终正文或 {@link SILENT_MARKER}——既做门控，也顺带做一次润色。
 */
export declare function composeVerifyPrompt(entryTitle: string, draft: string, contract?: string): string;
