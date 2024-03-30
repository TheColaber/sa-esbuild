import postcss from "postcss";
import { readFile } from "fs/promises";
import PostcssModulesPlugin from "postcss-modules";

export default () => {
  return {
    name: "postcss",
    setup(build) {
      const modulesExported = {};
      build.onLoad({ filter: /\.css/ }, async (args) => {
        const code = await readFile(args.path, "utf-8");
        if (!args.path.includes(".module.css")) {
          const contents = `export const stylesheet = ${JSON.stringify(code)};`;
          return { contents };
        }
        const result = await postcss([
          PostcssModulesPlugin({
            getJSON(filepath, json) {
              modulesExported[filepath] = json;
            },
          }),
        ]).process(code, { from: args.path, to: args.path });
        const contents = `export const stylesheet = ${JSON.stringify(result.css)};
        export default ${JSON.stringify(modulesExported[args.path])};`;
        return { contents };
      });
    },
  };
};
