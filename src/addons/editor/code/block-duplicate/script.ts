export default async () => {
  const Blockly = await addon.tab.blocklyReady();

  const originalSetTarget = Blockly.Gesture.prototype.setTargetBlock_;
  Blockly.Gesture.prototype.setTargetBlock_ = function (block) {
    originalSetTarget.call(this, block);
    if (!this.targetBlock_ || this.shouldDuplicateOnDrag_) return;
    this.shouldDuplicateOnDrag_ =
      this.mostRecentEvent_ instanceof MouseEvent &&
      this.mostRecentEvent_.altKey &&
      !this.flyout_ &&
      this.targetBlock_.type !== "procedures_definition";
  };

  // Blockly.Gesture.prototype.duplicateOnDrag_ = function() {
  //   var newBlock = null;
  //   Blockly.Events.disable();
  //   try {
  //     // Note: targetBlock_ should have no children.  If it has children we would
  //     // need to update shadow block IDs to avoid problems in the VM.
  //     // Resizes will be reenabled at the end of the drag.
  //     this.startWorkspace_.setResizesEnabled(false);
  //     var xmlBlock = Blockly.Xml.blockToDom(this.targetBlock_);
  //     newBlock = Blockly.Xml.domToBlock(xmlBlock, this.startWorkspace_);
  //     // Blockly.scratchBlocksUtils.changeObscuredShadowIds(newBlock);

  //     // Move the duplicate to original position.
  //     var xy = this.targetBlock_.getRelativeToSurfaceXY();
  //     newBlock.moveBy(xy.x, xy.y);
  //     newBlock.setShadow(false);
  //   } finally {
  //     Blockly.Events.enable();
  //   }
  //   if (!newBlock) {
  //     // Something went wrong.
  //     console.error('Something went wrong while duplicating a block.');
  //     return;
  //   }
  //   if (Blockly.Events.isEnabled()) {
  //     Blockly.Events.fire(new Blockly.Events.BlockCreate(newBlock));
  //   }
  //   newBlock.select();
  //   this.targetBlock_ = newBlock;
  // };
};
