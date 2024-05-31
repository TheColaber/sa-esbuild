export default async () => {
  const Blockly = await addon.tab.blocklyReady();

  let glowBlock = null;
  let glowInterval = null;
  const _doBlockClick_ = Blockly.Gesture.prototype.doBlockClick_;
  Blockly.Gesture.prototype.doBlockClick_ = function () {
    if (
      addon.enabled &&
      (this.mostRecentEvent_.button === 1 || this.mostRecentEvent_.shiftKey)
    ) {
      for (
        let block = this.startBlock_;
        block;
        block = block.getSurroundParent()
      ) {
        if (block.type !== "procedures_call") continue;
        let findProcCode = block.getProcCode();
        const workspace = this.creatorWorkspace_;
        let topBlocks = this.creatorWorkspace_.getTopBlocks();
        for (const topBlock of topBlocks) {
          if (topBlock.type === "procedures_definition") {
            let label = topBlock.getChildren()[0];
            let procCode = label.getProcCode();
            if (procCode && procCode === findProcCode) {
              // Found... navigate to it!
              goToBlock(topBlock);
              function goToBlock(rootBlock: any) {
                // The quaternary color is the darkest shade of the block, so set the shadow color to it
                // which is what the glowBlock function uses to change the color of the block.
                rootBlock.setShadowColour(rootBlock.getColourQuaternary());

                // If the user spam presses, lets make sure the glowing doesn't spam itself to death.
                if (glowBlock) {
                  clearInterval(glowInterval);
                  workspace.glowBlock(glowBlock, false);
                }

                // Calculate the positions and dimensions of the blocks
                const { x } = rootBlock.getRelativeToSurfaceXY(); // Align with the left of the block 'stack'
                const { y } = rootBlock.getRelativeToSurfaceXY(); // Align with the top of the block
                const { scale } = workspace;
                const leftX = x * scale;
                const topY = y * scale;
                const { height: blockHeight } = rootBlock;
                const bottomY = topY + blockHeight;

                // Get the viewport metrics
                const viewportMetrics = workspace.getMetrics();
                const {
                  viewLeft,
                  viewTop,
                  viewHeight,
                  contentLeft,
                  contentTop,
                } = viewportMetrics;
                const padding = 30; // Consistant with scratch when making new custom blocks.

                // Check if either the current block is not in the right x position or is outside the viewport
                if (
                  Math.round(leftX) !== Math.round(viewLeft + padding) ||
                  topY < viewTop - padding ||
                  bottomY > viewTop + viewHeight
                ) {
                  // TODO: RTL ;(
                  const scrollX = leftX - contentLeft - padding;
                  const scrollY = topY - contentTop - padding;
                  workspace.scrollbar.set(scrollX, scrollY);
                }
                Blockly.hideChaff();
                let glow = true;
                let count = 4;
                glowInterval = setInterval(() => {
                  glowBlock = rootBlock.id;
                  workspace.glowBlock(rootBlock.id, glow);
                  count--;
                  glow = !glow;
                  if (count === 0) clearInterval(glowInterval);
                }, 200);
              }
              return;
            }
          }
        }
      }
    }

    _doBlockClick_.call(this);
  };
};
