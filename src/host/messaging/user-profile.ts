/**
 * 用户资料（昵称 / 头像 URL）持久化。
 *
 * 消息事件 author 自 20261116 起携带 username / avatar / member_nickname，
 * 收消息时学习进 bot.userProfiles（内存）。但纯内存缓存在重启 `dsh web` 后清空，
 * 归档里已看到过真实头像的用户会退回默认图标。本存储把学习结果按机器人落盘：
 *
 *   ~/.dsh/qqbot/user-profiles/<appId>.json   { openid: { name, avatar } }
 *
 * 缓存性质：写回做防抖，进程被强杀时最多丢一个防抖窗口内的更新（下次收消息会重新学习）。
 * 条目有上限，超出后淘汰最早学习的（Map 保持插入顺序）。
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { pluginDataDir, writeStoreJson } from "../infra/store-file.js";

const MAX_ENTRIES = 2000;
const SAVE_DELAY_MS = 800;

function filePath(appId: string): string {
  return join(pluginDataDir(), "user-profiles", `${appId.replace(/[^A-Za-z0-9_-]/g, "_")}.json`);
}

export type UserProfile = { name: string; avatar: string };

export class UserProfileStore {
  readonly #logger: Pick<Console, "warn" | "error">;
  readonly #timers = new Map<string, ReturnType<typeof setTimeout>>();

  constructor(logger: Pick<Console, "warn" | "error">) {
    this.#logger = logger;
  }

  /** 读某机器人已学习的资料；文件缺失 / 损坏返回空表。 */
  async load(appId: string): Promise<Map<string, UserProfile>> {
    const map = new Map<string, UserProfile>();
    try {
      const raw = JSON.parse(await readFile(filePath(appId), "utf8")) as Record<string, unknown>;
      for (const [openid, v] of Object.entries(raw)) {
        if (!openid || !v || typeof v !== "object") continue;
        const { name, avatar } = v as Record<string, unknown>;
        if (typeof name !== "string" && typeof avatar !== "string") continue;
        map.set(openid, {
          name: typeof name === "string" ? name : "",
          avatar: typeof avatar === "string" ? avatar : "",
        });
      }
    } catch {
      /* 文件缺失或损坏 → 空表（收消息后重新学习） */
    }
    return map;
  }

  /** 防抖写回；同一机器人短时间内多次学习只落盘一次。 */
  scheduleSave(appId: string, map: Map<string, UserProfile>): void {
    const prev = this.#timers.get(appId);
    if (prev) clearTimeout(prev);
    this.#timers.set(appId, setTimeout(() => {
      this.#timers.delete(appId);
      void this.save(appId, map);
    }, SAVE_DELAY_MS));
  }

  /** 立即落盘；超过上限时淘汰最早插入的条目。 */
  async save(appId: string, map: Map<string, UserProfile>): Promise<void> {
    try {
      if (map.size > MAX_ENTRIES) {
        let toRemove = map.size - MAX_ENTRIES;
        for (const key of map.keys()) {
          if (toRemove-- <= 0) break;
          map.delete(key);
        }
      }
      await writeStoreJson(filePath(appId), Object.fromEntries(map));
    } catch (error) {
      this.#logger.warn(`[dsh-qqbot] 用户资料落盘失败（机器人 ${appId}）:`, error);
    }
  }
}
