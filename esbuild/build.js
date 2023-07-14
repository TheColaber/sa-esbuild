import esbuild from "esbuild";
import vue from "esbuild-plugin-vue3";

import chromeExtension from "./plugins/chrome-extension.js";
import globalVars from "./plugins/global-vars.js";
import virtuals from "./plugins/virtuals.js";

build();

async function build() {
  const ctx = await esbuild.context({
    entryPoints: ["src/manifest.ts"],
    outbase: "src",
    outdir: "dist",
    entryNames: "[dir]/[name]",
    assetNames: "[dir]/[name]",
    chunkNames: "[dir]/[name]",
    bundle: true,
    format: 'esm',
    // minify: true,
    plugins: [chromeExtension(), globalVars(), virtuals(), vue()],
  });
  await ctx.watch();
  console.log("watching...");
}
