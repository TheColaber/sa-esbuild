import { load } from "cheerio";
import { readFile, mkdir, writeFile, cp } from "fs/promises";
import path from "path";
import {
  default as manifest,
  extraIcons,
  extraPages,
} from "../../src/manifest.ts";
// import * as sfc from "@vue/compiler-sfc";
// import { renderToString } from "@vue/server-renderer";
// import { createApp, createSSRApp, h } from "vue";
export default () => ({
  name: "chrome-extension",
  async setup(build) {
    build.initialOptions.metafile = true;
    const manifestPath = build.initialOptions.entryPoints[0];
    if (!manifestPath) return;
    let manifestJSON = JSON.stringify(manifest, undefined, "  ");
    const dir = path.dirname(manifestPath);

    const manifestEntries = [
      manifest.background.service_worker,
      ...(manifest.content_scripts || []).flatMap((cs) => cs.js),
    ];
    const entryPoints = [...manifestEntries].map((f) => dir + "/" + f);
    const assets = [...Object.values(manifest.icons), ...extraIcons];

    const html = [
      manifest.action.default_popup,
      manifest.options_page,
      manifest.devtools_page,
      ...extraPages,
    ]
      .filter((page) => !!page)
      .map((f) => dir + "/" + f);

    for (const file of html) {
      const buffer = await readFile(file);
      const root = load(buffer).root();

      const scripts = root.find("script");
      for (const script of scripts) {
        if (!script.attribs.src) continue;
        entryPoints.push(path.join(path.dirname(file), script.attribs.src));
      }

      const htmlAssets = root.find("link");

      for (const asset of htmlAssets) {
        assets.push(
          path.relative(dir, path.join(path.dirname(file), asset.attribs.href)),
        );
      }

      // root.find("body").contents().map(async (i, el) => {
      //   if (el.type === 'comment') {
      //     const preload = "Header.vue" || el.data.match(/preload: `(.*)`/)[1];
      //     const filename = path.resolve(path.dirname(file), preload)
      //     const source = await readFile(filename, "utf8");
      //     const { descriptor } = sfc.parse(source, {
      //       filename,
      //     });
      //     const app = createSSRApp(descriptor);
      //     // console.log(sfc.compileScript(descriptor, { id: "test" }));
      //     // console.log(sfc.compileTemplate({
      //     //   source,
      //     //   filename,
      //     //   id: "test"
      //     // }));

      //     // app._component.name = "Test"
      //     // console.log(app._component);
      //     // app._component.template= app._component.template.content
      //     // const ahshed = h(app._component)
      //     // sfc.
      //     // console.log(ahshed);
      //     console.log(h(descriptor));
      //     console.log(await renderToString(createApp({render: () => h(descriptor)})));
      //   }
      // })
    }
    build.initialOptions.entryPoints = entryPoints;

    build.onStart(async () => {
      if (manifest.default_locale) {
        cp(
          build.initialOptions.outbase + "/_locales",
          build.initialOptions.outdir + "/_locales",
          { force: true, recursive: true },
        );
      }

      for (const asset of assets) {
        const buffer = await readFile(
          build.initialOptions.outbase + "/" + asset,
        );
        const outputFile =
          build.initialOptions.outdir +
          "/" +
          asset.replace(build.initialOptions.outbase + "/", "");
        await mkdir(path.dirname(outputFile), {
          recursive: true,
        });
        await writeFile(outputFile, buffer);
      }
    });

    build.onEnd(async (buildRes) => {
      if (!buildRes.metafile) return;
      for (const distFile in buildRes.metafile.outputs) {
        for (const entry of manifestEntries) {
          if (
            buildRes.metafile.outputs[distFile].entryPoint ===
            dir + "/" + entry
          ) {
            manifestJSON = manifestJSON.replaceAll(
              entry,
              path
                .relative(build.initialOptions.outdir, distFile)
                .replaceAll("\\", "/"),
            );
          }
        }
        for (const cs of manifest.content_scripts || []) {
          if (
            buildRes.metafile.outputs[distFile].entryPoint ===
            dir + "/" + cs.js
          ) {
            const contents = await readFile(distFile, "utf-8");
            const wrappedContents = `(() => {${contents}})();`;
            const fileName = "/_" + path.basename(distFile);
            if (process.env.MODE === "development") {
              await writeFile(
                path.dirname(distFile) + fileName,
                wrappedContents,
              );
              await writeFile(distFile, `import(".${fileName}")`);
              const manifestParsed = JSON.parse(manifestJSON);
              manifestParsed.web_accessible_resources =
                manifestParsed.web_accessible_resources || [];
              manifestParsed.web_accessible_resources.push({
                matches: cs.matches,
                // TODO: unhardcode
                resources: ["content-script" + fileName],
              });
              manifestJSON = JSON.stringify(manifestParsed);
            } else {
              await writeFile(distFile, wrappedContents);
            }
          }
        }
      }
      await writeFile(
        build.initialOptions.outdir + "/manifest.json",
        manifestJSON,
      );

      for (const file of html) {
        const buffer = await readFile(file);
        const outputFile =
          build.initialOptions.outdir +
          "/" +
          file.replace(build.initialOptions.outbase + "/", "");

        const root = load(buffer).root();
        const scripts = root.find("script");

        if (!buildRes.metafile) return;
        for (const distFile in buildRes.metafile.outputs) {
          for (const script of scripts) {
            if (!script.attribs.src) continue;
            const scriptEntry = path.join(
              path.dirname(file),
              script.attribs.src,
            );
            if (
              buildRes.metafile.outputs[distFile].entryPoint ===
              scriptEntry.replaceAll("\\", "/")
            ) {
              script.attribs.src = path.relative(
                path.dirname(outputFile),
                distFile,
              );
            }
          }
        }
        await mkdir(path.dirname(outputFile), {
          recursive: true,
        });
        // TODO: allow for html minfication?
        await writeFile(outputFile, root.html());
      }
    });
  },
});
