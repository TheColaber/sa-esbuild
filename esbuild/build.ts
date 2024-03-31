import esbuild from "esbuild";
import chokidar from "chokidar";
import chromeExtension from "./plugins/chrome-extension.ts";
import globalVars from "./plugins/global-vars.ts";
import virtuals from "./plugins/virtuals.ts";
import vue from "./plugins/vue.ts";
import postcss from "./plugins/postcss.ts";
import typedCss from "./plugins/typed-css.ts";
import image from "esbuild-plugin-inline-image";
import { writeFile } from "fs/promises";
process.env.MODE = "development";
build();

async function build() {
  const base = "src";
  const out = "dist";
  let settings = new Date().getTime();

  const ctx = await esbuild.context({
    entryPoints: [base + "/manifest.ts"],
    outbase: base,
    outdir: out,
    entryNames: "[dir]/[name]",
    assetNames: "[dir]/[name]",
    chunkNames: "[dir]/[name]",
    bundle: true,
    format: "esm",
    // minify: true,
    define: {
      "process.env.NODE_ENV": "'production'",
      "process.env.MODE": JSON.stringify(process.env.MODE),
    },
    plugins: [
      chromeExtension(),
      globalVars(),
      virtuals(),
      vue({ cssInline: true }),
      postcss(),
      typedCss(),
      image({ limit: 0 }),
    ],
    treeShaking: true,
    logLevel: "debug",
    logOverride: {
      "import-is-undefined": "silent",
    },
  });
  let promise = null;
  async function rebuild() {
    if (promise) await promise;
    console.time("build");
    promise = ctx.rebuild().then(() => {
      promise = null;
      console.timeEnd("build");
      writeFile(out + "/timestamp.json", JSON.stringify({ settings }));
    });    
  }
  rebuild();
  chokidar.watch(base).on("change", async (path) => {
    if (path.startsWith(base + "/pages/settings")) {
      settings = new Date().getTime();
    }
    rebuild();
  });
}
