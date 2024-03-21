<template>
  <div>
    <GridItem :addon="addon" v-for="addon of disabledAddons" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import GridItem from "./addon/grid-item.vue";
import { categories } from "./store";
const disabledAddons = computed(() => [
  ...categories.value.defaultDisabled,
  ...categories.value.disabled,
]);
</script>

<style lang="scss" module></style>
