import styles from "../styles.module.css";

export class DropdownItem {
  category: string;
  name: string;
  id: string;
  y: number;
  clones: string[];
  eventName?: string;
  el: HTMLLIElement;
  selected: boolean;
  constructor(category, name, id, y, color) {
    this.category = category;
    this.name = name;
    this.id = id;
    this.y = y;
    this.clones = [];
    this.selected = false;

    this.el = document.createElement("li");
    this.el.innerText = this.name;
    this.el.classList.add(styles.item);
    this.el.style.setProperty("--color-primary", color);
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
}
