<template>
  <ExploreAddons v-show="tab === 'explore'" />
  <EnabledAddons v-show="tab === 'enabled'" />
</template>

<script setup lang="ts">
import EnabledAddons from "./enabled-addons.vue";
import ExploreAddons from "./explore-addons.vue";
import { tab } from "./store";
</script>
