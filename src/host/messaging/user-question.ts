/**
 * 交互提问桥：把 DSH 的 `ask_user_question` 选择**转到 QQ 侧**，让群里 / 单聊里的用户直接点按钮回答。
 *
 * 为什么需要：DSH 的提问默认只渲染在 Agent 界面（Web GUI）。QQ 会话是在后台跑的，
 * 用户在 QQ 里根本看不到那张选项卡，于是整个 turn 一直等到超时——表现就是「消息卡死」。
 *
 * 接入接缝：DSH 暴露 Cordis 瀑布事件 `user-questions/request`（`Scoped<Agent>`）。
 * 认领它并返回答案即可接管；不属于 QQ 会话的请求一律 `next()` 交回界面，互不影响。
 *
 * 交互形态（**只认按钮**，刻意不支持自由文本——避免把用户随口聊的两句误判成答案）：
 *   - 正文里列全问题与选项文案；按钮只带序号，规避平台「按钮文字 ≤10 字符」的限制；
 *   - 单选：所有选项按钮同 `group_id`（点一个后其余变灰），点中即定案；
 *   - 多选：选项按钮各自独立、可连点（`visited_label` 显示「已选」），点「✅ 完成」定案；
 *   - 每个问题都带「跳过」按钮；**超时（默认 120 秒）同样按跳过返回**，并把
 *     「请你自行决定」写进 `custom` —— 宁可按跳过，也绝不把会话挂死。
 *
 * 消息通道：优先走被动回复（调用方给 `msgId` + 递增 `msgSeq`，不占主动消息配额）；
 * 没有凭证时退回主动通道（消耗每日配额）。发送失败直接按跳过返回，调用方不会卡住。
 */
import type { ApprovalInteractionEvent } from "./approval.js";

/** 一个可选项（与 DSH `AskUserQuestionOption` 同形）。 */
export interface UserQuestionOption {
  label: string;
  description?: string;
}

/** 一个问题（与 DSH `AskUserQuestionItem` 同形的结构化子集）。 */
export interface UserQuestionItem {
  id: string;
  question: string;
  detail?: string;
  header?: string;
  options?: UserQuestionOption[];
  multiSelect?: boolean;
}

/** 单个问题的答案（与 DSH `AskUserQuestionAnswerItem` 同形）。 */
export interface UserQuestionAnswerItem {
  id: string;
  selected: string[];
  custom?: string;
}

/** 一批答案（与 DSH `AskUserQuestionAnswer` 同形）。 */
export interface UserQuestionAnswer {
  answers: UserQuestionAnswerItem[];
}

/** 提问桥依赖的客户端能力子集（QqApiClient 满足此形状）。 */
export interface QuestionClient {
  sendMarkdown: (
    target: { scope: "c2c" | "group"; openid: string },
    content: string,
    opts?: Record<string, unknown>,
  ) => Promise<string | undefined>;
  acknowledgeInteraction: (interactionId: string, prompt?: string) => Promise<void>;
}

/** 按钮回调 data 前缀（与审批的前缀区分开，互不抢事件）。 */
const BUTTON_DATA_PREFIX = "qqbot-question:";
/** 未回答时的兜底文案：交给模型自行决定，避免它再问一次。 */
const SKIP_CUSTOM = "（QQ 侧用户未选择，已按跳过处理；请你自行决定，不要再追问）";
const DEFAULT_TIMEOUT_SECONDS = 120;
const MAX_TIMEOUT_SECONDS = 600;
/** 同一机器人同时在等的问题上限（一批多问也各自占一条）。 */
const MAX_PENDING = 8;
/** 可点选项上限：每行 3 个按钮，控制键盘行数不超平台限制。 */
const MAX_OPTIONS = 6;

interface PendingQuestion {
  chatKey: string;
  item: UserQuestionItem;
  multiSelect: boolean;
  picked: string[];
  timer: ReturnType<typeof setTimeout>;
  finish: (selected: string[] | null) => void;
}

