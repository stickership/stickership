// ponytail: @opennextjs/cloudflare 1.20.10 doesn't inline Next 16.4's preview-props.json; delete once the adapter ships the fix
import { readFile, writeFile } from "node:fs/promises";

const file = "node_modules/@opennextjs/cloudflare/dist/cli/build/patches/plugins/load-manifest.js";
const src = await readFile(file, "utf8").catch(() => null);
if (src && !src.includes("preview-props")) {
  await writeFile(file, src.replace("required-server-files,prefetch-hints}", "required-server-files,prefetch-hints,preview-props}"));
  console.log("patched opennext load-manifest for preview-props.json");
}
