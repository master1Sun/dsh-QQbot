/**
 * 机器人在各群视角的自身 openid 学习与持久化。
 *
 * 平台不提供「机器人自身 openid」的查询接口（openid 按群维度哈希）；但
 * GROUP_AT_MESSAGE_CREATE（@ 事件）的 content 首个 <@id> 即本机器人在该群的
 * openid（平台保证 AT 事件 @ 的就是本 bot）。据此学习并按机器人落盘：
 *
 *   ~/.dsh/qqbot/self-openids/<appId>.json   { 群openid: 本bot在该群的openid }
 *
 * 供群全量事件（GROUP_MESSAGE_CREATE）精确判定「@ 的是不是本机器人」。
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pluginDataDir } from "./store-file.js";

function filePath(appId: string): string {
  return join(pluginDataDir(), "self-openids", `${appId.replace(/[^A-Za-z0-9_-]/g, "_")}.json`);
}

export class SelfOpenidStore {
  readonly #logger: Pick<Console, "warn" | "error">;

  constructor(logger: Pick<Console, "warn" | "error">) {
    this.#logger = logger;
  }

  /** 读某机器人已学习的 { 群openid → 自身openid }；文件缺失/损坏返回空表。 */
  async load(appId: string): Promise<Map<string, string>> {
    const map = new Map<string, string>();
    try {
      const raw = JSON.parse(await readFile(filePath(appId), "utf8")) as Record<string, unknown>;
      for (const [group, id] of Object.entries(raw)) {
        if (group && typeof id === "string" && id) map.set(group, id);
      }
    } catch {
      /* 文件缺失或损坏 → 空表（首次 AT 事件后重新学习） */
    }
    return map;
  }

  /** 落盘某机器人的学习结果。 */
  async save(appId: string, map: Map<string, string>): Promise<void> {
    try {
      await mkdir(join(pluginDataDir(), "self-openids"), { recursive: true });
      await writeFile(filePath(appId), JSON.stringify(Object.fromEntries(map), null, 2), "utf8");
    } catch (error) {
      this.#logger.warn(`[dsh-qqbot] 自身 openid 记录落盘失败（机器人 ${appId}）:`, error);
    }
  }
}
