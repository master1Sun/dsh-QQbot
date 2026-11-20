/**
 * 管理服务：设置界面（connection.rpc）与 HTTP 管理端点共用的操作集合。
 *
 * 多机器人架构：
 *  - 机器人库（bots.json）是唯一事实来源；凭据/传输与连接按机器人独立；
 *  - 行为配置（工作区 / 消息回复策略 / 回复调优）同样按机器人独立保存，
 *    config.get / config.save 带 appId 定位到具体机器人，不传时默认主机器人；
 *  - 主动消息 / 定时消息 按 appId 归属到具体机器人，不传 appId 时默认作用在「主机器人」；
 *  - 启用 / 停用 / 删除 / 设为主 都会触发 bots.sync() 热重建运行时（停/起对应连接）。
 */
import { homedir } from "node:os";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import type { ModelOption } from "./catalogs.js";
import type { QrLoginManager } from "../qq/qr-login.js";
import type { ScheduleStore, ScheduleEntry, Scheduler } from "../schedule/schedule.js";
import type { ScriptGenerator } from "../schedule/script-gen.js";
import { archiveStats, listArchiveChats, listArchiveDays, readArchiveChat, readArchiveDay, readArchiveRecords, removeArchiveChat, removeArchiveDay } from "../infra/archive.js";
import { readArchivedMedia, type ArchiveMediaKind } from "../infra/archive-media.js";
import { applyUpdate, checkUpdate } from "./updater.js";
import { toShanghaiISO } from "../../shared/time.js";
import type { BotRuntimeManager, BotRuntime } from "../bots.js";
import {
  patchBotConfig,
  removeBot as storeRemoveBot,
  saveGlobalConfig,
  setBotEnabled,
  setPrimaryBot,
  upsertBot,
  BOT_CONFIG_FIELDS,
  type GlobalConfig,
  type StoredBot,
} from "../infra/store-file.js";
import type { QqbotConfig } from "../../shared/config.js";
import { resolveConfig, stringifyModelSelection } from "../../shared/config.js";
import type { ReplyTarget } from "../../shared/types.js";
import type { ModerationService } from "../moderation/service.js";
import { normalizeConfig } from "../moderation/store.js";
import type { JoinApprovalService } from "../join-approval/service.js";
import type { GuildModerationService } from "../guild-moderation/service.js";
import type { GuildReplyService } from "../guild-reply/service.js";
import type { GuildKeywordService } from "../guild-keyword-mod/service.js";
import type { AiOpsService, AiOpsResult, AiOpsStats } from "../ai-ops/service.js";
import type { AiEntity, AiScope } from "../ai-ops/catalog.js";

export interface AdminServiceContext {
  /** 多机器人运行时：所有按 appId 的查询 / 操作入口。 */
  bots: BotRuntimeManager;
  /** 全局配置（仅 adminToken；其余配置一律按机器人独立保存）。 */
  gconf: GlobalConfig;
  schedules: ScheduleStore;
  /** 调度器：设置页「测试」按钮执行一次（schedule.runOnce）。 */
  scheduler?: Scheduler;
  /** AI 脚本生成器：保存含 genPrompt 的任务后入队生成。 */
  scriptGen?: ScriptGenerator;
  qr: QrLoginManager;
  logger: Pick<Console, "info" | "warn" | "error">;
  /** webhook 运行时是否可用（不可用时 QQ 消息不会创建会话）。 */
  runtimeReady: () => boolean;
  /** cordis entry 显式配置（热更新时保持其优先级）。 */
  entryConfig: Partial<QqbotConfig>;
  /** 已配置的模型目录（读自宿主 settings.yaml）。 */
  listModels?: () => Promise<ModelOption[]>;
  /** 宿主 Agent Preset 目录（ctx.agentPresets 服务：list() + defaultId）。 */
  listAgentPresets?: () => Promise<{ defaultId: string; items: Array<{ id: string; label: string }> }>;
  /** AI 群规审核服务（配置读写 / 日志；设置页「AI 群规审核」区使用）。 */
  moderation?: ModerationService;
  /** 入群 AI 自动审批服务（配置读写 / 执行 / 日志）。 */
  joinApproval?: JoinApprovalService;
  /** 频道 AI 接管服务（配置读写 / 日志；频道管理弹窗使用）。 */
  guildModeration?: GuildModerationService;
  /** 频道 AI 自动回帖服务（配置读写 / 日志）。 */
  guildReply?: GuildReplyService;
  /** 频道违规词自动处置服务（配置读写 / 日志；发言管理 Tab 使用）。 */
  guildKeyword?: GuildKeywordService;
  /** AI 操作助手（群聊管理 / 频道管理对话式操作，本地优先省 token）。 */
  aiOps?: AiOpsService;
}

/** AppID 脱敏：保留前 4 与后 4 位。 */
const maskAppId = (appId: string): string =>
  appId.length <= 8 ? appId : `${appId.slice(0, 4)}••••${appId.slice(-4)}`;

