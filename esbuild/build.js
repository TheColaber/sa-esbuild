import esbuild from "esbuild";
import chokidar from "chokidar";
import chromeExtension from "./plugins/chrome-extension.js";
import globalVars from "./plugins/global-vars.js";
import virtuals from "./plugins/virtuals.js";
import vue from "./plugins/vue.js";
import postcss from "./plugins/postcss.js";
import path from "path";
import typedCss from "./plugins/typed-css.js";
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
    define: {
      "process.env.NODE_ENV": "'production'",
    },
    plugins: [
      chromeExtension(),
      globalVars(),
      virtuals(),
      vue({ cssInline: true }),
      postcss(),
      typedCss(),
    ],
    treeShaking: true,
  });
  console.time("build");
  await ctx.rebuild();
  console.timeEnd("build");
  let buildCount = 1;
  chokidar.watch(base).on("change", async () => {
    let currentCount = buildCount;
    buildCount++;
    console.time("build" + currentCount);
    await ctx.rebuild();
    console.timeEnd("build" + currentCount);
  });
}
