<template>
  <div :class="$style.container">
    <ExploreAddons v-show="tab === 'explore'" />
    <EnabledAddons v-show="tab === 'enabled'" />
    <Superpresets v-show="tab === 'superpresets'" />
  </div>
</template>

<script setup lang="ts">
import EnabledAddons from "./enabled-addons.vue";
import ExploreAddons from "./explore-addons.vue";
import Superpresets from "./superpresets.vue";
import { tab } from "./store";
</script>

<style lang="scss" module>
.container {
  overflow: auto;
}

/* width */
::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}

/* hide track */
::-webkit-scrollbar-track,
::-webkit-scrollbar-corner {
  background: none;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: gray;
  border-radius: 4px;
}
</style>
