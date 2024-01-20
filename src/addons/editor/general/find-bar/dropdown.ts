import { DropdownItem } from "./dropdown-item";
import styles from "./styles.module.css";
import Carousel from "./carousel";

const Blockly = await addon.tab.getBlockly();

export default class Dropdown {
  workspace: ScratchBlocks.WorkspaceSvg;
  el: HTMLUListElement;
  items: DropdownItem[];
  carousel: Carousel;
  colors: any;
  constructor(workspace: ScratchBlocks.WorkspaceSvg) {
    this.workspace = workspace;
    this.items = [];
    this.carousel = new Carousel();
    this.colors = Blockly.Colours;
  }

  get selectedTab() {
    return addon.tab.redux.state.scratchGui.editorTab.activeTabIndex;
  }

  selectItem(item: DropdownItem) {
    for (const name in this.items) {
      this.items[name].unselect();
    }
    item.select();
    if (item.category === "costume" || item.category === "sound") {
      // Viewing costumes/sounds - jump to selected costume/sound
      const assetPanel = document.querySelector("[class^=asset-panel_wrapper]");
      if (assetPanel) {
        const reactInstance: any =
          assetPanel[addon.tab.getInternalKey(assetPanel)];
        const reactProps = reactInstance.pendingProps.children[0].props;
        reactProps.onItemClick(item.y);
        const selectorList = assetPanel.firstElementChild.firstElementChild;
        selectorList.children[item.y].scrollIntoView({
          behavior: "auto",
          block: "center",
          inline: "start",
        });
        // The wrapper seems to scroll when we use the function above.
        let wrapper = assetPanel.closest("div[class*=gui_flex-wrapper]");
        wrapper.scrollTop = 0;
      }
    } else if (
      item.category === "var" ||
      item.category === "VAR" ||
      item.category === "list" ||
      item.category === "LIST"
    ) {
      const uses = this.workspace
        .getTopBlocks()
        .flatMap((topBlock) =>
          topBlock
            .getDescendants()
            .filter((block) =>
              block
                .getVarModels()
                .some((blockVar) => blockVar.getId() === item.id),
            ),
        );

      this.carousel.build(item, uses);
    } else if (item.category === "define") {
      let procBlock = this.workspace.getBlockById(item.id);
      let procCode = procBlock.getChildren()[0].getProcCode();

      const uses = this.workspace
        .getTopBlocks()
        .flatMap((topBlock) =>
          topBlock
            .getDescendants()
            .filter(
              (block) =>
                block.type === "procedures_call" &&
                block.getProcCode() === procCode,
            ),
        );
      uses.unshift(procBlock);

      this.carousel.build(item, uses);
    } else if (item.category === "receive") {
      // /*
      //   let blocks = [this.workspace.getBlockById(li.data.labelID)];
      //   if (li.data.clones) {
      //       for (const cloneID of li.data.clones) {
      //           blocks.push(this.workspace.getBlockById(cloneID))
      //       }
      //   }
      //   blocks = blocks.concat(getCallsToEventsByName(li.data.eventName));
      // */
      // // Now, fetch the events from the scratch runtime instead of blockly
      // let uses = []; // Definition First, then calls to it
      // const runtime = addon.tab.traps.vm.runtime;
      // const targets = runtime.targets; // The sprites / stage
      // for (const target of targets) {
      //   if (!target.isOriginal) {
      //     continue; // Skip clones
      //   }
      //   const blocks = target.blocks;
      //   if (!blocks._blocks) {
      //     continue;
      //   }
      //   for (const id of Object.keys(blocks._blocks)) {
      //     const block = blocks._blocks[id];
      //     if (block.opcode === "event_whenbroadcastreceived" && block.fields.BROADCAST_OPTION.value === name) {
      //       uses.push(new BlockInstance(target, block));
      //     } else if (block.opcode === "event_broadcast" || block.opcode === "event_broadcastandwait") {
      //       const broadcastInputBlockId = block.inputs.BROADCAST_INPUT.block;
      //       const broadcastInputBlock = blocks._blocks[broadcastInputBlockId];
      //       if (broadcastInputBlock) {
      //         let eventName;
      //         if (broadcastInputBlock.opcode === "event_broadcast_menu") {
      //           eventName = broadcastInputBlock.fields.BROADCAST_OPTION.value;
      //         } else {
      //           eventName = msg("complex-broadcast");
      //         }
      //         if (eventName === name) {
      //           uses.push(new BlockInstance(target, block));
      //         }
      //       }
      //     }
      //   }
      // }
      // if (!instanceBlock) {
      //   // Can we start by selecting the first block on 'this' sprite
      //   const currentTargetID = this.utils.getEditingTarget().id;
      //   for (const block of blocks) {
      //     if (block.targetId === currentTargetID) {
      //       instanceBlock = block;
      //       break;
      //     }
      //   }
      // }
      // this.carousel.build(myBlocks[name], blocks, instanceBlock);
    } else if (item.clones.length > 0) {
      let blocks = [this.workspace.getBlockById(item.id)];
      for (const cloneID of item.clones) {
        blocks.push(this.workspace.getBlockById(cloneID));
      }
      this.carousel.build(item, blocks);
    } else {
      item.scrollBlockIntoView();
      this.carousel.remove();
    }
  }

  getCallsToEvents() {
    const events: { [name: string]: ScratchBlocks.Block } = {};

    for (const block of this.workspace.getAllBlocks()) {
      if (
        block.type !== "event_broadcast" &&
        block.type !== "event_broadcastandwait"
      ) {
        continue;
      }

      const broadcastInput = block.getChildren()[0];
      if (!broadcastInput) {
        continue;
      }

      let eventName = "";
      if (broadcastInput.type === "event_broadcast_menu") {
        eventName = broadcastInput.inputList[0].fieldRow[0].getText();
      } else {
        eventName = addon.msg("complex-broadcast");
      }
      if (!(eventName in events)) {
        events[eventName] = block;
      }
    }

    return events;
  }

  inputChange() {
    // this.dropdown.blocks = null;
    // // Hide items in list that do not contain filter text
    // let listLI = this.dropdown.items;
    // for (const li of listLI) {
    //   let procCode = li.data.procCode;
    //   let i = li.data.lower.indexOf(val);
    //   if (i >= 0) {
    //     li.style.display = "block";
    //     while (li.firstChild) {
    //       li.removeChild(li.firstChild);
    //     }
    //     if (i > 0) {
    //       li.appendChild(document.createTextNode(procCode.substring(0, i)));
    //     }
    //     let bText = document.createElement("b");
    //     bText.appendChild(document.createTextNode(procCode.substr(i, val.length)));
    //     li.appendChild(bText);
    //     if (i + val.length < procCode.length) {
    //       li.appendChild(document.createTextNode(procCode.substr(i + val.length)));
    //     }
    //   } else {
    //     li.style.display = "none";
    //   }
    // }
  }

  inputKeyDown(e: KeyboardEvent) {
    if (e.key === "ArrowUp") {
      this.navigate(-1);
      e.preventDefault();
      return;
    }

    if (e.key === "ArrowDown") {
      this.navigate(1);
      e.preventDefault();
      return;
    }

    if (e.key === "Enter") {
      // Any selected on enter? if not select now
      if (!this.items.some((item) => item.selected)) {
        this.navigate(1);
      }
      e.preventDefault();
      return;
    }

    this.carousel.inputKeyDown(e);
  }

  navigate(dir: number) {
    const selectedIndex = this.items.findIndex((item) => item.selected);
    this.selectItem(this.items[selectedIndex + dir]);
  }
}
