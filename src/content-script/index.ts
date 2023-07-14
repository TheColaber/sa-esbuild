import * as addons from "#addons";
import loadClasses from "./scratch-classes";
import SharedObserver from "./shared-observer";
import injectStyle from "./inject-style";
import MATCH_PATTERNS from "./matches";
import UserscriptAddon from "../addon-api/userscript";
import {
  getBlocklyInstance,
  getMainWorkspace,
  getInternalKey,
  isProject,
} from "./blockly";
import "./redux";
import { SyncStorage } from "../background/storage";

const sharedObserver = new SharedObserver();
const realConsole = { ...console };
globalThis.scratchAddons = {
  addonsLoaded: false,
  console: realConsole,
  events: new EventTarget(),
  cache: {
    BlocklyInstance: null,
    vm: null,
  },
  redux: { target: new EventTarget(), state: null, dispatch: null },
  sharedObserver,
  classNames:
    isProject() && sharedObserver.watch({ query: "title" }).then(loadClasses),
  getBlocklyInstance,
  getMainWorkspace,
  getInternalKey,
  injectStyle,
};

const AddonInstances: UserscriptAddon[] = [];

console.log("Scratch Addons: Running on page");

scratchAddons.events.addEventListener(
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
        const addon = AddonInstances.find((addon) => addon.id === id);
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
        const addon = AddonInstances.find((addon) => addon.id === id);
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
        if (addon.mode === "dev") {
          scratchAddons.console.log(
            "Scratch Addons:",
            id,
            "is set to developer mode. Make sure to turn it off before it goes to all users!"
          );
        }
        const addonInstance = new UserscriptAddon(id, enabledLate);
        AddonInstances.push(addonInstance);
        script({
          addon: addonInstance,
          msg: (msg, parameters) => {
            let message = messages[id][msg];
            return message.replace(
              /\{(.*)\}/g,
              (full, param) => parameters[param]
            );
          },
        });
      }
      // TODO: loop around addon.styles, which are styles that may be controlled by setting values.
    }
  }
);

declare global {
  var scratchAddons: {
    addonsLoaded: boolean;
    console: Console;
    events: EventTarget;
    redux: { target: EventTarget; state: any; dispatch: any };
    sharedObserver: import("./shared-observer").default;
    cache: {
      BlocklyInstance: typeof import("../../esbuild/types/blockly").Blockly;
      vm: any;
    };
    classNames: Promise<string[]>;
    getBlocklyInstance: typeof import("./blockly").getBlocklyInstance;
    getMainWorkspace: typeof import("./blockly").getMainWorkspace;
    getInternalKey: typeof import("./blockly").getInternalKey;
    injectStyle: typeof import("./inject-style").default;
  };
  var __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
}
