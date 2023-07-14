import path from "path";
import { globby } from "globby";
const addonManifests = await globby("src/addons/**/addon.ts");

export default () => ({
  name: "virtual",
  setup(build) {
    const namespace = "virtual";
    const options = {
      "#addons": (function () {
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
        // console.log(exports);
        return exports.join("\n");
      })(),
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
