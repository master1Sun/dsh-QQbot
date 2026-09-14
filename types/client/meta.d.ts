/**
 * 设置项元数据（纯数据，无 UI 逻辑）：
 * 字段标签 / 数值项说明 / 开关定义 / 冷却时长候选与文案。
 */
export declare const FIELD_LABELS: Record<string, string>;
/** 数值项说明：写清「影响什么 + 什么时候生效」，配置界面直接展示。 */
export declare const FIELD_HELP: Record<string, string>;
/**
 * 开关项说明：逐条写清开启/关闭后的实际行为。
 *
 * 注意：以下配置项**刻意不出现在设置页**，只能通过 bots.json（配置文件）调整，
 * 界面不再提供开关（默认值见 shared/config.ts resolveConfig）：
 *   allowC2c（默认开）· markdownReply（默认开）· proactiveFallback（默认关）
 *   multimodalInbound（默认开）· welcomeEnabled（默认开）· reactionRecall（默认开）
 *   sanitizeReplies（默认开）· typingIndicator（默认开）· ttsReply（默认关）
 *   localPathWhitelist（默认关）· voiceTranscription（默认 note，平台转写）
 *   archiveEnabled（默认开）· memoryEnabled（默认开）· fileIngestion（默认开）
 * 另有以下**字段**（非开关）同样不出现在设置页：
 *   secretEnv（默认空，AppSecret 凭据引用）· agentPresetChat（默认空，群聊聊天 Preset，留空跟随 agentPreset）
 */
export declare const SWITCH_DEFS: Array<{
    key: string;
    label: string;
    desc: string;
    def: boolean;
}>;
export declare const COOLDOWN_OPTIONS: number[];
export declare function cooldownLabel(ms: number): string;
