export default async () => {
  const ScratchBlocks = await addon.tab.blocklyReady();

  const originalStartDraggingBlock =
    ScratchBlocks.Gesture.prototype.startDraggingBlock_;
  ScratchBlocks.Gesture.prototype.startDraggingBlock_ = function (...args) {
    if (
      this.mostRecentEvent_ instanceof MouseEvent &&
      this.mostRecentEvent_.ctrlKey
    ) {
      this.targetBlock_.unplug(true);
    }
    return originalStartDraggingBlock.call(this, ...args);
  };
};
