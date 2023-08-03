import styles from "../styles.module.css";

export class DropdownItem {
  workspace: ScratchBlocks.WorkspaceSvg;
  category: string;
  name: string;
  id: string;
  y: number;
  clones: string[];
  eventName?: string;
  el: HTMLLIElement;
  selected: boolean;
  glowInterval: number;
  glowBlock: string;
  constructor(
    workspace: ScratchBlocks.WorkspaceSvg,
    category: string,
    name: string,
    id: string,
    y: number,
    color: string,
  ) {
    this.workspace = workspace;
    this.category = category;
    this.name = name;
    this.id = id;
    this.y = y;
    this.clones = [];
    this.selected = false;

    this.el = document.createElement("li");
    this.el.className = styles.item;
    this.el.style.setProperty("--color-primary", color);

    let text = this.el.appendChild(document.createElement("span"));
    text.innerText = this.name;
    text.className = styles["item-text"];
  }

  unselect() {
    if (this.selected) {
      this.el.classList.remove(styles.selected);
      this.selected = false;
    }
  }

  select() {
    if (!this.selected) {
      this.el.classList.add(styles.selected);
      this.selected = true;
    }
  }

  scrollBlockIntoView(block?: ScratchBlocks.BlockSvg) {
    // Get the current block and its root block
    const currentBlock = block || this.workspace.getBlockById(this.id);
    // The quaternary color is the darkest shade of the block, so set the shadow color to it
    // which is what the glowBlock function uses to change the color of the block.
    currentBlock.setShadowColour(currentBlock.getColourQuaternary());
    const rootBlock = currentBlock.getRootBlock();

    // If the user spam presses, lets make sure the glowing doesn't spam itself to death.
    if (this.glowBlock) {
      clearInterval(this.glowInterval);
      this.workspace.glowBlock(this.glowBlock, false);
    }

    // Traverse up the block's stack until the topmost block is reached
    let topmostBlock = currentBlock;
    while (topmostBlock.getOutputShape() && topmostBlock.getSurroundParent()) {
      topmostBlock = topmostBlock.getSurroundParent();
    }

    // Calculate the positions and dimensions of the blocks
    const { x } = rootBlock.getRelativeToSurfaceXY(); // Align with the left of the block 'stack'
    const { y } = topmostBlock.getRelativeToSurfaceXY(); // Align with the top of the block
    const { scale } = this.workspace;
    const leftX = x * scale;
    const topY = y * scale;
    const { height: blockHeight } = currentBlock;
    const bottomY = topY + blockHeight;

    // Get the viewport metrics
    const viewportMetrics = this.workspace.getMetrics();
    const { viewLeft, viewTop, viewHeight, contentLeft, contentTop } =
      viewportMetrics;
    const padding = 30; // Consistant with scratch when making new custom blocks.

    // Check if either the current block is not in the right x psoition or is outside the viewport
    if (
      Math.round(leftX) !== Math.round(viewLeft + padding) ||
      topY < viewTop - padding ||
      bottomY > viewTop + viewHeight
    ) {
      const scrollX = leftX - contentLeft - padding;
      const scrollY = topY - contentTop - padding;
      this.workspace.scrollbar.set(scrollX, scrollY);
    }
    // this.blockly?.hideChaff();
    let glow = true;
    let count = 4;
    this.glowInterval = setInterval(() => {
      this.glowBlock = currentBlock.id;
      this.workspace.glowBlock(currentBlock.id, glow);
      count--;
      glow = !glow;
      if (count === 0) clearInterval(this.glowInterval);
    }, 200);
  }
}
