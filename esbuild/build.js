import esbuild from "esbuild";
import chokidar from "chokidar";
import chromeExtension from "./plugins/chrome-extension.js";
import globalVars from "./plugins/global-vars.js";
import virtuals from "./plugins/virtuals.js";
import vue from "./plugins/vue.js";
import postcss from "./plugins/postcss.js";
import path from "path";

build();

async function build() {
  const base = "src";
  const ctx = await esbuild.context({
    entryPoints: [base + "/manifest.ts"],
    outbase: base,
    outdir: "dist",
    entryNames: "[dir]/[name]",
    assetNames: "[dir]/[name]",
    chunkNames: "[dir]/[name]",
    bundle: true,
    format: "esm",
    inject: [path.resolve("esbuild/addon-helpers.ts").replace(/\\/g, "/")],
    // minify: true,
    plugins: [chromeExtension(), globalVars(), virtuals(), vue({ cssInline: true }), postcss()],
    treeShaking: true,
  });
  console.time("build");
  await ctx.rebuild();
  console.timeEnd("build");
  chokidar.watch(base).on("change", async () => {
    console.time("build");
    await ctx.rebuild();
    console.timeEnd("build");
  });
}