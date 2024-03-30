export default async () => {
  const Blockly = await addon.tab.blocklyReady();
  const oldSetSelectedItem = Blockly.Toolbox.prototype.setSelectedItem;
  Blockly.Toolbox.prototype.setSelectedItem = function (
    item,
    shouldScroll = true,
  ) {
    const previousSelection = this.selectedItem_;
    const visible = this.flyout_.isVisible();

    oldSetSelectedItem.call(this, item, shouldScroll);

    if (!addon.enabled) return;
    if (!shouldScroll && !visible) {
      // ignore initial selection when updating the toolbox
      item.setSelected(false);
    } else if (visible && item === previousSelection) {
      // animate out before hide...
      this.flyout_.hide();
    } else {
      // animate in
    }
    Blockly.svgResize(Blockly.getMainWorkspace());
  };
};
