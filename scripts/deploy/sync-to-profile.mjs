// 把构建产物同步到本地 web profile 的 node_modules，供 dsh 直接加载（开发用）。
// 目标：<DSH_HOME>/profiles/web/node_modules/@sunjuntao/dsh-qqbot
// 附带同步 silk-wasm（@tencent-connect/qqbot-nodejs 的可选运行时依赖，
// 语音消息 SILK→WAV 转码必需；SDK 运行时动态 import，需落在 profile 的 node_modules）。
import { cp, mkdir, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const dshHome = process.env.DSH_HOME || join(process.env.HOME || process.env.USERPROFILE, ".dsh");
const profileNodeModules = join(dshHome, "profiles", "web", "node_modules");
const dest = join(profileNodeModules, "@sunjuntao", "dsh-qqbot");

await mkdir(dest, { recursive: true });
for (const item of ["lib", "cordis.patch.yml", "package.json"]) {
  await cp(join(root, item), join(dest, item), { recursive: true, force: true });
}
// silk-wasm：本机装了才同步（可选依赖，缺失时语音走 voice_wav_url / 平台转写兜底）。
try {
  await access(join(root, "node_modules", "silk-wasm"));
  await cp(join(root, "node_modules", "silk-wasm"), join(profileNodeModules, "silk-wasm"), {
    recursive: true, force: true,
  });
  console.log("sync-to-profile: silk-wasm 已同步");
} catch { /* 未安装，跳过 */ }
console.log(`sync-to-profile: -> ${dest}`);
