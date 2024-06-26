<template>
  <div :class="$style['message-type']" v-show="length">
    <button :class="[$style.title]" @click="extended = !extended">
      <Icon
        :class="$style.dropdown"
        :icon="extended ? 'uil:angle-up' : 'uil:angle-down'"
      ></Icon>
      <span :class="$style.text">{{ title }}</span>
      <span :class="$style.right">
        <Icon :class="$style.icon" :icon="'uil:' + icon"></Icon>
        {{ length }}
      </span>
    </button>
    <div
      v-show="extended"
      :class="[
        $style.list,
        { [$style.noRowGap]: noRowGap, [$style.comments]: comments },
      ]"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// https://icon-sets.iconify.design/uil/
import { Icon } from "@iconify/vue";
import { ref } from "vue";
const props = defineProps<{
  noRowGap?: boolean;
  length: number;
  icon: string;
  title: string;
  comments?: boolean;
}>();

const extended = ref(props.comments);
</script>

<style module lang="scss">
.message-type {
  border-radius: 4px;
  border: 1px solid var(--background-tertiary);
  background: var(--background-secondary);
  box-shadow: var(--content-shadow);

  .title {
    font-size: 13px;
    color: var(--content-text);
    padding: 6px;
    padding-inline-end: 9px;
    cursor: default;
    display: flex;
    align-items: center;
    user-select: none;
    background: none;
    border: none;
    width: 100%;
    text-align: start;
    font-family: inherit;
    outline: none;

    .text {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      flex: 1;
      margin-left: 6px;
    }

    .right {
      white-space: nowrap;
      font-size: 13px;
      .icon {
        font-size: 15px;
        vertical-align: text-bottom;
      }
    }

    .dropdown {
      transition: background 0.2s;
      padding: 4px;
      border-radius: 4px;
      font-size: 24px;
    }

    &:focus-visible .dropdown {
      outline: none;
      box-shadow: inset 0 0 0 3px var(--content-text);
    }

    &:hover .dropdown {
      background: var(--hover-highlight);
    }
  }

  .list {
    color: var(--description-text);
    font-size: 12px;
    padding: 5px 16px 16px 16px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    &.noRowGap {
      gap: 0px 10px;
    }
    &.comments {
      padding: 0px 8px 8px 8px;
    }
  }
}
</style>
