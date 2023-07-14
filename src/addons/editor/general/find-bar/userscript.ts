// import FindBar from "./classes/find-bar";

export default defineScript(async ({ addon, msg }) => {
  const Blockly = await addon.tab.getBlockly();
  // await addon.tab.scratchClassesReady();

  // const mainWorkspace = addon.tab.getWorkspace();
  // mainWorkspace.findBar = new FindBar(mainWorkspace, addon, msg);

  // const oldInit = Blockly.init_;
  // Blockly.init_ = function (newWorkspace) {
  //   const mainWorkspace = newWorkspace.toolbox_
  //     ? newWorkspace
  //     : addon.tab.getWorkspace();
  //   if (!mainWorkspace.findBar) {
  //     mainWorkspace.findBar = new FindBar(mainWorkspace, addon, msg);
  //   }

  //   return oldInit.call(this, newWorkspace);
  // };
  const createWorkspaceDom = Blockly.WorkspaceSvg.prototype.createDom;
  Blockly.WorkspaceSvg.prototype.createDom = function (opt_backgroundClass) {
    console.log("test");
    // This is the same check scratch uses to create the toolbox/flyout.
    // If there is no flyout, there shouldn't be a find bar.
    if (this.options.hasCategories) {
      console.log("himm");
    }

    createWorkspaceDom.call(this, opt_backgroundClass);
  };
});
