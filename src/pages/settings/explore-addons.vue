<template>
  <div :class="$style.container">
    <div :class="$style.grid">
      <GridItem :addon="addon" v-for="addon of disabledAddons" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import GridItem from "./addon/grid-item.vue";
import { categories } from "./store";
import { addonDisabledStates } from "../../background/storage";

const disabledAddons = computed(() => addonDisabledStates.flatMap((state) => categories[state]));
// const sections = computed(() => [
//   {
//     id: "development",
//     name: "In Development",
//     addons: disabledAddons.value.filter((addon) => addon.mode === "dev"),
//   },
// ]);
</script>

<style lang="scss" module>
.container {
  display: flex;
  justify-content: center;
  .grid {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
