<template>
  <div>
    <GridItem :addon="addon" v-for="addon of disabledAddons" />
  </div>
</template>

<script setup lang="ts">
import GridItem from "./addon/grid-item.vue";
import { store } from "./store";
const { categories } = store;
const disabledAddons = [...categories.defaultDisabled, ...categories.disabled];
</script>

<style lang="scss" module>
</style>
