import type { ScriptGenLlm } from "../schedule/script-gen.js";
import { type GuildModConfig, type GuildMuteLevel } from "./store.js";
export declare const GUILD_CATEGORY_LABELS: Readonly<Record<string, string>>;
export declare function guildModSystemPrompt(config: GuildModConfig): string;
export interface GuildVerdict {
    level: GuildMuteLevel;
    category: string;
    reason: string;
}
export declare function parseGuildVerdict(text: string): GuildVerdict;
export declare function minutesForGuildLevel(config: GuildModConfig, level: GuildMuteLevel): number;
export interface GuildModerateDeps {
    getLlm: () => ScriptGenLlm | undefined;
    resolveModel: (appId?: string) => {
        provider: string;
        model: string;
    } | undefined;
}
/** 审核一条频道消息。模型不可用时抛错，由 service 降级。 */
export declare function moderateGuildMessage(deps: GuildModerateDeps, appId: string, content: string, config: GuildModConfig): Promise<GuildVerdict>;
