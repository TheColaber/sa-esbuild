import "./define";
import "./redux";
import * as addons from "#addons";
import MATCH_PATTERNS from "./matches";
import UserscriptAddon from "../addon-api/userscript";
import { SyncStorage } from "../background/storage";

globalThis.scratchAddons.events.addEventListener(
  "addonData",
  async ({ detail }: CustomEvent) => {
    if (scratchAddons.addonsLoaded) return;

    const {
      addonsStates,
      addonEnabledStates,
      messages,
    }: {
      addonsStates: SyncStorage["addonsStates"];
      addonEnabledStates: string[];
      messages: { [addon: string]: { [message: string]: string } };
    } = detail;
    console.log("Scratch Addons: Addon data received from storage");

    for (const id in addonsStates) {
      if (addonEnabledStates.includes(addonsStates[id])) {
        runAddon(id);
      }
    }
    scratchAddons.addonsLoaded = true;

    scratchAddons.events.addEventListener(
      "dynamicDisable",
      ({ detail: { id } }: CustomEvent) => {
        const addon = scratchAddons.addons.find((addon) => addon.id === id);
        addon.dispatchEvent(new CustomEvent("dynamicDisable"));
        const style = document.createElement("style");
        style.setAttribute("data-addon-disabled-style-" + id, "");
        style.textContent = `[data-addon-${id}] { display: none !important; }`;
        document.body.appendChild(style);
      }
    );
    scratchAddons.events.addEventListener(
      "dynamicEnable",
      ({ detail: { id } }: CustomEvent) => {
        const addon = scratchAddons.addons.find((addon) => addon.id === id);
        if (addon) {
          addon.dispatchEvent(new CustomEvent("dynamicEnable"));
          document.querySelector(`[data-addon-disabled-style-${id}]`).remove();
        } else {
          runAddon(id, true);
        }
      }
    );

    function runAddon(id, enabledLate = false) {
      const addon = addons[id];

      if (!addon || !addon.scripts) return;
      for (const { matches, script } of addon.scripts) {
        let urlMatches = false;
        for (const match of matches) {
          urlMatches = MATCH_PATTERNS[match].test(window.location.pathname);
          if (urlMatches) break;
        }
        if (!urlMatches || !script) continue;        
        scratchAddons.console.log("Scratch Addons:", id, "is running");
        const addonInstance = new UserscriptAddon(id, messages[id], enabledLate);
        scratchAddons.addons.push(addonInstance);
      }
      // TODO: loop around addon.styles, which are styles that may be controlled by setting values.
    }
  }
);
