/**
 * 设置界面目录源：从宿主 ~/.dsh/settings.yaml 读取「已配置的模型」。
 *
 * settings.yaml 中的模型配置形态（llm-* 插件段）：
 *   agent-default-model: { provider, model }          ← 宿主默认模型（置顶标注）
 *   llm-<provider>:
 *     models: [ { id, name?, contextWindow? } ]        ← 直连模型列表
 *     providers: <name>: { models: [ { id, name? } ] } ← 多供应商嵌套列表
 *
 * 输出统一为 { id: "provider/model", name, provider }，供设置界面下拉选择。
 */
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";
import * as yaml from "js-yaml";

export interface ModelOption {
  /** 路由 id："provider/model"（与 StoredBotConfig.model 的写入格式一致）。 */
  id: string;
  /** 展示名（模型 name 字段；缺省用 id）。 */
  name: string;
  provider: string;
  /** 供应商显示名（如 "DeepSeek"），用于下拉分组标题；缺省用 provider。 */
  providerLabel?: string;
}

type YamlValue = unknown;
type YamlRecord = Record<string, YamlValue>;

const isRecord = (v: YamlValue): v is YamlRecord =>
  v !== null && typeof v === "object" && !Array.isArray(v);

/** 从 llm-* 段里抽取模型列表（顶层 models 与 providers.<name>.models 两种形态）。 */
function collectFromLlmBlock(blockKey: string, block: YamlRecord, out: ModelOption[]): void {
  const blockProvider = blockKey.replace(/^llm-/, "");
  const push = (provider: string, raw: YamlValue, providerLabel?: string): void => {
    if (!Array.isArray(raw)) return;
    for (const entry of raw) {
      if (typeof entry === "string") {
        if (entry.trim()) out.push({ id: `${provider}/${entry.trim()}`, name: entry.trim(), provider, providerLabel });
        continue;
      }
      if (!isRecord(entry)) continue;
      const id = typeof entry.id === "string" ? entry.id.trim() : "";
      if (!id) continue;
      const name = typeof entry.name === "string" && entry.name.trim() ? entry.name.trim() : id;
      out.push({ id: `${provider}/${id}`, name, provider, providerLabel });
    }
  };
  push(blockProvider, block.models);
  const providers = block.providers;
  if (isRecord(providers)) {
    for (const [name, conf] of Object.entries(providers)) {
      if (!isRecord(conf)) continue;
      const label = typeof conf.displayName === "string" && conf.displayName.trim() ? conf.displayName.trim() : undefined;
      push(name, conf.models, label);
    }
  }
}

/** 读取宿主已配置的模型（读不到时返回空数组，调用方自行兜底当前值）。 */
export async function loadConfiguredModels(settingsPath?: string): Promise<ModelOption[]> {
  const file = settingsPath ?? path.join(homedir(), ".dsh", "settings.yaml");
  let text: string;
  try {
    text = await readFile(file, "utf8");
  } catch {
    return [];
  }
  let doc: YamlValue;
  try {
    doc = (yaml as { load?: (text: string) => YamlValue }).load?.(text);
  } catch {
    return [];
  }
  if (!isRecord(doc)) return [];
  const out: ModelOption[] = [];

  // 宿主默认模型置顶（agent-default-model: { provider, model }）。
  const def = doc["agent-default-model"];
  if (isRecord(def) && typeof def.provider === "string" && typeof def.model === "string") {
    const provider = def.provider.trim();
    const model = def.model.trim();
    if (provider && model) {
      out.push({ id: `${provider}/${model}`, name: model, provider: `${provider}（默认）` });
    }
  }

  for (const [key, block] of Object.entries(doc)) {
    if (key.startsWith("llm-") && isRecord(block)) collectFromLlmBlock(key, block, out);
  }
  // 按 id 去重（保持出现顺序，默认模型在最前）。
  const seen = new Set<string>();
  return out.filter((m) => (seen.has(m.id) ? false : (seen.add(m.id), true)));
}
