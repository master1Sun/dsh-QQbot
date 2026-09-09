/**
 * 多机器人运行时：每个机器人在进程内各持一套独立的
 *
 *   配置（QqbotConfig）· 运行状态（BotState）· 价值过滤状态 · API 客户端 · WebSocket 连接 · 归档器
 *
 * 所有已保存且 enabled 的机器人**同时连接**，互不干扰：
 * 同一条群消息会被每个在该群里的机器人各自判定、各自回复（冷却与群缓冲也各自独立）。
 *
 * 归属索引：
 *   deliveryId → appId（事件分发前登记，会话绑定后释放）
 *   sessionId  → appId（会话绑定时登记）
 * 回复泵据此把助手回复发回「来源机器人」的聊天，而不是全局单例客户端。
 */
import { createBotState } from "./state.js";
import { createValueFilterState } from "./value-filter.js";
import { Archiver } from "./archive.js";
import { RefIndex } from "./ref-index.js";
import { SelfOpenidStore } from "./self-id.js";
import { QqApiClient } from "./qq/api.js";
import { QqWsSource, type WsStatus } from "./qq/ws.js";
import { StatsStore, ZERO_COUNTERS } from "./stats.js";
import { resolveConfig, type QqbotConfig } from "../shared/config.js";
import { loadBotsFile, type BotsFile, type StoredBot } from "./store-file.js";
import type { BotState, QqEnvelope } from "../shared/types.js";

export interface BotRuntime {
  readonly appId: string;
  /** 当前生效的凭据（secretEnv 解析后覆盖明文）。 */
  appSecret: string;
  /** 是否建立连接并收发消息。 */
  enabled: boolean;
  /** 存储层条目（source / savedAt 等展示信息）。 */
  stored: StoredBot;
  config: QqbotConfig;
  state: BotState;
  valueFilterState: ReturnType<typeof createValueFilterState>;
  client: QqApiClient;
  ws: QqWsSource;
  archiver: Archiver;
  /**
   * 引用索引（REFIDX → 原文）：用户引用别人消息时，平台只给索引键不给原文，
   * 靠这份本地索引恢复被引用内容并注入模型上下文。每个机器人一份，独立落盘。
   */
  refIndex: RefIndex;
  /** 宿主解析出的真实 Preset id（空串 = 解析失败，禁止创建会话）。 */
  presets: { agentPreset: string; permissionPreset: string };
  /** 群 openid → 本机器人在该群视角的 openid（AT 事件学习，供全量 @ 精确判定）。 */
  selfOpenids: Map<string, string>;
  /** 自身 openid 学习结果的持久化存储。 */
  selfStore: SelfOpenidStore;
}

export interface BotRuntimeManagerOptions {
  logger: Pick<Console, "info" | "warn" | "error">;
  /** cordis entry 显式配置（最高优先级，全局覆盖）。 */
  entryConfig: Partial<QqbotConfig>;
  /** HTTP 管理端点令牌（全局项，注入每个 bot 的配置）。 */
  adminToken: () => string;
  /** AppSecret 解析：secretEnv 凭据引用优先，失败回退明文。 */
  resolveSecret: (bot: StoredBot) => Promise<string>;
  /** 把配置里的 Preset 名解析成宿主真实 id；失败时返回空串（禁止建会话）。 */
  resolvePresets: (config: QqbotConfig) => Promise<{ agentPreset: string; permissionPreset: string }>;
  /** 事件出口：由 index.ts 转发进 webhookRuntime。 */
  onEvent: (bot: BotRuntime, eventType: string, payload: QqEnvelope, deliveryId: string) => void;
  /** 原始网关事件出口（成员进出/表情/好友等），由 index.ts 分派给事件处理器。 */
  onRawEvent?: (bot: BotRuntime, eventType: string, data: unknown) => void;
}

/** delivery 归属表的容量上限（超出后丢弃最旧的一半，防止长期运行泄漏）。 */
const DELIVERY_INDEX_CAP = 2048;
const SESSION_INDEX_CAP = 2048;

/** 运行统计落盘间隔：值变化才写，重启最多丢最后间隔内的增量。 */
const STATS_FLUSH_INTERVAL_MS = 10_000;

export class BotRuntimeManager {
  readonly #options: BotRuntimeManagerOptions;
  readonly #bots = new Map<string, BotRuntime>();
  readonly #deliveryOwner = new Map<string, string>();
  readonly #sessionOwner = new Map<string, string>();
  readonly #stats: StatsStore;
  /** appId → 最近一次落盘的计数快照（序列化串比较，变化才写盘）。 */
  readonly #statsSaved = new Map<string, string>();
  #statsTimer: ReturnType<typeof setInterval> | null = null;
  #syncing: Promise<void> | null = null;
  #primaryAppId = "";

  constructor(options: BotRuntimeManagerOptions) {
    this.#options = options;
    this.#stats = new StatsStore(options.logger);
    this.#statsTimer = setInterval(() => void this.#flushStats(), STATS_FLUSH_INTERVAL_MS);
    this.#statsTimer.unref?.();
  }

