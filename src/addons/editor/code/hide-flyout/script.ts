export default async () => {
  const Blockly = await addon.tab.blocklyReady();
  // const _position = Blockly.VerticalFlyout.prototype.position;
  // Blockly.VerticalFlyout.prototype.position = function () {
  //   _position.call(this);

  //   const targetWorkspaceMetrics = this.targetWorkspace_.getMetrics();
  //   if (!targetWorkspaceMetrics) {
  //     // Hidden components will return null.
  //     return;
  //   }

  //   if (!this.parentToolbox_)
  //     return console.error("I DID NOT EXPECT THIS AT ALL!");
  //   const toolboxWidth = this.parentToolbox_.getWidth();
  //   const categoryWidth = toolboxWidth - this.width_;
  //   let x =
  //     this.toolboxPosition_ == Blockly.TOOLBOX_AT_RIGHT
  //       ? targetWorkspaceMetrics.viewWidth
  //       : categoryWidth;
  //   let y = 0;
  //   x -= this.width_;

  //   this.svgGroup_.setAttribute("width", this.width_ * 2);
  //   const transform = "translate(" + x + "px," + y + "px)";
  //   Blockly.utils.setCssTransform(this.svgGroup_, transform);

  //   // Update the scrollbar (if one exists).
  //   if (this.scrollbar_) {
  //     // Set the scrollbars origin to be the top left of the flyout.
  //     this.scrollbar_.setOrigin(x, y);
  //     this.scrollbar_.resize();
  //   }

  //   const showFlyout = (e) => {
  //     console.log(e);
  //   };

  //   // this.listeners_.push(Blockly.bindEvent_(this.svgBackground_, 'mouseover',
  //   //   this, showFlyout));
  // };
  let toggle = false;
  const oldSetSelectedItem = Blockly.Toolbox.prototype.setSelectedItem;
  Blockly.Toolbox.prototype.setSelectedItem = function (
    item,
    shouldScroll = true,
  ) {
    const previousSelection = this.selectedItem_;
    oldSetSelectedItem.call(this, item, shouldScroll);
    if (!addon.enabled) return;
    if (!shouldScroll && !toggle) {
      // ignore initial selection when updating the toolbox
      item.setSelected(false);
    } else if (item === previousSelection) {
      toggle = !toggle;
    } else if (!toggle) {
      // scrollAnimation = false;
      toggle = true;
    }
  };
};
