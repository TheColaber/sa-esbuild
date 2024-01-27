import esbuild from "esbuild";
import chokidar from "chokidar";
import chromeExtension from "./plugins/chrome-extension.ts";
import globalVars from "./plugins/global-vars.ts";
import virtuals from "./plugins/virtuals.ts";
import vue from "./plugins/vue.ts";
import postcss from "./plugins/postcss.ts";
import typedCss from "./plugins/typed-css.ts";
process.env.MODE = "development";
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
      "process.env.MODE": JSON.stringify(process.env.MODE),
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
      (promise = null), console.timeEnd("build");
    });
  }
  rebuild();
  chokidar.watch(base).on("change", rebuild);
}
