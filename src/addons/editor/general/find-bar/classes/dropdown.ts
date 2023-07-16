import { DropdownItem } from "./dropdown-item";
import styles from "../styles.module.css";
import Carousel from "./carousel";
import { ScratchBlocks } from "../../../../../../esbuild/types/blockly";
export default class Dropdown {
  workspace: ScratchBlocks.Workspace;
  el: HTMLUListElement;
  items: DropdownItem[];
  carousel: Carousel;
  colors: any;
  constructor(
    workspace: ScratchBlocks.Workspace,
  ) {
    this.workspace = workspace;
    this.items = [];
    this.carousel = new Carousel();

    // TODO: I don't think I really like this that much
    addon.tab.getBlockly().then((Blockly) => {
      this.colors = Blockly.Colours;
    });
  }

  createDom() {
    this.el = document.createElement("ul");
    this.el.className = styles.dropdown;
    return this.el;
  }

  get selectedTab() {
    return addon.tab.redux.state.scratchGui.editorTab.activeTabIndex;
  }

  show() {
    for (const item of this.items) {
      if (this.el.contains(item.el)) {
        this.el.removeChild(item.el);
      }
    }

    this.items = this.selectedTab === 0 ? this.getScratchBlocks() : []; // this.selectedTab === 1
    // ? this.getScratchCostumes()
    // : this.selectedTab === 2
    // ? this.getScratchSounds()
    // : [];

    for (const item of this.items) {
      this.el.appendChild(item.el);
    }
    // for (const proc of scratchBlocks) {
    //   let item = this.dropdown.addItem(proc);

    //   if (focusID) {
    //     if (proc.matchesID(focusID)) {
    //       this.dropdown.onItemClick(item, instanceBlock);
    //     } else {
    //       item.style.display = "none";
    //     }
    //   }
    // }

    // this.utils.offsetX = this.dropdownOut.getBoundingClientRect().width + 32;
    // this.utils.offsetY = 32;
  }
  getScratchBlocks() {
    let myBlocks: { [id: string]: DropdownItem } = {};

    let topBlocks = this.workspace.getTopBlocks();

    this.el.style.setProperty("--text-color", this.colors.text);
    const addBlock = (
      category: string,
      name: string,
      id: string,
      y: number
    ) => {
      if (myBlocks[name]) {
        myBlocks[name].clones.push(id);
      } else {
        const colorIds = {
          flag: "flag",
          receive: "event",
          event: "event",
          control: "control",
          define: "more",
          var: "data",
          VAR: "data",
          list: "data_lists",
          LIST: "data_lists",
          costume: "looks",
          sound: "sounds",
        };
        let color: string;
        if (category === "flag") {
          color = "#4cbf56";
        } else {
          color = this.colors[colorIds[category]].primary;
        }
        myBlocks[name] = new DropdownItem(category, name, id, y, color);
        myBlocks[name].el.addEventListener("mousedown", (e) => {
          for (const name in myBlocks) {
            myBlocks[name].unselect();
          }
          this.carousel.remove();
          myBlocks[name].select();
          if (category === "costume" || category === "sound") {
            // Viewing costumes/sounds - jump to selected costume/sound
            const assetPanel = document.querySelector(
              "[class^=asset-panel_wrapper]"
            );
            if (assetPanel) {
              const reactInstance: any =
                assetPanel[addon.tab.getInternalKey(assetPanel)];
              const reactProps = reactInstance.pendingProps.children[0].props;
              reactProps.onItemClick(y);
              const selectorList =
                assetPanel.firstElementChild.firstElementChild;
              selectorList.children[y].scrollIntoView({
                behavior: "auto",
                block: "center",
                inline: "start",
              });
              // The wrapper seems to scroll when we use the function above.
              let wrapper = assetPanel.closest("div[class*=gui_flex-wrapper]");
              wrapper.scrollTop = 0;
            }
          } else if (
            category === "var" ||
            category === "VAR" ||
            category === "list" ||
            category === "LIST"
          ) {
            // Search now for all instances
            let uses: ScratchBlocks.Block[] = [];

            let topBlocks = this.workspace.getTopBlocks();
            for (const topBlock of topBlocks) {
              let kids = topBlock.getDescendants();
              for (const block of kids) {
                let blockVariables = block.getVarModels();
                if (blockVariables) {
                  for (const blockVar of blockVariables) {
                    if (blockVar.getId() === id) {
                      uses.push(block);
                    }
                  }
                }
              }
            }
            this.carousel.build(myBlocks[name], uses);
          } else if (category === "define") {
            let procBlock = this.workspace.getBlockById(id);
            let label = procBlock.getChildren()[0];
            let procCode = label.getProcCode();

            let uses: ScratchBlocks.Block[] = [procBlock]; // Definition First, then calls to it
            let topBlocks = this.workspace.getTopBlocks();
            for (const topBlock of topBlocks) {
              /** @type {!Array<!Blockly.Block>} */
              let kids = topBlock.getDescendants();
              for (const block of kids) {
                if (block.type === "procedures_call") {
                  if (block.getProcCode() === procCode) {
                    uses.push(block);
                  }
                }
              }
            }
            this.carousel.build(myBlocks[name], uses);
          } else if (category === "receive") {
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
          } else if (myBlocks[name].clones) {
            let blocks = [this.workspace.getBlockById(myBlocks[name].id)];
            for (const cloneID of myBlocks[name].clones) {
              blocks.push(this.workspace.getBlockById(cloneID));
            }
            this.carousel.build(myBlocks[name], blocks);
          } else {
            // this.utils.scrollBlockIntoView(myBlocks[name].id);
            this.carousel.remove();
          }
          e.preventDefault();
          return false;
        });
      }
      return myBlocks[name];
    };

    function getDescFromField(root) {
      let fields = root.inputList[0];
      let desc;
      for (const fieldRow of fields.fieldRow) {
        desc = (desc ? desc + " " : "") + fieldRow.getText();
      }
      return desc;
    }

    for (const block of topBlocks) {
      const { id } = block;
      const { y } = block.getRelativeToSurfaceXY();
      if (block.type === "procedures_definition") {
        const label = block.getChildren()[0];
        const procCode = label.getProcCode();
        if (!procCode) {
          continue;
        }
        const indexOfLabel = block.inputList.findIndex(
          (i) => i.fieldRow.length > 0
        );
        if (indexOfLabel === -1) {
          continue;
        }
        const translatedDefine =
          block.inputList[indexOfLabel].fieldRow[0].getText();
        const message =
          indexOfLabel === 0
            ? `${translatedDefine} ${procCode}`
            : `${procCode} ${translatedDefine}`;
        addBlock("define", message, id, y);
        continue;
      }

      if (block.type === "event_whenflagclicked") {
        addBlock("flag", getDescFromField(block), id, y); // "When Flag Clicked"
        continue;
      }

      if (block.type === "event_whenbroadcastreceived") {
        const fieldRow = block.inputList[0].fieldRow;
        let eventName = fieldRow
          .find((input) => input.name === "BROADCAST_OPTION")
          .getText();
        addBlock(
          "receive",
          addon.msg("event", { name: eventName }),
          id,
          y
        ).eventName = eventName;

        continue;
      }

      if (block.type.substring(0, 10) === "event_when") {
        addBlock("event", getDescFromField(block), id, y);
        continue;
      }

      if (block.type === "control_start_as_clone") {
        addBlock("control", getDescFromField(block), id, y); // "when I start as a clone"
        continue;
      }
    }

    let map = this.workspace.getVariableMap();

    let vars = map.getVariablesOfType("");
    for (const row of vars) {
      addBlock(
        row.isLocal ? "var" : "VAR",
        row.isLocal
          ? addon.msg("var-local", { name: row.name })
          : addon.msg("var-global", { name: row.name }),
        row.getId(),
        null
      );
    }

    let lists = map.getVariablesOfType("list");
    for (const row of lists) {
      addBlock(
        row.isLocal ? "list" : "LIST",
        row.isLocal
          ? addon.msg("list-local", { name: row.name })
          : addon.msg("list-global", { name: row.name }),
        row.getId(),
        null
      );
    }

    const events = this.getCallsToEvents();
    for (const event in events) {
      const block = events[event];
      addBlock(
        "receive",
        addon.msg("event", { name: event }),
        block.id,
        block.getRelativeToSurfaceXY().y
      ).eventName = event;
    }

    const clsOrder = [
      "flag",
      "receive",
      "event",
      "control",
      "define",
      "var",
      "VAR",
      "list",
      "LIST",
    ];
    // Sort by the following: Using the above
    return Object.values(myBlocks).sort((a, b) => {
      let orderDiff =
        clsOrder.indexOf(a.category) - clsOrder.indexOf(b.category);
      if (orderDiff !== 0) {
        return orderDiff;
      }
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      }
      return a.y - b.y;
    });
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
}
