<template>
  <div v-show="tab === 'explore'">explore</div>
  <EnabledAddons v-show="tab === 'enabled'" />
</template>

<script setup lang="ts">
import EnabledAddons from "./enabled-addons.vue";

const { tab } = defineProps<{ tab: "explore" | "enabled" }>();
</script>
