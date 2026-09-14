import type { BotRuntime } from "../bots.js";
import type { QuotaTracker } from "../infra/quota.js";
/**
 * 每个群/单聊的定时消息条数**默认上限**（可被 bots.json 的 `scheduleMaxPerChat` 覆盖，0 = 不限）。
 * 仅作为兜底：实际生效值由 ScheduleStore 的 resolver 按机器人配置解析（见 maxPerChat）。
 */
export declare const MAX_SCHEDULES_PER_CHAT = 15;
/** 定时任务执行类型。 */
export type ScheduleEntryType = "daily" | "interval" | "cron" | "at";
/** 定时任务条目（schedules.json 一行一个对象）。 */
export interface ScheduleEntry {
    id: string;
    createdAt: string;
    scope: "group" | "c2c";
    openid: string;
    type: ScheduleEntryType;
    /** daily：HH:mm（上海时间）。 */
    time?: string;
    /** interval：间隔分钟数（≥5）。 */
    minutes?: number;
    /** cron：标准 5 段表达式。 */
    cron?: string;
    /** cron 使用的 IANA 时区（默认上海）。 */
    tz?: string;
    /** at：一次性触发时刻（ISO）。 */
    at?: string;
    /** 限定星期几执行（0=周日）；interval 类型也生效。 */
    weekdays?: number[];
    /** 执行模式：text 直发 / ai 会话生成 / tool 命令执行。 */
    mode?: "text" | "ai" | "tool";
    /** text=消息内容；ai=生成用 prompt；tool=命令行（优先于 command 字段展示）。 */
    content: string;
    /** tool 模式：规范化后的完整命令。 */
    command?: string;
    /** tool 模式：AI 脚本描述词（非空时走脚本生成流程）。 */
    genPrompt?: string;
    /** AI 脚本生成状态机。 */
    genStatus?: "pending" | "done" | "error";
    genError?: string;
    genStartedAt?: string;
    genDoneAt?: string;
    /** tool 模式：命令工作目录。 */
    cwd?: string;
    /**
     * tool 模式：命令执行超时（毫秒）。
     * 缺省用内置默认（12s，上限 10min）。报表 / 爬取类脚本常需更长，可按任务单独放宽。
     */
    timeoutMs?: number;
    /**
     * tool 模式：追加到进程环境变量的键值对（脚本可读 `process.env.XXX` / `os.environ`）。
     * 用于传 API Key、目标路径等，避免把敏感值硬编码进命令行（会出现在日志里）。
     */
    env?: Record<string, string>;
    /** tool 模式：命令输出处理——raw 原始输出播报 / ai 交给 AI 总结播报。 */
    resultMode?: "raw" | "ai";
    /**
     * 数据加工指令：把取到的数据整理成什么样再发送。
     * tool + resultMode=ai 时替代内置的「整理成简洁播报」默认指令；
     * 留空则用内置默认（见 composeParsePrompt）。
     */
    parsePrompt?: string;
    /**
     * 【任务契约】目标：这条任务服务于什么判断/决策。
     * 供 AI 分诊时理解「为什么发、发给谁看」，ai / tool 模式可用。
     */
    goal?: string;
    /**
     * 【任务契约】通知条件（自然语言）：满足什么才值得发送；不满足则本次静默跳过。
     * 例：「只有涨幅超过 5%、或出现异常时才提醒」。ai / tool 模式可用。
     */
    notifyWhen?: string;
    /**
     * 【任务契约】发送前自校验：
     * tool 模式由**独立模型二次复核**草稿是否满足契约，不达标则不发；
     * ai 模式因内容在会话内生成，降级为**强化的自查指令**。
     */
    verify?: boolean;
    /**
     * 发送门控：投递到 QQ 之前判定「这次值不值得发」。
     * - always（默认）：总是发送；
     * - nonempty：取数结果为空/无实质内容时跳过；
     * - changed：与上次成功发送的内容一致时跳过（适合「有变化才播报」）。
     * 跳过不投递、不消耗主动消息配额，并把原因记入 lastSkipReason。
     */
    gate?: "always" | "nonempty" | "changed";
    /** gate=changed：上次成功发送内容的指纹（sha1 前 16 位），避免明文驻留。 */
    lastDigest?: string;
    /** 最近一次「跳过发送」的时刻（上海时间 ISO）。 */
    lastSkipAt?: string;
    /** 最近一次跳过发送的原因（供界面与排障展示）。 */
    lastSkipReason?: string;
    /** false = 已禁用（调度器跳过、不占配额）。 */
    enabled?: boolean;
    /** 创建来源：chat 命令 / ai 工具 / settings 设置页。 */
    createdBy?: string;
    /** 归属机器人 AppID（缺省走主机器人）。 */
    appId?: string;
    /** 旧版遗留：聊天命令直接给的命令行（tool 模式兼容字段）。 */
    tool?: string;
    /** 旧版遗留：动作参数（tool 模式经动作注册表执行时使用）。 */
    args?: Record<string, unknown>;
    /** 下次触发时刻（上海时区 ISO）。 */
    nextRunAt?: string;
    lastSentAt?: string;
    lastError?: string;
}
/** ScheduleStore.add 的输入：字段经运行时校验后规范化为 ScheduleEntry。 */
export interface ScheduleAddInput {
    id?: string;
    scope?: string;
    openid?: string;
    type?: string;
    mode?: string;
    content?: string;
    command?: string;
    tool?: string;
    genPrompt?: string;
    cwd?: string;
    timeoutMs?: unknown;
    env?: unknown;
    resultMode?: string;
    parsePrompt?: string;
    goal?: string;
    notifyWhen?: string;
    verify?: unknown;
    gate?: string;
    weekdays?: unknown;
    time?: string;
    minutes?: unknown;
    cron?: string;
    tz?: string;
    at?: string;
    enabled?: boolean;
    createdBy?: string;
    appId?: string;
    [key: string]: unknown;
}
/** 命令超时合法区间（毫秒）：下限 1s，上限 10min（与 command-runner 的上限一致）。 */
export declare const COMMAND_TIMEOUT_MIN_MS = 1000;
export declare const COMMAND_TIMEOUT_MAX_LIMIT_MS = 600000;
/**
 * 规范化 tool 任务的超时（毫秒）：非法返回 undefined（用内置默认），
 * 越界则夹到合法区间。
 */
