export default async () => {
  const Blockly = await addon.tab.blocklyReady();
  let workspace = Blockly.getMainWorkspace();

  const originalInit = Blockly.init_;
  Blockly.init_ = function (...args) {
    workspace = args[0];
    if (addon.enabled) setGrid(true);
    return originalInit.call(this, ...args);
  };

  let connectToGrid = true;
  const originalUpdate = Blockly.InsertionMarkerManager.prototype.update;
  Blockly.InsertionMarkerManager.prototype.update = function (dxy, deleteArea) {
    originalUpdate.call(this, dxy, deleteArea);
    if (!connectToGrid) return;
    const block = this.firstMarker_;

    block.render();
    block.rendered = true;
    block.getSvgRoot().setAttribute("visibility", "visible");
    const grid = this.workspace_.getGrid();
    const spacing = grid.getSpacing();
    const half = spacing / 2;
    const xy = this.topBlock_.getRelativeToSurfaceXY();
    let dx = Math.round((xy.x - half) / spacing) * spacing + half;
    let dy = Math.round((xy.y - half) / spacing) * spacing + half;
    dx = Math.round(dx);
    dy = Math.round(dy);
    block.translate(dx, dy);
    block.snapToGrid();
  };
  const originalConnect =
    Blockly.InsertionMarkerManager.prototype.connectMarker_;
  Blockly.InsertionMarkerManager.prototype.connectMarker_ = function (...args) {
    connectToGrid = false;
    return originalConnect.call(this, ...args);
  };

  const originalDisconnect =
    Blockly.InsertionMarkerManager.prototype.disconnectMarker_;
  Blockly.InsertionMarkerManager.prototype.disconnectMarker_ = function (
    ...args
  ) {
    connectToGrid = true;
    return originalDisconnect.call(this, ...args);
  };

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
