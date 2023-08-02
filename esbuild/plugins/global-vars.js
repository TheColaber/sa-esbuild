import path from "path";
import { readFile } from "fs/promises";
import { globby } from "globby";

const addonScriptFiles = await globby("src/addons/**/addon.ts");
const addons = await addonScriptFiles.reduce(async (addons, file) => {
  addons[file.split("/").at(-2)] = await globby(
    path.dirname(file) + "/**/**.ts",
  );
  return addons;
}, {});
export default () => ({
  name: "glob-vars",
  setup(build) {
    build.onLoad({ filter: /.*/ }, async (args) => {
      for (const id in addons) {
        for (const file of addons[id]) {
          if (args.path === path.resolve(file)) {
            const code = await readFile(args.path, "utf-8");
            const contents = (
              await build.esbuild.transform(code, {
                loader: "ts",
                pure: ["defineScripts", "defineAddon"],
                define: {
                  console: `addon.console`,
                },
              })
            ).code.replace(
              /\b(addon)\b/g,
              `globalThis.scratchAddons.addons["${id}"]`,
            );
            return { contents };
          }
        }
      }
    });
  },
});
