<template>
  <div :class="$style.container">
    <template v-for="section of sections">
      <template v-if="section.addons.length > 0" :class="$style.section">
        <span :class="$style.name">{{ section.name }}</span>
        <GridItem v-for="addon of section.addons" :key="addon" :id="addon" />
      </template>
    </template>
    <div v-if="disabledAddons.length === 0">
      <template v-if="searchFilter">
        No search results found for '{{ searchFilter }}'. Consider using
        different search terms.
      </template>
      <template v-else>
        You have all addons enabled. But that's not really a great thing...
        Consider going through your addons and making sure you know what each
        one does.
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import GridItem from "./addon/grid-item.vue";
import { addonDisabledStates, syncStorage } from "../../background/storage";
import { searchFilter } from "./store";
import * as addons from "#addons";
import { categories } from "./store";

// for (const id in addons) {
//   const isDisabled = addonDisabledStates.some((state) => state === addonStorag[id])
//   if (isDisabled) {

//   }
// }
const disabledAddons = computed(() =>
  addonDisabledStates.flatMap((state) => categories[state].value),
);
const sections = computed(() => [
  {
    id: "development",
    name: "In Development",
    addons: disabledAddons.value.filter((id) => addons[id].mode === "dev"),
  },
  {
    id: "editor",
    name: "Editor Addons",
    addons: disabledAddons.value.filter((id) => addons[id].mode !== "dev"),
  },
]);
</script>

<style lang="scss" module>
.container {
  display: grid;
  justify-content: center;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(min-content, 272px));
  padding: 15px;
  font-size: 20px;
  .name {
    grid-column: 1 / -1;
  }
}
</style>