export declare function normalizeTimeoutMs(input: unknown): number | undefined;
/**
 * 规范化 tool 任务的附加环境变量：只保留字符串键与字符串值，
 * 键名限制为常规环境变量字符；非法项丢弃（返回 undefined 表示无）。
 */
export declare function normalizeEnv(input: unknown): Record<string, string> | undefined;
export declare class ScheduleStore {
    #private;
    constructor(logger: Pick<Console, "warn" | "error">, resolveMaxPerChat?: (appId?: string) => number);
    /** 某机器人的单群/单聊定时条数上限（0 = 不限）。 */
    maxPerChat(appId?: string): number;
    load(): Promise<ScheduleEntry[]>;
    save(): Promise<void>;
    list(): ScheduleEntry[];
    listForChat(scope: string, openid: string): ScheduleEntry[];
    countForChat(scope: string, openid: string): number;
    /** 按 id 取内部引用（可直接 mutate 并 save 落盘）。 */
    findById(id: string): ScheduleEntry | undefined;
    /**
     * 添加定时消息；超过单聊上限或参数非法时返回错误文案。
     * 传 id 时为编辑（保留原 id），否则新建。
     */
    add(input: ScheduleAddInput): Promise<{
        ok: boolean;
        error?: string;
        entry?: ScheduleEntry;
    }>;
    /**
     * 就地修改既有任务（部分字段补丁）：只覆盖显式传入的字段，其余保持原值。
     *
     * 与 {@link add} 的区别：add 是「整条替换」语义（未传的字段会被重置为默认/undefined），
     * 适合设置页那种表单全量提交；本方法面向「只改时间」「只改内容」这类增量编辑，
     * 避免调用方为了改一个字段而回填全部字段（也避免误清 openid / mode / content）。
     *
     * 校验与副作用：
     *  - type 不变时，只按需校验并覆盖对应的时间字段；
     *  - 若传了 type 且与原类型不同，则要求同时给出新类型对应的时间字段（否则会清空原配置）；
     *  - 时间字段变更后重算 nextRunAt（enabled 时）；
     *  - mode 切换时同步整理与该模式无关的残留字段（如 text 模式清空 gate/契约）。
     */
    update(id: string, patch: Record<string, unknown>): Promise<{
        ok: boolean;
        error?: string;
        entry?: ScheduleEntry;
    }>;
    /**
     * 启用 / 禁用定时任务（设置页「禁用」按钮 + AI 工具）。
     * 禁用后 dueEntries 不再返回该条目，调度器不会执行它（也不占用主动消息配额）。
     * 重新启用时按当前时刻重算下次运行，避免把禁用期间累积的过期时刻一次性补发。
     * 因此**启用不会立即执行**：daily/cron 会排到下一个触发点（可能要等到第二天），
     * 调用方应把返回的 entry.nextRunAt 回显给用户，否则会被当成「开关没生效」。
     *
     * 一次性（at）任务的特别处理：
     *   `nextRunFor` 对 at 恒返回固定的 `entry.at`，因此「在触发时刻之前禁用、之后再启用」
     *   会算出**已过期**的时刻，导致下一次 tick 立刻补发一条早已过期的提醒。
     *   这里改为：at 任务的触发时刻已过去时，直接删除该任务并返回提示，
     *   绝不静默补发（一次性提醒错过就是错过了）。
     */
    setEnabled(id: string, enabled: boolean): Promise<{
        ok: boolean;
        error?: string;
        entry?: ScheduleEntry;
    }>;
    /** 按序号（聊天内）或 id 删除。 */
    remove(scope: string, openid: string, idOrIndex: string): Promise<{
        ok: boolean;
        error?: string;
        entry?: ScheduleEntry;
    }>;
    /** 设置页用：仅凭全局 id 删除（无需 scope/openid）。 */
    removeById(id: string): Promise<{
        ok: boolean;
        error?: string;
        entry?: ScheduleEntry;
    }>;
    /**
     * 记录一次「跳过发送」：门控未通过或 AI 判定静默。
     * 不投递、不消耗主动消息配额，仅留下时间与原因供界面/排障查看
     * （`lastError` 同时清空——跳过不是失败）。
     */
    markSkipped(id: string, reason: string): Promise<void>;
    /** 到达执行时间的条目（now 之前）。AI 脚本生成中/失败的任务不执行（等生成完成后按计划继续）。 */
    dueEntries(now: Date): ScheduleEntry[];
}
/**
 * 内容指纹（gate=changed 用）：归一化空白后取 sha1 前 16 位。
 * 存指纹而非明文，避免脚本输出里的敏感内容长期驻留在 schedules.json。
 */