/** 规整选项：去空、截断过长文案、限制数量。 */
function normalizeOptions(raw: UserQuestionOption[] | undefined): UserQuestionOption[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((opt) => ({
      label: String(opt?.label ?? "").trim().slice(0, 60),
      description: typeof opt?.description === "string" ? opt.description.trim().slice(0, 120) : undefined,
    }))
    .filter((opt) => opt.label)
    .slice(0, MAX_OPTIONS);
}

/** 提问正文：完整问题 + 编号选项（按钮上只放序号，正文里放全文）。 */
function questionText(item: UserQuestionItem, options: UserQuestionOption[], timeoutSeconds: number): string {
  const lines = [`**❓ ${String(item.header ?? "需要你确认").slice(0, 40)}**`, ""];
  lines.push(String(item.question ?? "").slice(0, 300));
  if (item.detail) lines.push("", String(item.detail).slice(0, 400));
  lines.push("");
  options.forEach((opt, i) => {
    lines.push(`${i + 1}. ${opt.label}${opt.description ? ` —— ${opt.description}` : ""}`);
  });
  const extra = Array.isArray(item.options) ? item.options.length - options.length : 0;
  if (extra > 0) lines.push(`（选项过多，这里只列出前 ${options.length} 项）`);
  lines.push("", item.multiSelect
    ? "可连点多个选项，再点「✅ 完成」提交。"
    : "点其中一个按钮即可（按钮上是对应序号）。");
  lines.push(`${timeoutSeconds} 秒内未选择 → 视为「跳过」，机器人会自行决定。`);
  return lines.join("\n");
}

/**
 * 内联键盘：选项按钮（序号）+ 完成/跳过。
 * 单选时所有按钮同 group_id —— 平台会在点中一个后把其余置灰，正好是单选语义。
 */
function questionKeyboard(
  questionId: string,
  options: UserQuestionOption[],
  multiSelect: boolean,
): { content: { rows: Array<{ buttons: Array<Record<string, unknown>> }> } } {
  const sharedGroup = `qqbot-question:${questionId}`;
  const makeBtn = (
    id: string,
    label: string,
    visitedLabel: string,
    data: string,
    style: 0 | 1,
    groupId?: string,
  ) => ({
    id,
    render_data: { label: label.slice(0, 10), visited_label: visitedLabel.slice(0, 10), style },
    // click_limit=0 允许多次点击（多选连点需要）；单选靠 group_id 互斥。
    action: { type: 1, data, permission: { type: 2 }, click_limit: multiSelect ? 0 : 1 },
    ...(groupId ? { group_id: groupId } : {}),
  });
  const rows: Array<{ buttons: Array<Record<string, unknown>> }> = [];
  for (let i = 0; i < options.length; i += 3) {
    rows.push({
      buttons: options.slice(i, i + 3).map((_, k) => makeBtn(
        `o${i + k}`,
        String(i + k + 1),
        `${i + k + 1} 已选`,
        `${BUTTON_DATA_PREFIX}${questionId}:pick:${i + k}`,
        1,
        multiSelect ? undefined : sharedGroup,
      )),
    });
  }
  const tail: Array<Record<string, unknown>> = [];
  if (multiSelect) {
    tail.push(makeBtn("done", "✅ 完成", "已提交", `${BUTTON_DATA_PREFIX}${questionId}:done`, 1));
  }
  tail.push(makeBtn(
    "skip",
    "跳过",
    "已跳过",
    `${BUTTON_DATA_PREFIX}${questionId}:skip`,
    0,
    multiSelect ? undefined : sharedGroup,
  ));
  rows.push({ buttons: tail });
  return { content: { rows } };
}

/** 给「非 QQ 会话」或异常兜底用的整批跳过答案（每个问题一项，契约要求不多不少）。 */
export function skipAnswer(questions: UserQuestionItem[], custom = SKIP_CUSTOM): UserQuestionAnswer {
  return {
    answers: (Array.isArray(questions) ? questions : []).map((q) => ({
      id: String(q?.id ?? ""),
      selected: [],
      custom,
    })),
  };
}

