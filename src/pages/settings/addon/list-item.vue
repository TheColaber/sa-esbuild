<template>
  <div :class="$style.addon" :id="'addon-' + addon.id">
    <div :class="$style['top-bar']">
      <div :class="$style.name">{{ addon.name }}</div>
      <Toggle :state="enabledStates[addon.id]" @click="toggleAddon(addon.id)" />
    </div>

    <div :class="$style.description">{{ addon.description }}</div>
    <div
      v-if="addon.credits && addon.credits.length > 0"
      :class="$style.credits"
    >
      <div v-for="user of addon.credits" :class="$style.credit">{{ user }}</div>
    </div>

    <div
      :class="$style.settings"
      v-if="addon.settings && addon.settings.length > 0"
    >
      <Setting
        v-for="setting of addon.settings"
        :setting="setting"
        :preset-names="addon.presetNames"
        v-model:value="settings[setting.id]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Setting from "./setting.vue";
import { addonStorage } from "../../../background/storage";
import { ref, watch } from "vue";
import Toggle from "../components/toggle.vue";
import * as addons from "#addons";
import { enabledStates, toggleAddon } from "../store";

const { id } = defineProps<{ id: string }>();
const addon = addons[id];

const addonSettings = await addonStorage.get(addon.id);
const settings = ref(addonSettings[addon.id]);
watch(
  settings,
  (newSettings) => {
    addonStorage.set({ [addon.id]: newSettings });
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
    animation: addon-flash 0.6s 2 ease-in-out;
  }

  .top-bar {
    display: flex;

    .name {
      flex: 1;
      font-size: 15px;
    }
  }

  .description {
    font-size: 12px;
  }

  .credits {
    font-size: 12px;
    display: flex;
    gap: 10px;
    .credit {
    }
  }

  .settings {
  }
}

@keyframes addon-flash {
  0% {
    border: 1px solid var(--background-tertiary);
  }
  50% {
    border: 1px solid var(--theme);
    filter: drop-shadow(0px 0px 4px var(--theme));
  }
  100% {
    border: 1px solid var(--background-tertiary);
  }
}
</style>
