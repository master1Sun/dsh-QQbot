/**
 * dsh-qqbot — 把多个 QQ 官方机器人（WebSocket 长连接）接入本机 DeepSeek Harness。
 *
 * 多机器人架构：
 *  - bots.json 保存多个机器人（各自凭据 + 独立行为配置），全部 enabled 的机器人**同时连接**；
 *  - 每个机器人各自持一套运行状态 / API 客户端 / WebSocket 连接 / 归档器，互不干扰；
 *  - 同一条群消息会被每个在该群里的机器人各自判定、各自回复（冷却与群缓冲也各自独立）；
 *  - 主动消息 / 定时消息按归属机器人发送，未指定时落入「主机器人」。
 *
 * 能力：
 *  - QQ WebSocket 接收源（本机主动拨出网关，无需公网回调）→ webhookRuntime 会话；
 *  - 群全量消息（价值过滤）+ 群 AT + 单聊，统一会话入口；
 *  - 会话复用、聊天内命令、回复泵（Markdown 优先）；
 *  - 扫码 / 手动登录，凭据落盘并热生效（热重建对应 WS 连接）；
 *  - 设置界面：dsh 设置页「QQ 机器人」（connection.rpc 通道）。
 */
import type { Context } from "@deepseek-ai/cordis";
import { loadConfiguredModels, type ModelOption } from "./catalogs.js";
import { createAdminService } from "./admin.js";
import { credentialRef } from "@deepseek-ai/dsh-credentials";
import { QrLoginManager } from "./qr-login.js";
import { createQqRule } from "./rule.js";
import { installReplyPump } from "./reply.js";
import { makeQqbotRoutes } from "./routes.js";
import { BotRuntimeManager, type BotRuntime } from "./bots.js";
import { loadGlobalConfig, saveCredentials, upsertBot, type StoredBot, type StoredCredentials } from "./store-file.js";
import { ScheduleStore, Scheduler, type ScheduleEntry } from "./schedule.js";
import { registerQqbotTools } from "./tools.js";
import { ChatMemoryStore } from "./memory.js";
import { Outbox } from "./outbox.js";
import { QuotaTracker } from "./quota.js";
import { handleRawEvent } from "./events.js";
import type { QqbotConfig } from "../shared/config.js";

export const name = "qqbot";

/** 运行时 Agent 注册表（会话复用与 /stop /steer）。 */
interface QqAgentRegistry {
  get(id: string): import("@deepseek-ai/dsh-agent").Agent | undefined;
}

/** webhook 运行时（@deepseek-ai/dsh-webhook 提供的 ctx.webhookRuntime）。 */
interface WebhookRuntimeLike {
  register(rule: unknown): (() => void | Promise<void>) | Promise<() => void | Promise<void>>;
  dispatch(delivery: unknown): void;
}

/**
 * 取 webhook 运行时：
 *  1. 宿主已启用 @deepseek-ai/dsh-webhook → 直接用；
 *  2. 否则尝试自行加载它（该包是可选 peer，未安装时只警告）；
 *  3. 都拿不到 → 返回 null，插件以「无会话」降级模式运行（设置界面与 HTTP 端点仍可用）。
 */