export class UserQuestionBridge {
  readonly #pending = new Map<string, PendingQuestion>();
  readonly #client: QuestionClient;
  readonly #logger: Pick<Console, "info" | "warn">;

  constructor(client: QuestionClient, logger: Pick<Console, "info" | "warn">) {
    this.#client = client;
    this.#logger = logger;
  }

  /** 当前等待中的问题数（观测用）。 */
  get pendingCount(): number {
    return this.#pending.size;
  }

  /**
   * 依次把每个问题发到 QQ 并等用户点按钮，凑齐一批答案返回。
   * 任何失败（无选项、发送失败、超时）都按「跳过」记该项答案，**永不抛错、永不挂死**。
   * @param allocateSendOpts 每条提问消息的发送参数（有被动凭证时给 { msgId, msgSeq }）。
   */
  async ask(
    target: { scope: "c2c" | "group"; openid: string },
    {
      questions,
      timeoutSeconds,
      allocateSendOpts,
    }: {
      questions: UserQuestionItem[];
      timeoutSeconds?: number;
      allocateSendOpts?: () => Record<string, unknown>;
    },
  ): Promise<UserQuestionAnswer> {
    const list = Array.isArray(questions) ? questions : [];
    const answers: UserQuestionAnswerItem[] = [];
    for (const item of list) {
      const selected = await this.#askOne(target, item, timeoutSeconds, allocateSendOpts);
      answers.push(selected === null
        ? { id: String(item?.id ?? ""), selected: [], custom: SKIP_CUSTOM }
        : { id: String(item?.id ?? ""), selected });
    }
    return { answers };
  }

