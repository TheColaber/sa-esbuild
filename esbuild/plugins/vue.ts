import path from "path";
import * as fs from "fs";
import * as crypto from "crypto";
import * as sfc from "@vue/compiler-sfc";

export default (opts = {}) => ({
  name: "vue",
  async setup({ initialOptions, ...build }) {
    initialOptions.define = initialOptions.define || {};
    initialOptions.define["__VUE_OPTIONS_API__"] = "true";
    initialOptions.define["__VUE_PROD_DEVTOOLS__"] = "false";

    // Resolve main ".vue" import
    build.onResolve({ filter: /\.vue/ }, async (args) => {
      let hashes = args.path.slice(args.path.indexOf("?") + 1).split("&");
      const params = hashes.reduce((params, hash) => {
        let [key, val] = hash.split("=");
        return Object.assign(params, { [key]: decodeURIComponent(val) });
      }, {});

      return {
        path: path.isAbsolute(args.path)
          ? args.path
          : path.join(args.resolveDir, args.path),
        namespace:
          params.type === "script"
            ? "sfc-script"
            : params.type === "template"
              ? "sfc-template"
              : params.type === "style"
                ? "sfc-style"
                : "file",
        pluginData: {
          ...args.pluginData,
          index: params.index,
        },
      };
    });

    build.onResolve({ filter: /\.svg/ }, async (args) => {
      let hashes = args.path.slice(args.path.indexOf("?") + 1).split("&");
      const params = hashes.reduce((params, hash) => {
        let [key, val] = hash.split("=");
        return Object.assign(params, { [key]: decodeURIComponent(val) });
      }, {});

      return {
        path: path.isAbsolute(args.path)
          ? args.path
          : path.join(args.resolveDir, args.path),
        namespace: params.type === "loader" ? "svg-loader" : "file",
        pluginData: {
          ...args.pluginData,
          index: params.index,
        },
      };
    });

    // Load stub when .vue is requested
    build.onLoad({ filter: /\.vue$/ }, async (args) => {
      const encPath = args.path.replace(/\\/g, "\\\\");

      const source = await fs.promises.readFile(args.path, "utf8");
      const filename = path.relative(process.cwd(), args.path);

      const id = crypto
        .createHash("md5")
        .update(filename)
        .digest()
        .toString("hex")
        .substring(0, 8);

      const { descriptor } = sfc.parse(source, {
        filename,
      });

      const script =
        descriptor.script || descriptor.scriptSetup
          ? sfc.compileScript(descriptor, { id })
          : undefined;

      const dataId = "data-v-" + id;
      let code = "";

      if (descriptor.script || descriptor.scriptSetup) {
        const src =
          (descriptor.script &&
            !descriptor.scriptSetup &&
            descriptor.script.src) ||
          encPath;
        code += `import script from "${src}?type=script";`;
      } else {
        code += "const script = {};";
      }

      const renderFuncName = "render";
      code += `import { ${renderFuncName} } from "${encPath}?type=template";`;

      for (const style in descriptor.styles) {
        code += `import cssModules from "${encPath}?type=style&index=${style}";`;
      }

      code += `
      export default /* @__PURE__ */ (() => {
        if (${!!descriptor.styles.length} && cssModules) {
          script.__cssModules = cssModules
        }
        script.${renderFuncName} = ${renderFuncName};
        script.__file = ${JSON.stringify(filename)};
        return script;
      })()
      `;

      // if (descriptor.styles.some((o) => o.scoped)) {
      //   code += `script.__scopeId = ${JSON.stringify(dataId)};`;
      // }
      // if (opts.renderSSR) {
      //   code += "script.__ssrInlineRender = true;";
      // }

      return {
        contents: code,
        resolveDir: path.dirname(args.path),
        pluginData: { descriptor, id: dataId, script },
        watchFiles: [args.path],
      };
    });

    build.onLoad({ filter: /.*/, namespace: "svg-loader" }, async (args) => {
      const result = sfc.compileTemplate({
        id: args.pluginData.id,
        source: args.pluginData.source,
        filename: args.path,
        isProd: process.env.NODE_ENV === "production" || initialOptions.minify,
      });

      return {
        contents: result.code,
        warnings: result.tips.map((o) => ({ text: o })),
        loader: "ts",
        resolveDir: path.dirname(args.path),
      };
    });

    build.onLoad({ filter: /\.svg$/ }, async (args) => {
      let code = "const script = {};";

      const filename = path.relative(process.cwd(), args.path);
      const renderFuncName = "render";
      const encPath = args.path.replace(/\\/g, "\\\\");

      code += `import { ${renderFuncName} } from "${encPath}?type=loader"; script.${renderFuncName} = ${renderFuncName};`;

      code += `script.__file = ${JSON.stringify(filename)};`;

      code += "export default script;";

      const source = await fs.promises.readFile(args.path, "utf8");
      const id = crypto
        .createHash("md5")
        .update(filename)
        .digest()
        .toString("hex")
        .substring(0, 8);

      return {
        contents: code,
        resolveDir: path.dirname(args.path),
        pluginData: { source, id },
        watchFiles: [args.path],
      };
    });

    build.onLoad({ filter: /.*/, namespace: "sfc-script" }, async (args) => {
      const { script } = args.pluginData;

      if (script) {
        let code = script.content;

        if (initialOptions.sourcemap && script.map) {
          const sourceMap = Buffer.from(JSON.stringify(script.map)).toString(
            "base64",
          );

          code +=
            "\n\n//@ sourceMappingURL=data:application/json;charset=utf-8;base64," +
            sourceMap;
        }
        return {
          contents: code,
          loader: script.lang === "ts" ? "ts" : "js",
          resolveDir: path.dirname(args.path),
        };
      }
    });

    build.onLoad({ filter: /.*/, namespace: "sfc-template" }, async (args) => {
      const { descriptor, id, script } = args.pluginData;
      if (!descriptor.template) {
        throw new Error("Missing template");
      }

      let source = descriptor.template.content;

      const result = sfc.compileTemplate({
        id,
        source,
        filename: args.path,
        scoped: descriptor.styles.some((o) => o.scoped),
        slotted: descriptor.slotted,
        ssrCssVars: [],
        isProd: process.env.NODE_ENV === "production" || initialOptions.minify,
        compilerOptions: {
          directiveTransforms: {},
          bindingMetadata: script?.bindings,
        },
      });

      if (result.errors.length > 0) {
        return {
          errors: result.errors.map((o) =>
            typeof o === "string"
              ? { text: o }
              : {
                  text: o.message,
                  location: o.loc && {
                    column: o.loc.start.column,
                    file: descriptor.filename,
                    line:
                      o.loc.start.line + descriptor.template.loc.start.line + 1,
                    lineText: o.loc.source,
                  },
                },
          ),
        };
      }

      return {
        contents: result.code,
        warnings: result.tips.map((o) => ({ text: o })),
        loader: "ts",
        resolveDir: path.dirname(args.path),
      };
    });

    build.onLoad({ filter: /.*/, namespace: "sfc-style" }, async (args) => {
      const { descriptor, index, id } = args.pluginData;

      const style = descriptor.styles[index];
      let includedFiles = [];

      const result = await sfc.compileStyleAsync({
        filename: args.path,
        id,
        source: style.content,
        postcssOptions: {},
        postcssPlugins: [],
        preprocessLang: style.lang,
        scoped: style.scoped,
        modules: style.module,
      });

      if (result.errors.length > 0) {
        const errors: any[] = result.errors;

        return {
          errors: errors.map((o) => ({
            text: o.message,
            location: {
              column: o.column,
              line:
                o.file === args.path
                  ? style.loc.start.line + o.line - 1
                  : o.line,
              file: o.file.replace(/\?.*?$/, ""),
              namespace: "file",
            },
          })),
        };
      }

      const cssText = result.code;
      let contents = `export default {
                        "$style": /* @__PURE__ */ (() => {
                          const el = document.createElement("style");
                          el.textContent = ${JSON.stringify(cssText)};
                          document.head.append(el);
                          return ${
                            result.modules ? JSON.stringify(result.modules) : ""
                          };
                        })()
                      };`;
      return {
        contents,
        loader: "js",
        resolveDir: path.dirname(args.path),
        watchFiles: includedFiles,
      };
    });
  },
});
