<template>
  <div :class="$style.wrapper" ref="wrapper">
    <div
      :class="[$style['dropdown-out'], { [$style.visible]: visible }]"
      :style="{ '--text-color': textColor }"
    >
      <input
        :class="[$style.input, addon.tab.scratchClass('input_input-form')]"
        type="search"
        :placeholder="addon.msg('find-placeholder')"
        autocomplete="off"
        ref="findInput"
        v-model="input"
        @focus="showDropDown(), inputChange()"
        @focusout="visible = false"
        @keydown="inputKeyDown"
        @keyup="inputChange"
        v-show="visible || !selected"
      />
      <div
        v-show="!visible && selected"
        @click="showDropDown(), inputChange()"
        :class="$style['selected-display']"
        :style="{ '--color-primary': selected?.color }"
      >
        <span :class="$style['item-text']">{{ selected?.name }}</span>
        <!-- <span :class="$style.carousel">
            <span :class="$style['carousel-control']">◀</span>
            <span>1 / 2</span>
            <span :class="$style['carousel-control']">▶</span>
          </span> -->
      </div>
      <div :class="$style.dropdown" @mousedown.prevent>
        <div
          :class="[$style.item, { [$style.selected]: selected === item }]"
          v-for="(item, name) of items"
          :style="{ '--color-primary': item.color }"
          @mousedown="selected = item"
        >
          <span :class="$style['item-text']">{{ item.name }}</span>
          <span :class="$style.carousel">
            <span :class="$style['carousel-control']">◀</span>
            <span>1 / {{ item.ids.length }}</span>
            <span :class="$style['carousel-control']">▶</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import PopupAddon from "../../../../addon-api/userscript";
const { addon, workspace } = defineProps<{
  addon: PopupAddon;
  workspace: ScratchBlocks.WorkspaceSvg;
}>();

const visible = ref(false);
const input = ref("");
let prevValue = "";
const items = ref([]);
const textColor = ref("");
const selected = ref();

const wrapper = ref<HTMLDivElement>();
const findInput = ref<HTMLInputElement>();
onMounted(() => {
  addon.tab.displayNoneWhileDisabled(wrapper.value);
});

