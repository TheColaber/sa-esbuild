export default async () => {
  const ScratchBlocks = await addon.tab.blocklyReady();
  const originalRender = ScratchBlocks.BlockSvg.prototype.render;
  ScratchBlocks.BlockSvg.prototype.render = function (opt_bubble) {
    // Any changes that affect block striping should bubble to the top block of the script.
    // The top block of the script is responsible for striping all of its children.
    // This way stripes are computed exactly once.
    if (!this.isInFlyout && !this.isShadow() && this.getParent() === null) {
      // Conveniently getDescendants() returns blocks in an order such that each block's
      // parent will always come before that block (except the first block which has no
      // parent).
      for (const block of this.getDescendants()) {
        const parent = block.getSurroundParent();
        block.striped = parent && !block.isShadow() && parent.getCategory() === block.getCategory() && (block.nextConnection || (block.outputShape_ > 0 && block.outputShape_ === parent.outputShape_)) && !parent.striped;
        if (!block.striped && block.orginalColour_) {
          block.setColour(block.orginalColour_);
          block.orginalColour_ = null;
        } else if (block.striped && !block.orginalColour_) {
          block.orginalColour_ = block.colour_;
          block.setColour(lighten(block.colour_, -20));          
        }
      }
    }
    return originalRender.call(this, opt_bubble);
  };
};

function lighten(color, amount) {
  return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}