  // ── 查询 ──────────────────────────────────────────────────────────────────

  list(): BotRuntime[] {
    return [...this.#bots.values()];
  }

  get(appId: string | undefined): BotRuntime | undefined {
    return appId ? this.#bots.get(appId) : undefined;
  }

  /** 主机器人：未指定归属的主动消息 / 定时消息用它发送。 */
  primary(): BotRuntime | undefined {
    return this.get(this.#primaryAppId) ?? this.list()[0];
  }

  primaryAppId(): string {
    return this.primary()?.appId ?? "";
  }

  statusOf(appId: string): WsStatus {
    return this.get(appId)?.ws.status ?? { state: "idle", appId, lastConnectedAt: null, lastError: null, events: 0 };
  }

  /** deliveryId 属于哪个机器人（事件分发前登记）。 */
  botForDelivery(deliveryId: string): BotRuntime | undefined {
    const appId = this.#deliveryOwner.get(deliveryId);
    return appId ? this.#bots.get(appId) : undefined;
  }

  /** 会话属于哪个机器人（会话绑定时登记）。 */
  botForSession(sessionId: string): BotRuntime | undefined {
    const appId = this.#sessionOwner.get(sessionId);
    return appId ? this.#bots.get(appId) : undefined;
  }

  /** 遍历所有机器人，找到绑定了该会话的那个（tools 用）。 */
  findBySession(sessionId: string): BotRuntime | undefined {
    if (!sessionId) return undefined;
    const owner = this.botForSession(sessionId);
    if (owner) return owner;
    return this.list().find((bot) => bot.state.recordBySession.has(sessionId)
      || [...bot.state.chatSession.values()].includes(sessionId));
  }

  registerDelivery(deliveryId: string, appId: string): void {
    this.#deliveryOwner.set(deliveryId, appId);
    if (this.#deliveryOwner.size > DELIVERY_INDEX_CAP) this.#trim(this.#deliveryOwner);
  }

  releaseDelivery(deliveryId: string): void {
    this.#deliveryOwner.delete(deliveryId);
  }

  noteSession(sessionId: string, appId: string): void {
    this.#sessionOwner.set(sessionId, appId);
    if (this.#sessionOwner.size > SESSION_INDEX_CAP) this.#trim(this.#sessionOwner);
  }

  #trim(map: Map<string, string>): void {
    const drop = Math.floor(map.size / 2);
    let i = 0;
    for (const key of map.keys()) {
      if (i++ >= drop) break;
      map.delete(key);
    }
  }

  // ── 同步：把 bots.json 应用到运行时 ────────────────────────────────────────

  /**
   * 按存储层重建/更新/停止各机器人连接。
   * 串行执行（#syncing 排队），避免并发保存时两个 sync 交错启停。
   */
  sync(): Promise<void> {
    const prev = this.#syncing ?? Promise.resolve();
    const next = prev.then(() => this.#sync()).catch((error) => {
      this.#options.logger.error("[dsh-qqbot] 机器人同步失败:", error);
    });
    this.#syncing = next;
    return next;
  }

  async #sync(): Promise<void> {
    const file: BotsFile = await loadBotsFile();
    this.#primaryAppId = file.primaryAppId ?? file.bots[0]?.appId ?? "";
    const seen = new Set<string>();

    for (const stored of file.bots) {
      seen.add(stored.appId);
      let bot = this.#bots.get(stored.appId);
      let secret = stored.appSecret;
      try {
        secret = await this.#options.resolveSecret(stored);
      } catch (error) {
        this.#options.logger.warn(
          `[dsh-qqbot] 机器人 ${stored.appId} 凭据解析失败，回退明文:`,
          error,
        );
      }
      const config = this.#buildConfig(stored, secret);

      let isNew = false;
      let credentialChanged = false;
      if (!bot) {
        bot = this.#create(stored, secret, config);
        this.#bots.set(stored.appId, bot);
        isNew = true;
        credentialChanged = true;
      } else {
        credentialChanged = bot.appSecret !== secret;
        bot.stored = stored;
        bot.enabled = stored.enabled;
        bot.appSecret = secret;
        bot.config = config;
        if (credentialChanged) bot.client.resetAuthCache();
      }

      bot.presets = await this.#options.resolvePresets(config);

      if (!stored.enabled) {
        await bot.ws.stop();
        continue;
      }
      const state = bot.ws.status.state;
      // 新建 / 凭据变化 / 之前没连上 → 重新发起连接；已连接的不打断。
      if (isNew || credentialChanged || state === "idle" || state === "failed") {
        void bot.ws.start(config);
      }
    }

    // 已删除的机器人：断开并从表里移除。
    for (const [appId, bot] of [...this.#bots]) {
      if (seen.has(appId)) continue;
      await bot.ws.stop();
      this.#bots.delete(appId);
      this.#options.logger.info(`[dsh-qqbot] 机器人 ${appId} 已移除，连接已断开`);
    }
  }

  #buildConfig(stored: StoredBot, secret: string): QqbotConfig {
    return resolveConfig({
      entry: this.#options.entryConfig,
      stored: {
        // 该机器人独立的行为配置（工作区 / 策略 / 调优）与传输/凭据配置。
        ...stored.config,
        adminToken: this.#options.adminToken(),
        // 适配器实例名按机器人区分（事件 source / 日志定位）。
        source: `qq-${stored.appId}`,
      },
      credentials: { appId: stored.appId, appSecret: secret },
    });
  }

