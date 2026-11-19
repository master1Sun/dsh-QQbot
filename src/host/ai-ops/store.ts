/**
 * AI 操作执行记录持久化：群聊 / 频道各自一份 JSON，互不混写。
 *
 *   ~/.dsh/qqbot/ai-ops-group.json  群聊（agent 聊天里通过 qqbot_manage 触发）
 *   ~/.dsh/qqbot/ai-ops-guild.json  频道（同上，guildId 指定时）
 *
 * 每条记录含：聊天原话、识别来源、执行动作、结果与目标。采用原子写入，
 * 重启 dsh web 后仍可在设置页「执行记录」里看到历史操作。
 */
import { join } from "node:path";
import { pluginDataDir, readStoreJson, writeStoreJson } from "../infra/store-file.js";

export type AiOpsScope = "group" | "guild";

/** 一条 AI 操作记录。 */
export interface AiOpsLogEntry {
  id: number;
  at: string;
  appId: string;
  scope: AiOpsScope;
  groupOpenid?: string;
  guildId?: string;
  channelId?: string;
  /** 用户在聊天里说的原话。 */
  text: string;
  action?: string;
  actionLabel?: string;
  ok: boolean;
  source: "local" | "llm" | "cache" | "none";
  reply: string;
  error?: string;
  usedLlm: boolean;
}

interface AiOpsLogFile {
  version: 1;
  logs: AiOpsLogEntry[];
}

/** 场景专属记录文件路径（两侧必须一致，避免运行时与排查时找错文件）。 */
export function aiOpsLogPath(scope: AiOpsScope): string {
  return join(pluginDataDir(), scope === "guild" ? "ai-ops-guild.json" : "ai-ops-group.json");
}

/** 读取某场景的记录；文件缺失 / 损坏一律视为空，不影响机器人启动。 */
export async function loadAiOpsLogs(scope: AiOpsScope): Promise<AiOpsLogEntry[]> {
  const file = await readStoreJson<AiOpsLogFile>(aiOpsLogPath(scope));
  if (!file || !Array.isArray(file.logs)) return [];
  return file.logs.filter((row): row is AiOpsLogEntry =>
    Boolean(row && typeof row === "object" && typeof row.text === "string" && typeof row.at === "string"));
}

/** 原子写入某场景的记录（调用方保证串行，避免并发写覆盖）。 */
export async function saveAiOpsLogs(scope: AiOpsScope, logs: AiOpsLogEntry[]): Promise<void> {
  const file: AiOpsLogFile = { version: 1, logs };
  await writeStoreJson(aiOpsLogPath(scope), file);
}
