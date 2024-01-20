// import Dropdown from "./dropdown";
import { createApp } from "vue";
import component from "./find-bar.vue";
import "./styles.css";

export default async () => {
  const Blockly = await addon.tab.getBlockly();
  await addon.tab.scratchClassesReady();

  // Add find bar to current workspace
  const mainWorkspace = addon.tab.getWorkspace();
  createFindBar(mainWorkspace);

  const createWorkspaceDom = Blockly.WorkspaceSvg.prototype.createDom;
  Blockly.WorkspaceSvg.prototype.createDom = function (opt_backgroundClass) {
    // This is the same check scratch uses to create the toolbox/flyout.
    // If there is no flyout, there shouldn't be a find bar.
    if (this.options.hasCategories) {
      createFindBar(this);
    }

    return createWorkspaceDom.call(this, opt_backgroundClass);
  };

  function createFindBar(workspace: ScratchBlocks.WorkspaceSvg) {
    const guiTabList = document.querySelector("ul[class*=gui_tab-list_]");

    const fragment = document.createElement("div");

    const instance = createApp(component, { addon, workspace });
    instance.mount(fragment);
    guiTabList.append(fragment);
    // TODO: kinda hacky but will have to do for now.
    guiTabList.replaceChild(fragment.firstChild, fragment);

    const oldDispose = workspace.dispose;
    workspace.dispose = function () {
      instance.unmount();
      oldDispose.call(this);
    };
  }
};
