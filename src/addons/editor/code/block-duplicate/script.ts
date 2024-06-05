export default async () => {
  const ScratchBlocks = await addon.tab.blocklyReady();

  const originalHandleBlockStart =
    ScratchBlocks.Gesture.prototype.handleBlockStart;
  ScratchBlocks.Gesture.prototype.handleBlockStart = function (e, block) {
    let con = !!this.targetBlock_;
    console.log(con);
    originalHandleBlockStart.call(this, e, block);
    if (con) return;

    const isDuplicating =
      e instanceof MouseEvent &&
      e.altKey &&
      !this.flyout_ &&
      !this.shouldDuplicateOnDrag_ &&
      this.targetBlock_.type !== "procedures_definition";
    const workspace = this.targetBlock_.workspace;
    if (isDuplicating) {
      workspace.setResizesEnabled(false);
      ScratchBlocks.Events.disable();
      let newBlock;
      try {
        const xmlBlock = ScratchBlocks.Xml.blockToDom(this.targetBlock_);
        newBlock = ScratchBlocks.Xml.domToBlock(xmlBlock, workspace);
        ScratchBlocks.scratchBlocksUtils.changeObscuredShadowIds(newBlock);
        const xy = this.targetBlock_.getRelativeToSurfaceXY();
        newBlock.moveBy(xy.x, xy.y);
      } catch (e) {
        console.error(e);
      }
      ScratchBlocks.Events.enable();

      if (newBlock) {
        this.targetBlock_ = newBlock;
        if (ScratchBlocks.Events.isEnabled()) {
          ScratchBlocks.Events.fire(
            new ScratchBlocks.Events.BlockCreate(newBlock),
          );
        }
      }
    }
  };
};
