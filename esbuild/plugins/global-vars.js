import path from "path";
import { readFile } from "fs/promises";
import { globby } from "globby";

const addonScriptFiles = await globby("src/addons/**/addon.ts");
const addons = {};
for (const file of addonScriptFiles) {
  addons[file.split("/").at(-2)] = await globby(
    path.dirname(file) + "/**/**.ts",
  );
}

export default () => ({
  name: "glob-vars",
  setup(build) {
    build.onLoad({ filter: /.*/ }, async (args) => {
      for (const id in addons) {
        for (const file of addons[id]) {
          if (args.path === path.resolve(file)) {
            const code = await readFile(args.path, "utf-8");
            const contents =
              `import { defineAddon, defineScripts, definePopup, defineStyles } from "${path
                .resolve("esbuild/addon-helpers.ts")
                .replace(/\\/g, "/")}";` +
              (
                await build.esbuild.transform(
                  `const __addon = /* @__PURE__ */ (() => globalThis.scratchAddons.addons["${id}"])();` +
                    code,
                  {
                    loader: "ts",
                    pure: [
                      "defineScripts",
                      "defineAddon",
                      "definePopup",
                      "defineStyles",
                    ],
                    define: {
                      console: `__addon.console`,
                      addon: `__addon`,
                    },
                  },
                )
              ).code;
            return { contents };
          }
        }
      }
    });
  },
});
