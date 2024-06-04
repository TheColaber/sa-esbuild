<template>
  <div :class="$style.container">
    <ExploreAddons v-show="tab === 'explore'" />
    <EnabledAddons v-show="tab === 'enabled'" />
  </div>
</template>

<script setup lang="ts">
import EnabledAddons from "./enabled-addons.vue";
import ExploreAddons from "./explore-addons.vue";
import { tab } from "./store";
</script>

<style lang="scss" module>
.container {
  overflow: auto;
}
</style>