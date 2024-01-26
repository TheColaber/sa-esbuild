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
        @focus="showDropdown(), inputChange()"
        @focusout="hideDropdown"
        @keydown="inputKeyDown"
        @keyup="inputChange"
        v-show="visible || !selected"
      />
      <div
        v-if="!visible && selected"
        @click="showDropdown(), inputChange()"
        :class="$style['selected-display']"
        :style="{ '--color-primary': selected?.color }"
      >
        <span :class="$style['item-text']">{{ selected.name }}</span>
        <span :class="$style.carousel" v-if="selected.ids.length > 1">
          <span :class="$style['carousel-control']" @click.stop="nextItem(-1)"
            >◀</span
          >
          <span
            >{{ selected.carouselIndex + 1 }} / {{ selected.ids.length }}</span
          >
          <span :class="$style['carousel-control']" @click.stop="nextItem(1)"
            >▶</span
          >
        </span>
      </div>
      <div :class="$style.dropdown" @mousedown.prevent>
        <div
          :class="[$style.item, { [$style.selected]: selected === item }]"
          v-for="(item, name) of items"
          :style="{ '--color-primary': item.color }"
          @mousedown="selectItem(item)"
        >
          <span :class="$style['item-text']">{{ item.name }}</span>
          <span
            :class="$style.carousel"
            v-if="selected === item && item.ids.length > 1"
          >
            <span :class="$style['carousel-control']" @click.stop="nextItem(-1)"
              >◀</span
            >
            <span>{{ item.carouselIndex + 1 }} / {{ item.ids.length }}</span>
            <span :class="$style['carousel-control']" @click.stop="nextItem(1)"
              >▶</span
            >
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import PopupAddon from "../../../../addon-api/userscript";
const { addon, workspace } = defineProps<{
  addon: PopupAddon;
  workspace: ScratchBlocks.WorkspaceSvg;
}>();

let mounted = true;
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
onUnmounted(() => {
  mounted = false;
});

const { Blockly } = addon.tab;

