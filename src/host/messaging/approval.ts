/**
 * 按钮审批（参考 oc-src features/approval-handler 的 Inline Keyboard 模式）：
 *
 * AI 在执行敏感操作（命令、外发、删除等）前调用 qqbot_request_approval 工具，
 * 机器人向当前聊天发一条带「允许 / 拒绝」按钮的 Markdown 消息（msg_type=2 + keyboard）：
 *
 *   - 按钮 action.type=1（Callback）：点击后平台推 INTERACTION_CREATE，
 *     data.resolved.button_data = `qqbot-approval:<id>:allow|deny`；
 *   - group_id 相同 → 点一个后其余变灰（二选一语义）；click_limit=1 每人只能点一次；
 *   - permission.type=2 → 所有群成员可点（管理员约束由调用方自行评估）；
 *   - 收到回调先 acknowledgeInteraction（平台要求的数秒内 ACK），再唤醒等待中的工具；
 *   - 超时未点击 → 决议为 timeout（等同拒绝），工具带着明确结论返回给模型。
 *
 * 会话键匹配：回调里的 chat（c2c: openid / group: group_openid）必须与请求时一致，
 * 防止别的聊天点到了别处的审批按钮。
 */

/** INTERACTION_CREATE 事件体（SDK InteractionEvent 的结构化子集）。 */
export interface ApprovalInteractionEvent {
  id: string;
  user_openid?: string;
  group_openid?: string;
  group_member_openid?: string;
  data?: {
    resolved?: {
      button_data?: string;
      button_id?: string;
    };
  };
}

export type ApprovalDecision = "allow" | "deny" | "timeout";

interface PendingApproval {
  chatKey: string;
  target: { scope: "c2c" | "group"; openid: string };
  title: string;
  timer: ReturnType<typeof setTimeout>;
  resolve: (decision: ApprovalDecision) => void;
}

const BUTTON_DATA_PREFIX = "qqbot-approval:";
/** 审批默认等待时长（秒）——平台按钮回调没有过期推送，超时由本端兜底。 */
const DEFAULT_TIMEOUT_SECONDS = 120;
const MAX_TIMEOUT_SECONDS = 600;
/** 同一机器人同时在等的审批上限（防工具滥用堆积）。 */
const MAX_PENDING = 8;

/** 审批消息正文（Markdown 代码块展示操作说明，便于用户看清要批准什么）。 */
function approvalText(title: string, description: string, timeoutSeconds: number): string {
  const lines = ["**🔐 操作审批**", ""];
  if (title) lines.push(`操作：${title.slice(0, 200)}`);
  if (description) lines.push(`说明：${description.slice(0, 400)}`);
  lines.push("", `点击按钮即生效；${timeoutSeconds} 秒内未点击视为拒绝。`);
  return lines.filter((l) => l !== undefined).join("\n");
}

/** InlineKeyboard：两键一行（允许主样式 1 / 拒绝次样式 0），group_id 相同互斥置灰。 */
function approvalKeyboard(approvalId: string): {
  content: { rows: Array<{ buttons: Array<Record<string, unknown>> }> };
} {
  const makeBtn = (id: string, label: string, visitedLabel: string, data: string, style: 0 | 1) => ({
    id,
    render_data: { label, visited_label: visitedLabel, style },
    action: { type: 1, data, permission: { type: 2 }, click_limit: 1 },
    group_id: "qqbot-approval",
  });
  return {
    content: {
      rows: [
        {
          buttons: [
            makeBtn("allow", "✅ 允许", "已允许", `${BUTTON_DATA_PREFIX}${approvalId}:allow`, 1),
            makeBtn("deny", "❌ 拒绝", "已拒绝", `${BUTTON_DATA_PREFIX}${approvalId}:deny`, 0),
          ],
        },
      ],
    },
  };
}

/** 审批依赖的客户端能力子集（QqApiClient 满足此形状）。 */
export interface ApprovalClient {
  sendMarkdown: (
    target: { scope: "c2c" | "group"; openid: string },
    content: string,
    opts?: Record<string, unknown>,
  ) => Promise<string | undefined>;
  acknowledgeInteraction: (interactionId: string, prompt?: string) => Promise<void>;
}

export class ApprovalManager {
  readonly #pending = new Map<string, PendingApproval>();
  readonly #client: ApprovalClient;
  readonly #logger: Pick<Console, "info" | "warn">;

