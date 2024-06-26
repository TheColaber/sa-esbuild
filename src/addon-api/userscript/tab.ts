import Editor from "./editor";
import Redux from "./redux";

export default class Tab {
  id: string;
  _waitForElementSet: WeakSet<{}>;
  _classes: string[];
  _blockly: typeof ScratchBlocks;
  _vm: any;
  redux: Redux;
  editor: Editor;

  constructor(id: string) {
    this.id = id;
    this._waitForElementSet = new WeakSet();
    this.redux = new Redux();
    this.editor = new Editor(this);
  }

  injectStyle(stylesheet: string) {
    scratchAddons.injectStyle(stylesheet, this.id);
  }

  getInternalKey(elem: Element) {
    return scratchAddons.getInternalKey(elem);
  }

  waitForElement(
    selector: string,
    {
      markAsSeen = false,
      condition,
      reduxCondition,
      elementCondition,
      reduxEvents,
    }: {
      markAsSeen?: boolean;
      condition?: () => boolean;
      reduxCondition?: (state: any) => boolean;
      elementCondition?: (element: Element) => boolean;
      reduxEvents?: string[];
    },
  ) {
    if (!condition || condition()) {
      const firstQuery = document.querySelectorAll(selector);
      for (const element of firstQuery) {
        if (this._waitForElementSet.has(element)) continue;
        if (elementCondition && !elementCondition(element)) continue;
        if (markAsSeen) this._waitForElementSet.add(element);

        return Promise.resolve(element);
      }
    }

    let satisfied = false;
    let combinedCondition = () => {
      if (condition && !condition()) return false;
      if (this.redux.state) {
        if (reduxCondition && !reduxCondition(this.redux.state)) return false;
      }
      // NOTE: this may reach sooner than expected, if redux state is not available
      // because of timing issues. However this is just an optimization! It's fine
      // if it runs a little earlier. Just don't error out.
      return reduxEvents ? satisfied : true;
    };
    const promise = scratchAddons.sharedObserver.watch({
      query: selector,
      seen: markAsSeen ? this._waitForElementSet : null,
      condition: combinedCondition,
      elementCondition,
    });
    if (reduxEvents) {
      let listener = (({ detail }: CustomEvent) => {
        if (reduxEvents.includes(detail.action.type)) {
          satisfied = true;
        }
      }) as EventListener;
      this.redux.initialize();
      this.redux.addEventListener("statechanged", listener);
      promise.then((match) => {
        this.redux.removeEventListener("statechanged", listener);
        return match;
      });
    }

    return promise;
  }

  /* TODO: Move the following into editor.ts */
  get editorMode() {
    const pathname = location.pathname.toLowerCase();
    const split = pathname.split("/").filter(Boolean);
    if (!split[0] || split[0] !== "projects") return null;
    if (split.includes("editor")) return "editor";
    if (split.includes("fullscreen")) return "fullscreen";
    if (split.includes("embed")) return "embed";
    return "projectpage";
  }

  getWorkspace() {
    return scratchAddons.getMainWorkspace();
  }

  async vmReady() {
    return (this._vm = (await scratchAddons.getCache()).vm);
  }

  get vm() {
    if (!this._vm) {
      throw "await Tab.vmReady before getting Tab.vm";
    }
    return this._vm;
  }

  async blocklyReady() {
    return (this._blockly = (await scratchAddons.getCache()).BlocklyInstance);
  }

  get Blockly() {
    if (!this._blockly) {
      throw "await Tab.blocklyReady before getting Tab.Blockly";
    }
    return this._blockly;
  }

  async scratchClassesReady() {
    this._classes = await scratchAddons.classNames;
  }

  scratchClass(...args: (string | { others: string })[]) {
    let res = "";
    if (!this._classes) {
      throw "await Tab.scratchClassesReady before calling scratchClass";
    }
    for (const classNameToFind of args) {
      if (typeof classNameToFind !== "string") continue;
      const scratchClass = this._classes.find(
        (className) =>
          className.startsWith(classNameToFind + "_") &&
          className.length === classNameToFind.length + 6,
      );
      if (!scratchClass) {
        console.error("Could not find scratch class", classNameToFind);
      }
      res += scratchClass + " ";
    }

    const options = args[args.length - 1];
    if (typeof options === "object") {
      const classNames = Array.isArray(options.others)
        ? options.others
        : [options.others];
      classNames.forEach((string) => (res += string + " "));
    }
    res = res.slice(0, -1);
    // Sanitize just in case
    res = res.replace(/"/g, "");
    return res;
  }

  displayNoneWhileDisabled(el: Element) {
    el.setAttribute("data-addon-" + this.id, "");
  }
}
