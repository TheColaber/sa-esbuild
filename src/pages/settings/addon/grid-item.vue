<template>
      <div :class="$style.addon">
      <img :class="$style.thumbnail" :src="addon.image" />
      <span :class="$style.name">{{ addon.name }}</span>
      <Toggle :id="addon.id" />
    </div>
</template>

<script lang="ts" setup>
import { ExtraAddonManifest } from '../../../../esbuild/addon-helpers';
import Toggle from '../components/toggle.vue';
const {addon} = defineProps<{ addon: ExtraAddonManifest}>()
</script>

<style lang="scss" module>
.addon {
  .thumbnail {

  }
  .name {

  }
}
</style>