export declare function contentDigest(text: string): string;
/**
 * 发送门控判定：返回 null 表示照常投递，否则返回「跳过原因」。
 * 只在 tool 模式（有确定性取数结果）下调用；always 直接放行。
 * 注意：`changed` 命中新内容时会**就地更新** entry.lastDigest，
 * 调用方负责落盘（调度器 tick / 测试执行结束时都会 save）。
 */
export declare function gateSkipReason(entry: ScheduleEntry, text: string): string | null;
/** daily（HH:mm 上海时间 + 可选 weekdays）的下一次触发时刻。 */ export declare function nextDailyRun(time: string, now: Date, weekdays?: number[]): Date | null;
/** interval（≥5 分钟）的下一次触发时刻。 */
export declare function nextIntervalRun(minutes: number, now: Date): Date | null;
/** 按任务类型计算下一次触发时刻。 */
export declare function nextRunFor(entry: ScheduleEntry, now: Date): Date | null;
/** 宿主会话总线（cordis ctx）：仅用 session/event 的订阅与退订。 */
export interface ScheduleBus {
    on(event: "session/event", listener: (session: unknown, event: {
        type: string;
        data?: unknown;
    }) => void): unknown;
    off(event: "session/event", listener: (session: unknown, event: {
        type: string;
        data?: unknown;
    }) => void): unknown;
}
/**
 * tool 模式的一次执行结果。
 * `skipped=true` 表示本次**没有投递**（发送门控未通过），
 * 调度层据此归还预扣的主动消息配额、且不计入发送计数。
 * （AI 加工 / AI 静默的跳过发生在回复投递阶段，由回复泵归还配额，不在这里返回。）
 */
export interface ScheduleSkipResult {
    skipped?: boolean;
    reason?: string;
}
export interface SchedulerContext {
    store: ScheduleStore;
    /** 按 appId 取运行时机器人；缺省回落主机器人。 */
    resolveBot: (appId?: string) => BotRuntime | undefined;
    /** 主动消息每日配额（定时任务消耗）。 */
    quota?: QuotaTracker;
    /**
     * AI 模式执行回调：把 prompt 当作合成事件注入 webhookRuntime，返回 deliveryId
     * （供测试执行时等待真实投递结果）。
     */
    generateAndSend?: (entry: ScheduleEntry, bot: BotRuntime) => Promise<string | void>;
    /**
     * tool 模式执行回调：执行命令 / 动作，并按发送门控决定是否投递。
     * 返回 `{ skipped: true }` 表示门控拦下、本次未投递（调度层会归还预扣配额）。
     */
    executeTool?: (entry: ScheduleEntry, bot: BotRuntime) => Promise<ScheduleSkipResult | void>;
    /** 宿主会话总线（测试执行时等待投递结果）。 */
    bus?: ScheduleBus;
    logger: Pick<Console, "info" | "warn" | "error">;
}
export declare class Scheduler {
    #private;
    constructor(ctx: SchedulerContext);
    start(): void;
    stop(): void;
    tick(now?: Date): Promise<void>;
    /**
     * 手动执行一次（来自设置页「测试」按钮）。
     * 真实发送一次，但：不计入主动消息配额（bot.state.counters.proactive 不 +1）、
     * 不改写 nextRunAt、不删除 at 任务——仅把结果写回 lastError / lastSentAt 供前端展示。
     * AI 模式会等会话管线真实投递完成（或失败/超时）才返回结果；失败也不顺延，仅记录错误。
     */
    runOnce(id: string): Promise<{
        ok: boolean;
        message: string;
    }>;
}
