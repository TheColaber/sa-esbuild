export default async () => {
  const ScratchBlocks = await addon.tab.blocklyReady();

  const originalStartDraggingBlock =
    ScratchBlocks.Gesture.prototype.startDraggingBlock_;
  ScratchBlocks.Gesture.prototype.startDraggingBlock_ = function (...args) {
    this.shouldCherryPick =
      this.mostRecentEvent_ instanceof MouseEvent &&
      this.mostRecentEvent_.ctrlKey;
    if (this.shouldCherryPick && !this.shouldDuplicateOnDrag_) {
      this.targetBlock_.unplug(true);
    }
    return originalStartDraggingBlock.call(this, ...args);
  };

  const originalDuplicateOnDrag =
    ScratchBlocks.Gesture.prototype.duplicateOnDrag_;
  ScratchBlocks.Gesture.prototype.duplicateOnDrag_ = function () {
    originalDuplicateOnDrag.call(this);
    if (this.shouldCherryPick) {
      const nextBlock = this.targetBlock_.getNextBlock();
      if (nextBlock) {
        nextBlock.dispose();
      }
    }
  };
};
