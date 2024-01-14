import "./define";
import "./redux";
import * as addons from "#addon-scripts";
import locales from "#addon-l10n";
import MATCH_PATTERNS from "./matches";
import UserscriptAddon from "../addon-api/userscript";
import { SyncStorage } from "../background/storage";

scratchAddons.events.addEventListener(
  "addonData",
  async ({ detail }: CustomEvent) => {
    if (scratchAddons.addonsLoaded) return;

    const {
      addonsStates,
      addonEnabledStates,
      userLangs,
    }: {
      addonsStates: SyncStorage["addonsStates"];
      addonEnabledStates: string[];
      userLangs: string[];
    } = detail;

    console.log("Addon data received from storage");

    for (const id in addonsStates) {
      if (addonEnabledStates.includes(addonsStates[id])) {
        runAddon(id);
      }
    }
    scratchAddons.addonsLoaded = true;

    scratchAddons.events.addEventListener(
      "dynamicDisable",
      ({ detail: { id } }: CustomEvent) => {
        const addon = scratchAddons.addons[id];
        addon.dispatchEvent(new CustomEvent("dynamicDisable"));
        const style = document.createElement("style");
        style.setAttribute("data-addon-disabled-style-" + id, "");
        style.textContent = `[data-addon-${id}] { display: none !important; }`;
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
        } else {
          runAddon(id, true);
        }
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
            addonLocales[key] = addonLocales[key] || locales[lang][id][key];
          }
        }
        console.log(addonLocales);

        const addonInstance = new UserscriptAddon(
          id,
          addonLocales,
          enabledLate,
        );
        scratchAddons.addons[id] = addonInstance;
        script().then((imported) => imported.default());
      }
      // TODO: loop around addon.styles, which are styles that may be controlled by setting values.
    }
  },
);