  #create(stored: StoredBot, secret: string, config: QqbotConfig): BotRuntime {
    const bot: BotRuntime = {
      appId: stored.appId,
      appSecret: secret,
      enabled: stored.enabled,
      stored,
      config,
      state: createBotState(),
      valueFilterState: createValueFilterState(),
      presets: { agentPreset: "", permissionPreset: "" },
      selfOpenids: new Map(),
      // 占位：下面立即替换（对象需要自引用闭包）
      client: undefined as unknown as QqApiClient,
      ws: undefined as unknown as QqWsSource,
      archiver: undefined as unknown as Archiver,
      refIndex: undefined as unknown as RefIndex,
      selfStore: undefined as unknown as SelfOpenidStore,
    };
    bot.client = new QqApiClient({
      getCredentials: () => ({ appId: bot.appId, appSecret: bot.appSecret }),
      getApiBase: () => bot.config.apiBase,
      getTokenUrl: () => bot.config.tokenUrl,
      logger: this.#options.logger,
      getSdk: () => bot.ws.sdk,
    });
    bot.archiver = new Archiver(() => bot.config.archiveEnabled, this.#options.logger, bot.appId);
    bot.refIndex = new RefIndex({ logger: this.#options.logger, appId: bot.appId });
    // 历史引用索引异步加载（缓存性质，加载慢不影响建连与收发）。
    void bot.refIndex.load();
    // 持久化运行统计异步读回：与内存计数取 max 合并（计数单调递增，max 对竞态安全）。
    void this.#restoreCounters(bot);
    // 已学习的各群自身 openid 异步读回（判定全量消息 @ 的是不是本 bot）。
    bot.selfStore = new SelfOpenidStore(this.#options.logger);
    void bot.selfStore.load(bot.appId).then((map) => {
      for (const [group, id] of map) bot.selfOpenids.set(group, id);
    });
    bot.ws = new QqWsSource({
      logger: this.#options.logger,
      onEvent: (eventType, payload, deliveryId) => {
        this.registerDelivery(deliveryId, bot.appId);
        this.#options.onEvent(bot, eventType, payload, deliveryId);
      },
      onRawEvent: (eventType, data) => {
        this.#options.onRawEvent?.(bot, eventType, data);
      },
    });
    return bot;
  }

  /** 手动重连指定机器人（设置界面「重试连接」）。 */
  async reconnect(appId?: string): Promise<BotRuntime | undefined> {
    const bot = appId ? this.get(appId) : this.primary();
    if (!bot) return undefined;
    await bot.ws.start(bot.config);
    return bot;
  }

  // ── 运行统计持久化 ─────────────────────────────────────────────────────────

  /** 读回持久计数并与内存取 max 合并（启动时调用，异步不阻塞建连）。 */
  async #restoreCounters(bot: BotRuntime): Promise<void> {
    const saved = await this.#stats.load(bot.appId);
    const counters = bot.state.counters;
    for (const key of Object.keys(ZERO_COUNTERS) as (keyof typeof ZERO_COUNTERS)[]) {
      if (saved[key] > counters[key]) counters[key] = saved[key];
    }
  }

  /** 把所有机器人的当前计数落盘（值无变化跳过）。 */
  async #flushStats(): Promise<void> {
    for (const bot of this.#bots.values()) {
      const json = JSON.stringify(bot.state.counters);
      if (this.#statsSaved.get(bot.appId) === json) continue;
      this.#statsSaved.set(bot.appId, json);
      await this.#stats.save(bot.appId, bot.state.counters);
    }
  }

  /**
   * 复位某机器人的运行统计（设置界面「复位」按钮）：内存清零 + 立即落盘。
   * 不传 appId 复位主机器人。返回被复位的机器人；不存在返回 undefined。
   */
  async resetCounters(appId?: string): Promise<BotRuntime | undefined> {
    const bot = appId ? this.get(appId) : this.primary();
    if (!bot) return undefined;
    bot.state.counters = { received: 0, sessions: 0, replies: 0, proactive: 0, errors: 0 };
    this.#statsSaved.set(bot.appId, JSON.stringify(bot.state.counters));
    await this.#stats.save(bot.appId, bot.state.counters);
    this.#options.logger.info(`[dsh-qqbot] 机器人 ${bot.appId} 的运行统计已复位`);
    return bot;
  }

  async stopAll(): Promise<void> {
    await this.#flushStats().catch(() => undefined);
    if (this.#statsTimer) {
      clearInterval(this.#statsTimer);
      this.#statsTimer = null;
    }
    for (const bot of this.#bots.values()) await bot.ws.stop();
    this.#bots.clear();
    this.#deliveryOwner.clear();
    this.#sessionOwner.clear();
  }
}
