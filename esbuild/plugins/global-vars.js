import path from "path";
import { readFile } from "fs/promises";
import { globby } from "globby";

const addonScriptFiles = await globby("src/addons/**/**.ts");

export default () => ({
  name: "glob-vars",
  setup(build) {
    build.onLoad({ filter: /.*/ }, async (args) => {
      for (const file of addonScriptFiles) {
        if (args.path === path.resolve(file)) {
          const code = await readFile(args.path, "utf-8");

          return {
            contents:
              `import { defineAddon, defineScript } from "${path
                .resolve("esbuild/addon-helpers.ts")
                .replace(
                  /\\/g,
                  "/"
                )}"\nconst console = globalThis.scratchAddons && globalThis.scratchAddons.console;\n` +
              code,
          };
        }
      }
    });
  },
});
