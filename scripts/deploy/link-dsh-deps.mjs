// Link @deepseek-ai/* 类型包从本地 DSH profile 到本项目的 node_modules，
// 供 `tsc --noEmit`（typecheck）与声明生成解析；构建（esbuild）本身不需要。
// 来源：<DSH_HOME>/profiles/node_modules/@deepseek-ai（任意 profile 启动过即存在）。
import { mkdir, symlink, readdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const nmAt = join(root, "node_modules", "@deepseek-ai");

const dshHome = process.env.DSH_HOME || join(process.env.HOME || process.env.USERPROFILE, ".dsh");
const src = join(dshHome, "profiles", "node_modules", "@deepseek-ai");

let entries = [];
try {
  entries = await readdir(src);
} catch {
  console.error(`link-dsh-deps: 未找到 ${src}，请先启动过任意 dsh profile`);
  process.exit(1);
}

await mkdir(dirname(nmAt), { recursive: true });
await rm(nmAt, { recursive: true, force: true });
await mkdir(nmAt, { recursive: true });

let linked = 0;
for (const name of entries) {
  await symlink(join(src, name), join(nmAt, name), "junction");
  linked++;
}
console.log(`link-dsh-deps: linked ${linked} @deepseek-ai/* packages from ${src}`);