function showDropdown(showBlock?: ScratchBlocks.BlockSvg) {
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
    const addBlock = (block: ScratchBlocks.Block, category, name?: string) => {
      const isWhenFlagClicked = block.type === "event_whenflagclicked";
      const color = isWhenFlagClicked ? "#4cbf56" : block.getColour();
      const { y } = block.getRelativeToSurfaceXY();
      name = name || getBlockName(block);

      myBlocks[name] = myBlocks[name] || {
        category,
        y,
        color,
        ids: [],
        carouselIndex: 0,
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
        carouselIndex: number;
      }
    >;
    const blocks = workspace.getAllBlocks();
    for (const block of blocks) {
      const isEventBlock =
        block.getCategory() === "events" && !block.isShadow();        
        const isVariableBlock =
        block.getCategory() === "data" && !block.isShadow();
        const isListBlock =
        block.getCategory() === "data-lists" && !block.isShadow();
      const isCustomBlock =
        block.type === "procedures_definition" ||
        block.type === "procedures_call";

      if (
        isEventBlock ||
        isCustomBlock ||
        isVariableBlock ||
        isListBlock ||
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

          addBlock(block, "broadcast", addon.msg("event", { name: event.getText() }));
        } else if (block.type === "procedures_call") {
          let childProc = block.getProcCode();

          for (const b of blocks) {
            if (b.type === "procedures_definition") {
              let label = b.getChildren()[0];
              if (label.getProcCode() === childProc) {
                addBlock(block, "custom", getBlockName(b));
              }
            }
          }
        } else if (isVariableBlock || isListBlock) {
          const list = (block.inputList.find(list => list.name=== "" ||list.name === "VALUE") );
  const input = (list.fieldRow.find(row => row instanceof Blockly.FieldVariable || row instanceof Blockly.FieldVariableGetter));
  const {isLocal} = input.getVariable();
  let name;
  if (isVariableBlock) {
    name = isLocal? "var-local":"var-global"
  } else {
    name = isLocal? "list-local":"list-global"
  }
  addBlock(block, name, addon.msg(name, { name: input.getText() }))

        } else {
          addBlock(block, block.getCategory());
        }
      }
    }

    const order = [
      "flag",
      "broadcast",
      "event",
      "control",
      "custom",
      "var-local",
      "var-global",
      "list-local",
      "list-global",
    ];

    // Sort first by `order`, then by alphabetical, then top of page to bottom.
    return Object.entries(myBlocks)
      .map(([name, block]) => ({ name, ...block }))
      .sort((a, b) => {
        
        let orderDiff =
        order.indexOf(a.category) - order.indexOf(b.category);
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

function hideDropdown() {
  visible.value = false;
  if (selected.value && selected.value.ids.length === 1) {
    selected.value = null;
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

let glowBlock = null;
let glowInterval = null;
function goToBlock(id: string) {
  const currentBlock = workspace.getBlockById(id);
  // The quaternary color is the darkest shade of the block, so set the shadow color to it
  // which is what the glowBlock function uses to change the color of the block.
  currentBlock.setShadowColour(currentBlock.getColourQuaternary());
  const rootBlock = currentBlock.getRootBlock();

  // If the user spam presses, lets make sure the glowing doesn't spam itself to death.
  if (glowBlock) {
    clearInterval(glowInterval);
    workspace.glowBlock(glowBlock, false);
  }

  let topmostBlock = currentBlock;
  while (topmostBlock.getOutputShape() && topmostBlock.getSurroundParent()) {
    topmostBlock = topmostBlock.getSurroundParent();
  }

  // Calculate the positions and dimensions of the blocks
  const { x } = rootBlock.getRelativeToSurfaceXY(); // Align with the left of the block 'stack'
  const { y } = topmostBlock.getRelativeToSurfaceXY(); // Align with the top of the block
  const { scale } = workspace;
  const leftX = x * scale;
  const topY = y * scale;
  const { height: blockHeight } = currentBlock;
  const bottomY = topY + blockHeight;

  // Get the viewport metrics
  const viewportMetrics = workspace.getMetrics();
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
    workspace.scrollbar.set(scrollX, scrollY);
  }
  Blockly.hideChaff();
  let glow = true;
  let count = 4;
  glowInterval = setInterval(() => {
    glowBlock = currentBlock.id;
    workspace.glowBlock(currentBlock.id, glow);
    count--;
    glow = !glow;
    if (count === 0) clearInterval(glowInterval);
  }, 200);
}

function selectItem(item) {
  selected.value = item;
  goToBlock(item.ids[item.carouselIndex]);
}

function nextItem(increase: number) {
  const item = selected.value
  if (item.ids.length === 1) return;
  
  item.carouselIndex = (((item.carouselIndex + increase) % item.ids.length) + item.ids.length) %
  item.ids.length
  goToBlock(item.ids[item.carouselIndex]);
}

document.addEventListener("keydown", (event) => {
  if (!addon.enabled || !mounted) return;

  let ctrlKey = event.ctrlKey || event.metaKey;

  // F3 also opens
  if (event.key.toLowerCase() === "f" && ctrlKey && !event.shiftKey) {
    showDropdown();
    inputChange()
    event.preventDefault();
  }

  if (visible.value) {
    if (event.key === "ArrowDown") {
    const selectedIndex = items.value.indexOf(selected.value);
    const nextItem =
      items.value[
        (((selectedIndex + 1) % items.value.length) + items.value.length) %
          items.value.length
      ];
    selectItem(nextItem);
  }
  if (event.key === "ArrowUp") {
    const selectedIndex = items.value.indexOf(selected.value);
    const previousItem =
      items.value[
        (((selectedIndex - 1) % items.value.length) + items.value.length) %
          items.value.length
      ];
    selectItem(previousItem);
  }
  if (selected.value) {
  if (event.key === "ArrowLeft") {
    nextItem(-1);
  }
  if (event.key === "ArrowRight") {
    nextItem(1);
  }}
  }
  if (selected.value && event.key === "F2") {
      if (event.shiftKey) {
        nextItem(-1);

      } else {
        nextItem(1);

      }
}
});

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
    mounted &&
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
        showDropdown(block);
        return;
      }
    }
  }

  _doBlockClick_.call(this);
};
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
    line-height: 1;

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
    .dropdown {
      display: none;
      padding: 0.2em 0;
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
