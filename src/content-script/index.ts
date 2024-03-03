import "./define";
import "./redux";
import * as addons from "#addon-scripts";
import * as localeEN from "#addon-en";
import MATCH_PATTERNS from "./matches";
import UserscriptAddon from "../addon-api/userscript";
import { AddonStorage } from "../background/storage";

let enabledAddons: string[]
let addonSettings: AddonStorage
let userLangs: string[];

const locales = {
  en: localeEN,
};
scratchAddons.events.addEventListener(
  "addonData",
  async ({ detail }: CustomEvent<{
    enabledAddons: string[];
    addonSettings: AddonStorage
    userLangs: string[];
  }>) => {
    if (scratchAddons.addonsLoaded) return;

    enabledAddons = detail.enabledAddons;
    addonSettings = detail.addonSettings;
    userLangs = detail.userLangs;

    console.log("Addon data received from storage");

    for (const id of enabledAddons) {
      runAddon(id);
    }

    scratchAddons.addonsLoaded = true;
  },
);

scratchAddons.events.addEventListener(
  "dynamicDisable",
  ({ detail: { id } }: CustomEvent) => {
    const addon = scratchAddons.addons[id];
    addon.dispatchEvent(new CustomEvent("dynamicDisable"));
    const style = document.createElement("style");
    style.setAttribute("data-addon-disabled-style-" + id, "");
    style.textContent = `[data-addon-${id}] { display: none !important; }`;
    const injectedStyles = document.querySelectorAll(
      `.scratch-addons-style[data-addon-id=${id}]`,
    );
    injectedStyles.forEach(
      (style: HTMLStyleElement) => (style.disabled = true),
    );
    document.body.appendChild(style);
  },
);
scratchAddons.events.addEventListener(
  "dynamicEnable",
  ({ detail: { id } }: CustomEvent) => {
    const addon = scratchAddons.addons[id];
    if (addon) {
      addon.dispatchEvent(new CustomEvent("dynamicEnable"));
      document.querySelector(`[data-addon-disabled-style-${id}]`).remove();
      const injectedStyles = document.querySelectorAll(
        `.scratch-addons-style[data-addon-id=${id}]`,
      );
      injectedStyles.forEach(
        (style: HTMLStyleElement) => (style.disabled = false),
      );
    } else {
      runAddon(id, true);
    }
  },
);
scratchAddons.events.addEventListener(
  "settingChange",
  ({ detail: { id, settings } }: CustomEvent) => {
    const addon = scratchAddons.addons[id];
    addonSettings[id] = settings;
    addon.settings.dispatchEvent(new CustomEvent("change", {detail: settings}));
  },
);

function runAddon(id, enabledLate = false) {
  const addon = addons[id];

  if (!addon) return;
  for (const { script, matches } of addon) {
    let urlMatches = false;
    for (const match of matches) {
      urlMatches = MATCH_PATTERNS[match].test(window.location.pathname);
      if (urlMatches) break;
    }
    if (!urlMatches || !script) continue;
    console.log(id, "is running");

    const addonLocales = {};
    for (const lang of userLangs) {
      for (const key in locales[lang][id]) {
        const string =
          locales[lang][id][key].string || locales[lang][id][key];
        addonLocales[key] = addonLocales[key] || string;
      }
    }

    const settings = addonSettings[id];
    console.log(addonSettings, id, settings);
    

    const addonInstance = new UserscriptAddon(
      id,
      addonLocales,
      enabledLate,
      settings,
    );
    scratchAddons.addons[id] = addonInstance;
    script().then((imported) => imported.default());
  }
  // TODO: loop around addon.styles, which are styles that may be controlled by setting values.
}