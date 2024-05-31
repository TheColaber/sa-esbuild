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
        @focus="open()"
        @focusout="hide"
        @keydown="inputKeyDown"
        v-show="visible || !selected"
      />
      <div
        v-if="!visible && selected"
        @click="open()"
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
          v-show="
            !input ||
            item.filteredName === undefined ||
            item.filteredName.length > 0
          "
          :style="{ '--color-primary': item.color }"
          @mousedown="selectItem(item)"
        >
          <span :class="$style['item-text']">
            <template
              v-if="
                item.filteredName !== undefined && item.filteredName.length > 0
              "
            >
              {{ item.filteredName[0]
              }}<b :class="$style.highlighted">{{ item.filteredName[1] }}</b
              >{{ item.filteredName[2] }}
            </template>
            <template v-else>{{ item.name }}</template>
          </span>
          <span
            :class="$style.carousel"
            v-if="selected === item && item.ids && item.ids.length > 1"
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
import { onMounted, onUnmounted, ref, watch } from "vue";
import UserscriptAddon from "../../../../addon-api/userscript";
const { addon, workspace } = defineProps<{
  addon: UserscriptAddon;
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

const { Blockly, vm } = addon.tab;
if (addon.showPreview) {
  open();
}

function open(
  options: { showBlock?: ScratchBlocks.BlockSvg; showMore?: boolean } = {},
) {
  show(options);
  filter();
}

function show(
  options: { showBlock?: ScratchBlocks.BlockSvg; showMore?: boolean } = {},
) {
  if (!options.showBlock && !("showMore" in options) && visible.value) {
    return;
  }
  visible.value = true;
  setTimeout(() => findInput.value.focus());
  // setting null forces the results to rerender.
  prevValue = null;

  const selectedTab = addon.tab.redux.state.scratchGui.editorTab.activeTabIndex;
  items.value =
    selectedTab === 0
      ? getBlocks()
      : selectedTab === 1
        ? getCostumes()
        : selectedTab === 2
          ? getSounds()
          : [];

  const focusBlock =
    options.showBlock &&
    items.value.find((item) =>
      item.ids.find((id) => id === options.showBlock.id),
    );
  if (focusBlock) {
    focusBlock.carouselIndex = focusBlock.ids.indexOf(options.showBlock.id);
    selectItem(focusBlock);
  }

  function getBlocks() {
    textColor.value = Blockly.Colours.text;

    function getBlockName(block, reporters = false) {
      let name = block.inputList.flatMap((list) => {
        const inputs = list.fieldRow.map((row) =>
          row instanceof Blockly.FieldDropdown ? "[]" : row.getText(),
        );

        if (list.type === 1) inputs.push("()");
        return inputs;
      });

      let child = block.getChildren()[0];

      if (child && child.isShadow()) {
        let shape = child.getOutputShape();
        if (shape !== 2) {
          name.push(getBlockName(child, reporters));
        }
      }
      return name.join(" ");
    }
    const addBlock = (
      block: ScratchBlocks.Block,
      category: string,
      name?: string,
    ) => {
      if (category === "show-more" || category === "show-less") {
        return (myBlocks[name] = {
          category,
          color: "#593849",
          ids: [],
          carouselIndex: 0,
        });
      }
      if (block.isShadow()) return;
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
        filteredName: [],
      };
      myBlocks[name].ids.push(block.id);

      return myBlocks[name];
    };
    const myBlocks = {} as Record<
      string,
      {
        category: string;
        y?: number;
        color: string;
        ids: string[];
        carouselIndex: number;
        filteredName?: string[];
      }
    >;
    const blocks = workspace.getAllBlocks();
    for (const block of blocks) {
      let category = block.getCategory();
      category = category === "sounds" ? "sound" : category;
      category = category === null ? "myBlocks" : category;
      const isEventBlock = category === "events";
      const isVariableBlock = category === "data";
      const isListBlock = category === "data-lists";
      const isCustomBlock = block.type === "procedures_call";

      if (options.showMore) {
        addBlock(block, category);
      } else if (
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

          addBlock(
            block,
            "broadcast",
            addon.msg("event", { name: event.getText() }),
          );
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
          const list = block.inputList.find(
            (list) => list.name === "" || list.name === "VALUE",
          );
          const input = list.fieldRow.find(
            (row) =>
              row instanceof Blockly.FieldVariable ||
              row instanceof Blockly.FieldVariableGetter,
          );
          const { isLocal } = input.getVariable();
          let name;
          if (isVariableBlock) {
            name = isLocal ? "var-local" : "var-global";
          } else {
            name = isLocal ? "list-local" : "list-global";
          }
          addBlock(block, name, addon.msg(name, { name: input.getText() }));
        } else {
          addBlock(block, block.getCategory());
        }
      }
    }
    let showName = options.showMore ? "show-less" : "show-more";
    addBlock(null, showName, addon.msg(showName));

    let order = [
      "flag",
      "broadcast",
      "event",
      "control",
      "custom",
      "var-local",
      "var-global",
      "list-local",
      "list-global",
      "show-more",
      "show-less",
    ];

    if (options.showMore) {
      const treeChildren = [...workspace.options.languageTree.childNodes];
      const categoryChildren = treeChildren.filter(
        (child) => child.tagName && child.tagName.toUpperCase() === "CATEGORY",
      );
      order.unshift(...categoryChildren.map((child) => child.id));
    }

    // Sort first by `order`, then by alphabetical, then top of page to bottom.
    return Object.entries(myBlocks)
      .map(([name, block]) => ({ name, ...block }))
      .sort((a, b) => {
        let orderDiff = order.indexOf(a.category) - order.indexOf(b.category);
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

  function getCostumes() {
    textColor.value = "#fff";

    let costumes = vm.editingTarget.getCostumes().map((asset, i) => ({
      category: "gui",
      name: asset.name,
      color: "#855cd6",
      carouselIndex: 0,
      filteredName: [],
      y: i,
    }));
    return costumes;
  }

  function getSounds() {
    textColor.value = "#fff";

    let sounds = vm.editingTarget.getSounds().map((asset, i) => ({
      category: "gui",
      name: asset.name,
      color: "#855cd6",
      carouselIndex: 0,
      filteredName: [],
      y: i,
    }));
    return sounds;
  }
}

function hide() {
  visible.value = false;
  if (
    !selected.value ||
    !selected.value.ids ||
    selected.value.ids.length === 1
  ) {
    selected.value = null;
  }
}

function filter() {
  let val = input.value.toLowerCase();
  if (val === prevValue) {
    return;
  }
  prevValue = val;

  for (const item of items.value) {
    if (item.filteredName === undefined) continue;
    item.filteredName = [];
    if (val !== "") {
      let indexOfSearch = item.name.toLowerCase().indexOf(val);
      if (indexOfSearch >= 0) {
        item.filteredName.push(item.name.substring(0, indexOfSearch));
        item.filteredName.push(item.name.substr(indexOfSearch, val.length));
        if (indexOfSearch + val.length < item.name.length) {
          item.filteredName.push(item.name.substr(indexOfSearch + val.length));
        }
      }
    }
  }
}
watch(input, filter);

function inputKeyDown(e: KeyboardEvent) {
  // this.dropdown.inputKeyDown(e);

  if (e.key === "Escape") {
    // If there's any value in the input, clear it, otherwise exit
    if (input.value.length > 0) {
      input.value = "";
      filter();
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

  // Check if either the current block is not in the right x position or is outside the viewport
  if (
    Math.round(leftX) !== Math.round(viewLeft + padding) ||
    topY < viewTop - padding ||
    bottomY > viewTop + viewHeight
  ) {
    // TODO: RTL ;(
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
  if (item.category === "show-more") {
    open({ showMore: true });
    return;
  }
  if (item.category === "show-less") {
    open({ showMore: false });
    return;
  }
  selected.value = item;

  if (item.category === "gui" || item.category === "gui") {
    // Viewing costumes/sounds - jump to selected costume/sound
    const assetPanel = document.querySelector("[class^=asset-panel_wrapper]");
    if (assetPanel) {
      const reactInstance = assetPanel[addon.tab.getInternalKey(assetPanel)];
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
    return;
  }

  goToBlock(item.ids[item.carouselIndex]);
}

function nextItem(increase: number) {
  const item = selected.value;
  if (!item.ids || item.ids.length === 1) return;

  item.carouselIndex =
    (((item.carouselIndex + increase) % item.ids.length) + item.ids.length) %
    item.ids.length;
  goToBlock(item.ids[item.carouselIndex]);
}

document.addEventListener("keydown", (event) => {
  if (!addon.enabled || !mounted) return;

  let ctrlKey = event.ctrlKey || event.metaKey;

  // F3 also opens
  if (event.key.toLowerCase() === "f" && ctrlKey && !event.shiftKey) {
    if (visible.value) {
      open();
    } else {
      close();
    }
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
      }
    }
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
        show({ showBlock: block });
        return;
      }
    }
  }

  _doBlockClick_.call(this);
};
</script>

<style lang="scss" module>
.wrapper {
  width: 100%;
  z-index: 100;
  height: 100%;
  display: flex;
  align-items: flex-end;
  flex-direction: column;

  .dropdown-out {
    width: 16em;
    display: flex;
    flex-direction: column;
    font-size: 0.75rem;
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
        color: var(--color-primary);
        .item-text {
          overflow: hidden;
          .highlighted {
            background-color: #aaffaa;
            color: black;
          }
        }
        &:hover,
        &.selected {
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

[dir="rtl"] .dropdown-out {
  float: left;
}
</style>
