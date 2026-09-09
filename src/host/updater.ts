/**
 * 插件自更新：从 GitHub 仓库 master1Sun/dsh-QQbot（master 分支）拉取最新发布产物，
 * 覆盖当前安装目录（由 import.meta.url 反解出的 lib/..）。
 *
 * 检查：raw package.json 的 version 字段 vs 本地安装 package.json 的 version；
 * 更新：下载 package.json / cordis.patch.yml / lib/index.js / lib/client.js 四个文件，
 *       先把旧文件备份到 <安装目录>/.update-backup/<旧版本>-<时间戳>/，再逐个覆盖。
 * 更新完成后新代码需重启 DSH 宿主才生效（运行中的模块不会热替换）。
 */
import { copyFile, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_RAW = "https://raw.githubusercontent.com/master1Sun/dsh-QQbot/master";
const REPO_URL = "https://github.com/master1Sun/dsh-QQbot";
const FETCH_TIMEOUT_MS = 15_000;
/** 单 URL 失败重试次数（不含首次）。 */
const FETCH_RETRIES = 2;
/** 仓库文件镜像源：raw 失败时依次尝试 jsDelivr。 */
const REPO_MIRRORS = [
  REPO_RAW,
  "https://cdn.jsdelivr.net/gh/master1Sun/dsh-QQbot@master",
];

/** 需要覆盖的文件（相对安装目录；与 package.json files + 构建产物收敛一致）。 */
const UPDATE_FILES = ["package.json", "cordis.patch.yml", "lib/index.js", "lib/client.js"];

/** 当前安装目录（lib/index.js 的上级）。 */
const installDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

/** 简化 semver 比较：逐段数字比较；返回 true 表示 a > b。 */
export function isNewerVersion(a: string, b: string): boolean {
  const pa = String(a || "").trim().replace(/^v/, "").split(/[.-]/).map((s) => Number(s) || 0);
  const pb = String(b || "").trim().replace(/^v/, "").split(/[.-]/).map((s) => Number(s) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i += 1) {
    const da = pa[i] ?? 0;
    const db = pb[i] ?? 0;
    if (da !== db) return da > db;
  }
  return false;
}

/** 本地安装的版本号（读安装目录 package.json，失败回退空串）。 */
export async function currentVersion(): Promise<string> {
  try {
    const raw = await readFile(path.join(installDir, "package.json"), "utf8");
    return String(JSON.parse(raw).version ?? "");
  } catch {
    return "";
  }
}

/** 单 URL 拉取（带超时与重试）。 */
async function fetchTextOnce(url: string): Promise<string> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= FETCH_RETRIES; attempt += 1) {
    try {
      const res = await fetch(url, {
        headers: { "user-agent": "dsh-qqbot-updater", "cache-control": "no-cache" },
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}（${url}）`);
      return await res.text();
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

/** 拉取仓库文件：依次尝试各镜像源，任一成功即返回。 */
async function fetchRepoFile(rel: string): Promise<string> {
  const errors: string[] = [];
  for (const base of REPO_MIRRORS) {
    try {
      return await fetchTextOnce(`${base}/${rel}`);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }
  throw new Error(`所有源均不可达（raw.githubusercontent.com / cdn.jsdelivr.net）：${errors.join(" | ")}`);
}

export interface UpdateCheckResult {
  current: string;
  latest: string;
  hasUpdate: boolean;
  repoUrl: string;
}

/** 检查 GitHub 上的最新版本。 */
export async function checkUpdate(): Promise<UpdateCheckResult> {
  const current = await currentVersion();
  let latest = "";
  let parseError = "";
  try {
    const raw = await fetchRepoFile("package.json");
    latest = String(JSON.parse(raw).version ?? "");
  } catch (error) {
    parseError = error instanceof Error ? error.message : String(error);
  }
  if (!latest) {
    throw new Error(`无法获取远端版本信息：${parseError || "远端 package.json 无 version 字段"}`);
  }
  return { current, latest, hasUpdate: isNewerVersion(latest, current), repoUrl: REPO_URL };
}

export interface UpdateApplyResult {
  updatedFrom: string;
  updatedTo: string;
  backupDir: string;
  restartRequired: true;
}

/** 下载并覆盖安装目录文件（先备份旧文件）。假定调用前已确认有新版本。 */
export async function applyUpdate(): Promise<UpdateApplyResult> {
  const updatedFrom = await currentVersion();

  // 1) 预下载全部文件到内存，任何一个失败都不动本地文件。
  const contents = new Map<string, string>();
  for (const rel of UPDATE_FILES) {
    contents.set(rel, await fetchRepoFile(rel));
  }
  const pkg = JSON.parse(contents.get("package.json")!);
  const updatedTo = String(pkg.version ?? "");
  if (!updatedTo) throw new Error("远端 package.json 缺少 version 字段，已取消更新");
  if (!isNewerVersion(updatedTo, updatedFrom)) {
    throw new Error(`远端版本 ${updatedTo} 不高于当前版本 ${updatedFrom || "(未知)"}，已取消更新`);
  }

  // 2) 备份现存的旧文件到 .update-backup/<旧版本>-<时间戳>/。
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const backupDir = path.join(installDir, ".update-backup", `${updatedFrom || "unknown"}-${stamp}`);
  for (const rel of UPDATE_FILES) {
    try {
      const src = path.join(installDir, rel);
      const dest = path.join(backupDir, rel);
      await mkdir(path.dirname(dest), { recursive: true });
      await copyFile(src, dest);
    } catch {
      /* 本地缺该文件时跳过备份 */
    }
  }

  // 3) 逐个写入（先写临时文件再 rename，失败回退直接覆盖）。
  for (const rel of UPDATE_FILES) {
    const dest = path.join(installDir, rel);
    await mkdir(path.dirname(dest), { recursive: true });
    const tmp = `${dest}.updating`;
    await writeFile(tmp, contents.get(rel)!, "utf8");
    try {
      await rename(tmp, dest);
    } catch {
      // rename 失败（目标被占用等）：直接覆盖写入，并清掉临时文件。
      await writeFile(dest, contents.get(rel)!, "utf8");
      await rm(tmp, { force: true }).catch(() => { /* 清理失败不影响更新 */ });
    }
  }

  return { updatedFrom, updatedTo, backupDir, restartRequired: true };
}
