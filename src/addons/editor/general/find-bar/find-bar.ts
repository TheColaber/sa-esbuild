import Dropdown from "./dropdown";
import styles from "./styles.module.css";
import { createApp } from "vue";
import component from "./find-bar.vue";

const Blockly = await addon.tab.getBlockly();
export default class FindBar {
  readonly workspace: ScratchBlocks.WorkspaceSvg;
  readonly dropdown: Dropdown;
  readonly wrapper: HTMLDivElement;
  readonly dropdownOut: HTMLDivElement;
  readonly findInput: HTMLInputElement;
  readonly selectedDisplay: HTMLDivElement;
  private prevValue: string = "";
  constructor(workspace: ScratchBlocks.WorkspaceSvg) {
    this.workspace = workspace;
    this.dropdown = new Dropdown(workspace);

    const guiTabList = document.querySelector("ul[class*=gui_tab-list_]");

    const fragment = document.createElement("div");

    createApp(component, { addon }).mount(fragment);
  
    guiTabList.append(fragment);
    // TODO: kinda hacky but will have to do for now.
    guiTabList.replaceChild(fragment.firstChild, fragment);

    // this.findInput.type = "search";
    // this.findInput.placeholder = addon.msg("find-placeholder");
    // this.findInput.autocomplete = "off";
    // this.findInput.addEventListener("focus", () => this.inputChange());
    // this.findInput.addEventListener("keydown", (e) => this.inputKeyDown(e));
    // this.findInput.addEventListener("keyup", () => this.inputChange());
    // this.findInput.addEventListener("focusout", () => this.hideDropDown());


    // this.selectedDisplay = this.dropdownOut.appendChild(
    //   document.createElement("div"),
    // );
    // this.selectedDisplay.className = styles["selected-display"];

    const _doBlockClick_ = Blockly.Gesture.prototype.doBlockClick_;
    Blockly.Gesture.prototype.doBlockClick_ = function () {
      const findBar = this.creatorWorkspace_.findBar;
      const searchableBlocks = [
        "procedures_definition",
        "procedures_call",
        "data_variable",
        "data_changevariableby",
        "data_setvariableto",
        "event_whenbroadcastreceived",
        "event_broadcastandwait",
        "event_broadcast",
      ];

      if (
        addon.enabled &&
        (this.mostRecentEvent_.button === 1 || this.mostRecentEvent_.shiftKey)
      ) {
        // Wheel button or shift-click.
        for (
          let block = this.startBlock_;
          block;
          block = block.getSurroundParent()
        ) {
          if (searchableBlocks.includes(block.type)) {
            findBar.findInput.focus();
            findBar.showDropDown(block);

            return;
          }
        }
      }

      _doBlockClick_.call(this);
    };
  }

  dispose() {
    this.wrapper.remove();
  }

  showDropDown(showBlock?: ScratchBlocks.BlockSvg) {
    if (!showBlock && this.dropdownOut.classList.contains(styles.visible)) {
      return;
    }

    // TODO: should we use "" or null here?
    this.prevValue = null;

    this.dropdownOut.classList.add(styles.visible);
    this.dropdown.show(showBlock);
  }

  hideDropDown() {
    this.dropdownOut.classList.remove(styles.visible);
  }

  inputChange() {
    this.showDropDown();

    let val = this.findInput.value.toLowerCase();
    if (val === this.prevValue) {
      // No change so don't re-filter
      return;
    }
    this.prevValue = val;

    this.dropdown.inputChange();
  }

  inputKeyDown(e: KeyboardEvent) {
    this.dropdown.inputKeyDown(e);

    if (e.key === "Escape") {
      // If there's any value in the input, clear it, otherwise exit
      if (this.findInput.value.length > 0) {
        this.findInput.value = "";
        this.inputChange();
      } else {
        this.findInput.blur();
      }
      e.preventDefault();
    }
  }
}