export function createAdminService(ctx: AdminServiceContext) {
  const { bots, gconf, schedules, scriptGen, qr, logger, runtimeReady, moderation, joinApproval, guildModeration, guildReply, guildKeyword, aiOps } = ctx;
  const primaryAppId = () => bots.primaryAppId();

  /** 单个机器人的可序列化摘要（bots.list / status 共用）。 */
  const botSummary = (bot: BotRuntime) => {
    const ws = bots.statusOf(bot.appId);
    return {
      appId: bot.appId,
      appIdMasked: maskAppId(bot.appId),
      source: bot.stored.source,
      savedAt: bot.stored.savedAt,
      enabled: bot.enabled,
      primary: bot.appId === primaryAppId(),
      ws: { state: ws.state, lastConnectedAt: ws.lastConnectedAt, lastError: ws.lastError },
      counters: { ...bot.state.counters },
      daily: { ...bot.state.dailyReceived },
      pendingReplies: bot.state.pending.size,
      boundSessions: bot.state.chatSession.size,
      groupBuffers: [...bot.state.groupBuffer.entries()].map(([openid, list]) => ({ openid, buffered: list.length })),
      /** 该机器人独立的行为配置（设置界面编辑对象）。 */
      config: { ...bot.stored.config },
    };
  };

  const status = () => ({
    ok: true,
    data: {
      sessionEnabled: runtimeReady(),
      runtimeReady: runtimeReady(),
      primaryAppId: primaryAppId(),
      bots: bots.list().map(botSummary),
    },
  });

  const configGet = async (appId?: string) => {
    // 返回「生效中的配置」（含默认值），保证设置页显示值与实际生效值完全一致——
    // 新建机器人时页面显示的就是真正生效的策略/调优/工作区，而非空白。
    const bot = (appId && bots.get(appId)) || bots.primary();
    const effective: QqbotConfig = bot
      ? bot.config
      : resolveConfig({
          entry: ctx.entryConfig,
          stored: {
            adminToken: gconf.adminToken ?? "",
          },
        });
    const config: Record<string, unknown> = {};
    const effectiveRec = effective as unknown as Record<string, unknown>;
    for (const f of BOT_CONFIG_FIELDS) {
      const v = effectiveRec[f];
      if (v === undefined) continue;
      // model 在生效配置里是解析后的对象（QqbotModelSelection），
      // 回读给设置页时须还原成 "provider/model[:cap]" 字符串，否则下拉无法回显。
      config[f] = f === "model" ? stringifyModelSelection(effective.model) : v;
    }
    return { ok: true, data: { appId: bot?.appId ?? "", config } };
  };

  const configSave = async (payload: Record<string, unknown>) => {
    const appId = (typeof payload.appId === "string" && payload.appId) || primaryAppId();
    if (!appId) return { ok: false, error: "没有可用的机器人（请先添加机器人）" };
    // adminToken 是全局项，单独落到 global.json，不进入单机器人配置。
    const { appId: _omit, adminToken, ...rest } = payload;
    void _omit;
    if (typeof adminToken === "string") {
      gconf.adminToken = adminToken.trim();
      await saveGlobalConfig(gconf);
    }
    // 行为配置写入该机器人独立 config，仅对该机器人热生效。
    // patchBotConfig 对 bots.json 中不存在的机器人是静默无操作，必须以返回的
    // bots.json 为准校验目标机器人确实存在，避免「返回成功却没写入」。
    const savedFile = await patchBotConfig(appId, rest);
    const savedBot = savedFile.bots.find((b) => b.appId === appId);
    if (!savedBot) {
      return { ok: false, error: `机器人 ${maskAppId(appId)} 不存在，配置未写入` };
    }
    await bots.sync();
    logger.info(`[dsh-qqbot] 机器人 ${maskAppId(appId)} 的策略/调优/工作区配置已更新并热生效`);
    // 回读落盘后的配置（以 bots.json 为准），供客户端做端到端校验
    // （如确认 groupOverrides 中该群键确实写入）。
    return { ok: true, data: { saved: true, appId, groupOverrides: savedBot.config.groupOverrides ?? {} } };
  };

  const credentialsSave = async (payload: { appId?: unknown; appSecret?: unknown }) => {
    const appId = typeof payload.appId === "string" ? payload.appId.trim() : "";
    const appSecret = typeof payload.appSecret === "string" ? payload.appSecret.trim() : "";
    if (!appId || !appSecret) return { ok: false, error: "appId 与 appSecret 必填" };
    const stored: StoredBot = {
      appId,
      appSecret,
      source: "manual",
      savedAt: toShanghaiISO(),
      enabled: true,
      config: {},
    };
    await upsertBot(stored);
    await bots.sync();
    logger.info(`[dsh-qqbot] 凭据已保存（手动），机器人 ${maskAppId(appId)} 已启用`);
    return { ok: true, data: { appId } };
  };

  const qrStart = async () => ({ ok: true, data: await qr.start() });
  const qrState = () => ({ ok: true, data: qr.snapshot() });
  const qrCancel = () => ({ ok: true, data: qr.cancel() });

  // ── 多机器人：卡片列表 / 启用 / 删除 / 设为主 ──────────────────────────────────

  const botsList = async () => ({
    ok: true,
    data: {
      primaryAppId: primaryAppId(),
      runtimeReady: runtimeReady(),
      bots: bots.list().map(botSummary),
    },
  });

  const botsSetPrimary = async (payload: { appId?: unknown }) => {
    const appId = typeof payload.appId === "string" ? payload.appId.trim() : "";
    if (!appId) return { ok: false, error: "缺少 appId" };
    if (!bots.get(appId)) return { ok: false, error: `未找到机器人 ${appId || "(空)"}` };
    await setPrimaryBot(appId);
    await bots.sync();
    logger.info(`[dsh-qqbot] 已设机器人 ${maskAppId(appId)} 为主机器人`);
    return { ok: true, data: { primaryAppId: appId } };
  };

  const botsEnable = async (payload: { appId?: unknown; enabled?: unknown }) => {
    const appId = typeof payload.appId === "string" ? payload.appId.trim() : "";
    const enabled = Boolean(payload.enabled);
    if (!appId) return { ok: false, error: "缺少 appId" };
    if (!bots.get(appId)) return { ok: false, error: `未找到机器人 ${appId || "(空)"}` };
    await setBotEnabled(appId, enabled);
    await bots.sync();
    logger.info(`[dsh-qqbot] 机器人 ${maskAppId(appId)} 已${enabled ? "启用" : "停用"}`);
    return { ok: true, data: { appId, enabled } };
  };

  const botsRemove = async (payload: { appId?: unknown }) => {
    const appId = typeof payload.appId === "string" ? payload.appId.trim() : "";
    if (!bots.get(appId)) return { ok: false, error: `未找到机器人 ${appId || "(空)"}` };
    await storeRemoveBot(appId);
    await bots.sync();
    logger.info(`[dsh-qqbot] 已删除机器人 ${maskAppId(appId)}`);
    return { ok: true, data: { removed: appId } };
  };

  // ── 下拉目录：模型 / Agent Preset（读宿主真实配置） ────────────────────────────

  const catalogs = async () => {
    const models: Array<{ id: string; label: string; group?: string }> = [];
    try {
      const configured = ctx.listModels ? await ctx.listModels() : [];
      for (const m of configured) {
        if (!m?.id || typeof m.id !== "string") continue;
        const slash = m.id.indexOf("/");
        const modelPart = slash > 0 ? m.id.slice(slash + 1) : m.id;
        const label = m.name && m.name !== modelPart ? `${m.name}（${m.id}）` : m.id;
        const group = typeof m.providerLabel === "string" && m.providerLabel
          ? m.providerLabel
          : typeof m.provider === "string" && m.provider ? m.provider : undefined;
        models.push({ id: m.id, label, group });
      }
    } catch (error) {
      logger.warn("[dsh-qqbot] 读取已配置模型失败:", error);
    }
    // 主机器人当前模型兜底并入（host 目录未含时仍可显示）。
    const primary = bots.primary();
    if (primary?.config.model) {
      const cur = `${primary.config.model.provider}/${primary.config.model.model}`;
      if (!models.some((m) => m.id === cur)) {
        models.unshift({ id: cur, label: `${cur}（当前）`, group: primary.config.model.provider });
      }
    }

    let presets: Array<{ id: string; label: string }> = [];
    try {
      const catalog = ctx.listAgentPresets ? await ctx.listAgentPresets() : { defaultId: "", items: [] };
      presets = (catalog.items ?? [])
        .filter((item) => item && typeof item.id === "string" && item.id)
        .map((item) => ({ id: item.id, label: item.label && item.label !== item.id ? `${item.label}（${item.id}）` : item.id }));
    } catch (error) {
      logger.warn("[dsh-qqbot] 读取 Agent Preset 目录失败:", error);
    }
    if (presets.length === 0) presets = [{ id: "default", label: "default" }];

    return {
      ok: true,
      data: { models, agentPresets: presets },
    };
  };

  /** 枚举可选工作区：~/.dsh/file 下的每个子目录都是一个 dsh 工作区。 */
  const workspaceList = async () => {
    const root = path.join(homedir(), ".dsh", "file");
    const workspaces: Array<{ path: string; name: string }> = [];
    try {
      const dirents = await readdir(root, { withFileTypes: true });
      for (const dirent of dirents) {
        if (!dirent.isDirectory()) continue;
        if (dirent.name.startsWith(".")) continue;
        workspaces.push({ path: path.join(root, dirent.name), name: dirent.name });
      }
    } catch {
      // 根目录不可读时仅返回默认项
    }
    workspaces.sort((a, b) => a.name.localeCompare(b.name));
    const primary = bots.primary();
    return {
      ok: true,
      data: {
        current: primary?.config.workspacePath ?? root,
        root,
        workspaces: [{ path: root, name: "（默认工作区根目录）" }, ...workspaces],
      },
    };
  };

  /**
   * 目录浏览：列出指定目录下的子文件夹（仅目录，不做任何写操作）。
   *
   * 「此电脑」虚拟层：Windows 各盘符之间没有文件系统父目录（dirname("C:\\")==="C:\\"），
   * 浏览到盘符根后再往上一级就到不了其他盘。约定哨兵路径 COMPUTER_PATH 表示虚拟的
   * 「此电脑」层级——返回本机所有盘符作为可进入的子目录；盘符根目录的 parent 也指向它。
   * （客户端 workspace-picker.tsx 持有同名哨兵常量，两侧必须一致。）
   */
  const COMPUTER_PATH = "__computer__";
  const isDriveRoot = (p: string) => /^[a-zA-Z]:[\\/]?$/.test(p);

  /** 枚举本机盘符（仅 Windows）：逐个 stat A:\–Z:\，存在的即为可用盘。 */
  const listWindowsDrives = async (): Promise<Array<{ path: string; name: string }>> => {
    if (process.platform !== "win32") return [];
    const probes: Array<Promise<{ path: string; name: string } | null>> = [];
    for (let code = 65; code <= 90; code++) {
      const letter = String.fromCharCode(code);
      const root = `${letter}:\\`;
      probes.push(
        stat(root).then(
          () => ({ path: root, name: `${letter}:` }),
          () => null,
        ),
      );
    }
    const found = await Promise.all(probes);
    return found.filter((d): d is { path: string; name: string } => d !== null);
  };

  const workspaceBrowse = async (payload: { path?: unknown }) => {
    const root = path.join(homedir(), ".dsh", "file");
    const requested = typeof payload.path === "string" && payload.path.trim() ? payload.path.trim() : root;
    // 「此电脑」虚拟层：列出所有盘符，parent 为 null（不能再往上）。
    if (requested === COMPUTER_PATH) {
      const drives = await listWindowsDrives();
      return {
        ok: true,
        data: { path: COMPUTER_PATH, parent: null, isDefault: false, dirs: drives },
      };
    }
    const target = path.resolve(requested);
    let info;
    try {
      info = await stat(target);
    } catch {
      return { ok: false, error: `目录不存在: ${target}` };
    }
    if (!info.isDirectory()) return { ok: false, error: `不是目录: ${target}` };
    const parent = path.dirname(target);
    const dirs: Array<{ path: string; name: string }> = [];
    try {
      const dirents = await readdir(target, { withFileTypes: true });
      for (const dirent of dirents) {
        if (!dirent.isDirectory()) continue;
        if (dirent.name.startsWith(".")) continue;
        dirs.push({ path: path.join(target, dirent.name), name: dirent.name });
      }
    } catch (error) {
      return { ok: false, error: `无法读取目录: ${error instanceof Error ? error.message : String(error)}` };
    }
    dirs.sort((a, b) => a.name.localeCompare(b.name));
    // 盘符根目录（如 C:\）的上一级是「此电脑」虚拟层，保证可以跨盘浏览；
    // 非 Windows 的文件系统根（/）没有上级，仍返回 null。
    const atDriveRoot = process.platform === "win32" && isDriveRoot(target);
    return {
      ok: true,
      data: {
        path: target,
        parent: parent === target ? (atDriveRoot ? COMPUTER_PATH : null) : parent,
        isDefault: target === path.resolve(root),
        dirs,
      },
    };
  };

  const sendProactive = async (payload: { appId?: unknown; scope?: unknown; openid?: unknown; content?: unknown }) => {
    const appId = typeof payload.appId === "string" && payload.appId ? payload.appId : primaryAppId();
    const bot = appId ? bots.get(appId) : bots.primary();
    if (!bot) return { ok: false, error: "没有可用的机器人（请先添加机器人）" };
    const scope = payload.scope === "group" ? "group" : payload.scope === "c2c" ? "c2c" : null;
    const openid = typeof payload.openid === "string" ? payload.openid.trim() : "";
    const content = typeof payload.content === "string" ? payload.content.trim() : "";
    if (!scope || !openid || !content) return { ok: false, error: "scope/openid/content 必填" };
    await bot.client.sendText({ scope, openid } satisfies ReplyTarget, content);
    bot.state.counters.proactive += 1;
    void bot.archiver.append({ kind: "proactive", chat: scope + ":" + openid, content, note: `manual:${bot.appId}` });
    return { ok: true, data: { sent: true, appId: bot.appId } };
  };

  // ── 定时消息（全局 store，按 appId 归属机器人） ────────────────────────────────

  const scheduleList = async (payload: { scope?: unknown; openid?: unknown; appId?: unknown; allBots?: unknown }) => {
    const scope = payload.scope === "c2c" ? "c2c" : payload.scope === "group" ? "group" : null;
    const openid = typeof payload.openid === "string" ? payload.openid.trim() : "";
    const all = schedules.list();
    // 机器人过滤：allBots=true 返回全部；否则默认只看「当前机器人」
    // （条目未写 appId 时归属主机器人，与运行时 resolveBot 的兜底语义一致）。
    let mine = all;
    const effAppId = typeof payload.appId === "string" && payload.appId ? payload.appId : primaryAppId();
    if (payload.allBots !== true) {
      mine = mine.filter((e: ScheduleEntry) => (e.appId ?? primaryAppId()) === effAppId);
    }
    if (scope && openid) mine = mine.filter((e: ScheduleEntry) => e.scope === scope && e.openid === openid);
    // 上限按机器人配置解析（bots.json scheduleMaxPerChat，默认 15；allBots 视图回落主机器人）。
    const maxPerChat = schedules.maxPerChat(payload.allBots === true ? undefined : effAppId);
    return { ok: true, data: { schedules: mine, total: all.length, maxPerChat } };
  };

  const scheduleAdd = async (payload: Record<string, unknown>) => {
    const appId = typeof payload.appId === "string" && payload.appId ? payload.appId : primaryAppId();
    // 传 id 时为编辑（ScheduleStore.add 保留原 id 与创建时间）。
    const added = await schedules.add({
      ...(typeof payload.id === "string" && payload.id ? { id: payload.id } : {}),
      scope: String(payload.scope ?? ""),
      openid: String(payload.openid ?? ""),
      type: String(payload.type ?? ""),
      time: typeof payload.time === "string" ? payload.time : undefined,
      minutes: typeof payload.minutes === "number" ? payload.minutes : undefined,
      cron: typeof payload.cron === "string" ? payload.cron : undefined,
      tz: typeof payload.tz === "string" ? payload.tz : undefined,
      at: typeof payload.at === "string" ? payload.at : undefined,
      weekdays: Array.isArray(payload.weekdays) ? payload.weekdays.map((w) => Number(w)).filter((w) => Number.isFinite(w)) : undefined,
      content: typeof payload.content === "string" ? payload.content : undefined,
      command: typeof payload.command === "string" ? payload.command : undefined,
      cwd: typeof payload.cwd === "string" ? payload.cwd : undefined,
      timeoutMs: payload.timeoutMs === undefined ? undefined : Number(payload.timeoutMs),
      env: payload.env && typeof payload.env === "object" && !Array.isArray(payload.env) ? payload.env as Record<string, string> : undefined,
      resultMode: payload.resultMode === "ai" || payload.resultMode === "raw" ? payload.resultMode : undefined,
      parsePrompt: typeof payload.parsePrompt === "string" ? payload.parsePrompt : undefined,
      gate: typeof payload.gate === "string" ? payload.gate : undefined,
      goal: typeof payload.goal === "string" ? payload.goal : undefined,
      notifyWhen: typeof payload.notifyWhen === "string" ? payload.notifyWhen : undefined,
      verify: typeof payload.verify === "boolean" ? payload.verify : undefined,
      // @全体成员：与 text / group 任务的勾选框对应，漏传会导致保存后不生效。
      atEveryone: typeof payload.atEveryone === "boolean" ? payload.atEveryone
        : payload.atEveryone === "true" ? true
          : payload.atEveryone === "false" ? false : undefined,
      genPrompt: typeof payload.genPrompt === "string" ? payload.genPrompt : undefined,
      tool: typeof payload.tool === "string" ? payload.tool : undefined,
      args: payload.args && typeof payload.args === "object" && !Array.isArray(payload.args) ? payload.args as Record<string, unknown> : undefined,
      createdBy: "settings",
      appId,
      ...(payload.mode === "ai" || payload.mode === "text" || payload.mode === "tool" ? { mode: payload.mode } : {}),
      // 省略 enabled 时：新建=启用，编辑=保留原状态。
      ...(typeof payload.enabled === "boolean" ? { enabled: payload.enabled } : {}),
    });
    if (added.ok) {
      if (added.entry?.genStatus === "pending") scriptGen?.enqueue(added.entry);
      return { ok: true, data: { schedule: added.entry } };
    }
    return { ok: false, error: added.error };
  };

  /** 启用 / 禁用（设置页行内开关）。 */
  const scheduleSetEnabled = async (payload: { id?: unknown; enabled?: unknown }) => {
    const id = typeof payload.id === "string" ? payload.id.trim() : "";
    if (!id) return { ok: false, error: "缺少 id" };
    if (typeof payload.enabled !== "boolean") return { ok: false, error: "enabled 必须是布尔值" };
    const res = await schedules.setEnabled(id, payload.enabled);
    if (!res.ok) return { ok: false, error: res.error };
    // 重新启用时若脚本需要（重新）生成（新任务或上次生成失败被复位），交给后台生成器，
    // 否则 genStatus=pending 的任务会一直排队、永远不执行。
    if (res.entry?.genStatus === "pending") scriptGen?.enqueue(res.entry);
    logger.info(`[dsh-qqbot] 定时任务 ${id} 已${payload.enabled ? "启用" : "禁用"}`);
    return { ok: true, data: { schedule: res.entry } };
  };

  /** 测试执行一次（真实发送，但不计入主动消息配额、不改下次触发时间）。 */
  const scheduleRunOnce = async (payload: { id?: unknown }) => {
    const id = typeof payload.id === "string" ? payload.id.trim() : "";
    if (!id) return { ok: false, error: "缺少 id" };
    if (!ctx.scheduler) return { ok: false, error: "调度器不可用" };
    const r = await ctx.scheduler.runOnce(id);
    if (r.ok) return { ok: true, data: { message: r.message } };
    return { ok: false, error: r.message };
  };

  const scheduleRemove = async (payload: { scope?: unknown; openid?: unknown; id?: unknown; index?: unknown }) => {
    // 设置页弹窗只传全局 id；聊天命令路径仍带 scope/openid（支持聊天内序号）。
    const id = typeof payload.id === "string" ? payload.id.trim() : "";
    if (id && !(typeof payload.scope === "string" && payload.scope) && !(typeof payload.openid === "string" && payload.openid)) {
      const removed = await schedules.removeById(id);
      return removed.ok ? { ok: true, data: { removed: removed.entry } } : { ok: false, error: removed.error };
    }
    const scope = String(payload.scope ?? "");
    const openid = String(payload.openid ?? "");
    const removed = await schedules.remove(scope, openid, String(payload.id ?? payload.index ?? ""));
    return removed.ok ? { ok: true, data: { removed: removed.entry } } : { ok: false, error: removed.error };
  };

  // ── 消息归档（设置页「消息归档」弹窗：只读最近记录） ─────────────────────────

  const archiveAppId = (payload: { appId?: unknown }) =>
    typeof payload.appId === "string" && payload.appId ? payload.appId : primaryAppId();

  const archiveList = async (payload: { appId?: unknown; limit?: unknown; day?: unknown }) => {
    const appId = archiveAppId(payload);
    // 带 day：读该天归档（设置页日期列表点击进入）。
    if (typeof payload.day === "string" && payload.day) {
      const result = await readArchiveDay({ bot: appId, day: payload.day, limit: 500 });
      return { ok: true, data: { appId, day: payload.day, ...result } };
    }
    const limit = typeof payload.limit === "number" && Number.isSafeInteger(payload.limit) ? payload.limit : undefined;
    const result = await readArchiveRecords({ bot: appId, limit });
    return { ok: true, data: { appId, ...result } };
  };

  /** 列举每个归档天的条数（顺带触发旧按天文件 → 「会话/月份」新结构迁移）。 */
  const archiveDays = async (payload: { appId?: unknown }) => {
    const appId = archiveAppId(payload);
    const days = await listArchiveDays(appId, logger);
    return { ok: true, data: { appId, days } };
  };

  /** 列举归档中出现过的会话（供会话选择器使用）。 */
  const archiveChats = async (payload: { appId?: unknown; limit?: unknown }) => {
    const appId = archiveAppId(payload);
    const limit = typeof payload.limit === "number" && Number.isSafeInteger(payload.limit) ? payload.limit : undefined;
    const result = await listArchiveChats({ bot: appId, limit });
    return { ok: true, data: { appId, ...result } };
  };

  /** 运营总览的归档统计：分类占比、会话来源、月份分布与活跃会话。 */
  const archiveStatsRpc = async (payload: { appId?: unknown }) => {
    const appId = archiveAppId(payload);
    return { ok: true, data: { appId, ...(await archiveStats(appId)) } };
  };

  /** 读取单个会话的归档记录（归档弹窗右栏；支持月份过滤、分页、倒序）。 */
  const archiveChat = async (payload: { appId?: unknown; chat?: unknown; month?: unknown; limit?: unknown; offset?: unknown; order?: unknown }) => {
    const appId = archiveAppId(payload);
    const chat = typeof payload.chat === "string" ? payload.chat : "";
    const month = typeof payload.month === "string" ? payload.month : "";
    const limit = typeof payload.limit === "number" && Number.isSafeInteger(payload.limit) ? payload.limit : undefined;
    const offset = typeof payload.offset === "number" && Number.isSafeInteger(payload.offset) ? payload.offset : undefined;
    const order = payload.order === "asc" ? "asc" : "desc";
    const result = await readArchiveChat({ bot: appId, chat, month, limit, offset, order });
    return { ok: true, data: { appId, chat, month, ...result } };
  };

  /** 删除单个会话的归档记录（按月份文件，其余会话保留）。 */
  const archiveRemoveChat = async (payload: { appId?: unknown; chat?: unknown; month?: unknown }) => {
    const appId = archiveAppId(payload);
    const chat = typeof payload.chat === "string" ? payload.chat : "";
    const month = typeof payload.month === "string" && /^\d{4}-\d{2}$/.test(payload.month) ? payload.month : "";
    const result = await removeArchiveChat({ bot: appId, chat, month });
    logger.info(`[dsh-qqbot] 已删除归档会话 ${chat}${month ? ` 的 ${month}` : ""} 中机器人 ${appId} 的 ${result.removed} 条记录${result.filesDeleted.length ? `（整删 ${result.filesDeleted.length} 个月份文件）` : ""}`);
    const list = await listArchiveChats({ bot: appId });
    // 与 archive.chats 保持同一结构：data.chats 必须是数组（此前把整个 list 对象塞进 chats，
    // 客户端 Array.isArray 判定失败，删除后列表与右栏状态无法刷新）。
    return { ok: true, data: { appId, chat, month, ...result, ...list } };
  };

  /** 删除某天归档中当前机器人的记录（其余机器人的保留）。 */
  const archiveRemoveDay = async (payload: { appId?: unknown; day?: unknown }) => {
    const appId = archiveAppId(payload);
    const day = typeof payload.day === "string" ? payload.day : "";
    const result = await removeArchiveDay({ bot: appId, day });
    logger.info(`[dsh-qqbot] 已删除归档 ${day} 中机器人 ${appId} 的 ${result.removed} 条记录${result.fileDeleted ? "（月份文件已整删）" : ""}`);
    const days = await listArchiveDays(appId, logger);
    return { ok: true, data: { appId, day, ...result, days } };
  };

  /**
   * 读取归档媒体（前端渲染缩略图用）。
   *
   * 媒体已落地在 ~/.dsh/qqbot/archive/<images|videos|files>/ 下，这里按
   * 类别 + 文件名取回 base64。
   * 走 RPC 通道（而非新增裸 HTTP 端点）是为了复用已有的浏览器鉴权栅栏，
   * 归档里的聊天内容不应绕过会话认证被任意读取。
   */
  const archiveMedia = async (payload: { kind?: unknown; file?: unknown }) => {
    const kindRaw = typeof payload.kind === "string" ? payload.kind : "image";
    const kind: ArchiveMediaKind = kindRaw === "video" || kindRaw === "file" ? kindRaw : "image";
    const file = typeof payload.file === "string" ? payload.file.trim() : "";
    if (!file) return { ok: false, error: "file 不能为空" };
    const media = await readArchivedMedia(kind, file);
    if (!media) return { ok: false, error: "媒体不存在或已被清理" };
    return { ok: true, data: { kind, file, ...media } };
  };

  // ── 平台能力（20261021~20261116 QQ OpenAPI 新增接口） ───────────────────────

  /** 按 appId 取运行时（缺省主机器人）；不存在返回 null。 */
  const platformBot = (appId: unknown) => {
    const id = typeof appId === "string" && appId ? appId : primaryAppId();
    return bots.get(id) ?? bots.primary() ?? null;
  };

  /** 批量解析用户资料：先读消息事件学习的内存缓存，缺失的回退平台接口（带缓存）。 */
  const platformUserInfo = async (payload: { appId?: unknown; openids?: unknown }) => {
    const bot = platformBot(payload.appId);
    if (!bot) return { ok: false, error: "没有可用的机器人（请先添加机器人）" };
    const openids = Array.isArray(payload.openids)
      ? payload.openids.filter((o): o is string => typeof o === "string" && o.trim() !== "").slice(0, 30)
      : [];
    if (!openids.length) return { ok: true, data: { users: {} } };
    const users: Record<string, { name: string; avatar: string }> = {};
    const missing: string[] = [];
    for (const o of openids) {
      const cached = bot.userProfiles.get(o);
      if (cached && (cached.name || cached.avatar)) users[o] = cached;
      else missing.push(o);
    }
    if (missing.length) {
      try {
        const fetched = await bot.client.getUserInfoBatch(missing);
        let learned = false;
        for (const [o, info] of Object.entries(fetched)) {
          users[o] = { name: info.username, avatar: info.avatar };
          if (info.username || info.avatar) {
            bot.userProfiles.set(o, { name: info.username, avatar: info.avatar });
            learned = true;
          }
        }
        if (learned) bot.profileStore.scheduleSave(bot.appId, bot.userProfiles);
      } catch (error) {
        logger.warn(`[dsh-qqbot] 批量拉取用户资料失败（已学习的资料仍可用）:`, error);
      }
    }
    return { ok: true, data: { users } };
  };

  /** 查询全局自定义菜单（仅 C2C 单聊展示）。 */
  const platformMenuGet = async (payload: { appId?: unknown }) => {
    const bot = platformBot(payload.appId);
    if (!bot) return { ok: false, error: "没有可用的机器人" };
    const menu = await bot.client.getMenu();
    return { ok: true, data: menu };
  };

  /** 保存全局自定义菜单（整份覆盖）。items 由客户端从菜单编辑器 / 指令清单生成。 */
  const platformMenuPut = async (payload: { appId?: unknown; items?: unknown }) => {
    const bot = platformBot(payload.appId);
    if (!bot) return { ok: false, error: "没有可用的机器人" };
    if (!Array.isArray(payload.items)) return { ok: false, error: "items 必须是菜单项数组" };
    const version = await bot.client.putMenu(payload.items as never[]);
    logger.info(`[dsh-qqbot] 已更新机器人 ${bot.appId} 的全局自定义菜单（version=${version}）`);
    return { ok: true, data: { version } };
  };

  /** 查询指令面板列表（scope 必填：c2c/group/channel/dm）。 */
  const platformPanelsList = async (payload: { appId?: unknown; scope?: unknown }) => {
    const bot = platformBot(payload.appId);
    if (!bot) return { ok: false, error: "没有可用的机器人" };
    const scope = typeof payload.scope === "string" ? payload.scope : "c2c";
    const panels = await bot.client.listPanels(scope);
    return { ok: true, data: { panels } };
  };

  /** 创建指令面板（body 透传平台字段：scope/target_type/group_openids/panel）。 */
  const platformPanelCreate = async (payload: { appId?: unknown; body?: unknown }) => {
    const bot = platformBot(payload.appId);
    if (!bot) return { ok: false, error: "没有可用的机器人" };
    if (!payload.body || typeof payload.body !== "object" || Array.isArray(payload.body)) {
      return { ok: false, error: "body 必须是对象（scope/target_type/panel）" };
    }
    const panelId = await bot.client.createPanel(payload.body as Record<string, unknown>);
    return { ok: true, data: { panelId } };
  };

  /** 查询指令面板详情。 */
  const platformPanelGet = async (payload: { appId?: unknown; panelId?: unknown }) => {
    const bot = platformBot(payload.appId);
    if (!bot) return { ok: false, error: "没有可用的机器人" };
    const panelId = typeof payload.panelId === "string" ? payload.panelId.trim() : "";
    if (!panelId) return { ok: false, error: "panelId 必填" };
    return { ok: true, data: await bot.client.getPanel(panelId) };
  };

  /** 修改指令面板配置（整份覆盖 items/remark）。 */
  const platformPanelUpdate = async (payload: { appId?: unknown; panelId?: unknown; panel?: unknown; version?: unknown }) => {
    const bot = platformBot(payload.appId);
    if (!bot) return { ok: false, error: "没有可用的机器人" };
    const panelId = typeof payload.panelId === "string" ? payload.panelId.trim() : "";
    if (!panelId) return { ok: false, error: "panelId 必填" };
    if (!payload.panel || typeof payload.panel !== "object" || Array.isArray(payload.panel)) {
      return { ok: false, error: "panel 必须是对象（items/remark）" };
    }
    const panel = { ...(payload.panel as Record<string, unknown>) };
    if (typeof payload.version === "number") panel.version = payload.version;
    const version = await bot.client.updatePanel(panelId, { panel });
    return { ok: true, data: { version } };
  };

  /** 删除指令面板。 */
  const platformPanelDelete = async (payload: { appId?: unknown; panelId?: unknown }) => {
    const bot = platformBot(payload.appId);
    if (!bot) return { ok: false, error: "没有可用的机器人" };
    const panelId = typeof payload.panelId === "string" ? payload.panelId.trim() : "";
    if (!panelId) return { ok: false, error: "panelId 必填" };
    await bot.client.deletePanel(panelId);
    return { ok: true, data: { done: true } };
  };

  /** 修改指令面板关联对象（add/del 群或用户）。 */
  const platformPanelTarget = async (payload: {
    appId?: unknown; panelId?: unknown; op?: unknown; groupOpenids?: unknown; userOpenids?: unknown;
  }) => {
    const bot = platformBot(payload.appId);
    if (!bot) return { ok: false, error: "没有可用的机器人" };
    const panelId = typeof payload.panelId === "string" ? payload.panelId.trim() : "";
    const op = payload.op === "del" ? "del" : "add";
    if (!panelId) return { ok: false, error: "panelId 必填" };
    const strList = (v: unknown): string[] => Array.isArray(v)
      ? v.filter((s): s is string => typeof s === "string" && s.trim() !== "").map((s) => s.trim())
      : [];
    await bot.client.setPanelTarget(panelId, op, {
      groupOpenids: strList(payload.groupOpenids), userOpenids: strList(payload.userOpenids),
    });
    return { ok: true, data: { done: true } };
  };

  /** 获取机器人自身详情（GET /users/@me）。 */
  const platformSelfInfo = async (payload: { appId?: unknown }) => {
    const bot = platformBot(payload.appId);
    if (!bot) return { ok: false, error: "没有可用的机器人" };
    return { ok: true, data: await bot.client.getSelfInfo() };
  };

  /** 生成机器人好友分享链接。 */
  const platformShareLink = async (payload: { appId?: unknown; callbackData?: unknown }) => {
    const bot = platformBot(payload.appId);
    if (!bot) return { ok: false, error: "没有可用的机器人" };
    const callbackData = typeof payload.callbackData === "string" ? payload.callbackData.trim() : "";
    const url = await bot.client.generateShareLink(callbackData || undefined);
    return { ok: true, data: { url } };
  };

  /** 手动发送图文卡片（msg_type=8）。 */
  const platformSendCard = async (payload: {
    appId?: unknown; scope?: unknown; openid?: unknown; msgId?: unknown;
    title?: unknown; description?: unknown; url?: unknown; picUrl?: unknown;
  }) => {
    const bot = platformBot(payload.appId);
    if (!bot) return { ok: false, error: "没有可用的机器人" };
    const scope = payload.scope === "group" ? "group" : payload.scope === "c2c" ? "c2c" : null;
    const openid = typeof payload.openid === "string" ? payload.openid.trim() : "";
    const msgId = typeof payload.msgId === "string" ? payload.msgId.trim() : "";
    const title = typeof payload.title === "string" ? payload.title.trim() : "";
    const description = typeof payload.description === "string" ? payload.description.trim() : "";
    const url = typeof payload.url === "string" ? payload.url.trim() : "";
    const picUrl = typeof payload.picUrl === "string" ? payload.picUrl.trim() : "";
    if (!scope || !openid) return { ok: false, error: "scope/openid 必填" };
    const id = await bot.client.sendCard(
      { scope, openid } satisfies ReplyTarget,
      { title, description, url, picUrl },
      msgId ? { msgId } : {},
    );
    if (msgId) bot.state.counters.replies += 1;
    else bot.state.counters.proactive += 1;
    void bot.archiver.append({ kind: msgId ? "reply" : "proactive", chat: scope + ":" + openid, content: `[图文卡片] ${title}`, note: `manual:card:${bot.appId}` });
    return { ok: true, data: { sent: true, id: id ?? "" } };
  };

  /** 列出某聊天最近可作为被动回复凭证的消息（msg_id 5 分钟内有效）。 */
  const platformRecentMessages = async (payload: { appId?: unknown; scope?: unknown; openid?: unknown }) => {
    const bot = platformBot(payload.appId);
    if (!bot) return { ok: false, error: "没有可用的机器人" };
    const scope = payload.scope === "group" ? "group" : payload.scope === "c2c" ? "c2c" : null;
    const openid = typeof payload.openid === "string" ? payload.openid.trim() : "";
    if (!scope || !openid) return { ok: false, error: "scope/openid 必填" };
    const chat = `${scope}:${openid}`;
    const now = Date.now();
    const items = bot.refIndex.recentByChat(chat, 20, 5 * 60 * 1000).map((entry) => ({
      msgId: entry.msgId,
      senderName: entry.senderName,
      sender: entry.sender,
      content: entry.content,
      at: entry.at,
      /** 剩余有效秒数（被动回复窗口 5 分钟）。 */
      leftSec: Math.max(0, Math.floor((entry.at + 5 * 60 * 1000 - now) / 1000)),
    }));
    return { ok: true, data: { messages: items } };
  };

  /** 上传素材图片（url），返回 Markdown 可引用的 qqbot-media:// 地址。 */
  const platformUploadMaterial = async (payload: { appId?: unknown; url?: unknown }) => {
    const bot = platformBot(payload.appId);
    if (!bot) return { ok: false, error: "没有可用的机器人" };
    const url = typeof payload.url === "string" ? payload.url.trim() : "";
    if (!url) return { ok: false, error: "url 必填" };
    const media = await bot.client.uploadMaterialImage({ url });
    return { ok: true, data: media };
  };

  /** 群成员列表（分页）。 */
  const platformGroupMembers = async (payload: { appId?: unknown; groupOpenid?: unknown; cursor?: unknown }) => {
    const bot = platformBot(payload.appId);
    if (!bot) return { ok: false, error: "没有可用的机器人" };
    const groupOpenid = typeof payload.groupOpenid === "string" ? payload.groupOpenid.trim() : "";
    if (!groupOpenid) return { ok: false, error: "groupOpenid 必填" };
    const cursor = typeof payload.cursor === "string" ? payload.cursor : "";
    const result = await bot.client.listGroupMembers(groupOpenid, cursor);
    return { ok: true, data: result };
  };

  /** 查询群禁言状态。 */
  const platformMuteGet = async (payload: { appId?: unknown; groupOpenid?: unknown }) => {
    const bot = platformBot(payload.appId);
    if (!bot) return { ok: false, error: "没有可用的机器人" };
    const groupOpenid = typeof payload.groupOpenid === "string" ? payload.groupOpenid.trim() : "";
    if (!groupOpenid) return { ok: false, error: "groupOpenid 必填" };
    const state = await bot.client.getMuteState(groupOpenid);
    return { ok: true, data: state };
  };

  /** 设置/解除成员禁言。minutes≤0 表示立即解除。 */
  const platformMuteSet = async (payload: { appId?: unknown; groupOpenid?: unknown; memberOpenids?: unknown; minutes?: unknown }) => {
    const bot = platformBot(payload.appId);
    if (!bot) return { ok: false, error: "没有可用的机器人" };
    const groupOpenid = typeof payload.groupOpenid === "string" ? payload.groupOpenid.trim() : "";
    if (!groupOpenid) return { ok: false, error: "groupOpenid 必填" };
    const memberOpenids = Array.isArray(payload.memberOpenids)
      ? payload.memberOpenids.filter((o): o is string => typeof o === "string" && o.trim() !== "").slice(0, 20)
      : [];
    if (!memberOpenids.length) return { ok: false, error: "memberOpenids 必填（≤20 个）" };
    const minutes = Number(payload.minutes);
    await bot.client.setMemberMute(groupOpenid, memberOpenids, Number.isFinite(minutes) && minutes > 0 ? Math.round(minutes) : 0);
    logger.info(`[dsh-qqbot] 群 ${groupOpenid.slice(0, 8)}… ${minutes > 0 ? `禁言 ${minutes} 分钟` : "解除禁言"}：${memberOpenids.length} 名成员`);
    return { ok: true, data: { done: true } };
  };

  /**
   * 全员禁言 / 全员解禁。minutes≤0 解禁。
   * 官方无 global_rule 写接口，这里遍历成员逐个设置；返回实际处理数量。
   */
  const platformMuteGlobal = async (payload: { appId?: unknown; groupOpenid?: unknown; minutes?: unknown }) => {
    const bot = platformBot(payload.appId);
    if (!bot) return { ok: false, error: "没有可用的机器人" };
    const groupOpenid = typeof payload.groupOpenid === "string" ? payload.groupOpenid.trim() : "";
    if (!groupOpenid) return { ok: false, error: "groupOpenid 必填" };
    const minutes = Number(payload.minutes);
    const safeMinutes = Number.isFinite(minutes) ? Math.max(0, Math.min(43200, Math.round(minutes))) : 10;
    const result = await bot.client.setGlobalMute(groupOpenid, safeMinutes);
    logger.info(`[dsh-qqbot] 群 ${groupOpenid.slice(0, 8)}… ${safeMinutes > 0 ? `全员禁言 ${safeMinutes} 分钟` : "全员解禁"}：${result.affected} 人`);
    return { ok: true, data: { done: true, affected: result.affected } };
  };

  /**
   * 续费 / 减轻已禁言成员的到期时间：按当前到期时间 + deltaMinutes 计算新到期（op=update）。
   * deltaMinutes>0 延长，<0 缩短；结果被夹在 [1 分钟后, 30 天后]（平台最大禁言 30 天）。
   */
  const platformMuteAdjust = async (payload: {
    appId?: unknown; groupOpenid?: unknown; memberOpenids?: unknown; deltaMinutes?: unknown;
  }) => {
    const bot = platformBot(payload.appId);
    if (!bot) return { ok: false, error: "没有可用的机器人" };
    const groupOpenid = typeof payload.groupOpenid === "string" ? payload.groupOpenid.trim() : "";
    if (!groupOpenid) return { ok: false, error: "groupOpenid 必填" };
    const memberOpenids = Array.isArray(payload.memberOpenids)
      ? payload.memberOpenids.filter((o): o is string => typeof o === "string" && o.trim() !== "").slice(0, 20)
      : [];
    if (!memberOpenids.length) return { ok: false, error: "memberOpenids 必填（≤20 个）" };
    const delta = Number(payload.deltaMinutes);
    if (!Number.isFinite(delta) || delta === 0) return { ok: false, error: "调整分钟数必须是非零数字" };

    const state = await bot.client.getMuteState(groupOpenid);
    const expireMap = new Map(state.members.map((m) => [m.member_openid, m.mute_expire_at]));
    const now = Date.now();
    const minExpire = now + 60_000;
    const maxExpire = now + 30 * 24 * 60 * 60_000;
    const entries: Array<{ member_openid: string; mute_expire_at: string }> = [];
    for (const openid of memberOpenids) {
      const raw = expireMap.get(openid);
      const current = raw ? Date.parse(raw) : NaN;
      // 找不到当前到期时间（已自然解除 / 不在列表）时，以「现在」为基准，视作重新禁言 delta 分钟。
      const base = Number.isNaN(current) ? now : current;
      const next = Math.min(maxExpire, Math.max(minExpire, base + Math.round(delta) * 6e4));
      entries.push({ member_openid: openid, mute_expire_at: new Date(next).toISOString() });
    }
    await bot.client.updateMemberMuteExpire(groupOpenid, entries);
    logger.info(
      `[dsh-qqbot] 群 ${groupOpenid.slice(0, 8)}… ${delta > 0 ? "续费" : "减轻"}禁言 ${Math.abs(Math.round(delta))} 分钟：${entries.length} 名成员`,
    );
    return { ok: true, data: { done: entries.length } };
  };

  /** 批量移除群成员（≤20 个/次；需群主开启权限）。 */
  const platformRemoveMembers = async (payload: { appId?: unknown; groupOpenid?: unknown; memberOpenids?: unknown }) => {
    const bot = platformBot(payload.appId);
    if (!bot) return { ok: false, error: "没有可用的机器人" };
    const groupOpenid = typeof payload.groupOpenid === "string" ? payload.groupOpenid.trim() : "";
    if (!groupOpenid) return { ok: false, error: "groupOpenid 必填" };
    const memberOpenids = Array.isArray(payload.memberOpenids)
      ? payload.memberOpenids.filter((o): o is string => typeof o === "string" && o.trim() !== "").slice(0, 20)
      : [];
    if (!memberOpenids.length) return { ok: false, error: "memberOpenids 必填（≤20 个）" };
    await bot.client.batchRemoveMembers(groupOpenid, memberOpenids);
    logger.warn(`[dsh-qqbot] 群 ${groupOpenid.slice(0, 8)}… 已批量移除 ${memberOpenids.length} 名成员`);
    return { ok: true, data: { removed: memberOpenids.length } };
  };

  /** 入群申请列表（分页）。 */
  const platformJoinRequests = async (payload: { appId?: unknown; groupOpenid?: unknown; cursor?: unknown; limit?: unknown }) => {
    const bot = platformBot(payload.appId);
    if (!bot) return { ok: false, error: "没有可用的机器人" };
    const groupOpenid = typeof payload.groupOpenid === "string" ? payload.groupOpenid.trim() : "";
    if (!groupOpenid) return { ok: false, error: "groupOpenid 必填" };
    const cursor = typeof payload.cursor === "string" ? payload.cursor : "";
    const limit = typeof payload.limit === "number" && Number.isFinite(payload.limit) ? payload.limit : 20;
    const result = await bot.client.listJoinRequests(groupOpenid, { cursor, limit });
    return { ok: true, data: result };
  };

  /** 审批入群申请（approve / decline）。 */
  const platformJoinApprove = async (payload: {
    appId?: unknown; groupOpenid?: unknown; memberOpenid?: unknown;
    approve?: unknown; joinRequestId?: unknown; rejectReason?: unknown; addToBlacklist?: unknown;
  }) => {
    const bot = platformBot(payload.appId);
    if (!bot) return { ok: false, error: "没有可用的机器人" };
    const groupOpenid = typeof payload.groupOpenid === "string" ? payload.groupOpenid.trim() : "";
    const memberOpenid = typeof payload.memberOpenid === "string" ? payload.memberOpenid.trim() : "";
    if (!groupOpenid || !memberOpenid) return { ok: false, error: "groupOpenid/memberOpenid 必填" };
    const approve = payload.approve === true;
    await bot.client.approveJoinRequest(groupOpenid, memberOpenid, {
      approve,
      joinRequestId: typeof payload.joinRequestId === "string" ? payload.joinRequestId : "",
      rejectReason: typeof payload.rejectReason === "string" ? payload.rejectReason : "",
      addToBlacklist: payload.addToBlacklist === true,
    });
    logger.info(`[dsh-qqbot] 群 ${groupOpenid.slice(0, 8)}… 入群申请已${approve ? "通过" : "拒绝"}：${memberOpenid.slice(0, 8)}…`);
    return { ok: true, data: { done: true } };
  };

  /** 入群自动审批策略列表。 */
  const platformJoinStrategies = async (payload: { appId?: unknown }) => {
    const bot = platformBot(payload.appId);
    if (!bot) return { ok: false, error: "没有可用的机器人" };
    const strategies = await bot.client.listJoinStrategies();
    return { ok: true, data: { strategies } };
  };

  /** 创建入群自动审批策略（关联群 openid 列表）。 */
  const platformJoinStrategyCreate = async (payload: { appId?: unknown; groupOpenids?: unknown; remark?: unknown }) => {
    const bot = platformBot(payload.appId);
    if (!bot) return { ok: false, error: "没有可用的机器人" };
    const groupOpenids = Array.isArray(payload.groupOpenids)
      ? payload.groupOpenids.filter((o): o is string => typeof o === "string" && o.trim() !== "")
      : [];
    if (!groupOpenids.length) return { ok: false, error: "groupOpenids 必填" };
    const remark = typeof payload.remark === "string" ? payload.remark.trim() : "";
    const strategyId = await bot.client.createJoinStrategy(groupOpenids, remark);
    return { ok: true, data: { strategyId } };
  };

  /** 删除入群自动审批策略。 */
  const platformJoinStrategyDelete = async (payload: { appId?: unknown; strategyId?: unknown }) => {
    const bot = platformBot(payload.appId);
    if (!bot) return { ok: false, error: "没有可用的机器人" };
    const strategyId = typeof payload.strategyId === "string" ? payload.strategyId.trim() : "";
    if (!strategyId) return { ok: false, error: "strategyId 必填" };
    await bot.client.deleteJoinStrategy(strategyId);
    return { ok: true, data: { deleted: true } };
  };

  /** 群基本信息（群名/简介/标签/人数）。 */
  const platformGroupInfo = async (payload: { appId?: unknown; groupOpenid?: unknown }) => {
    const bot = platformBot(payload.appId);
    if (!bot) return { ok: false, error: "没有可用的机器人" };
    const groupOpenid = typeof payload.groupOpenid === "string" ? payload.groupOpenid.trim() : "";
    if (!groupOpenid) return { ok: false, error: "groupOpenid 必填" };
    const info = await bot.client.getGroupInfo(groupOpenid);
    return { ok: true, data: info };
  };

  /** 单个群成员详情（内邀接口）。 */
  const platformGroupMember = async (payload: { appId?: unknown; groupOpenid?: unknown; memberOpenid?: unknown }) => {
    const bot = platformBot(payload.appId);
    if (!bot) return { ok: false, error: "没有可用的机器人" };
    const groupOpenid = typeof payload.groupOpenid === "string" ? payload.groupOpenid.trim() : "";
    const memberOpenid = typeof payload.memberOpenid === "string" ? payload.memberOpenid.trim() : "";
    if (!groupOpenid || !memberOpenid) return { ok: false, error: "groupOpenid/memberOpenid 必填" };
    const info = await bot.client.getGroupMember(groupOpenid, memberOpenid);
    return { ok: true, data: info ?? {} };
  };

  /** 机器人群内状态（管理员权限检测）。 */
  const platformBotState = async (payload: { appId?: unknown; groupOpenid?: unknown }) => {
    const bot = platformBot(payload.appId);
    if (!bot) return { ok: false, error: "没有可用的机器人" };
    const groupOpenid = typeof payload.groupOpenid === "string" ? payload.groupOpenid.trim() : "";
    if (!groupOpenid) return { ok: false, error: "groupOpenid 必填" };
    const state = await bot.client.getBotGroupState(groupOpenid);
    return { ok: true, data: state };
  };

  /** 群黑名单查询（分页）。 */
  const platformBlacklistList = async (payload: { appId?: unknown; groupOpenid?: unknown; cursor?: unknown; limit?: unknown }) => {
    const bot = platformBot(payload.appId);
    if (!bot) return { ok: false, error: "没有可用的机器人" };
    const groupOpenid = typeof payload.groupOpenid === "string" ? payload.groupOpenid.trim() : "";
    if (!groupOpenid) return { ok: false, error: "groupOpenid 必填" };
    const cursor = typeof payload.cursor === "string" ? payload.cursor : "";
    const limit = typeof payload.limit === "number" && Number.isFinite(payload.limit) ? payload.limit : 20;
    const result = await bot.client.listBlacklist(groupOpenid, { cursor, limit });
    return { ok: true, data: result };
  };

  /** 群黑名单操作（add/del，≤20 人）。 */
  const platformBlacklistSet = async (payload: {
    appId?: unknown; groupOpenid?: unknown; op?: unknown; memberOpenids?: unknown;
  }) => {
    const bot = platformBot(payload.appId);
    if (!bot) return { ok: false, error: "没有可用的机器人" };
    const groupOpenid = typeof payload.groupOpenid === "string" ? payload.groupOpenid.trim() : "";
    if (!groupOpenid) return { ok: false, error: "groupOpenid 必填" };
    const op = payload.op === "add" || payload.op === "del" ? payload.op : null;
    if (!op) return { ok: false, error: "op 必须是 add 或 del" };
    const memberOpenids = Array.isArray(payload.memberOpenids)
      ? payload.memberOpenids.filter((o): o is string => typeof o === "string" && o.trim() !== "").slice(0, 20)
      : [];
    if (!memberOpenids.length) return { ok: false, error: "memberOpenids 必填（≤20 个）" };
    const failOpenids = await bot.client.modifyBlacklist(groupOpenid, op, memberOpenids);
    return { ok: true, data: { failOpenids } };
  };

  /** 修改入群自动审批策略（启停/关联群/备注）。 */
  const platformJoinStrategyPatch = async (payload: {
    appId?: unknown; strategyId?: unknown; isEnable?: unknown; expireAt?: unknown;
    remark?: unknown; groupAction?: unknown;
  }) => {
    const bot = platformBot(payload.appId);
    if (!bot) return { ok: false, error: "没有可用的机器人" };
    const strategyId = typeof payload.strategyId === "string" ? payload.strategyId.trim() : "";
    if (!strategyId) return { ok: false, error: "strategyId 必填" };
    const body: {
      isEnable?: "on" | "off"; expireAt?: string; remark?: string;
      groupAction?: { op: "add" | "del"; groupOpenids: string[] };
    } = {};
    if (payload.isEnable === "on" || payload.isEnable === "off") body.isEnable = payload.isEnable;
    if (typeof payload.expireAt === "string" && payload.expireAt.trim()) body.expireAt = payload.expireAt.trim();
    if (typeof payload.remark === "string") body.remark = payload.remark;
    if (payload.groupAction && typeof payload.groupAction === "object" && !Array.isArray(payload.groupAction)) {
      const ga = payload.groupAction as { op?: unknown; groupOpenids?: unknown };
      if ((ga.op === "add" || ga.op === "del") && Array.isArray(ga.groupOpenids)) {
        body.groupAction = {
          op: ga.op,
          groupOpenids: ga.groupOpenids.filter((o): o is string => typeof o === "string" && o.trim() !== ""),
        };
      }
    }
    const result = await bot.client.patchJoinStrategy(strategyId, body);
    return { ok: true, data: result };
  };

  /** 执行入群自动审批策略（异步全量扫描）。 */
  const platformJoinStrategyExecute = async (payload: { appId?: unknown; strategyId?: unknown }) => {
    const bot = platformBot(payload.appId);
    if (!bot) return { ok: false, error: "没有可用的机器人" };
    const strategyId = typeof payload.strategyId === "string" ? payload.strategyId.trim() : "";
    if (!strategyId) return { ok: false, error: "strategyId 必填" };
    await bot.client.executeJoinStrategy(strategyId);
    return { ok: true, data: { started: true } };
  };

  /** 修改入群自动审批策略白名单号码。 */
  const platformStrategyWhitelist = async (payload: {
    appId?: unknown; strategyId?: unknown; op?: unknown; qqNumbers?: unknown;
  }) => {
    const bot = platformBot(payload.appId);
    if (!bot) return { ok: false, error: "没有可用的机器人" };
    const strategyId = typeof payload.strategyId === "string" ? payload.strategyId.trim() : "";
    if (!strategyId) return { ok: false, error: "strategyId 必填" };
    const op = payload.op === "add" || payload.op === "del" ? payload.op : null;
    if (!op) return { ok: false, error: "op 必须是 add 或 del" };
    const qqNumbers = Array.isArray(payload.qqNumbers)
      ? payload.qqNumbers.filter((n): n is string => typeof n === "string" && /^\d+$/.test(n.trim())).slice(0, 10000)
      : [];
    if (!qqNumbers.length) return { ok: false, error: "qqNumbers 必填（QQ 号码，最多 10000 个）" };
    const count = await bot.client.setStrategyWhitelist(strategyId, op, qqNumbers);
    return { ok: true, data: { count } };
  };

  /** 归档中出现过的会话（供平台能力群选择器候选：群 openid + 最近发言者辨认）。 */
  const platformArchiveChats = async (payload: { appId?: unknown }) => {
    const appId = archiveAppId(payload);
    const result = await listArchiveChats({ bot: appId });
    // 只回传选择器需要的字段，避免整份归档记录（含 months）走 RPC。
    const chats = result.chats.map((c) => ({
      scope: c.scope, openid: c.openid, name: c.name,
      lastSenderName: c.lastSenderName, lastTs: c.lastTs, count: c.count,
    }));
    return { ok: true, data: { appId, chats } };
  };

  // ── QQ 频道管理（Guild：频道 / 子频道 / 成员 / 身份组 / 消息） ─────────────
  type GuildBot = NonNullable<ReturnType<typeof platformBot>>;
  const guildReq = async (
    appId: unknown,
    required: Array<[string, unknown]>,
    fn: (bot: GuildBot) => Promise<unknown>,
  ) => {
    const bot = platformBot(appId);
    if (!bot) return { ok: false as const, error: "没有可用的机器人" };
    for (const [name, value] of required) {
      if (typeof value !== "string" || !value.trim()) return { ok: false as const, error: `${name} 必填` };
    }
    return { ok: true as const, data: await fn(bot) };
  };
  const guildBody = (v: unknown): Record<string, unknown> | null =>
    v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : null;

  const guildList = (p: { appId?: unknown }) => guildReq(p.appId, [], (bot) => bot.client.listGuilds());
  const guildInfo = (p: { appId?: unknown; guildId?: unknown }) =>
    guildReq(p.appId, [["guildId", p.guildId]], (bot) => bot.client.getGuild(String(p.guildId).trim()));
  const guildChannels = (p: { appId?: unknown; guildId?: unknown }) =>
    guildReq(p.appId, [["guildId", p.guildId]], (bot) => bot.client.listGuildChannels(String(p.guildId).trim()));
  const guildChannelGet = (p: { appId?: unknown; channelId?: unknown }) =>
    guildReq(p.appId, [["channelId", p.channelId]], (bot) => bot.client.getGuildChannel(String(p.channelId).trim()));
  const guildChannelCreate = async (p: { appId?: unknown; guildId?: unknown; body?: unknown }) => {
    const guildId = typeof p.guildId === "string" ? p.guildId.trim() : "";
    if (!guildId) return { ok: false as const, error: "guildId 必填" };
    const body = guildBody(p.body);
    if (!body) return { ok: false as const, error: "body 必须是对象" };
    return await guildReq(p.appId, [], (bot) => bot.client.createGuildChannel(guildId, body));
  };
  const guildChannelPatch = async (p: { appId?: unknown; channelId?: unknown; body?: unknown }) => {
    const channelId = typeof p.channelId === "string" ? p.channelId.trim() : "";
    if (!channelId) return { ok: false as const, error: "channelId 必填" };
    const body = guildBody(p.body);
    if (!body) return { ok: false as const, error: "body 必须是对象" };
    return await guildReq(p.appId, [], (bot) => bot.client.patchGuildChannel(channelId, body));
  };
  const guildChannelDelete = (p: { appId?: unknown; channelId?: unknown }) =>
    guildReq(p.appId, [["channelId", p.channelId]], async (bot) => {
      await bot.client.deleteGuildChannel(String(p.channelId).trim());
      return { deleted: true };
    });
  const guildMembers = (p: { appId?: unknown; guildId?: unknown; after?: unknown; limit?: unknown }) =>
    guildReq(p.appId, [["guildId", p.guildId]], (bot) => bot.client.listGuildMembers(String(p.guildId).trim(), {
      after: typeof p.after === "string" ? p.after : "0",
      limit: typeof p.limit === "number" && Number.isFinite(p.limit) ? p.limit : 100,
    }));
  const guildMember = (p: { appId?: unknown; guildId?: unknown; userId?: unknown }) =>
    guildReq(p.appId, [["guildId", p.guildId], ["userId", p.userId]], (bot) =>
      bot.client.getGuildMember(String(p.guildId).trim(), String(p.userId).trim()));
  const guildRoles = (p: { appId?: unknown; guildId?: unknown }) =>
    guildReq(p.appId, [["guildId", p.guildId]], (bot) => bot.client.listGuildRoles(String(p.guildId).trim()));
  const guildRoleCreate = async (p: { appId?: unknown; guildId?: unknown; body?: unknown }) => {
    const guildId = typeof p.guildId === "string" ? p.guildId.trim() : "";
    if (!guildId) return { ok: false as const, error: "guildId 必填" };
    const body = guildBody(p.body);
    if (!body) return { ok: false as const, error: "body 必须是对象" };
    return await guildReq(p.appId, [], (bot) => bot.client.createGuildRole(guildId, body));
  };
  const guildRolePatch = async (p: { appId?: unknown; guildId?: unknown; roleId?: unknown; body?: unknown }) => {
    const guildId = typeof p.guildId === "string" ? p.guildId.trim() : "";
    const roleId = typeof p.roleId === "string" ? p.roleId.trim() : "";
    if (!guildId) return { ok: false as const, error: "guildId 必填" };
    if (!roleId) return { ok: false as const, error: "roleId 必填" };
    const body = guildBody(p.body);
    if (!body) return { ok: false as const, error: "body 必须是对象" };
    return await guildReq(p.appId, [], (bot) => bot.client.patchGuildRole(guildId, roleId, body));
  };
  const guildRoleDelete = (p: { appId?: unknown; guildId?: unknown; roleId?: unknown }) =>
    guildReq(p.appId, [["guildId", p.guildId], ["roleId", p.roleId]], async (bot) => {
      await bot.client.deleteGuildRole(String(p.guildId).trim(), String(p.roleId).trim());
      return { deleted: true };
    });
  const guildRoleMember = (p: {
    appId?: unknown; guildId?: unknown; userId?: unknown; roleId?: unknown; add?: unknown; channelId?: unknown;
  }) =>
    guildReq(p.appId, [["guildId", p.guildId], ["userId", p.userId], ["roleId", p.roleId]], async (bot) => {
      await bot.client.setGuildMemberRole(
        String(p.guildId).trim(), String(p.userId).trim(), String(p.roleId).trim(),
        p.add === true, typeof p.channelId === "string" ? p.channelId.trim() : "",
      );
      return { done: true };
    });
  const guildMessageSend = (p: { appId?: unknown; channelId?: unknown; content?: unknown }) =>
    guildReq(p.appId, [["channelId", p.channelId]], (bot) =>
      bot.client.sendChannelMessage(String(p.channelId).trim(), typeof p.content === "string" ? p.content : ""));
  // 发言管理：全员 / 指定成员 / 批量禁言（minutes=0 解除）
  const guildMuteAll = (p: { appId?: unknown; guildId?: unknown; minutes?: unknown }) =>
    guildReq(p.appId, [["guildId", p.guildId]], async (bot) => {
      await bot.client.muteGuildAll(String(p.guildId).trim(), typeof p.minutes === "number" ? p.minutes : 0);
      return { done: true };
    });
  const guildMuteMember = (p: { appId?: unknown; guildId?: unknown; userId?: unknown; minutes?: unknown }) =>
    guildReq(p.appId, [["guildId", p.guildId], ["userId", p.userId]], async (bot) => {
      await bot.client.muteGuildMember(String(p.guildId).trim(), String(p.userId).trim(), typeof p.minutes === "number" ? p.minutes : 0);
      return { done: true };
    });
  const guildMuteMembers = (p: { appId?: unknown; guildId?: unknown; userIds?: unknown; minutes?: unknown }) =>
    guildReq(p.appId, [["guildId", p.guildId]], async (bot) => {
      const ids = Array.isArray(p.userIds) ? p.userIds.filter((id): id is string => typeof id === "string") : [];
      return { data: await bot.client.muteGuildMembers(String(p.guildId).trim(), ids, typeof p.minutes === "number" ? p.minutes : 0) };
    });
  const guildSettingGet = (p: { appId?: unknown; guildId?: unknown }) =>
    guildReq(p.appId, [["guildId", p.guildId]], (bot) =>
      bot.client.getGuildMessageSetting(String(p.guildId).trim()));
  const guildSettingPut = async (p: { appId?: unknown; guildId?: unknown; body?: unknown }) => {
    const guildId = typeof p.guildId === "string" ? p.guildId.trim() : "";
    if (!guildId) return { ok: false as const, error: "guildId 必填" };
    const body = guildBody(p.body);
    if (!body) return { ok: false as const, error: "body 必须是对象" };
    return await guildReq(p.appId, [], (bot) => bot.client.putGuildMessageSetting(guildId, body));
  };
  const guildMessageDelete = (p: { appId?: unknown; channelId?: unknown; messageId?: unknown; hideTip?: unknown }) =>
    guildReq(p.appId, [["channelId", p.channelId], ["messageId", p.messageId]], async (bot) => {
      await bot.client.deleteGuildMessage(
        String(p.channelId).trim(), String(p.messageId).trim(), p.hideTip !== false);
      return { deleted: true };
    });
  const guildChannelRoleGet = (p: { appId?: unknown; channelId?: unknown; roleId?: unknown }) =>
    guildReq(p.appId, [["channelId", p.channelId], ["roleId", p.roleId]], (bot) =>
      bot.client.getGuildChannelRolePermission(String(p.channelId).trim(), String(p.roleId).trim()));
  const guildChannelRolePatch = (p: {
    appId?: unknown; channelId?: unknown; roleId?: unknown; add?: unknown; remove?: unknown;
  }) =>
    guildReq(p.appId, [["channelId", p.channelId], ["roleId", p.roleId]], (bot) =>
      bot.client.patchGuildChannelRolePermission(
        String(p.channelId).trim(), String(p.roleId).trim(),
        guildBody(p.add) ?? undefined, guildBody(p.remove) ?? undefined));
  const guildMemberRoles = (p: { appId?: unknown; guildId?: unknown; userId?: unknown }) =>
    guildReq(p.appId, [["guildId", p.guildId], ["userId", p.userId]], (bot) =>
      bot.client.getGuildMemberRoles(String(p.guildId).trim(), String(p.userId).trim()));

  // ── 频道成员 / 内容管理 / 权限（全量补齐） ──────────────────────────────────
  const guildChannelOnline = (p: { appId?: unknown; channelId?: unknown }) =>
    guildReq(p.appId, [["channelId", p.channelId]], (bot) =>
      bot.client.getGuildChannelOnlineNums(String(p.channelId).trim()));
  const guildRoleMembers = (p: {
    appId?: unknown; guildId?: unknown; roleId?: unknown; startIndex?: unknown; limit?: unknown;
  }) =>
    guildReq(p.appId, [["guildId", p.guildId], ["roleId", p.roleId]], (bot) =>
      bot.client.getGuildRoleMembers(
        String(p.guildId).trim(), String(p.roleId).trim(),
        typeof p.startIndex === "number" ? p.startIndex : 0,
        typeof p.limit === "number" ? p.limit : 100));
  const guildMemberDelete = (p: { appId?: unknown; guildId?: unknown; userId?: unknown }) =>
    guildReq(p.appId, [["guildId", p.guildId], ["userId", p.userId]], async (bot) => {
      await bot.client.deleteGuildMember(String(p.guildId).trim(), String(p.userId).trim());
      return { deleted: true };
    });
  const guildApiPermGet = (p: { appId?: unknown; guildId?: unknown }) =>
    guildReq(p.appId, [["guildId", p.guildId]], (bot) =>
      bot.client.getGuildApiPermission(String(p.guildId).trim()));
  const guildApiPermDemand = async (p: { appId?: unknown; guildId?: unknown; body?: unknown }) => {
    const guildId = typeof p.guildId === "string" ? p.guildId.trim() : "";
    if (!guildId) return { ok: false as const, error: "guildId 必填" };
    const body = guildBody(p.body) ?? {};
    return await guildReq(p.appId, [], (bot) => bot.client.demandGuildApiPermission(guildId, body));
  };
  // QQ 官方没有「获取公告列表」接口（GET /guilds/{id}/announces 返回 405 请求方法非法），
  // 公告只有 POST 创建 / DELETE 删除。保留此 RPC 但返回说明，兼容旧客户端，避免抛原始 405。
  const guildAnnounceList = async (_p?: { appId?: unknown; guildId?: unknown }) => ({
    ok: true as const,
    data: { supported: false, note: "QQ 官方不提供公告列表查询接口；请用消息 ID 发布 / 删除公告。" },
  });
  const guildAnnounceCreate = async (p: { appId?: unknown; guildId?: unknown; body?: unknown }) => {
    const guildId = typeof p.guildId === "string" ? p.guildId.trim() : "";
    if (!guildId) return { ok: false as const, error: "guildId 必填" };
    const body = guildBody(p.body);
    if (!body) return { ok: false as const, error: "body 必须是对象" };
    return await guildReq(p.appId, [], (bot) => bot.client.createGuildAnnounce(guildId, body));
  };
  const guildAnnounceDelete = (p: { appId?: unknown; guildId?: unknown; messageId?: unknown }) =>
    guildReq(p.appId, [["guildId", p.guildId], ["messageId", p.messageId]], async (bot) => {
      await bot.client.deleteGuildAnnounce(String(p.guildId).trim(), String(p.messageId).trim());
      return { deleted: true };
    });
  const guildPinAdd = (p: { appId?: unknown; channelId?: unknown; messageId?: unknown }) =>
    guildReq(p.appId, [["channelId", p.channelId], ["messageId", p.messageId]], (bot) =>
      bot.client.addGuildPin(String(p.channelId).trim(), String(p.messageId).trim()));
  const guildPinDelete = (p: { appId?: unknown; channelId?: unknown; messageId?: unknown }) =>
    guildReq(p.appId, [["channelId", p.channelId], ["messageId", p.messageId]], (bot) =>
      bot.client.deleteGuildPin(String(p.channelId).trim(), String(p.messageId).trim()));
  const guildPinList = (p: { appId?: unknown; channelId?: unknown }) =>
    guildReq(p.appId, [["channelId", p.channelId]], (bot) =>
      bot.client.getGuildPins(String(p.channelId).trim()));
  /**
   * 拉取子频道消息列表，返回精简消息数组供客户端选真实 message_id。
   * 精华 / 撤回 / 引用回复都要真实消息 ID，不能用子频道 ID 代替（否则 501009）。
   */
  const guildMessageList = (p: { appId?: unknown; channelId?: unknown; limit?: unknown }) =>
    guildReq(p.appId, [["channelId", p.channelId]], async (bot) => {
      const raw = await bot.client.getChannelMessages(String(p.channelId).trim(), {
        limit: typeof p.limit === "number" ? p.limit : 50,
      });
      const list = Array.isArray(raw)
        ? raw
        : (raw && typeof raw === "object" ? (raw as Record<string, unknown>).messages : []);
      const rows = Array.isArray(list) ? list : [];
      return rows
        .filter((m): m is Record<string, unknown> => !!m && typeof m === "object")
        .map((m) => {
          const author = m.author && typeof m.author === "object"
            ? m.author as Record<string, unknown> : {};
          return {
            id: String(m.id ?? m.message_id ?? ""),
            content: String(m.content ?? "").slice(0, 160),
            author: String(author.username ?? author.id ?? ""),
            timestamp: String(m.timestamp ?? ""),
          };
        })
        .filter((m) => !!m.id);
    });
  const guildScheduleList = (p: { appId?: unknown; channelId?: unknown }) =>
    guildReq(p.appId, [["channelId", p.channelId]], (bot) =>
      bot.client.getGuildSchedules(String(p.channelId).trim()));
  const guildScheduleGet = (p: { appId?: unknown; channelId?: unknown; scheduleId?: unknown }) =>
    guildReq(p.appId, [["channelId", p.channelId], ["scheduleId", p.scheduleId]], (bot) =>
      bot.client.getGuildSchedule(String(p.channelId).trim(), String(p.scheduleId).trim()));
  const guildScheduleCreate = async (p: { appId?: unknown; channelId?: unknown; body?: unknown }) => {
    const channelId = typeof p.channelId === "string" ? p.channelId.trim() : "";
    if (!channelId) return { ok: false as const, error: "channelId 必填" };
    const body = guildBody(p.body);
    if (!body) return { ok: false as const, error: "body 必须是对象" };
    return await guildReq(p.appId, [], (bot) => bot.client.createGuildSchedule(channelId, body));
  };
  const guildSchedulePatch = async (p: {
    appId?: unknown; channelId?: unknown; scheduleId?: unknown; body?: unknown;
  }) => {
    const channelId = typeof p.channelId === "string" ? p.channelId.trim() : "";
    const scheduleId = typeof p.scheduleId === "string" ? p.scheduleId.trim() : "";
    if (!channelId) return { ok: false as const, error: "channelId 必填" };
    if (!scheduleId) return { ok: false as const, error: "scheduleId 必填" };
    const body = guildBody(p.body);
    if (!body) return { ok: false as const, error: "body 必须是对象" };
    return await guildReq(p.appId, [], (bot) => bot.client.patchGuildSchedule(channelId, scheduleId, body));
  };
  const guildScheduleDelete = (p: { appId?: unknown; channelId?: unknown; scheduleId?: unknown }) =>
    guildReq(p.appId, [["channelId", p.channelId], ["scheduleId", p.scheduleId]], async (bot) => {
      await bot.client.deleteGuildSchedule(String(p.channelId).trim(), String(p.scheduleId).trim());
      return { deleted: true };
    });
  const guildAudio = async (p: { appId?: unknown; channelId?: unknown; body?: unknown }) => {
    const channelId = typeof p.channelId === "string" ? p.channelId.trim() : "";
    if (!channelId) return { ok: false as const, error: "channelId 必填" };
    const body = guildBody(p.body) ?? {};
    return await guildReq(p.appId, [], (bot) => bot.client.guildAudioControl(channelId, body));
  };
  // 论坛接口官方现行路径只用 channel_id，没有 forum_id（旧 /forums/{forum}/ 已废弃）。
  // 仍接受 forumId 入参以兼容旧调用方，但不再要求必填。
  const guildForumThreads = (p: { appId?: unknown; channelId?: unknown; forumId?: unknown }) =>
    guildReq(p.appId, [["channelId", p.channelId]], (bot) =>
      bot.client.getGuildForumThreads(String(p.channelId).trim()));
  const guildForumThreadGet = (p: {
    appId?: unknown; channelId?: unknown; forumId?: unknown; threadId?: unknown;
  }) =>
    guildReq(p.appId, [["channelId", p.channelId], ["threadId", p.threadId]], (bot) =>
      bot.client.getGuildForumThread(
        String(p.channelId).trim(), "", String(p.threadId).trim()));
  const guildForumThreadCreate = async (p: {
    appId?: unknown; channelId?: unknown; forumId?: unknown; body?: unknown;
  }) => {
    const channelId = typeof p.channelId === "string" ? p.channelId.trim() : "";
    if (!channelId) return { ok: false as const, error: "channelId 必填" };
    const body = guildBody(p.body);
    if (!body) return { ok: false as const, error: "body 必须是对象" };
    return await guildReq(p.appId, [], (bot) => bot.client.createGuildForumThread(channelId, "", body));
  };
  const guildForumThreadDelete = (p: {
    appId?: unknown; channelId?: unknown; forumId?: unknown; threadId?: unknown;
  }) =>
    guildReq(p.appId, [["channelId", p.channelId], ["threadId", p.threadId]], async (bot) => {
      await bot.client.deleteGuildForumThread(
        String(p.channelId).trim(), "", String(p.threadId).trim());
      return { deleted: true };
    });
  const guildChannelPermGet = (p: { appId?: unknown; channelId?: unknown }) =>
    guildReq(p.appId, [["channelId", p.channelId]], (bot) =>
      bot.client.getGuildChannelPermissions(String(p.channelId).trim()));
  const guildChannelPermAll = async (p: { appId?: unknown; channelId?: unknown; body?: unknown }) => {
    const channelId = typeof p.channelId === "string" ? p.channelId.trim() : "";
    if (!channelId) return { ok: false as const, error: "channelId 必填" };
    const body = guildBody(p.body) ?? {};
    return await guildReq(p.appId, [], (bot) => bot.client.putGuildChannelPermissionAll(channelId, body));
  };

  // ── AI 群规审核（配置读写 / 日志 / 手动测试） ────────────────────────────────
  const moderationRequire = () => {
    if (!moderation) return null;
    return moderation;
  };
  const moderationGet = async (payload: { appId?: unknown; groupOpenid?: unknown }) => {
    const svc = moderationRequire();
    if (!svc) return { ok: false, error: "AI 审核服务不可用" };
    const appId = typeof payload.appId === "string" ? payload.appId.trim() : primaryAppId();
    const groupId = typeof payload.groupOpenid === "string" ? payload.groupOpenid.trim() : "";
    if (!groupId) return { ok: false, error: "groupOpenid 必填" };
    const config = await svc.store.getConfig(appId, groupId);
    return { ok: true, data: { appId, groupOpenid: groupId, config } };
  };
  const moderationSave = async (payload: { appId?: unknown; groupOpenid?: unknown; config?: unknown }) => {
    const svc = moderationRequire();
    if (!svc) return { ok: false, error: "AI 审核服务不可用" };
    const appId = typeof payload.appId === "string" ? payload.appId.trim() : primaryAppId();
    const groupId = typeof payload.groupOpenid === "string" ? payload.groupOpenid.trim() : "";
    if (!groupId) return { ok: false, error: "groupOpenid 必填" };
    const config = await svc.store.setConfig(appId, groupId, payload.config);
    svc.invalidateAdmin(appId, groupId);
    return { ok: true, data: { appId, groupOpenid: groupId, config } };
  };
  const moderationLogs = async (payload: { appId?: unknown; groupOpenid?: unknown; limit?: unknown }) => {
    const svc = moderationRequire();
    if (!svc) return { ok: false, error: "AI 审核服务不可用" };
    const appId = typeof payload.appId === "string" && payload.appId.trim() ? payload.appId.trim() : undefined;
    const groupId = typeof payload.groupOpenid === "string" && payload.groupOpenid.trim() ? payload.groupOpenid.trim() : undefined;
    const logs = await svc.store.listLogs({ appId, groupId, limit: typeof payload.limit === "number" ? payload.limit : 100 });
    return { ok: true, data: { logs } };
  };
  /** 规则自测：传 config 时用界面草稿（未保存也能测），否则用已保存配置。只判定不处罚。 */
  const moderationTest = async (payload: {
    appId?: unknown; groupOpenid?: unknown; content?: unknown; config?: unknown;
  }) => {
    const svc = moderationRequire();
    if (!svc) return { ok: false, error: "AI 审核服务不可用" };
    const appId = typeof payload.appId === "string" ? payload.appId.trim() : primaryAppId();
    const groupId = typeof payload.groupOpenid === "string" ? payload.groupOpenid.trim() : "";
    if (!groupId) return { ok: false, error: "groupOpenid 必填" };
    const content = typeof payload.content === "string" ? payload.content : "";
    if (!content.trim()) return { ok: false, error: "测试内容不能为空" };
    const config = payload.config !== undefined ? normalizeConfig(payload.config) : undefined;
    try {
      const result = await svc.testMessage({ appId, groupId, content, config });
      return { ok: true, data: result };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : String(error) };
    }
  };

  // ── 入群 AI 自动审批（配置读写 / 执行 / 日志） ────────────────────────────
  const joinApprovalRequire = () => {
    if (!joinApproval) return null;
    return joinApproval;
  };
  const joinApprovalGet = async (payload: { appId?: unknown; groupOpenid?: unknown }) => {
    const svc = joinApprovalRequire();
    if (!svc) return { ok: false, error: "入群自动审批服务不可用" };
    const appId = typeof payload.appId === "string" ? payload.appId.trim() : primaryAppId();
    const groupId = typeof payload.groupOpenid === "string" ? payload.groupOpenid.trim() : "";
    if (!groupId) return { ok: false, error: "groupOpenid 必填" };
    const config = await svc.getConfig(appId, groupId);
    return { ok: true, data: { appId, groupOpenid: groupId, config } };
  };
  const joinApprovalSave = async (payload: { appId?: unknown; groupOpenid?: unknown; config?: unknown }) => {
    const svc = joinApprovalRequire();
    if (!svc) return { ok: false, error: "入群自动审批服务不可用" };
    const appId = typeof payload.appId === "string" ? payload.appId.trim() : primaryAppId();
    const groupId = typeof payload.groupOpenid === "string" ? payload.groupOpenid.trim() : "";
    if (!groupId) return { ok: false, error: "groupOpenid 必填" };
    const config = await svc.saveConfig(appId, groupId, payload.config);
    return { ok: true, data: { appId, groupOpenid: groupId, config } };
  };
  const joinApprovalRun = async (payload: { appId?: unknown; groupOpenid?: unknown; limit?: unknown }) => {
    const svc = joinApprovalRequire();
    if (!svc) return { ok: false, error: "入群自动审批服务不可用" };
    const bot = platformBot(payload.appId);
    if (!bot) return { ok: false, error: "没有可用的机器人" };
    const groupId = typeof payload.groupOpenid === "string" ? payload.groupOpenid.trim() : "";
    if (!groupId) return { ok: false, error: "groupOpenid 必填" };
    const config = await svc.getConfig(bot.appId, groupId);
    if (!config.enabled) return { ok: false, error: "请先开启并保存自动审批配置" };
    const limit = typeof payload.limit === "number" && Number.isFinite(payload.limit) ? Math.min(100, Math.max(1, payload.limit)) : 50;
    const result = await svc.run(bot, groupId, limit);
    return { ok: true, data: result };
  };
  const joinApprovalLogs = async (payload: { appId?: unknown; groupOpenid?: unknown; limit?: unknown }) => {
    const svc = joinApprovalRequire();
    if (!svc) return { ok: false, error: "入群自动审批服务不可用" };
    const appId = typeof payload.appId === "string" && payload.appId.trim() ? payload.appId.trim() : undefined;
    const groupId = typeof payload.groupOpenid === "string" && payload.groupOpenid.trim() ? payload.groupOpenid.trim() : undefined;
    const logs = await svc.store.listLogs({ appId, groupId, limit: typeof payload.limit === "number" ? payload.limit : 30 });
    return { ok: true, data: { logs } };
  };

  // ── 频道 AI 接管（配置读写 / 日志） ────────────────────────────────────────
  const guildModRequire = () => {
    if (!guildModeration) return null;
    return guildModeration;
  };
  const guildModGet = async (payload: { appId?: unknown; guildId?: unknown }) => {
    const svc = guildModRequire();
    if (!svc) return { ok: false, error: "频道 AI 接管服务不可用" };
    const appId = typeof payload.appId === "string" ? payload.appId.trim() : "";
    const guildId = typeof payload.guildId === "string" ? payload.guildId.trim() : "";
    if (!appId || !guildId) return { ok: false, error: "appId 与 guildId 必填" };
    return { ok: true, data: { config: await svc.store.getConfig(appId, guildId) } };
  };
  const guildModSave = async (payload: { appId?: unknown; guildId?: unknown; config?: unknown }) => {
    const svc = guildModRequire();
    if (!svc) return { ok: false, error: "频道 AI 接管服务不可用" };
    const appId = typeof payload.appId === "string" ? payload.appId.trim() : "";
    const guildId = typeof payload.guildId === "string" ? payload.guildId.trim() : "";
    if (!appId || !guildId) return { ok: false, error: "appId 与 guildId 必填" };
    const config = await svc.store.setConfig(appId, guildId, payload.config);
    return { ok: true, data: { config } };
  };
  const guildModLogs = async (payload: { appId?: unknown; guildId?: unknown; limit?: unknown }) => {
    const svc = guildModRequire();
    if (!svc) return { ok: false, error: "频道 AI 接管服务不可用" };
    const appId = typeof payload.appId === "string" && payload.appId.trim() ? payload.appId.trim() : undefined;
    const guildId = typeof payload.guildId === "string" && payload.guildId.trim() ? payload.guildId.trim() : undefined;
    const logs = await svc.store.listLogs({ appId, guildId, limit: typeof payload.limit === "number" ? payload.limit : 30 });
    return { ok: true, data: { logs } };
  };

  // ── 频道违规词自动处置（配置读写 / 日志） ──────────────────────────────────
  const guildKeywordGet = async (payload: { appId?: unknown; guildId?: unknown }) => {
    if (!guildKeyword) return { ok: false, error: "违规词自动处置服务不可用" };
    const appId = typeof payload.appId === "string" ? payload.appId.trim() : "";
    const guildId = typeof payload.guildId === "string" ? payload.guildId.trim() : "";
    if (!appId || !guildId) return { ok: false, error: "appId 与 guildId 必填" };
    return { ok: true, data: { config: await guildKeyword.store.getConfig(appId, guildId) } };
  };
  const guildKeywordSave = async (payload: { appId?: unknown; guildId?: unknown; config?: unknown }) => {
    if (!guildKeyword) return { ok: false, error: "违规词自动处置服务不可用" };
    const appId = typeof payload.appId === "string" ? payload.appId.trim() : "";
    const guildId = typeof payload.guildId === "string" ? payload.guildId.trim() : "";
    if (!appId || !guildId) return { ok: false, error: "appId 与 guildId 必填" };
    const config = await guildKeyword.store.setConfig(appId, guildId, payload.config);
    return { ok: true, data: { config } };
  };
  const guildKeywordLogs = async (payload: { appId?: unknown; guildId?: unknown; limit?: unknown }) => {
    if (!guildKeyword) return { ok: false, error: "违规词自动处置服务不可用" };
    const appId = typeof payload.appId === "string" && payload.appId.trim() ? payload.appId.trim() : undefined;
    const guildId = typeof payload.guildId === "string" && payload.guildId.trim() ? payload.guildId.trim() : undefined;
    const logs = await guildKeyword.store.listLogs({ appId, guildId, limit: typeof payload.limit === "number" ? payload.limit : 30 });
    return { ok: true, data: { logs } };
  };

  // ── 频道 AI 自动回帖（配置读写 / 日志） ────────────────────────────────────
  const guildReplyGet = async (payload: { appId?: unknown; guildId?: unknown }) => {
    if (!guildReply) return { ok: false, error: "频道自动回帖服务不可用" };
    const appId = typeof payload.appId === "string" ? payload.appId.trim() : "";
    const guildId = typeof payload.guildId === "string" ? payload.guildId.trim() : "";
    if (!appId || !guildId) return { ok: false, error: "appId 与 guildId 必填" };
    return { ok: true, data: { config: await guildReply.store.getConfig(appId, guildId) } };
  };
  const guildReplySave = async (payload: { appId?: unknown; guildId?: unknown; config?: unknown }) => {
    if (!guildReply) return { ok: false, error: "频道自动回帖服务不可用" };
    const appId = typeof payload.appId === "string" ? payload.appId.trim() : "";
    const guildId = typeof payload.guildId === "string" ? payload.guildId.trim() : "";
    if (!appId || !guildId) return { ok: false, error: "appId 与 guildId 必填" };
    const config = await guildReply.store.setConfig(appId, guildId, payload.config);
    return { ok: true, data: { config } };
  };
  const guildReplyLogs = async (payload: { appId?: unknown; guildId?: unknown; limit?: unknown }) => {
    if (!guildReply) return { ok: false, error: "频道自动回帖服务不可用" };
    const appId = typeof payload.appId === "string" && payload.appId.trim() ? payload.appId.trim() : undefined;
    const guildId = typeof payload.guildId === "string" && payload.guildId.trim() ? payload.guildId.trim() : undefined;
    const logs = await guildReply.store.listLogs({ appId, guildId, limit: typeof payload.limit === "number" ? payload.limit : 30 });
    return { ok: true, data: { logs } };
  };

  // ── AI 操作助手（群聊管理 / 频道管理：对话式操作，本地优先省 token） ──────────
  const parseAiEntities = (v: unknown): AiEntity[] => {
    if (!Array.isArray(v)) return [];
    return v.slice(0, 300).flatMap((row) => {
      if (!row || typeof row !== "object") return [];
      const r = row as Record<string, unknown>;
      const id = typeof r.id === "string" ? r.id.trim() : "";
      const name = typeof r.name === "string" ? r.name.trim() : "";
      const kind = r.kind === "member" || r.kind === "channel" || r.kind === "role" ? r.kind : "member";
      return id && name ? [{ id, name, kind }] : [];
    });
  };
  const aiChat = async (payload: {
    appId?: unknown; scope?: unknown; text?: unknown; groupOpenid?: unknown;
    guildId?: unknown; channelId?: unknown; entities?: unknown;
  }) => {
    if (!aiOps) return { ok: false, error: "AI 操作助手服务不可用（请重启 dsh web）" };
    const scope: AiScope = payload.scope === "guild" ? "guild" : "group";
    const text = typeof payload.text === "string" ? payload.text.trim() : "";
    if (!text) return { ok: false, error: "text 必填" };
    const out: AiOpsResult = await aiOps.chat({
      appId: typeof payload.appId === "string" ? payload.appId.trim() : "",
      scope,
      text,
      groupOpenid: typeof payload.groupOpenid === "string" ? payload.groupOpenid.trim() : "",
      guildId: typeof payload.guildId === "string" ? payload.guildId.trim() : "",
      channelId: typeof payload.channelId === "string" ? payload.channelId.trim() : "",
      entities: parseAiEntities(payload.entities),
    });
    return { ok: out.ok, data: { reply: out.reply, source: out.source, usedLlm: out.usedLlm, action: out.action, data: out.data } };
  };
  const aiSuggest = async (payload: { scope?: unknown; entities?: unknown }) => {
    if (!aiOps) return { ok: false, error: "AI 操作助手服务不可用（请重启 dsh web）" };
    const scope: AiScope = payload.scope === "guild" ? "guild" : "group";
    const items = aiOps.suggest({
      scope,
      entities: parseAiEntities(payload.entities),
    });
    return { ok: true, data: { items } };
  };
  /** 用量统计：按群聊 / 频道独立返回，两个面板不再共用同一份数字。 */
  const aiStats = async (payload: { scope?: unknown } = {}): Promise<{ ok: true; data: { stats: AiOpsStats } }> => {
    const scope = payload.scope === "guild" ? "guild" : payload.scope === "group" ? "group" : undefined;
    return { ok: true, data: { stats: aiOps ? aiOps.stats(scope) : { local: 0, cache: 0, llm: 0, failed: 0, savedTokens: 0 } } };
  };
  /** 设置页「执行记录」Tab：按场景读取独立 JSON，只看当前机器人 + 当前群/频道的历史操作。 */
  const aiLogs = async (payload: {
    appId?: unknown; scope?: unknown; groupOpenid?: unknown; guildId?: unknown; limit?: unknown;
  }) => {
    if (!aiOps) return { ok: false, error: "AI 操作助手服务不可用（请重启 dsh web）" };
    await aiOps.ready();
    const scope = payload.scope === "guild" ? "guild" : "group";
    const logs = aiOps.logs({
      appId: typeof payload.appId === "string" ? payload.appId : "",
      scope,
      groupOpenid: typeof payload.groupOpenid === "string" ? payload.groupOpenid : "",
      guildId: typeof payload.guildId === "string" ? payload.guildId : "",
      limit: typeof payload.limit === "number" ? payload.limit : 50,
    });
    return { ok: true, data: { logs, scope } };
  };

  // ── 版本检查与自更新（GitHub master1Sun/dsh-QQbot） ──────────────────────────

  const updateCheck = async () => {
    const data = await checkUpdate();
    return { ok: true, data };
  };

  const updateApply = async () => {
    const check = await checkUpdate();
    if (!check.hasUpdate) {
      return { ok: false, error: `暂无新版本（当前 v${check.current || "?"}，远端 v${check.latest}）` };
    }
    const data = await applyUpdate();
    logger.info(`[dsh-qqbot] 已自更新 ${data.updatedFrom} → ${data.updatedTo}，备份于 ${data.backupDir}`);
    return { ok: true, data };
  };

  /**
   * 把内部 reply 规整成 DSH RPC 信封：成功用 value（不是 data），
   * 失败用 { code, message, details }（三个字段齐全，否则浏览器端 parseConnectionResponse
   * 会抛 "connection: invalid server-response failure"）。
   */
  const normalizeReply = (reply: unknown): { ok: boolean; value?: unknown; error?: unknown } => {
    if (!reply || typeof reply !== "object") {
      return { ok: false, error: { code: "qqbot-operation-failed", message: "空响应", details: {} } };
    }
    const r = reply as { ok?: boolean; value?: unknown; data?: unknown; error?: unknown };
    if (r.ok) {
      const value = "value" in r ? r.value : r.data;
      return { ok: true, value };
    }
    const err = r.error;
    const message = typeof err === "string"
      ? err
      : err && typeof err === "object" && typeof (err as { message?: unknown }).message === "string"
        ? (err as { message: string }).message
        : "操作失败";
    return { ok: false, error: { code: "qqbot-operation-failed", message, details: {} } };
  };

  /** 设置界面 RPC 分发：endpoint → 处理函数。 */
  const handle = async (endpoint: string, payload: Record<string, unknown> = {}): Promise<unknown> => {
    let result: unknown;
    try {
      switch (endpoint) {
        case "status": result = status(); break;
        case "config.get": result = await configGet(typeof payload.appId === "string" ? payload.appId : undefined); break;
        case "config.save": result = await configSave(payload); break;
        case "credentials.save": result = await credentialsSave(payload); break;
        case "qr.start": result = await qrStart(); break;
        case "qr.state": result = qrState(); break;
        case "qr.cancel": result = qrCancel(); break;
        case "bots.list": result = await botsList(); break;
        case "bots.setPrimary": result = await botsSetPrimary(payload); break;
        case "bots.enable": result = await botsEnable(payload); break;
        case "bots.remove": result = await botsRemove(payload); break;
        case "bots.reconnect": result = await bots.reconnect(typeof payload.appId === "string" ? payload.appId : undefined); result = { ok: true, data: { reconnected: true, ws: bots.statusOf(typeof payload.appId === "string" ? payload.appId : primaryAppId()) } }; break;
        case "catalogs": result = await catalogs(); break;
        case "workspace.list": result = await workspaceList(); break;
        case "workspace.browse": result = await workspaceBrowse(payload); break;
        case "send": result = await sendProactive(payload); break;
        case "schedule.list": result = await scheduleList(payload); break;
        case "schedule.add": result = await scheduleAdd(payload); break;
        case "schedule.remove": result = await scheduleRemove(payload); break;
        case "schedule.setEnabled": result = await scheduleSetEnabled(payload); break;
        case "schedule.runOnce": result = await scheduleRunOnce(payload); break;
        case "archive.list": result = await archiveList(payload); break;
        case "archive.days": result = await archiveDays(payload); break;
        case "archive.chats": result = await archiveChats(payload); break;
        case "archive.stats": result = await archiveStatsRpc(payload); break;
        case "archive.chat": result = await archiveChat(payload); break;
        case "archive.removeChat": result = await archiveRemoveChat(payload); break;
        case "archive.removeDay": result = await archiveRemoveDay(payload); break;
        case "archive.media": result = await archiveMedia(payload); break;
        case "platform.userInfo": result = await platformUserInfo(payload); break;
        case "platform.selfInfo": result = await platformSelfInfo(payload); break;
        case "platform.menu.get": result = await platformMenuGet(payload); break;
        case "platform.menu.put": result = await platformMenuPut(payload); break;
        case "platform.panels.list": result = await platformPanelsList(payload); break;
        case "platform.panel.create": result = await platformPanelCreate(payload); break;
        case "platform.panel.get": result = await platformPanelGet(payload); break;
        case "platform.panel.update": result = await platformPanelUpdate(payload); break;
        case "platform.panel.delete": result = await platformPanelDelete(payload); break;
        case "platform.panel.target": result = await platformPanelTarget(payload); break;
        case "platform.shareLink": result = await platformShareLink(payload); break;
        case "platform.sendCard": result = await platformSendCard(payload); break;
        case "platform.recentMessages": result = await platformRecentMessages(payload); break;
        case "platform.uploadMaterial": result = await platformUploadMaterial(payload); break;
        case "platform.group.members": result = await platformGroupMembers(payload); break;
        case "platform.mute.get": result = await platformMuteGet(payload); break;
        case "platform.mute.set": result = await platformMuteSet(payload); break;
        case "platform.mute.global": result = await platformMuteGlobal(payload); break;
        case "platform.mute.adjust": result = await platformMuteAdjust(payload); break;
        case "platform.group.removeMembers": result = await platformRemoveMembers(payload); break;
        case "platform.join.requests": result = await platformJoinRequests(payload); break;
        case "platform.join.approve": result = await platformJoinApprove(payload); break;
        case "platform.join.strategies": result = await platformJoinStrategies(payload); break;
        case "platform.join.strategy.create": result = await platformJoinStrategyCreate(payload); break;
        case "platform.join.strategy.delete": result = await platformJoinStrategyDelete(payload); break;
        case "platform.group.info": result = await platformGroupInfo(payload); break;
        case "platform.group.member": result = await platformGroupMember(payload); break;
        case "platform.bot.state": result = await platformBotState(payload); break;
        case "platform.blacklist.list": result = await platformBlacklistList(payload); break;
        case "platform.blacklist.set": result = await platformBlacklistSet(payload); break;
        case "platform.join.strategy.patch": result = await platformJoinStrategyPatch(payload); break;
        case "platform.join.strategy.execute": result = await platformJoinStrategyExecute(payload); break;
        case "platform.strategy.whitelist": result = await platformStrategyWhitelist(payload); break;
        case "platform.archiveChats": result = await platformArchiveChats(payload); break;
        case "guild.list": result = await guildList(payload); break;
        case "guild.info": result = await guildInfo(payload); break;
        case "guild.channels": result = await guildChannels(payload); break;
        case "guild.channel.get": result = await guildChannelGet(payload); break;
        case "guild.channel.create": result = await guildChannelCreate(payload); break;
        case "guild.channel.patch": result = await guildChannelPatch(payload); break;
        case "guild.channel.delete": result = await guildChannelDelete(payload); break;
        case "guild.members": result = await guildMembers(payload); break;
        case "guild.member": result = await guildMember(payload); break;
        case "guild.roles": result = await guildRoles(payload); break;
        case "guild.role.create": result = await guildRoleCreate(payload); break;
        case "guild.role.patch": result = await guildRolePatch(payload); break;
        case "guild.role.delete": result = await guildRoleDelete(payload); break;
        case "guild.role.member": result = await guildRoleMember(payload); break;
        case "guild.message.send": result = await guildMessageSend(payload); break;
        case "guild.mute.all": result = await guildMuteAll(payload); break;
        case "guild.mute.member": result = await guildMuteMember(payload); break;
        case "guild.mute.members": result = await guildMuteMembers(payload); break;
        case "guild.setting.get": result = await guildSettingGet(payload); break;
        case "guild.setting.put": result = await guildSettingPut(payload); break;
        case "guild.message.delete": result = await guildMessageDelete(payload); break;
        case "guild.channel.role.get": result = await guildChannelRoleGet(payload); break;
        case "guild.channel.role.patch": result = await guildChannelRolePatch(payload); break;
        case "guild.member.roles": result = await guildMemberRoles(payload); break;
        case "guild.channel.online": result = await guildChannelOnline(payload); break;
        case "guild.role.members": result = await guildRoleMembers(payload); break;
        case "guild.member.delete": result = await guildMemberDelete(payload); break;
        case "guild.apiPerm.get": result = await guildApiPermGet(payload); break;
        case "guild.apiPerm.demand": result = await guildApiPermDemand(payload); break;
        case "guild.announce.list": result = await guildAnnounceList(payload); break;
        case "guild.announce.create": result = await guildAnnounceCreate(payload); break;
        case "guild.announce.delete": result = await guildAnnounceDelete(payload); break;
        case "guild.pin.add": result = await guildPinAdd(payload); break;
        case "guild.pin.delete": result = await guildPinDelete(payload); break;
        case "guild.pin.list": result = await guildPinList(payload); break;
        case "guild.message.list": result = await guildMessageList(payload); break;
        case "guild.schedule.list": result = await guildScheduleList(payload); break;
        case "guild.schedule.get": result = await guildScheduleGet(payload); break;
        case "guild.schedule.create": result = await guildScheduleCreate(payload); break;
        case "guild.schedule.patch": result = await guildSchedulePatch(payload); break;
        case "guild.schedule.delete": result = await guildScheduleDelete(payload); break;
        case "guild.audio": result = await guildAudio(payload); break;
        case "guild.forum.threads": result = await guildForumThreads(payload); break;
        case "guild.forum.thread.get": result = await guildForumThreadGet(payload); break;
        case "guild.forum.thread.create": result = await guildForumThreadCreate(payload); break;
        case "guild.forum.thread.delete": result = await guildForumThreadDelete(payload); break;
        case "guild.channelPerm.get": result = await guildChannelPermGet(payload); break;
        case "guild.channelPerm.all": result = await guildChannelPermAll(payload); break;
        case "moderation.config.get": result = await moderationGet(payload); break;
        case "moderation.config.save": result = await moderationSave(payload); break;
        case "moderation.logs": result = await moderationLogs(payload); break;
        case "moderation.test": result = await moderationTest(payload); break;
        case "join.auto.config.get": result = await joinApprovalGet(payload); break;
        case "join.auto.config.save": result = await joinApprovalSave(payload); break;
        case "join.auto.run": result = await joinApprovalRun(payload); break;
        case "join.auto.logs": result = await joinApprovalLogs(payload); break;
        case "guild.mod.config.get": result = await guildModGet(payload); break;
        case "guild.mod.config.save": result = await guildModSave(payload); break;
        case "guild.mod.logs": result = await guildModLogs(payload); break;
        case "guild.keyword.config.get": result = await guildKeywordGet(payload); break;
        case "guild.keyword.config.save": result = await guildKeywordSave(payload); break;
        case "guild.keyword.logs": result = await guildKeywordLogs(payload); break;
        case "guild.reply.config.get": result = await guildReplyGet(payload); break;
        case "guild.reply.config.save": result = await guildReplySave(payload); break;
        case "guild.reply.logs": result = await guildReplyLogs(payload); break;
        case "ai.chat": result = await aiChat(payload); break;
        case "ai.suggest": result = await aiSuggest(payload); break;
        case "ai.stats": result = await aiStats(payload); break;
        case "ai.logs": result = await aiLogs(payload); break;
        case "stats.reset": {
          const bot = await bots.resetCounters(typeof payload.appId === "string" ? payload.appId : undefined);
          result = bot
            ? { ok: true, data: { appId: bot.appId, counters: { ...bot.state.counters } } }
            : { ok: false, error: "机器人不存在" };
          break;
        }
        case "update.check": result = await updateCheck(); break;
        case "update.apply": result = await updateApply(); break;
        default: result = { ok: false, error: `unknown endpoint: ${endpoint}` };
      }
    } catch (error) {
      logger.error(`[dsh-qqbot] RPC ${endpoint} 失败:`, error);
      result = { ok: false, error: error instanceof Error ? error.message : String(error) };
    }
    return normalizeReply(await result);
  };

  return {
    status,
    configGet,
    configSave,
    credentialsSave,
    qrStart,
    qrState,
    qrCancel,
    sendProactive,
    handle,
    /** 当前 adminToken（HTTP /send 鉴权用）。 */
    adminToken: () => gconf.adminToken ?? "",
    /** 当前管理路由前缀（/status /qr /send）。 */
    callbackPath: () => "/qqbot",
  };
}

export type AdminService = ReturnType<typeof createAdminService>;
