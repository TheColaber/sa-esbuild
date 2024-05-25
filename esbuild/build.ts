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
const isDev = process.argv[2] === "--dev";
process.env.MODE = isDev ? "development" : "production";
const base = "src";
const out = "dist";

const ctx = await esbuild.context({
  entryPoints: [base + "/manifest.ts"],
  outbase: base,
  outdir: out,
  entryNames: "[dir]/[name]",
  assetNames: "[dir]/[name]",
  chunkNames: "[dir]/[name]",
  bundle: true,
  format: "esm",
  minify: !isDev,
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

let time = new Date().getTime();
let settings = time;
let promise = null;

await rebuild();

if (isDev) {
  chokidar.watch(base).on("change", async (path) => {
    if (path.startsWith(base + "\\pages\\settings")) {
      settings = new Date().getTime();
    }
    rebuild();
  });
} else {
  process.exit();
}

async function rebuild() {
  if (promise) await promise;
  time = new Date().getTime();
  let error = false;
  await (promise = ctx.rebuild().catch(() => (error = true)));
  promise = null;
  if (error) {
    console.log("Failed to build.");
  } else {
    console.log("build: " + (new Date().getTime() - time) + "ms");
  }

  writeFile(out + "/timestamp.json", JSON.stringify({ settings }));
}
