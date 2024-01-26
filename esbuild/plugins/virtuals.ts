import path from "path";
import { globby } from "globby";
import { readFile, readdir } from "fs/promises";

const addonManifests = await globby("src/addons/**/addon.ts");
// const addonLocales = await (
//   await readdir("src/addon-l10n")
// ).reduce(async (locales, lang) => {
//   locales[lang] = {};
//   const dir = await readdir("src/addon-l10n/" + lang);
//   for (const id of dir) {
//     locales[lang][id.split(".")[0]] = JSON.parse(
//       await readFile("src/addon-l10n/" + lang + "/" + id, "utf-8"),
//     );
//   }
//   return locales;
// }, {});

export default () => ({
  name: "virtual",
  setup(build) {
    const namespace = "virtual";
    function exportAddons(item) {
      const exports = [];
      for (const addon of addonManifests) {
        const parts = addon.split("/");
        const id = parts.at(-2);
        const varName = id.replace(/-/g, "_");
        if (item === "default") {
          parts.shift();
          parts.shift();
          parts.pop();
          parts.pop();
          exports.push(
            `import { ${item} as ${varName} } from "${path
              .resolve(addon)
              .replace(/\\/g, "/")}";
              ${varName}.id = ${JSON.stringify(id)}
              ${varName}.category = ${JSON.stringify(parts)};
              export { ${varName} as ${JSON.stringify(id)} };`,
          );
        } else {
          exports.push(
            `import * as ${varName} from "${path
              .resolve(addon)
              .replace(/\\/g, "/")}";
            const ${varName}2 = ${varName}.${item};

            export { ${varName}2 as ${JSON.stringify(id)} };`,
          );
        }
      }
      return exports.join("\n");
    }
    const options = {
      "#addons": exportAddons("default"),
      "#addon-scripts": exportAddons("scripts"),
      "#addon-styles": exportAddons("styles"),
      "#addon-popups": exportAddons("popup"),
      "#addon-en": exportAddons("strings"),
    };
    const filter = new RegExp(
      Object.keys(options)
        .map((name) => `^${name}$`)
        .join("|"),
    );
    build.onResolve({ filter }, (args) => ({ path: args.path, namespace }));
    build.onLoad({ filter: /.*/, namespace }, (args) => ({
      contents: options[args.path],
      loader: "js",
      resolveDir: "src",
    }));
  },
});
