export declare const MEMORY_MAX_ENTRIES = 50;
export declare const MEMORY_MAX_CHARS = 200;
export interface MemoryEntry {
    text: string;
}
/**
 * 净化记忆文本——只留对话内容本身：
 *  - 剥离 markdown 标记（* _ ~ ` # >）与 emoji/符号图元（\p{Extended_Pictographic}，含 ★ ● ◆ 等）；
 *  - 剥离装饰性标签框（【】〖〗）与行首列表符/编号（- 1. ① 等）；
 *  - 折叠连续空白，截断到单条上限（按显示宽度）。
 */
export declare function sanitizeMemoryText(raw: string, maxChars?: number): string;
export declare class ChatMemoryStore {
    #private;
    constructor(logger: Pick<Console, "warn" | "error">);
    /** 读取某聊天的记忆（带进程内缓存）。 */
    load(chatKey: string): Promise<MemoryEntry[]>;
    /** 追加一条记忆（净化后写入；去重：同文本追加时前移）。 */
    add(chatKey: string, text: string): Promise<boolean>;
    /** 清空某聊天的记忆，返回清除条数。 */
    clear(chatKey: string): Promise<number>;
    /**
     * 生成注入 prompt 的记忆块（无记忆返回 null）。
     * 声明为长期事实而非指令，防止记忆内容被当作 prompt 注入攻击。
     */
    promptBlock(chatKey: string, maxChars?: number): Promise<string | null>;
}
