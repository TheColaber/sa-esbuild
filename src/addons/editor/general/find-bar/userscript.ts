import { ScratchBlocks } from "../../../../../esbuild/types/blockly";
import FindBar from "./classes/find-bar";

export default async () => {
  const Blockly = await addon.tab.getBlockly();
  await addon.tab.scratchClassesReady();

  const mainWorkspace: ScratchBlocks.Workspace = addon.tab.getWorkspace();
  mainWorkspace.findBar = new FindBar(mainWorkspace);

  // const oldInit = Blockly.init_;
  // Blockly.init_ = function (newWorkspace) {
  //   const mainWorkspace = newWorkspace.toolbox_
  //     ? newWorkspace
  //     : addon.tab.getWorkspace();
  //   if (!mainWorkspace.findBar) {
  //     mainWorkspace.findBar = new FindBar(mainWorkspace);
  //   }

  //   return oldInit.call(this, newWorkspace);
  // };
  const createWorkspaceDom = Blockly.WorkspaceSvg.prototype.createDom;
  Blockly.WorkspaceSvg.prototype.createDom = function (opt_backgroundClass) {
    console.log("create");
    // This is the same check scratch uses to create the toolbox/flyout.
    // If there is no flyout, there shouldn't be a find bar.
    if (this.options.hasCategories) {
      console.log("add findbar");
      this.findBar = new FindBar(mainWorkspace);
    }

    return createWorkspaceDom.call(this, opt_backgroundClass);
  };

  const disposeWorkspaceDom = Blockly.WorkspaceSvg.prototype.dispose;
  Blockly.WorkspaceSvg.prototype.dispose = function() {
    console.log("dispose");
    
    if (this.findBar) {
      this.findBar.dispose()
    }
    disposeWorkspaceDom.call(this)
  }
};
