import loadClasses from "./scratch-classes";
import SharedObserver from "./shared-observer";
import injectStyle from "./inject-style";
import {
  getCache,
  getMainWorkspace,
  getInternalKey,
  isProject,
} from "./blockly";
import UserscriptAddon from "../addon-api/userscript";

console.log("Scratch Addons: Running on page");

const sharedObserver = new SharedObserver();
const realConsole = { ...console };
globalThis.scratchAddons = {
  addonsLoaded: false,
  console: realConsole,
  events: new EventTarget(),
  addons: [],
  cache: {
    BlocklyInstance: null,
    vm: null,
  },
  redux: { target: new EventTarget(), state: null, dispatch: null },
  sharedObserver,
  classNames:
    isProject() && sharedObserver.watch({ query: "title" }).then(loadClasses),
  getCache,
  getMainWorkspace,
  getInternalKey,
  injectStyle,
};

declare global {
  var scratchAddons: {
    addonsLoaded: boolean;
    console: Console;
    events: EventTarget;
    redux: { target: EventTarget; state: any; dispatch: any };
    sharedObserver: import("./shared-observer").default;
    addons: { [id: string]: UserscriptAddon };
    cache: {
      BlocklyInstance: typeof import("../../esbuild/types/blockly").Blockly;
      vm: any;
    };
    classNames: Promise<string[]>;
    getCache: typeof import("./blockly").getCache;
    getMainWorkspace: typeof import("./blockly").getMainWorkspace;
    getInternalKey: typeof import("./blockly").getInternalKey;
    injectStyle: typeof import("./inject-style").default;
  };
  var __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
}
