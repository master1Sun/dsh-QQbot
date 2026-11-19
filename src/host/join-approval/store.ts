/**
 * 入群 AI 自动审批：按「机器人 + 群」维度的配置与审批日志落盘。
 *
 * 逻辑独立于 bots.json 的行为配置与 moderation.json 的消息审核配置：
 *  - 配置是对象（开关 / 入群介绍要求 / 免审批名单），启用后由后台定时器定期自动执行；
 *  - 审批日志频繁追加，独立文件避免污染其它配置；
 *  - 记录已处理过的申请 ID，避免自动轮询时对同一批 pending 申请反复审核、重复烧 token；
 *  - 全程容错，读不到时返回默认结构，绝不阻断手动审批。
 *
 * 落盘 ~/.dsh/qqbot/join-approval.json。
 */
import { join } from "node:path";
import { readStoreJson, writeStoreJson, pluginDataDir } from "../infra/store-file.js";

const JOIN_APPROVAL_PATH = () => join(pluginDataDir(), "join-approval.json");

/** 单群自动审批配置。 */
export interface JoinApprovalConfig {
  /** 是否启用（未启用时「AI 自动审批」按钮不可用）。 */
  enabled: boolean;
  /** 入群介绍要求（自然语言，逐条；AI 判断申请介绍是否符合）。 */
  requirements: string[];
  /** 介绍为空时是否仍放行（默认 false：信息不足一律保留人工）。 */
  allowEmpty: boolean;
  /** 免审批名单：这些昵称的申请直接通过，不走 AI 判断。 */
  whitelist: string[];
}

/** 单条自动审批结果日志。 */
export interface JoinApprovalLog {
  at: string;
  appId: string;
  groupId: string;
  memberOpenid: string;
  username: string;
  /** pass=通过 / keep=保留人工 / decline=自动拒绝 / error=处理失败。 */
  action: "pass" | "keep" | "decline" | "error";
  /** AI 判定理由。 */
  reason: string;
  /** 入群介绍原文（截断）。 */
  intro: string;
  /** 失败原因（调用 QQ 接口异常时）。 */
  error?: string;
}

interface JoinApprovalFile {
  configs: Record<string, JoinApprovalConfig>;
  logs: JoinApprovalLog[];
  /** 每群已处理过的入群申请 ID（键为 joinKey），避免定时轮询重复审核。 */
  seen: Record<string, string[]>;
}

const LOG_CAP = 300;
/** 每群记住的最近申请 ID 数（超出丢最旧，防止落盘无限增长）。 */
const SEEN_CAP = 300;

/** 配置键：机器人 + 群。 */
export function joinKey(appId: string, groupId: string): string {
  return `${appId || "?"}::${groupId || "?"}`;
}

/** 默认配置：关闭，无要求，信息不足不放行，无白名单。 */
export function defaultJoinConfig(): JoinApprovalConfig {
  return { enabled: false, requirements: [], allowEmpty: false, whitelist: [] };
}

/** 归一化单群配置（容错：非法字段回退默认）。 */
function normalizeConfig(raw: unknown): JoinApprovalConfig {
  const src = raw && typeof raw === "object" && !Array.isArray(raw) ? raw as Record<string, unknown> : {};
  const d = defaultJoinConfig();
  return {
    enabled: typeof src.enabled === "boolean" ? src.enabled : d.enabled,
    requirements: Array.isArray(src.requirements)
      ? src.requirements.filter((r): r is string => typeof r === "string" && r.trim().length > 0).map((r) => r.trim()).slice(0, 50)
      : d.requirements,
    allowEmpty: typeof src.allowEmpty === "boolean" ? src.allowEmpty : d.allowEmpty,
    whitelist: Array.isArray(src.whitelist)
      ? src.whitelist.filter((w): w is string => typeof w === "string" && w.trim().length > 0).map((w) => w.trim()).slice(0, 200)
      : d.whitelist,
  };
}

export class JoinApprovalStore {
  #file: JoinApprovalFile | null = null;