async function showDropDown(showBlock?: ScratchBlocks.BlockSvg) {
  // TODO: not ideal.
  const Blockly = await addon.tab.getBlockly();

  if (!showBlock && visible.value) {
    return;
  }
  visible.value = true;
  setTimeout(() => findInput.value.focus());
  // setting null forces the results to rerender.
  prevValue = null;

  const selectedTab = addon.tab.redux.state.scratchGui.editorTab.activeTabIndex;
  items.value = selectedTab === 0 ? getScratchBlocks() : []; // selectedTab === 1
  // ? this.getScratchCostumes()
  // : selectedTab === 2
  // ? this.getScratchSounds()
  // : [];

  selected.value =
    showBlock &&
    items.value.find(
      (item) =>
        item.id === showBlock.id &&
        item.clones.find((id) => id === showBlock.id),
    );
  // for (const item of items.value) {
  //   if (
  //     showBlock &&
  //     item.id === showBlock.id &&
  //     item.clones.find((id) => id === showBlock.id)
  //   ) {
  //     this.selectItem(item);
  //   }
  // }

  function getScratchBlocks() {
    textColor.value = Blockly.Colours.text;

    function getBlockName(block, reporters = false) {
      let name = block.inputList[0].fieldRow.map((row) => row.getText());
      let child = block.getChildren()[0];
      if (child && child.isShadow()) {
        let shape = child.getOutputShape();
        if (shape === 2)
          name.push(
            "(" + (reporters ? getBlockName(child, reporters) : "") + ")",
          );
        else name.push(getBlockName(child, reporters));
      }
      return name.join(" ");
    }
    const addBlock = (block: ScratchBlocks.Block, name?: string) => {
      const isWhenFlagClicked = block.type === "event_whenflagclicked";
      const color = isWhenFlagClicked ? "#4cbf56" : block.getColour();
      const { y } = block.getRelativeToSurfaceXY();
      name = name || getBlockName(block);
      const category = isWhenFlagClicked ? "flag" : block.getCategory();

      myBlocks[name] = myBlocks[name] || {
        category,
        y,
        color,
        ids: [],
      };
      myBlocks[name].ids.push(block.id);

      return myBlocks[name];
    };
    const myBlocks = {} as Record<
      string,
      {
        category: string;
        y: number;
        color: string;
        ids: string[];
      }
    >;
    const blocks = workspace.getAllBlocks();
    for (const block of blocks) {
      const isEventBlock =
        block.getCategory() === "events" && !block.isShadow();
      const isCustomBlock =
        block.type === "procedures_definition" ||
        block.type === "procedures_call";

      if (
        isEventBlock ||
        isCustomBlock ||
        block.type === "control_start_as_clone"
      ) {
        if (
          [
            "event_whenbroadcastreceived",
            "event_broadcast",
            "event_broadcastandwait",
          ].includes(block.type)
        ) {
          const fieldRow = block.inputList[0].fieldRow;

          let event = fieldRow.find(
            (input) => input.name === "BROADCAST_OPTION",
          );
          if (!event) {
            const childRow = block.getChildren()[0].inputList[0].fieldRow;
            event = childRow.find((input) => input.name === "BROADCAST_OPTION");
          }

          addBlock(block, "event " + event.getText());
        } else if (block.type === "procedures_call") {
          let childProc = block.getProcCode();

          for (const b of blocks) {
            if (b.type === "procedures_definition") {
              let label = b.getChildren()[0];
              if (label.getProcCode() === childProc) {
                addBlock(block, getBlockName(b));
              }
            }
          }
        } else {
          addBlock(block);
        }
      }
    }

    // let map = workspace.getVariableMap();

    // let vars = map.getVariablesOfType("");
    // for (const row of vars) {
    //   addBlock(
    //     row.isLocal ? "var" : "VAR",
    //     row.isLocal
    //       ? addon.msg("var-local", { name: row.name })
    //       : addon.msg("var-global", { name: row.name }),
    //     row.getId(),
    //     null,
    //   );
    // }

    // let lists = map.getVariablesOfType("list");
    // for (const row of lists) {
    //   addBlock(
    //     row.isLocal ? "list" : "LIST",
    //     row.isLocal
    //       ? addon.msg("list-local", { name: row.name })
    //       : addon.msg("list-global", { name: row.name }),
    //     row.getId(),
    //     null,
    //   );
    // }

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
    return Object.entries(myBlocks)
      .map(([name, block]) => ({ name, ...block }))
      .sort((a, b) => {
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
}

function inputChange() {
  let val = input.value.toLowerCase();
  if (val !== prevValue) {
    prevValue = val;
    // this.dropdown.inputChange();
  }
}

function inputKeyDown(e: KeyboardEvent) {
  // this.dropdown.inputKeyDown(e);

  if (e.key === "Escape") {
    // If there's any value in the input, clear it, otherwise exit
    if (input.value.length > 0) {
      input.value = "";
      inputChange();
    } else {
      findInput.value.blur();
    }
    e.preventDefault();
  }
}
(async () => {
  const Blockly = await addon.tab.getBlockly();
  const _doBlockClick_ = Blockly.Gesture.prototype.doBlockClick_;
  Blockly.Gesture.prototype.doBlockClick_ = function () {
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
          findInput.value.focus();
          showDropDown(block);
          return;
        }
      }
    }

    _doBlockClick_.call(this);
  };
})();
</script>

<style lang="scss" module>
.wrapper {
  height: 2rem;
  width: 100%;
  z-index: 100;
  margin-left: 1em;
  margin-bottom: 6px;

  .dropdown-out {
    width: 16em;
    display: flex;
    flex-direction: column;
    font-size: 0.75rem;
    padding: 4px;
    border-radius: 4px;
    float: right;

    &.visible {
      box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.3);
      background-color: white;
      .dropdown {
        display: flex;
        flex-direction: column;
      }
    }
    .input {
      height: 1.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      padding-left: 0.4em;

      &:focus {
        box-shadow: none;
      }
    }

    .selected-display {
      display: flex;
      padding: 6px;
      white-space: nowrap;
      margin: 0;
      font-weight: bold;
      cursor: pointer;
      color: var(--text-color);
      background-color: var(--color-primary);
      border-radius: 0.25rem;
      height: 1.5rem;
      align-items: center;
      .item-text {
        overflow: hidden;
      }
    }
    .dropdown {
      display: none;
      padding: 0.2em 0;
      line-height: 1;
      overflow-y: auto;
      min-height: 128px;
      max-height: 65vh;
      user-select: none;
      margin-top: 6px;
      .item {
        display: flex;
        padding: 6px;
        white-space: nowrap;
        margin: 0;
        font-weight: bold;
        cursor: pointer;
        /* variable set in dropdown-item.ts */
        color: var(--color-primary);
        .item-text {
          overflow: hidden;
        }
        &:hover,
        &.selected {
          /* variables set in dropdown-item.ts */
          color: var(--text-color);
          background-color: var(--color-primary);
        }
        .carousel {
          font-weight: normal;
          white-space: nowrap;
          background-color: inherit;
          padding: 0;
          flex: 1;
          display: flex;
          justify-content: flex-end;
          .carousel-control {
            padding: 0 6px;
            &:hover {
              color: #ffff80;
            }
          }
        }
      }
    }
  }
}
</style>
