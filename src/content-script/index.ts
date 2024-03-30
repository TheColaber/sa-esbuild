import "./define";
import "./redux";
import * as addonScripts from "#addon-scripts";
import * as addonStyles from "#addon-styles";
import * as localeEN from "#addon-en";
import { MATCH_PATTERNS } from "./matches";
import UserscriptAddon from "../addon-api/userscript";
import { AddonStorage } from "../background/storage";
import injectStyle from "./inject-style";

let enabledAddons: string[];
let addonSettings: AddonStorage;
let userLangs: string[];
let previewAddon: string | null;

const locales = {
  en: localeEN,
};
scratchAddons.events.addEventListener(
  "addonData",
  async ({
    detail,
  }: CustomEvent<{
    enabledAddons: string[];
    addonSettings: AddonStorage;
    userLangs: string[];
    previewAddon: string | null;
  }>) => {
    if (scratchAddons.addonsLoaded) return;

    enabledAddons = detail.enabledAddons;
    addonSettings = detail.addonSettings;
    userLangs = detail.userLangs;
    previewAddon = detail.previewAddon;

    console.log("Addon data received from storage");

    for (const id of enabledAddons) {
      runAddon(id);
    }

    if (previewAddon) {
      runAddon(previewAddon, { showPreview: true });
    }

    scratchAddons.addonsLoaded = true;
  },
);

scratchAddons.events.addEventListener(
  "dynamicDisable",
  ({ detail: { id } }: CustomEvent) => {
    const addon = scratchAddons.addons[id];
    if (addon) {
      addon.dispatchEvent(new CustomEvent("dynamicDisable"));
      const style = document.createElement("style");
      style.setAttribute("data-addon-disabled-style-" + id, "");
      style.textContent = `[data-addon-${id}] { display: none !important; }`;
      document.body.appendChild(style);
    }
    const injectedStyles = document.querySelectorAll<HTMLStyleElement>(
      `.scratch-addons-style[data-addon-id='${id}']`,
    );
    injectedStyles.forEach((style) => (style.disabled = true));
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
      runAddon(id, { enabledLate: true });
    }
  },
);
scratchAddons.events.addEventListener(
  "settingChange",
  ({ detail: { id, settings } }: CustomEvent) => {
    const addon = scratchAddons.addons[id];
    addonSettings[id] = settings;
    addon.settings.dispatchEvent(
      new CustomEvent("change", { detail: settings }),
    );
  },
);

function runAddon(
  id: string,
  { enabledLate = false, showPreview = false } = {},
) {
  const scripts = addonScripts[id] || [];
  if (scripts.length > 0) {
    const settings = addonSettings[id];

    const addonLocales = {};
    for (const lang of userLangs) {
      if (!locales[lang]) continue;
      for (const key in locales[lang][id]) {
        const string = locales[lang][id][key].string || locales[lang][id][key];
        addonLocales[key] = addonLocales[key] || string;
      }
    }

    const addonInstance = new UserscriptAddon(
      id,
      { enabledLate, showPreview },
      addonLocales,
      settings,
    );
    scratchAddons.addons[id] = addonInstance;
    for (const { script, matches } of scripts) {
      if (!testUrlMatches(matches)) continue;
      script().then((imported) => imported.default());
      console.log(id, "is running");
      scratchAddons.runningAddons.push(id);
    }
  }
  const styles = addonStyles[id] || [];

  for (const { style, matches } of styles) {
    if (!testUrlMatches(matches)) continue;
    injectStyle(style, id);
    scratchAddons.runningAddons.push(id);
  }
}

function testUrlMatches(matches: (keyof typeof MATCH_PATTERNS)[]) {
  let urlMatches = false;
  for (const match of matches) {
    urlMatches = MATCH_PATTERNS[match].test(window.location.pathname);
    if (urlMatches) break;
  }
  return urlMatches;
}
