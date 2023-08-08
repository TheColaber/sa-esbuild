import FindBar from "./find-bar";

export default async () => {
  const Blockly = await addon.tab.getBlockly();
  await addon.tab.scratchClassesReady();

  // Add find bar to current workspace
  const mainWorkspace = addon.tab.getWorkspace();
  mainWorkspace.findBar = new FindBar(mainWorkspace);

  const createWorkspaceDom = Blockly.WorkspaceSvg.prototype.createDom;
  Blockly.WorkspaceSvg.prototype.createDom = function (opt_backgroundClass) {
    // This is the same check scratch uses to create the toolbox/flyout.
    // If there is no flyout, there shouldn't be a find bar.
    if (this.options.hasCategories) {
      this.findBar = new FindBar(this);
    }

    return createWorkspaceDom.call(this, opt_backgroundClass);
  };

  // dispose find bar on current and all future workspaces.
  const disposeWorkspaceDom = Blockly.WorkspaceSvg.prototype.dispose;
  Blockly.WorkspaceSvg.prototype.dispose = function () {
    if (this.findBar) {
      this.findBar.dispose();
    }
    disposeWorkspaceDom.call(this);
  };
};
