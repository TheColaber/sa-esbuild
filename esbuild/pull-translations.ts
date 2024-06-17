import { writeFile } from "fs/promises";
import { txPull, txAvailableLanguages } from "./transifex.js";
const scratchAddonsSlug = "scratch-addons-extension";
const addonTranslationSlug = "addons-translation-new";
const generalTranslationSlug = "general-translation";

// let count = 0;
// console.log("Fetching Languages");
// const languages = await txAvailableLanguages(scratchAddonsSlug);
// console.log(`Fetching translations (${count}/${languages.length})`);
// const data = await Promise.all(languages.map((lang) =>
//   txPull(scratchAddonsSlug, generalTranslationSlug, lang).then((data) => {
//     count++;
//     console.log(`Fetched ${lang} (${count}/${languages.length})`);
//     return data;
//   }),
// ));
// console.log(data);
const englishGeneralTranslations = await txPull(
  scratchAddonsSlug,
  generalTranslationSlug,
  "en",
);
await writeFile(
  "src/_locales/en/messages.json",
  JSON.stringify(englishGeneralTranslations, null, 2),
);
console.log("Successfully pulled translations from tx and wrote to _locales.");
