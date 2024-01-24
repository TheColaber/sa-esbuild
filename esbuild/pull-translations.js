import { txPull, txAvailableLanguages } from "./transifex.js";
const scratchAddonsSlug = "scratch-addons-extension";
const addonTranslationSlug = "addons-translation-new";
const generalTranslationSlug = "general-translation";

let count = 0;
console.log("Fetching Languages");
const languages = await txAvailableLanguages(scratchAddonsSlug);
console.log(`Fetching translations (${count}/${languages.length})`);
languages.map((lang) =>
  txPull(scratchAddonsSlug, addonTranslationSlug, lang).then(() => {
    count++;
    console.log(`Fetched ${lang} (${count}/${languages.length})`);
  }),
);
