import path from "path";
import { globby } from "globby";
import { readFile, readdir } from "fs/promises";

const addonManifests = await globby("src/addons/**/addon.ts");
const addonLocales = await (
  await readdir("src/addon-l10n")
).reduce(async (locales, lang) => {
  locales[lang] = {};
  const dir = await readdir("src/addon-l10n/" + lang);
  for (const id of dir) {
    locales[lang][id.split(".")[0]] = JSON.parse(
      await readFile("src/addon-l10n/" + lang + "/" + id, "utf-8")
    );
  }
  return locales;
}, {});

export default () => ({
  name: "virtual",
  setup(build) {
    const namespace = "virtual";
    const options = {
      "#addons": (() => {
        const exports = [];
        for (const addon of addonManifests) {
          const parts = addon.split("/");
          const id = parts.at(-2);
          exports.push(
            `export { default as "${id}" } from "${path
              .resolve(addon)
              .replace(/\\/g, "/")}";`
          );
        }
        return exports.join("\n");
      })(),
      "#addon-scripts": (() => {
        const exports = [];
        for (const addon of addonManifests) {
          const parts = addon.split("/");
          const id = parts.at(-2);
          exports.push(
            `export { scripts as "${id}" } from "${path
              .resolve(addon)
              .replace(/\\/g, "/")}";`
          );
        }
        return exports.join("\n");
      })(),
      "#addon-l10n": `export default ${JSON.stringify(addonLocales)}`,
    };
    const filter = new RegExp(
      Object.keys(options)
        .map((name) => `^${name}$`)
        .join("|")
    );
    build.onResolve({ filter }, (args) => ({ path: args.path, namespace }));
    build.onLoad({ filter: /.*/, namespace }, (args) => ({
      contents: options[args.path],
      loader: "js",
      resolveDir: "src",
    }));
  },
});
