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
import { listArchiveChats, listArchiveDays, readArchiveDay, readArchiveRecords, removeArchiveDay } from "../infra/archive.js";
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
}

/** AppID 脱敏：保留前 4 与后 4 位。 */
const maskAppId = (appId: string): string =>
  appId.length <= 8 ? appId : `${appId.slice(0, 4)}••••${appId.slice(-4)}`;

export function createAdminService(ctx: AdminServiceContext) {
  const { bots, gconf, schedules, scriptGen, qr, logger, runtimeReady } = ctx;
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

  /** 目录浏览：列出指定目录下的子文件夹（仅目录，不做任何写操作）。 */
  const workspaceBrowse = async (payload: { path?: unknown }) => {
    const root = path.join(homedir(), ".dsh", "file");
    const requested = typeof payload.path === "string" && payload.path.trim() ? payload.path.trim() : root;
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
    return {
      ok: true,
      data: {
        path: target,
        parent: parent === target ? null : parent,
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
      resultMode: payload.resultMode === "ai" || payload.resultMode === "raw" ? payload.resultMode : undefined,
      parsePrompt: typeof payload.parsePrompt === "string" ? payload.parsePrompt : undefined,
      gate: typeof payload.gate === "string" ? payload.gate : undefined,
      goal: typeof payload.goal === "string" ? payload.goal : undefined,
      notifyWhen: typeof payload.notifyWhen === "string" ? payload.notifyWhen : undefined,
      verify: typeof payload.verify === "boolean" ? payload.verify : undefined,
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

  /** 列举每个归档天的条数（顺带触发旧月文件 → 天文件迁移）。 */
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

  /** 删除某天归档中当前机器人的记录（其余机器人的保留）。 */
  const archiveRemoveDay = async (payload: { appId?: unknown; day?: unknown }) => {
    const appId = archiveAppId(payload);
    const day = typeof payload.day === "string" ? payload.day : "";
    const result = await removeArchiveDay({ bot: appId, day });
    logger.info(`[dsh-qqbot] 已删除归档 ${day} 中机器人 ${appId} 的 ${result.removed} 条记录${result.fileDeleted ? "（天文件已整删）" : ""}`);
    const days = await listArchiveDays(appId, logger);
    return { ok: true, data: { appId, day, ...result, days } };
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
        case "archive.removeDay": result = await archiveRemoveDay(payload); break;
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
