import { access, readdir, readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");

const guides = await Promise.all(
  ["jingju-three-minute-guide", "tea-three-minute-guide"].map(async (id) =>
    JSON.parse(
      await readFile(resolve(root, `content/audio/${id}.json`), "utf8"),
    ),
  ),
);

const requiredAssets = [
  ...guides.flatMap(({ cues }) => cues.map(({ src }) => src)),
  "audio/previews/jingju-cosyvoice-preview.m4a",
  "audio/previews/tea-cosyvoice-preview.m4a",
  "assets/jingju-backstage.webp",
];

await Promise.all(
  requiredAssets.map(async (relativePath) => {
    const path = resolve(dist, relativePath);
    await access(path);
    const metadata = await stat(path);
    if (metadata.size === 0) throw new Error(`发布文件为空：${relativePath}`);
  }),
);

const publishedJingjuFiles = await readdir(
  resolve(dist, "audio/guides/jingju"),
);
const publishedTeaFiles = await readdir(resolve(dist, "audio/guides/tea"));
if (publishedJingjuFiles.length !== guides[0].cues.length) {
  throw new Error("京剧逐句音频数量与内容数据不一致。");
}
if (publishedTeaFiles.length !== guides[1].cues.length) {
  throw new Error("茶艺逐句音频数量与内容数据不一致。");
}

try {
  await access(resolve(dist, "assets/jingju-backstage.png"));
  throw new Error("高清 PNG 原文件不应进入 GitHub Pages 发布产物。");
} catch (error) {
  if (error instanceof Error && error.message.includes("不应进入")) throw error;
}

console.log(
  `GitHub Pages 产物验证通过：${requiredAssets.length} 个媒体文件，` +
    `含 ${guides[0].cues.length + guides[1].cues.length} 个逐句音频。`,
);
