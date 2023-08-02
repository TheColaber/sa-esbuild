import Dropdown from "./dropdown";
import styles from "../styles.module.css";

export default class FindBar {
  readonly workspace: ScratchBlocks.Workspace;
  readonly dropdown: Dropdown;
  readonly wrapper: HTMLDivElement;
  readonly dropdownOut: HTMLDivElement;
  readonly findInput: HTMLInputElement;
  private prevValue: string;
  constructor(workspace: ScratchBlocks.Workspace) {
    this.workspace = workspace;
    this.dropdown = new Dropdown(workspace);

    this.prevValue = "";

    const guiTabList = document.querySelector("ul[class*=gui_tab-list_]");

    this.wrapper = guiTabList.appendChild(document.createElement("div"));

    this.wrapper.className = styles.wrapper;
    addon.tab.displayNoneWhileDisabled(this.wrapper);

    this.dropdownOut = this.wrapper.appendChild(document.createElement("div"));
    this.dropdownOut.className = styles["dropdown-out"];

    this.findInput = this.dropdownOut.appendChild(
      document.createElement("input"),
    );
    this.findInput.className = addon.tab.scratchClass("input_input-form", {
      others: styles.input,
    });
    this.findInput.type = "search";
    this.findInput.placeholder = addon.msg("find-placeholder");
    this.findInput.autocomplete = "off";
    this.findInput.addEventListener("focus", () => this.inputChange());
    this.findInput.addEventListener("keydown", (e) => this.inputKeyDown(e));
    this.findInput.addEventListener("keyup", () => this.inputChange());
    this.findInput.addEventListener("focusout", () => this.hideDropDown());

    this.dropdownOut.appendChild(this.dropdown.createDom());

    // this.bindEvents();
    // this.tabChanged();
  }

  dispose() {
    this.wrapper.remove();
  }

  inputChange() {
    this.showDropDown();

    // Filter the list...
    let val = (this.findInput.value || "").toLowerCase();
    if (val === this.prevValue) {
      // No change so don't re-filter
      return;
    }
    this.prevValue = val;

    this.dropdown.inputChange();
  }

  inputKeyDown(e: KeyboardEvent) {}

  showDropDown(focusID?: string, instanceBlock?: any) {
    if (!focusID && this.dropdownOut.classList.contains(styles.visible)) {
      return;
    }

    // special '' vs null... - null forces a reevaluation
    this.prevValue = focusID ? "" : null; // Clear the previous value of the input search

    this.dropdownOut.classList.add(styles.visible);
    this.dropdown.show();
  }

  hideDropDown() {
    this.dropdownOut.classList.remove(styles.visible);
  }
}
