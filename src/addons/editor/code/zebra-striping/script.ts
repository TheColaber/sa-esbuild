export default async () => {
  // const vm = await addon.tab.vmReady();
  // const ScratchBlocks = await addon.tab.blocklyReady();
  // const originalRender = ScratchBlocks.BlockSvg.prototype.render;
  // ScratchBlocks.BlockSvg.prototype.render = function (opt_bubble) {
  //   // Any changes that affect block striping should bubble to the top block of the script.
  //   // The top block of the script is responsible for striping all of its children.
  //   // This way stripes are computed exactly once.
  //   if (!this.isInFlyout && !this.isShadow() && this.getParent() === null) {
  //     // Conveniently getDescendants() returns blocks in an order such that each block's
  //     // parent will always come before that block (except the first block which has no
  //     // parent).
  //     for (const block of this.getDescendants()) {
  //       const parent = block.getSurroundParent();
  //       let isStriped = false;
  //       if (parent) {
  //         if (block.isShadow()) {
  //           isStriped = parent.striped;
  //         } else if (parent.getCategory() === block.getCategory()) {
  //           isStriped = !parent.striped;
  //         }
  //       }
  //       block.striped = isStriped;
  //       block.renderedStripe = false;
  //       block.stripe()
  //     }
  //   }
  //   return originalRender.call(this, opt_bubble);
  // };
  // ScratchBlocks.BlockSvg.prototype.stripe = function () {
  //   const elements = [this.svgPath_];
  //   for (const input of this.inputList) {
  //     if (input.outlinePath) {
  //       elements.push(input.outlinePath);
  //     }
  //     for (const field of input.fieldRow) {
  //       if (field.fieldGroup_) {
  //         elements.push(field.fieldGroup_);
  //       }
  //     }
  //   }
  //   for (const el of elements) {
  //     if (!this.striped && this.renderedStripe) {
  //       el.removeAttribute("filter");
  //     } else if (this.striped && !this.renderedStripe) {
  //       // let filter = (el.getAttribute("filter") || "") + " brightness(0.5)";
  //       el.setAttribute("filter", "brightness(0.5)");
  //       }
  //   }
  //   this.renderedStripe = this.striped;
  // }
  // if (vm.editingTarget) {
  //   vm.emitWorkspaceUpdate();
  // }
};
