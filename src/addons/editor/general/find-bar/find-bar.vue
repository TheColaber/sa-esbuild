<template>
  <div :class="$style.wrapper" ref="wrapper">
    <div :class="$style['dropdown-out']">
      <input
        :class="[$style.input, addon.tab.scratchClass('input_input-form')]"
        type="search"
        placeholder="Find (Ctrl+F)"
        autocomplete="off"
      />
      <ul :class="$style.dropdown" style="--text-color: #ffffff">
        <li :class="$style.item" style="--color-primary: #4cbf56">
          <span :class="$style['item-text']">when flag clicked</span>
          <span :class="$style.carousel">
            <span :class="$style['carousel-control']">◀</span>
            <span>1 / 2</span>
            <span :class="$style['carousel-control']">▶</span>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import PopupAddon from "../../../../addon-api/userscript";
const { addon } = defineProps<{ addon: PopupAddon }>();

const wrapper = ref<HTMLDivElement>();
onMounted(() => {
  addon.tab.displayNoneWhileDisabled(wrapper.value);
})
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
    .dropdown {
      display: none;
      padding: 0.2em 0;
      font-size: 0.75rem;
      line-height: 1;
      overflow-y: auto;
      min-height: 128px;
      max-height: 65vh;
      user-select: none;
      margin-top: 6px;
      .item {
        display: flex;
        padding: 0.5em 0.5em;
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
