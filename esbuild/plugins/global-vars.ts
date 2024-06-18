import path from "path";
import { readFile } from "fs/promises";
import * as addonHelpers from "../addon-helpers.ts";
import { PluginBuild } from "esbuild";

const cache = new Map<string, { input: string; output: string }>();
export default () => ({
  name: "glob-vars",
  setup(build: PluginBuild) {
    const regex = /src\\addons\\(.*)\\(.*)\\(.*)\.ts/;
    build.onLoad({ filter: regex }, async (args) => {
      const [full, categories, id, file] = args.path.match(regex);
      const code = await readFile(args.path, "utf-8");
      let cachedContents = cache.get(args.path);

      if (!cachedContents || cachedContents.input === code) {
        const contents =
          `import { ${Object.keys(addonHelpers).join(",")} } from "${path
            .resolve("esbuild/addon-helpers.ts")
            .replace(/\\/g, "/")}";` +
          (
            await build.esbuild.transform(
              `const __addon = /* @__PURE__ */ (() => globalThis.scratchAddons.addons["${id}"])();` +
                code,
              {
                loader: "ts",
                pure: Object.keys(addonHelpers),
                define: args.path.includes("popup")
                  ? undefined
                  : {
                      console: `__addon.console`,
                      addon: `__addon`,
                    },
              },
            )
          ).code;
        cachedContents = { input: code, output: contents };
        cache.set(args.path, cachedContents);
      }
      return { contents: cachedContents.output };
    });
  },
});
