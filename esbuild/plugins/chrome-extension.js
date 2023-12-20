import { load } from "cheerio";
import esm from "esm";
import { Module } from "module";
import { readFile, mkdir, writeFile, cp } from "fs/promises";
import path from "path";
import "esbuild-runner/register.js";

export default () => ({
  name: "chrome-extension",
  async setup(build) {
    build.initialOptions.metafile = true;
    const manifestPath = build.initialOptions.entryPoints[0];
    if (!manifestPath) return;
    const resolve = esm(new Module("module"));
    const manifest = resolve("./src/manifest.ts").default;
    let manifestJSON = JSON.stringify(manifest, undefined, "  ");
    const dir = path.dirname(manifestPath);

    const manifestEntries = [
      manifest.background.service_worker,
      ...manifest.content_scripts.flatMap((cs) => cs.js),
    ];
    const entryPoints = [...manifestEntries].map((f) => dir + "/" + f);
    const assets = [...Object.values(manifest.icons)];
    const html = [manifest.action.default_popup, manifest.options_page].map(
      (f) => dir + "/" + f,
    );

    
    for (const file of html) {
      const buffer = await readFile(file);
      const root = load(buffer).root();

      const scripts = root.find("script");
      for (const script of scripts) {
        entryPoints.push(path.join(path.dirname(file), script.attribs.src));
      }

      const htmlAssets = root.find("link");
      for (const asset of htmlAssets) {
        assets.push(path.relative(dir, path.join(path.dirname(file), asset.attribs.href)));
      }

      build.initialOptions.entryPoints = entryPoints;
    }


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
        await writeFile(outputFile, root.html());
      };
    });
  },
});