  /** 单个问题：发一条带按钮的消息，等一次点击（或超时）。返回 null 表示按跳过处理。 */
  async #askOne(
    target: { scope: "c2c" | "group"; openid: string },
    item: UserQuestionItem,
    timeoutSeconds: number | undefined,
    allocateSendOpts: (() => Record<string, unknown>) | undefined,
  ): Promise<string[] | null> {
    const options = normalizeOptions(item?.options);
    // 没有选项（纯开放式提问）：按钮模式表达不了 → 直接按跳过，让模型自己决定而不是干等。
    if (options.length === 0) {
      this.#logger.info(`[dsh-qqbot] 提问无选项，按跳过返回（${String(item?.question ?? "").slice(0, 40)}）`);
      return null;
    }
    if (this.#pending.size >= MAX_PENDING) {
      this.#logger.warn(`[dsh-qqbot] 待答问题已达 ${MAX_PENDING} 个，本次按跳过返回`);
      return null;
    }
    const seconds = Math.min(
      MAX_TIMEOUT_SECONDS,
      Math.max(30, Math.round(timeoutSeconds ?? DEFAULT_TIMEOUT_SECONDS)),
    );
    const questionId = `q${Date.now().toString(36)}${Math.floor(Math.random() * 1296).toString(36)}`.slice(0, 12);
    const chatKey = `${target.scope}:${target.openid}`;
    const multiSelect = item?.multiSelect === true;
    const sendOpts = allocateSendOpts?.() ?? {};
    let sent: string | undefined;
    try {
      sent = await this.#client.sendMarkdown(
        target,
        questionText(item, options, seconds),
        { ...sendOpts, keyboard: questionKeyboard(questionId, options, multiSelect) },
      );
    } catch (error) {
      this.#logger.warn(
        `[dsh-qqbot] 提问消息发送失败，按跳过返回 chat=${chatKey}:`,
        error instanceof Error ? error.message : error,
      );
      return null;
    }
    if (!sent) {
      this.#logger.warn(`[dsh-qqbot] 提问消息未返回消息 id（仍等待点击）chat=${chatKey} id=${questionId}`);
    }
    this.#logger.info(
      `[dsh-qqbot] 交互提问已发到 QQ chat=${chatKey} id=${questionId} `
      + `选项=${options.length} 多选=${multiSelect} 超时=${seconds}s`,
    );
    return await new Promise<string[] | null>((resolve) => {
      const timer = setTimeout(() => {
        this.#pending.delete(questionId);
        this.#logger.info(`[dsh-qqbot] 提问 ${questionId} 超时（${seconds}s），按跳过返回`);
        resolve(null);
      }, seconds * 1000);
      timer.unref?.();
      this.#pending.set(questionId, {
        chatKey,
        item,
        multiSelect,
        picked: [],
        timer,
        finish: resolve,
      });
    });
  }

  /**
   * 处理 INTERACTION_CREATE：命中本桥的待答问题时回 ACK 并记下选择。
   * 返回 true 表示事件已消费（index.ts 不再记未处理告警）。
   */
  async handleInteraction(event: ApprovalInteractionEvent): Promise<boolean> {
    const buttonData = event.data?.resolved?.button_data ?? "";
    if (!buttonData.startsWith(BUTTON_DATA_PREFIX)) return false;
    const rest = buttonData.slice(BUTTON_DATA_PREFIX.length);
    const [questionId = "", action = "", param = ""] = rest.split(":");
    const pending = questionId ? this.#pending.get(questionId) : undefined;
    const options = normalizeOptions(pending?.item.options);
    const clicker = event.group_member_openid || event.user_openid || "";
    // ACK 无论如何都回（按钮不能一直转圈）：命中就给具体反馈，否则提示已过期。
    let feedback = "⚠️ 该问题已过期";
    if (pending) {
      if (action === "skip") feedback = "已跳过";
      else if (action === "done") feedback = "已提交";
      else if (action === "pick") {
        const label = options[Number(param)]?.label ?? "";
        feedback = label ? `已选：${label}`.slice(0, 20) : "已选";
      }
    }
    try {
      await this.#client.acknowledgeInteraction(event.id, feedback);
    } catch (error) {
      this.#logger.warn(
        `[dsh-qqbot] 提问回调 ACK 失败（不影响决议）: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
    if (!pending) {
      this.#logger.info(`[dsh-qqbot] 提问回调 ${questionId} 不存在或已超时（点击者 ${clicker.slice(-6)}）`);
      return true;
    }
    const group = event.group_openid ?? "";
    const eventChatKey = group ? `group:${group}` : `c2c:${event.user_openid ?? ""}`;
    if (eventChatKey !== pending.chatKey) {
      this.#logger.warn(
        `[dsh-qqbot] 提问 ${questionId} 回调聊天不匹配（${eventChatKey} ≠ ${pending.chatKey}），已忽略`,
      );
      return true;
    }
    if (action === "skip") {
      clearTimeout(pending.timer);
      this.#pending.delete(questionId);
      this.#logger.info(`[dsh-qqbot] 提问 ${questionId} → 用户跳过（点击者 ${clicker.slice(-6)}）`);
      pending.finish(null);
      return true;
    }
    if (action === "done") {
      clearTimeout(pending.timer);
      this.#pending.delete(questionId);
      this.#logger.info(`[dsh-qqbot] 提问 ${questionId} → ${pending.picked.join(" / ")}（多选完成）`);
      pending.finish(pending.picked.length > 0 ? pending.picked : null);
      return true;
    }
    if (action !== "pick") return true;
    const picked = options[Number(param)]?.label ?? "";
    if (!picked) return true;
    if (pending.multiSelect) {
      // 多选：只记下来，等「完成」；同一项重复点不叠加。
      if (!pending.picked.includes(picked)) pending.picked.push(picked);
      this.#logger.info(`[dsh-qqbot] 提问 ${questionId} 已选「${picked}」（累计 ${pending.picked.length} 项）`);
      return true;
    }
    clearTimeout(pending.timer);
    this.#pending.delete(questionId);
    this.#logger.info(`[dsh-qqbot] 提问 ${questionId} → ${picked}（点击者 ${clicker.slice(-6)}）`);
    pending.finish([picked]);
    return true;
  }

  /** 机器人移除/停机时清理等待（一律按跳过返回，避免上游挂住）。 */
  dispose(): void {
    for (const [, pending] of this.#pending) {
      clearTimeout(pending.timer);
      pending.finish(null);
    }
    this.#pending.clear();
  }
}
