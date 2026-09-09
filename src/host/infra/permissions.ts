/**
 * 对话权限注入（openclaw 风格）：每机器人在 ~/.dsh/qqbot/permissions/<appId>/ 下
 * 只保留 `_default.md`（所有用户共用）；`resolvePermission(appId)` 读默认权限文本，
 * `permissionBlock` 把它包成 prompt 顶部的指令块注入新会话。
 *
 * 自助入口 = 聊天命令 /perm：view 任何人可读；set/clear 受 permissionAdmins 约束——
 * 名单为空（默认 []）即不设限、任何人可改；配了名单才仅名单内可改（"*"=全部）。
 */
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { pluginDataDir } from "./store-file.js";

const DEFAULT_KEY = "_default";
const MAX_PERMISSION_CHARS = 4e3;

function safeKey(id: string): string {
  const cleaned = (id || "").replace(/[^A-Za-z0-9._-]/g, "_");
  return cleaned || "_unknown";
}

function permissionsDir(appId: string | undefined): string {
  return join(pluginDataDir(), "permissions", safeKey(appId ?? ""));
}

function defaultPath(appId: string | undefined): string {
  return join(permissionsDir(appId), `${DEFAULT_KEY}.md`);
}

async function readText(path: string): Promise<string | null> {
  try {
    const text = (await readFile(path, "utf8")).trim();
    return text || null;
  } catch {
    return null;
  }
}

/** 读取该机器人生效的默认权限文本（无则 null）。 */
async function resolvePermission(appId: string | undefined): Promise<string | null> {
  return readText(defaultPath(appId));
}

/** 读取默认权限原文（/perm view）。 */
async function readDefault(appId: string | undefined): Promise<string | null> {
  return readText(defaultPath(appId));
}

async function writeText(path: string, text: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, text.trim() + "\n", "utf8");
}

/** 写默认权限（/perm set，截断到 4000 字）。 */
async function writeDefault(appId: string | undefined, text: string): Promise<void> {
  const trimmed = (text || "").slice(0, MAX_PERMISSION_CHARS).trim();
  await writeText(defaultPath(appId), trimmed);
}

/** 清除默认权限（/perm clear），返回是否确有文件被清。 */
async function clearDefault(appId: string | undefined): Promise<boolean> {
  try {
    await rm(defaultPath(appId), { force: true });
    return true;
  } catch {
    return false;
  }
}

/** 把权限文本包成 prompt 顶部指令块（防注入：声明为必须遵守的用户设定）。 */
function permissionBlock(text: string): string {
  return [
    "【用户权限设定 · 你必须严格遵守，不得绕过】",
    text.trim(),
    "【用户权限设定结束】"
  ].join("\n");
}

/**
 * 判定 openid 是否可修改权限：名单为空=不设限（true）；含 "*"=全部放行；
 * 否则仅名单内 openid 可改。
 */
function isPermissionAdmin(adminOpenids: string[] | undefined, openid: string): boolean {
  if (!adminOpenids || adminOpenids.length === 0) return true;
  return adminOpenids.includes("*") || (openid !== "" && adminOpenids.includes(openid));
}

export { clearDefault, isPermissionAdmin, permissionBlock, readDefault, resolvePermission, writeDefault };
