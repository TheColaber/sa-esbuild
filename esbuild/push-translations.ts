import esbuild from "esbuild";
import virtuals from "./plugins/virtuals.ts";
import image from "esbuild-plugin-inline-image";
import vue from "./plugins/vue.ts";
import postcss from "./plugins/postcss.ts";
import globalVars from "./plugins/global-vars.ts";
import { rm } from "fs/promises";

const outdir = "__temp__";
const ADDON_VIR = "!addon-en";
const PAGES_FILE = "src/pages/strings.ts";
const EXTENTION_FILE = "src/_locales/en/messages.json";
const build = await esbuild.build({
  entryPoints: [ADDON_VIR, PAGES_FILE, EXTENTION_FILE],
  outbase: "src",
  outdir,
  bundle: true,
  format: "esm",
  minify: true,
  metafile: true,
  plugins: [
    globalVars(),
    virtuals(),
    vue({ cssInline: true }),
    postcss(),
    image({ limit: 0 }),
  ],
  treeShaking: true,
  logOverride: {
    "import-is-undefined": "silent",
  },
});

const outputs = Object.entries(build.metafile.outputs);
console.log(outputs);

const [addonFile, { exports: addonExports }] = outputs.find(
  ([, { entryPoint }]) => entryPoint === "virtual:" + ADDON_VIR,
);
const addonStrings = await import("../" + addonFile);

// we should import default from below:
const [pagesFile] = outputs.find(
  ([, { entryPoint }]) => entryPoint === PAGES_FILE,
);
const pagesStrings = await import("../" + pagesFile);

const [extentionFile] = outputs.find(
  ([, { entryPoint }]) => entryPoint === EXTENTION_FILE,
);
const extentionStrings = await import("../" + extentionFile);
//

rm(outdir, { recursive: true, force: true });

// console.log({addonStrings, pagesStrings, extentionStrings});
