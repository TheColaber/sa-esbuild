export default async () => {
  const ScratchBlocks = await addon.tab.blocklyReady();
  const originalCreateCheckbox =
    ScratchBlocks.VerticalFlyout.prototype.createCheckbox_;
  ScratchBlocks.VerticalFlyout.prototype.createCheckbox_ = function (
    block,
    cursorX,
    cursorY,
    blockHW,
  ) {
    originalCreateCheckbox.call(this, block, cursorX, cursorY, blockHW);
    const checkbox = this.checkboxes_[block.id];
    if (addon.enabled && checkbox.clicked === false) {
      checkbox.autoHide = true;
    }
  };

  const originalSetCheckbox =
    ScratchBlocks.VerticalFlyout.prototype.setCheckboxState;
  ScratchBlocks.VerticalFlyout.prototype.setCheckboxState = function (
    blockId,
    value,
  ) {
    const checkbox = this.checkboxes_[blockId];
    if (addon.enabled && checkbox && checkbox.autoHide) {
      return (checkbox.autoHide = false);
    }
    originalSetCheckbox.call(this, blockId, value);
  };
};
