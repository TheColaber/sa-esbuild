export default async () => {
  const Blockly = await addon.tab.blocklyReady();
  let workspace = Blockly.getMainWorkspace();

  const originalInit = Blockly.init_;
  Blockly.init_ = function (...args) {
    workspace = args[0];
    if (addon.enabled) setGrid(true);
    return originalInit.call(this, ...args);
  };

  const originalGetCandidate = Blockly.InsertionMarkerManager.prototype.getCandidate_;
  Blockly.InsertionMarkerManager.prototype.getCandidate_ = function(dxy) {
    const candidate = originalGetCandidate.call(this, dxy);
    if (candidate.closest === null) {
      // todo show little insetionmarker where it would go
      //https://github.com/scratchfoundation/scratch-blocks/blob/a6197a1c0a76a06b7629b6dc3a3af544c7b059a1/core/rendered_connection.js#L39
      //https://github.com/scratchfoundation/scratch-blocks/blob/develop/core/block_render_svg_horizontal.js#L873
      //https://github.com/scratchfoundation/scratch-blocks/blob/develop/core/insertion_marker_manager.js#L366
      return {
        closest: null,
        local: null,
        radius: 48
      }
    }
    return res;
  }


  setGrid(true);

  addon.settings.addEventListener("change", () => setGrid(true));
  addon.addEventListener("dynamicDisable", () => setGrid(false));
  addon.addEventListener("dynamicEnable", () => setGrid(true));

  function setGrid(enabled) {
    workspace.grid_.snapToGrid_ = enabled;

    if (enabled) workspace.grid_.spacing_ = addon.settings.get("grid");
    else workspace.grid_.spacing_ = 40;
    workspace.grid_.update(workspace.scale);
  }
};
