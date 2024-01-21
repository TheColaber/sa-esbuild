import path from "path";
import { globby } from "globby";
import { DtsCreator } from "typed-css-modules/lib/dts-creator.js";
const allCSSFiles = await globby("src/addons/**/**.module.css");

export default () => ({
  name: "typed-css",
  setup(build) {
    build.onStart(() => {
      for (const file of allCSSFiles) {
        new DtsCreator({}).create(path.resolve(file)).then((typed) => {
          typed.writeFile((formatted) => {
            return formatted.replace("{", `{\nreadonly "stylesheet": string;`);
          });
        });
      }
    });
  },
});
