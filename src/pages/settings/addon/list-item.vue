<template>
  <div :class="$style.addon" :id="'addon-' + addon.id">
    <div :class="$style['top-bar']">
      <div :class="$style.name">{{ addon.name }}</div>
      <Toggle :id="addon.id" />
    </div>

    <div>{{ addon.description }}</div>
    <div v-if="addon.credits && addon.credits.length > 0">
      <div v-for="user of addon.credits">{{ user }}</div>
    </div>

    <div
      :class="$style.settings"
      v-if="addon.settings && addon.settings.length > 0"
    >
      <Setting
        v-for="setting of addon.settings"
        :setting="setting"
        :preset-names="addon.presetNames"
        v-model:value="settings[addon.id][setting.id]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { store } from "../store";
import { ExtraAddonManifest } from "../../../../esbuild/addon-helpers";
import Setting from "./setting.vue";
import { addonStorage } from "../../../background/storage";
import { ref, watch } from "vue";
import Toggle from "../components/toggle.vue";

const { addon } = defineProps<{ addon: ExtraAddonManifest }>();
const { categories } = store;
const enabledAddons = [
  ...categories.enabled,
  ...categories.defaultEnabled,
  ...categories.dev,
];
const settings = ref(
  await addonStorage.get(...enabledAddons.map((addon) => addon.id)),
);
watch(
  settings,
  (newSettings) => {
    addonStorage.set(newSettings);
  },
  { deep: true },
);
</script>

<style lang="scss" module>
.addon {
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  border: 1px solid var(--background-tertiary);
  background: var(--background-secondary);
  box-shadow: var(--content-shadow);
  padding: 8px;

  &:target {
    animation: addon-flash 1s 2 ease-in-out;
  }

  .top-bar {
    display: flex;

    .name {
      flex: 1;
      font-size: 15px;
    }
  }

  .settings {
  }
}

@keyframes addon-flash {
  50% {
    background: green;
  }
}
</style>
