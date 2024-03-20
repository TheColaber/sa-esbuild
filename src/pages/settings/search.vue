<template>
  <div :class="[$style.search, { [$style['hide-small']]: hideSmall }]">
    <input
      v-model="inputVal"
      :class="$style.input"
      id="search"
      type="text"
      placeholder="Search for addons"
    />
    <label :class="$style.icon" for="search"><Icon :icon="search" /></label>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Icon } from "@iconify/vue";
import search from "@iconify-icons/tabler/search";

const { value, hideSmall } = defineProps<{
  value: string;
  hideSmall?: boolean;
}>();
const inputVal = ref(value);
const emit = defineEmits(["update:value"]);
watch(inputVal, (val) => emit("update:value", val));
</script>

<style lang="scss" module>
.search {
  min-height: 40px;
  flex: 1;
  display: flex;
  align-items: center;
  background: #00000020;
  height: 40px;
  width: 100%;
  max-width: 500px;
  min-width: 250px;
  border-radius: 6px;
  color: inherit;
  font-size: 18px;

  &:has(:focus-visible) {
    box-shadow: 0 0 0 3px #fff;
  }

  &.hide-small {
    display: none;
  }

  .input {
    padding: 0px 15px;

    width: 100%;
    background: none;
    border: none;
    font-size: inherit;
    color: inherit;
    font-family: inherit;
    height: 100%;

    &::placeholder {
      color: inherit;
      opacity: 0.4;
    }

    &:focus-visible {
      outline: none;
    }
  }
  .icon {
    padding: 0px 15px;
  }
}

@media only screen and (max-width: 520px) {
  .search.hide-small {
    display: flex;
  }
}
</style>
