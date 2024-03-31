<template>
  <div :class="$style.container">
    <div v-for="section of sections" :class="$style.section">
      <span>{{ section.name }}</span>
      <div :class="$style.grid">
        <GridItem :addon="addon" v-for="addon of section.addons" />
      </div>
    </div>
    <div v-if="disabledAddons.length === 0">
      You have all addons enabled. But that's not really a great thing...
      Consider going through your addons and making sure you know what each one
      does.
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import GridItem from "./addon/grid-item.vue";
import { categories } from "./store";
import { addonDisabledStates } from "../../background/storage";

const disabledAddons = computed(() =>
  addonDisabledStates.flatMap((state) => categories[state]),
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
