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

const sharedObserver = new SharedObserver();
globalThis.scratchAddons = {
  addonsLoaded: false,
  realConsole: { ...console },
  console: {
    ...console,
    log: console.log.bind(console, "%csa", "color: #ff7b26;"),
  },
  events: new EventTarget(),
  runningAddons: [],
  addons: {},
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
scratchAddons.console.log("Running on page")
declare global {
  var scratchAddons: {
    addonsLoaded: boolean;
    console: Console;
    realConsole: Console;
    events: EventTarget;
    redux: { target: EventTarget; state: any; dispatch: any };
    sharedObserver: import("./shared-observer").default;
    runningAddons: string[];
    addons: { [id: string]: UserscriptAddon };
    cache: {
      BlocklyInstance: typeof import("../../esbuild/types/blockly/index").Blockly;
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
