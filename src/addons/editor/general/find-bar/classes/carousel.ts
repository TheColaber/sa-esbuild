import { DropdownItem } from "./dropdown-item";
import styles from "../styles.module.css";

export default class Carousel {
  el: HTMLSpanElement;
  count: HTMLSpanElement;
  blocks: ScratchBlocks.BlockSvg[];
  idx: number;
  item: DropdownItem;
  constructor() {}

  build(item: DropdownItem, blocks: ScratchBlocks.BlockSvg[]) {
    this.item = item;
    if (this.el && this.el.parentElement === item.el) {
      // Same control... click again to go to next
      this.navigate(1, undefined);
    } else {
      this.remove();
      this.blocks = blocks;
      item.el.appendChild(this.createDom());

      this.idx = 0;
      // if (instanceBlock) {
      //   for (const idx of Object.keys(this.blocks)) {
      //     const block = this.blocks[idx];
      //     if (block.id === instanceBlock.id) {
      //       this.idx = Number(idx);
      //       break;
      //     }
      //   }
      // }

      this.navigate(0);
    }
  }

  createDom() {
    this.el = document.createElement("span");
    this.el.className = styles.carousel;

    const leftControl = this.el.appendChild(document.createElement("span"));
    leftControl.className = styles["carousel-control"];
    leftControl.textContent = "◀";
    leftControl.addEventListener("mousedown", (e) => this.navigate(-1, e));

    this.count = this.el.appendChild(document.createElement("span"));
    this.count.innerText =
      this.blocks.length > 0 ? this.idx + 1 + " / " + this.blocks.length : "0";

    const rightControl = this.el.appendChild(document.createElement("span"));
    rightControl.className = styles["carousel-control"];
    rightControl.textContent = "▶";
    rightControl.addEventListener("mousedown", (e) => this.navigate(1, e));

    return this.el;
  }

  navigate(dir: number, event?: MouseEvent) {
    if (this.blocks.length > 0) {
      this.idx = (this.idx + dir + this.blocks.length) % this.blocks.length; // + length to fix negative modulo js issue.
      this.count.innerText = this.idx + 1 + " / " + this.blocks.length;
      this.item.scrollBlockIntoView(this.blocks[this.idx]);
    }

    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  remove() {
    if (this.el) {
      this.el.remove();
      this.blocks = [];
      this.idx = 0;
    }
  }
}
