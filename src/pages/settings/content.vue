<template>
  <ExploreAddons v-show="tab === 'explore'" />
  <EnabledAddons v-show="tab === 'enabled'" :searchFilter="searchFilter" />
</template>

<script setup lang="ts">
import EnabledAddons from "./enabled-addons.vue";
import ExploreAddons from "./explore-addons.vue";
const { tab, searchFilter } = defineProps<{
  tab: "explore" | "enabled" | "themes";
  searchFilter: string;
}>();
</script>