  async #load(): Promise<JoinApprovalFile> {
    if (this.#file) return this.#file;
    const raw = await readStoreJson<unknown>(JOIN_APPROVAL_PATH());
    const src = raw && typeof raw === "object" && !Array.isArray(raw) ? raw as Record<string, unknown> : {};
    const configsRaw = src.configs && typeof src.configs === "object" ? src.configs as Record<string, unknown> : {};
    const configs: Record<string, JoinApprovalConfig> = {};
    for (const [key, value] of Object.entries(configsRaw)) configs[key] = normalizeConfig(value);
    const seenRaw = src.seen && typeof src.seen === "object" ? src.seen as Record<string, unknown> : {};
    const seen: Record<string, string[]> = {};
    for (const [key, value] of Object.entries(seenRaw)) {
      if (Array.isArray(value)) seen[key] = value.filter((v): v is string => typeof v === "string" && v.length > 0).slice(-SEEN_CAP);
    }
    this.#file = {
      configs,
      logs: Array.isArray(src.logs) ? (src.logs as JoinApprovalLog[]).slice(0, LOG_CAP) : [],
      seen,
    };
    return this.#file;
  }

  async #save(): Promise<void> {
    if (!this.#file) return;
    await writeStoreJson(JOIN_APPROVAL_PATH(), this.#file);
  }

  /** 读取单群配置（未配置时返回全默认副本）。 */
  async getConfig(appId: string, groupId: string): Promise<JoinApprovalConfig> {
    const file = await this.#load();
    const cfg = file.configs[joinKey(appId, groupId)] ?? defaultJoinConfig();
    return { ...cfg, requirements: [...cfg.requirements], whitelist: [...cfg.whitelist] };
  }

  /** 保存单群配置（归一化后写入）。 */
  async setConfig(appId: string, groupId: string, raw: unknown): Promise<JoinApprovalConfig> {
    const file = await this.#load();
    const config = normalizeConfig(raw);
    const key = joinKey(appId, groupId);
    file.configs[key] = config;
    // 配置变更（要求/白名单/空介绍策略）后，之前保留人工的申请需要按新配置重新审核。
    delete file.seen[key];
    await this.#save();
    return { ...config, requirements: [...config.requirements], whitelist: [...config.whitelist] };
  }

  /** 追加一条审批日志（仅保留最近 LOG_CAP 条）。 */
  async appendLog(log: JoinApprovalLog): Promise<void> {
    const file = await this.#load();
    file.logs.unshift(log);
    file.logs = file.logs.slice(0, LOG_CAP);
    await this.#save();
  }

  /** 查询日志（可按机器人 / 群过滤）。 */
  async listLogs(filter: { appId?: string; groupId?: string; limit?: number }): Promise<JoinApprovalLog[]> {
    const file = await this.#load();
    const limit = filter.limit && filter.limit > 0 ? filter.limit : 100;
    return file.logs
      .filter((l) => (!filter.appId || l.appId === filter.appId) && (!filter.groupId || l.groupId === filter.groupId))
      .slice(0, limit);
  }

  /** 列出所有开启了自动审批的「机器人 + 群」，供后台定时调度遍历。 */
  async listEnabledGroups(): Promise<Array<{ appId: string; groupId: string }>> {
    const file = await this.#load();
    const out: Array<{ appId: string; groupId: string }> = [];
    for (const [key, cfg] of Object.entries(file.configs)) {
      if (!cfg.enabled) continue;
      const sep = key.indexOf("::");
      if (sep <= 0 || sep === key.length - 2) continue;
      out.push({ appId: key.slice(0, sep), groupId: key.slice(sep + 2) });
    }
    return out;
  }

  /** 读取某群已处理过的申请 ID（定时轮询跳过它们，避免重复审核）。 */
  async listSeenIds(appId: string, groupId: string): Promise<Set<string>> {
    const file = await this.#load();
    return new Set(file.seen[joinKey(appId, groupId)] ?? []);
  }

  /** 标记一批申请已处理；配置变更后由 setConfig 清空。 */
  async markSeenIds(appId: string, groupId: string, ids: string[]): Promise<void> {
    const valid = ids.filter((id) => typeof id === "string" && id.length > 0);
    if (!valid.length) return;
    const file = await this.#load();
    const key = joinKey(appId, groupId);
    const merged = new Set([...(file.seen[key] ?? []), ...valid]);
    file.seen[key] = [...merged].slice(-SEEN_CAP);
    await this.#save();
  }
}
