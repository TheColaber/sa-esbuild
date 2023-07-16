import path from "path";
import { readFile } from "fs/promises";
import { globby } from "globby";

const addonScriptFiles = await globby("src/addons/**/addon.ts");
const addons = await addonScriptFiles.reduce(async (addons, file) => {
  addons[file.split("/").at(-2)] = await globby(path.dirname(file) + "/**/**.ts")
  return addons;
}, {})
export default () => ({
  name: "glob-vars",
  setup(build) {
    build.onLoad({ filter: /.*/ }, async (args) => {
      for (const id in addons) {
        for (const file of addons[id]) {
          if (args.path === path.resolve(file)) {
            const code = await readFile(args.path, "utf-8");
            const addonHelpers = path.resolve("esbuild/addon-helpers.ts").replace(/\\/g,"/")
            return {
              contents:
  `import { defineAddon } from "${addonHelpers}"
  const console = globalThis.scratchAddons && globalThis.scratchAddons.console;
  const addon = globalThis.scratchAddons && globalThis.scratchAddons.addons["${id}"];\n` +
                  (await build.esbuild.transform(code, {
                    loader: "ts"
                  })).code,
            };
          }
        }
      }
    });
  },
});
