<template>
  <div :class="$style.container">
    <template v-for="section of sections">
      <div v-if="section.addons.length > 0" :class="$style.section">
        <span>{{ section.name }}</span>
        <div :class="$style.grid">
          <GridItem
            v-for="addon of section.addons"
            :key="addon.id"
            :addon="addon"
          />
        </div>
      </div>
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
import { categories } from "./store";
import { addonDisabledStates } from "../../background/storage";
import { searchFilter } from "./store";

const disabledAddons = computed(() =>
  addonDisabledStates.flatMap((state) => categories[state].value),
);
const sections = computed(() => [
  {
    id: "development",
    name: "In Development",
    addons: disabledAddons.value.filter((addon) => addon.mode === "dev"),
  },
  {
    id: "editor",
    name: "Editor Addons",
    addons: disabledAddons.value.filter((addon) => addon.mode !== "dev"),
  },
]);
</script>

<style lang="scss" module>
.container {
  display: flex;
  padding: 30px;
  flex-direction: column;
  gap: 30px;
  font-size: 20px;
  overflow-y: auto;

  .section {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 5px;

    .grid {
      flex: 1;
      display: grid;
      gap: 20px;
      grid-template-columns: repeat(auto-fit, minmax(min-content, 272px));
    }
  }
}
</style>
