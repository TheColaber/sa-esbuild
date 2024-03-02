export default async () => {
  const Blockly = await addon.tab.blocklyReady();
  let workspace = Blockly.getMainWorkspace();

  const originalInit = Blockly.init_;
  Blockly.init_ = function (...args) {
    workspace = args[0];
    if (addon.enabled) setGrid(true);
    return originalInit.call(this, ...args);
  };

  setGrid(true);

  addon.settings.addEventListener("change", () => setGrid(true));
  addon.addEventListener("disabled", () => setGrid(false));
  addon.addEventListener("reenabled", () => setGrid(true));

  function setGrid(enabled) {
    workspace.grid_.snapToGrid_ = enabled;
    console.log(enabled);

    if (enabled) workspace.grid_.spacing_ = addon.settings.get("grid");
    else workspace.grid_.spacing_ = 40;
    workspace.grid_.update(workspace.scale);
  }
};