async function resolveWebhookRuntime(
  ctx: Context,
  logger: Pick<Console, "info" | "warn" | "error">,
): Promise<WebhookRuntimeLike | null> {
  const host = ctx as unknown as {
    get?(name: string, strict?: boolean): unknown;
    plugin?(entry: unknown): unknown;
  };
  const existing = host.get?.("webhookRuntime", false);
  if (existing) return existing as WebhookRuntimeLike;
  try {
    const mod = await import("@deepseek-ai/dsh-webhook") as {
      WebhookRuntime?: unknown;
      default?: unknown;
    };
    const Runtime = mod.WebhookRuntime ?? mod.default;
    if (typeof Runtime !== "function") return null;
    await host.plugin?.(Runtime);
    for (let i = 0; i < 20; i += 1) {
      const loaded = host.get?.("webhookRuntime", false);
      if (loaded) return loaded as WebhookRuntimeLike;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return null;
  } catch (error) {
    logger.warn("[dsh-qqbot] 无法加载 @deepseek-ai/dsh-webhook，QQ 消息将不能创建会话:", error);
    return null;
  }
}

export const inject = ["connection", "webServer", "agents", "agentPresets", "permissionPresets"];

export async function apply(ctx: Context, entryConfig: Partial<QqbotConfig>) {
  const logger = (() => {
    const raw = (ctx as unknown as { logger?: unknown }).logger;
    if (typeof raw === "function") {
      return (raw as (name: string) => Pick<Console, "info" | "warn" | "error">)("dsh-qqbot");
    }
    return console as Pick<Console, "info" | "warn" | "error">;
  })();

  const gconf = await loadGlobalConfig();
  // 全局 adminToken 实时引用（设置界面可改，立即生效）。
  const adminToken = () => gconf.adminToken ?? "";

  // 宿主 Preset 服务（把配置里的 Preset 名解析成宿主真实 id）。
  const hostPresetServices = ctx as unknown as {
    agentPresets?: { resolve(id?: string): Promise<{ id: string }> };
    permissionPresets?: { defaultPreset: string; resolve(name: string): unknown };
  };

  /** 按机器人配置解析会话 Preset；失败时返回空串（禁止建会话）。 */
  const resolvePresets = async (config: QqbotConfig): Promise<{ agentPreset: string; permissionPreset: string }> => {
    let agentPreset = "";
    let permissionPreset = "";
    try {
      if (config.agentPreset) {
        await hostPresetServices.agentPresets?.resolve(config.agentPreset);
        agentPreset = config.agentPreset;
      } else {
        agentPreset = (await hostPresetServices.agentPresets?.resolve())?.id ?? "";
      }
    } catch (error) {
      logger.error(`[dsh-qqbot] Agent Preset "${config.agentPreset || "<宿主默认>"}" 解析失败:`, error);
    }
    try {
      if (config.permissionPreset) {
        hostPresetServices.permissionPresets?.resolve(config.permissionPreset);
        permissionPreset = config.permissionPreset;
      } else {
        permissionPreset = hostPresetServices.permissionPresets?.defaultPreset ?? "";
      }
    } catch (error) {
      logger.error(`[dsh-qqbot] 权限 Preset "${config.permissionPreset || "<宿主默认>"}" 解析失败:`, error);
    }
    if (agentPreset && permissionPreset) {
      logger.info(`[dsh-qqbot] 会话 Preset：agent=${agentPreset}, permission=${permissionPreset}`);
    } else {
      logger.warn(
        `[dsh-qqbot] 会话 Preset 解析不完整（agent=${agentPreset || "无"}, permission=${permissionPreset || "无"}），对应机器人将无法创建会话`,
      );
    }
    return { agentPreset, permissionPreset };
  };

  /** 按机器人解析 AppSecret：secretEnv（凭据引用）优先，失败回退明文。 */
  const resolveSecret = async (stored: StoredBot): Promise<string> => {
    if (stored.config.secretEnv) {
      try {
        const credentials = (ctx as unknown as {
          credentials?: { resolve(ref: string): Promise<{ value: string } | undefined> };
        }).credentials;
        const resolved = await credentials?.resolve(credentialRef(stored.config.secretEnv));
        if (resolved?.value) return resolved.value;
        logger.warn(`[dsh-qqbot] 凭据引用 ${stored.config.secretEnv} 未解析到值，回退到明文 AppSecret`);
      } catch (error) {
        logger.warn("[dsh-qqbot] 凭据引用解析失败，回退到明文:", error);
      }
    }
    if (!stored.appSecret) {
      throw new Error(`机器人 ${stored.appId} 的 AppSecret 不可用：请扫码登录、在设置中填写，或配置 secretEnv`);
    }
    return stored.appSecret;
  };

  // 定时消息：store + 30s 调度循环（按归属机器人发送）。
  const schedules = new ScheduleStore(logger);
  await schedules.load();
  // 主动消息每日配额（以主机器人配置为准）。
  const quota = new QuotaTracker(logger, () => bots.primary()?.config.quotaPerDay ?? 50);
  // AI 模式定时任务：把 prompt 当作合成事件注入 webhookRuntime，
  // 机器人在目标聊天创建会话生成内容并回复（回复走主动消息通道，消耗配额）。
  const generateAndSend = async (entry: ScheduleEntry, bot: BotRuntime): Promise<void> => {
    if (!runtime) throw new Error("webhook 运行时不可用，AI 定时任务无法创建会话");
    const eventId = `sched-${entry.id}-${Date.now()}`;
    const deliveryId = `qqws:${eventId}`;
    const isGroup = entry.scope === "group";
    runtime.dispatch({
      kind: "qq",
      source: bot.config.source,
      deliveryId,
      event: {
        eventType: isGroup ? "GROUP_AT_MESSAGE_CREATE" : "C2C_MESSAGE_CREATE",
        payload: {
          op: 0,
          id: eventId,
          t: isGroup ? "GROUP_AT_MESSAGE_CREATE" : "C2C_MESSAGE_CREATE",
          d: {
            id: eventId,
            content: entry.content,
            timestamp: new Date().toISOString(),
            ...(isGroup ? { group_openid: entry.openid } : {}),
            author: isGroup
              ? { member_openid: entry.createdBy || "scheduler", username: "定时任务" }
              : { user_openid: entry.openid, username: "定时任务" },
            __scheduled: true,
          },
        },
        botAppId: bot.appId,
      },
      receivedAt: Date.now(),
    } as never);
  };
  const scheduler = new Scheduler({
    store: schedules,
    resolveBot: (appId?: string) => (appId ? bots.get(appId) : undefined) ?? bots.primary(),
    quota,
    generateAndSend,
    logger,
  });
  scheduler.start();

  // 每聊天长期记忆 + 投递出箱（可靠性）。
  const memory = new ChatMemoryStore(logger);
  const outbox = new Outbox(logger);
  // 出箱重投循环：每 60s 一轮（发送失败的内容走主动消息通道补发）。
  const outboxTimer = setInterval(() => {
    void outbox.flush(async (item) => {
      const bot = bots.get(item.appId);
      if (!bot) throw new Error(`机器人 ${item.appId} 不可用`);
      if (!(await quota.tryConsume())) throw new Error("主动消息配额不足，稍后重试");
      await bot.client.sendText({ scope: item.scope, openid: item.openid }, item.content);
      bot.state.counters.proactive += 1;
    }).then(({ sent }) => {
      if (sent > 0) logger.info(`[dsh-qqbot] 出箱重投完成：补发 ${sent} 条`);
    }).catch(() => { /* flush 内部已处理 */ });
  }, 60_000);
  outboxTimer.unref?.();

  // webhook 运行时（先占位，机器人事件回调里使用；稍后赋值）。
  let runtime: WebhookRuntimeLike | null = null;

  // 多机器人运行时管理器：所有机器人 / 连接 / 状态的中枢。
  const bots = new BotRuntimeManager({
    logger,
    entryConfig,
    adminToken,
    resolveSecret,
    resolvePresets,
    onEvent: (bot, eventType, payload, deliveryId) => {
      if (!runtime) {
        logger.warn("[dsh-qqbot] webhook 运行时不可用，事件已丢弃");
        return;
      }
      try {
        runtime.dispatch({
          kind: "qq",
          source: bot.config.source,
          deliveryId,
          event: { eventType, payload, botAppId: bot.appId },
          receivedAt: Date.now(),
        } as never);
      } catch (error) {
        // dispatch 同步抛错（delivery 校验失败等）时清掉等待绑定的记录，别留悬挂 pending。
        bot.state.pending.delete(deliveryId);
        bot.state.counters.errors += 1;
        logger.error("[dsh-qqbot] 事件分发失败:", error);
      }
    },
    onRawEvent: (bot, eventType, data) => {
      void handleRawEvent(bot, eventType, data).then((outcome) => {
        if (outcome.handled) {
          logger.info(`[dsh-qqbot] 事件 ${eventType} 已处理（机器人 ${bot.appId}${outcome.note ? `：${outcome.note}` : ""}）`);
        } else if (outcome.note) {
          logger.warn(`[dsh-qqbot] 事件 ${eventType} 处理未完成（机器人 ${bot.appId}）：${outcome.note}`);
        }
      }).catch((error) => {
        logger.error(`[dsh-qqbot] 事件 ${eventType} 处理失败:`, error);
      });
    },
  });

  runtime = await resolveWebhookRuntime(ctx, logger);

  // 扫码登录管理器：凭据落盘 + 写入机器人库（多机器人卡片）+ 热同步运行时。
  const qr = new QrLoginManager({
    source: "primary-qq",
    logger,
    onCredentials: async (credentials: StoredCredentials) => {
      const stored: StoredBot = {
        appId: credentials.appId,
        appSecret: credentials.appSecret,
        source: "qr",
        savedAt: credentials.savedAt,
        ...(credentials.userOpenid ? { userOpenid: credentials.userOpenid } : {}),
        enabled: true,
        config: {},
      };
      await saveCredentials(credentials);
      await upsertBot(stored);
      await bots.sync();
      logger.info(`[dsh-qqbot] 扫码登录成功，机器人 ${stored.appId} 已加入并启用`);
    },
  });

  const admin = createAdminService({
    bots,
    gconf,
    schedules,
    qr,
    logger,
    runtimeReady: () => Boolean(runtime),
    entryConfig,
    listModels: async () => {
      try {
        const host = ctx as unknown as {
          get?(name: string): unknown;
          llm?: {
            listProviders?: () => Array<{ id?: unknown }>;
            listConfigurableProviders?: () => Array<{ provider?: unknown; displayName?: unknown }>;
            listModels?: (provider: string) => Promise<Array<{ provider?: unknown; id?: unknown; name?: unknown }>>;
          };
        };
        const llm = ((typeof host.get === "function" ? host.get("llm") : undefined) ?? host.llm) as typeof host.llm;
        if (llm && typeof llm.listProviders === "function" && typeof llm.listModels === "function") {
          const displayNames = new Map<string, string>();
          if (typeof llm.listConfigurableProviders === "function") {
            for (const entry of llm.listConfigurableProviders()) {
              if (typeof entry?.provider === "string" && typeof entry?.displayName === "string" && entry.displayName.trim()) {
                displayNames.set(entry.provider, entry.displayName.trim());
              }
            }
          }
          const out: ModelOption[] = [];
          for (const p of llm.listProviders()) {
            const providerId = typeof p?.id === "string" ? p.id : "";
            if (!providerId) continue;
            try {
              const listed = await llm.listModels(providerId);
              for (const m of Array.isArray(listed) ? listed : []) {
                if (!m || typeof m.id !== "string" || !m.id) continue;
                out.push({
                  id: `${m.provider && typeof m.provider === "string" ? m.provider : providerId}/${m.id}`,
                  name: typeof m.name === "string" && m.name.trim() ? m.name.trim() : m.id,
                  provider: providerId,
                  providerLabel: displayNames.get(providerId) ?? providerId,
                });
              }
            } catch {
              /* 个别 provider 暂不可用 */
            }
          }
          if (out.length > 0) return out;
        }
      } catch (error) {
        logger.warn("[dsh-qqbot] 读取宿主 llm 模型目录失败，回退 settings.yaml:", error);
      }
      return loadConfiguredModels();
    },
    listAgentPresets: async () => {
      try {
        const host = ctx as unknown as {
          get?(name: string): unknown;
          agentPresets?: { list?: () => Promise<unknown>; defaultId?: unknown };
        };
        const service = (((typeof host.get === "function" ? host.get("agentPresets") : undefined)
          ?? host.agentPresets) as { list?: () => Promise<unknown>; defaultId?: unknown } | undefined);
        if (service && typeof service.list === "function") {
          const listed = await service.list();
          let rawItems: unknown[];
          if (Array.isArray(listed)) rawItems = listed;
          else if (listed && typeof listed === "object") {
            const rec = listed as { items?: unknown; presets?: unknown };
            if (Array.isArray(rec.items)) rawItems = rec.items;
            else if (Array.isArray(rec.presets)) rawItems = rec.presets;
            else rawItems = Object.entries(listed as Record<string, unknown>).map(([id, value]) => ({ id, ...((value && typeof value === "object" ? value : {}) as Record<string, unknown>) }));
          } else rawItems = [];
          const items = rawItems
            .map((entry) => {
              if (typeof entry === "string") return { id: entry, label: entry };
              const rec = entry as { id?: unknown; name?: unknown; label?: unknown };
              if (!rec || typeof rec.id !== "string" || !rec.id) return null;
              const label = typeof rec.name === "string" && rec.name.trim()
                ? rec.name.trim()
                : typeof rec.label === "string" && rec.label.trim() ? rec.label.trim() : rec.id;
              return { id: rec.id, label };
            })
            .filter((v): v is { id: string; label: string } => v !== null);
          return { defaultId: typeof service.defaultId === "string" ? service.defaultId : "", items };
        }
      } catch (error) {
        logger.warn("[dsh-qqbot] 读取宿主 Agent Preset 目录失败:", error);
      }
      return { defaultId: "", items: [] };
    },
  });

  // 回复泵：会话 → 来源机器人的 QQ 聊天（含出箱重投与主动配额）。
  const disposePump = installReplyPump(ctx, { bots, outbox, quota, logger });

  // webhookRuntime 规则：QQ 事件 → 会话（命令系统带 schedule store 与长期记忆）。
  let disposeRule: (() => void | Promise<void>) | undefined;
  if (runtime) {
    const rule = createQqRule({
      resolveBot: (appId?: string) => bots.get(appId) ?? bots.primary(),
      agents: (ctx as unknown as { agents: QqAgentRegistry }).agents,
      schedules,
      memory,
      quota,
      logger,
    });
    disposeRule = await runtime.register(rule);
  } else {
    logger.warn(
      "[dsh-qqbot] 降级运行：webhook 运行时不可用，QQ 消息不会创建会话。"
      + "请在 profile 中启用 @deepseek-ai/dsh-webhook（设置界面与 /status 仍可用）。",
    );
  }

  // AI 工具：让模型帮忙设置/取消/查看定时消息、发送主动消息与图片、管理长期记忆。
  const disposeTools = registerQqbotTools(ctx, { bots, store: schedules, memory, logger });

  // HTTP 路由：管理端点（status / qr / send）。
  const route = makeQqbotRoutes({ logger, admin });
  const disposeRoute = (ctx as unknown as {
    webServer: { register(route: unknown): () => void };
  }).webServer.register(route);

  // 设置界面 RPC：dsh 设置页「QQ 机器人」通过 connection.rpc 调用。
  let disposeRpc: (() => void) | undefined;
  try {
    const connection = (ctx as unknown as {
      connection?: { rpc?: { handle(channel: string, handler: (endpoint: string, payload?: Record<string, unknown>) => Promise<unknown>): () => void } };
    }).connection;
    const handle = connection?.rpc?.handle;
    if (typeof handle === "function") {
      const dispose = handle.call(connection!.rpc!, "/qqbot-settings", (endpoint, payload) =>
        admin.handle(endpoint, payload),
      );
      disposeRpc = () => dispose();
    } else {
      logger.warn("[dsh-qqbot] connection.rpc 不可用，设置界面将无法连接（HTTP 管理端点仍可用）");
    }
  } catch (error) {
    logger.warn("[dsh-qqbot] RPC 注册失败:", error);
  }

  // 启动时按 bots.json 重建所有已启用机器人的连接（不阻塞 dsh 启动，结果看日志）。
  const anyConfigured = await (async () => {
    const { loadBotsFile } = await import("./store-file.js");
    const file = await loadBotsFile();
    return file.bots.some((b) => b.enabled);
  })();
  void bots.sync().then(() => {
    if (!anyConfigured) {
      logger.warn(
        "[dsh-qqbot] 已加载但未配置任何机器人：请在 DSH 设置页「QQ 机器人」扫码登录或填写 AppID/AppSecret（也可 dsh-qqbot login）",
      );
    }
  });

  return async () => {
    try {
      disposeRoute();
    } catch { /* 已卸载 */ }
    clearInterval(outboxTimer);
    disposePump();
    disposeRpc?.();
    disposeTools();
    scheduler.stop();
    qr.dispose();
    await bots.stopAll();
    if (disposeRule) {
      try {
        await disposeRule();
      } catch {
        /* 规则卸载失败不影响插件卸载 */
      }
    }
  };
}
