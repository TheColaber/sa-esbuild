<template>
  <div v-if="tab === 'explore'">explore</div>
  <EnabledAddons v-else />
</template>

<script setup lang="ts">
import EnabledAddons from "./enabled-addons.vue";

const { tab } = defineProps<{ tab: "explore" | "enabled" }>();
</script>
