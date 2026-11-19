// 把构建产物同步到本地 web / desktop profile 的 node_modules，供 dsh 两端直接加载（开发用）。
// 目标：<DSH_HOME>/profiles/{web,desktop}/node_modules/@sunjuntao/dsh-qqbot
// desktop 由 Electron 应用管理，profile 目录不存在时自动跳过，仅同步已存在的端。
// 附带同步 silk-wasm（@tencent-connect/qqbot-nodejs 的可选运行时依赖，
// 语音消息 SILK→WAV 转码必需；SDK 运行时动态 import，需落在 profile 的 node_modules）。
import { cp, mkdir, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const dshHome = process.env.DSH_HOME || join(process.env.HOME || process.env.USERPROFILE, ".dsh");
const silkSource = join(root, "node_modules", "silk-wasm");
let hasSilk = true;
try { await access(silkSource); } catch { hasSilk = false; }

for (const profile of ["web", "desktop"]) {
  const profileRoot = join(dshHome, "profiles", profile);
  try { await access(profileRoot); } catch {
    console.log(`sync-to-profile: ${profile} profile 不存在，跳过`);
    continue;
  }
  const profileNodeModules = join(profileRoot, "node_modules");
  const dest = join(profileNodeModules, "@sunjuntao", "dsh-qqbot");

  await mkdir(dest, { recursive: true });
  for (const item of ["lib", "cordis.patch.yml", "package.json"]) {
    await cp(join(root, item), join(dest, item), { recursive: true, force: true });
  }
  // silk-wasm：本机装了才同步（可选依赖，缺失时语音走 voice_wav_url / 平台转写兜底）。
  if (hasSilk) {
    await cp(silkSource, join(profileNodeModules, "silk-wasm"), { recursive: true, force: true });
  }
  console.log(`sync-to-profile: -> ${dest}${hasSilk ? "（含 silk-wasm）" : "（无 silk-wasm）"}`);
}
