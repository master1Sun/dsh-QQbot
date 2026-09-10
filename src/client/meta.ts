/**
 * 设置项元数据（纯数据，无 UI 逻辑）：
 * 字段标签 / 数值项说明 / 开关定义 / 冷却时长候选与文案。
 */

import { fmt, t } from "./i18n/index.js";

export const FIELD_LABELS: Record<string, string> = {
  workspacePath: t("session.workspace"),
  agentPreset: "Agent Preset",
  model: t("session.model"),
  valueThreshold: t("tune.groupValueThreshold"),
  atContextMessages: t("tune.atContext"),
  groupCooldownMs: t("tune.minGroupInterval"),
  senderCooldownMs: t("tune.sameSenderInterval"),
  replyChunkChars: t("tune.chunkChars"),
  maxRepliesPerMessage: t("tune.maxReplies"),
  quoteMaxChars: t("policy.quoteLimit"),
  quotaPerDay: t("quota.daily"),
};

/** 数值项说明：写清「影响什么 + 什么时候生效」，配置界面直接展示。 */
export const FIELD_HELP: Record<string, string> = {
  valueThreshold: t("tune.groupValueThresholdHint"),
  atContextMessages: t("tune.atContextHint"),
  groupCooldownMs: t("tune.minGroupIntervalHint"),
  senderCooldownMs: t("tune.sameSenderIntervalHint"),
  replyChunkChars: t("tune.chunkCharsHint"),
  maxRepliesPerMessage: t("tune.maxRepliesHint"),
  quoteMaxChars: t("policy.quoteLimitHint"),
  quotaPerDay: t("quota.dailyHint"),
};

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
export const SWITCH_DEFS: Array<{ key: string; label: string; desc: string; def: boolean }> = [
  {
    key: "groupFullReply",
    label: t("policy.fullGroupReply"),
    desc: t("policy.fullGroupReplyHint"),
    def: true,
  },
  {
    key: "respondToBots",
    label: t("policy.respondBots"),
    desc: t("policy.respondBotsHint"),
    def: false,
  },
  // archiveEnabled / memoryEnabled / fileIngestion 已从界面移除（默认常开，仅 bots.json 可配）——
  // 见本文件顶部注释；配置解析与默认值仍在 shared/config.ts 与 store-file.ts 中保留。
  {
    key: "approvalButtons",
    label: t("feature.buttonApproval"),
    desc: t("feature.buttonApprovalHint"),
    def: true,
  },
  {
    key: "ssrfGuard",
    label: t("feature.ssrfGuard"),
    desc: t("feature.ssrfGuardHint"),
    def: true,
  },
];

export const COOLDOWN_OPTIONS = [0, 10_000, 30_000, 60_000, 120_000, 300_000, 600_000, 1_800_000];

export function cooldownLabel(ms: number): string {
  if (ms === 0) return t("common.unlimited");
  if (ms % 60_000 === 0 && ms >= 60_000) return fmt("unit.minutes", ms / 60_000);
  return fmt("unit.seconds", ms / 1000);
}
