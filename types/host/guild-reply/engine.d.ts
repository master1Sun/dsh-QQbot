import type { ScriptGenLlm } from "../schedule/script-gen.js";
import type { GuildReplyConfig } from "./store.js";
export interface GuildReplyDeps {
    getLlm: () => ScriptGenLlm | undefined;
    resolveModel: (appId?: string) => {
        provider: string;
        model: string;
    } | undefined;
}
export declare function guildReplySystemPrompt(config: GuildReplyConfig): string;
/** 生成一条频道回帖；模型不可用时抛错，由 service 捕获降级。 */
export declare function generateGuildReply(deps: GuildReplyDeps, appId: string, config: GuildReplyConfig, params: {
    trigger: "post" | "mention";
    senderName: string;
    content: string;
}): Promise<string>;