  constructor(client: ApprovalClient, logger: Pick<Console, "info" | "warn">) {
    this.#client = client;
    this.#logger = logger;
  }

  /** 当前等待中的审批数量（调试/观测）。 */
  get pendingCount(): number {
    return this.#pending.size;
  }

  /**
   * 发送审批按钮消息并等待用户点击。解析为 allow / deny / timeout；
   * 消息发送失败直接抛错（工具返回错误，模型不会误以为已获批）。
   */
  async request(
    target: { scope: "c2c" | "group"; openid: string },
    { title, description, timeoutSeconds }: { title: string; description?: string; timeoutSeconds?: number },
  ): Promise<ApprovalDecision> {
    if (this.#pending.size >= MAX_PENDING) {
      throw new Error(`已有 ${MAX_PENDING} 个审批等待处理，请先等用户点击或超时后再发起新审批`);
    }
    const seconds = Math.min(MAX_TIMEOUT_SECONDS, Math.max(10, Math.round(timeoutSeconds ?? DEFAULT_TIMEOUT_SECONDS)));
    const approvalId = `a${Date.now().toString(36)}${Math.floor(Math.random() * 1296).toString(36)}`.slice(0, 12);
    const chatKey = `${target.scope}:${target.openid}`;
    const content = approvalText(title, description ?? "", seconds);
    // 审批消息没有 msg_id 可挂：走主动消息通道（消耗配额，由调用方工具提示模型节制）。
    await this.#client.sendMarkdown(target, content, { keyboard: approvalKeyboard(approvalId) });
    this.#logger.info(`[dsh-qqbot] 审批请求已发送 ${approvalId} → ${chatKey}（${seconds}s）`);
    return await new Promise<ApprovalDecision>((resolve) => {
      const timer = setTimeout(() => {
        this.#pending.delete(approvalId);
        resolve("timeout");
      }, seconds * 1000);
      timer.unref?.();
      this.#pending.set(approvalId, { chatKey, target, title, timer, resolve });
    });
  }

  /**
   * 处理 INTERACTION_CREATE 事件：命中本管理器的待决审批时回 ACK 并唤醒等待方。
   * 返回 true 表示事件已消费（index.ts 不再记未处理告警）。
   */
  async handleInteraction(event: ApprovalInteractionEvent): Promise<boolean> {
    const buttonData = event.data?.resolved?.button_data ?? "";
    if (!buttonData.startsWith(BUTTON_DATA_PREFIX)) return false;
    const [, approvalId = "", decisionRaw = ""] = buttonData.split(":");
    const pending = approvalId ? this.#pending.get(approvalId) : undefined;
    // ACK 无论如何都回（哪怕审批已超时/不存在）——按钮不能一直转圈。
    const clicker = event.group_member_openid || event.user_openid || "";
    const feedback = decisionRaw === "allow"
      ? "✅ 已允许"
      : decisionRaw === "deny"
        ? "❌ 已拒绝"
        : "⚠️ 审批已过期";
    try {
      await this.#client.acknowledgeInteraction(event.id, feedback);
    } catch (error) {
      this.#logger.warn(`[dsh-qqbot] 审批回调 ACK 失败（不影响决议）: ${error instanceof Error ? error.message : String(error)}`);
    }
    if (!pending) {
      this.#logger.info(`[dsh-qqbot] 审批回调 ${approvalId} 不存在或已超时（点击者 ${clicker.slice(-6)}）`);
      return true;
    }
    const group = event.group_openid ?? "";
    const eventChatKey = group ? `group:${group}` : `c2c:${event.user_openid ?? ""}`;
    clearTimeout(pending.timer);
    this.#pending.delete(approvalId);
    if (eventChatKey !== pending.chatKey) {
      this.#logger.warn(
        `[dsh-qqbot] 审批 ${approvalId} 回调聊天不匹配（${eventChatKey} ≠ ${pending.chatKey}），已忽略`,
      );
      return true;
    }
    this.#logger.info(`[dsh-qqbot] 审批 ${approvalId} → ${decisionRaw}（点击者 ${clicker.slice(-6)}）`);
    pending.resolve(decisionRaw === "allow" ? "allow" : decisionRaw === "deny" ? "deny" : "timeout");
    return true;
  }

  /** 机器人移除/停机时清理全部等待（等待方收到 timeout）。 */
  dispose(): void {
    for (const [, pending] of this.#pending) {
      clearTimeout(pending.timer);
      pending.resolve("timeout");
    }
    this.#pending.clear();
  }
}
