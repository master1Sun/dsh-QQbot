// 把构建产物同步到本地 web profile 的 node_modules，供 dsh 直接加载（开发用）。
// 目标：<DSH_HOME>/profiles/web/node_modules/@sunjuntao/dsh-qqbot
import { cp, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const dshHome = process.env.DSH_HOME || join(process.env.HOME || process.env.USERPROFILE, ".dsh");
const dest = join(dshHome, "profiles", "web", "node_modules", "@sunjuntao", "dsh-qqbot");

await mkdir(dest, { recursive: true });
for (const item of ["lib", "cordis.patch.yml", "package.json"]) {
  await cp(join(root, item), join(dest, item), { recursive: true, force: true });
}
console.log(`sync-to-profile: -> ${dest}`);
