import esbuild from "esbuild";
import chokidar from "chokidar";
import vue from "esbuild-plugin-vue3";
import chromeExtension from "./plugins/chrome-extension.js";
import globalVars from "./plugins/global-vars.js";
import virtuals from "./plugins/virtuals.js";
import postcss from "@chialab/esbuild-plugin-postcss";

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
    // minify: true,
    plugins: [chromeExtension(), postcss(), globalVars(), virtuals(), vue()],
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
