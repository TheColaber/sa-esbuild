<template>
  <div :class="$style.addon" :id="'addon-' + addon.id">
    <div :class="$style['top-bar']">
      <div :class="$style.name">{{ addon.name }}</div>
      <button
        :class="$style['switch-background']"
        @click="toggleAddon(addon.id)"
        :state="enabledStates[addon.id]"
      >
        <div :class="$style.switch"></div>
      </button>
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
const { enabledStates, toggleAddon } = store;
const { addon } = defineProps<{ addon: ExtraAddonManifest }>();
const { categories } = store;
import { addonStorage } from "../../../background/storage";
import { ref, watch } from "vue";

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

    .switch-background {
      background-image: var(--gradient);
      border-radius: 10px;
      overflow: hidden;
      cursor: pointer;
      border: none;
      color: inherit;
      padding: 0px;

      &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 3px var(--content-text);
      }

      &[state="true"] {
        .switch {
          background-color: transparent;
          &::before {
            background-color: #fff;
            left: 25px;
          }
        }
      }

      .switch {
        display: flex;
        background-color: var(--switch-background);
        width: 40px;
        height: 20px;
        position: relative;
        cursor: pointer;
        transition: all 0.25s ease;
        &::before {
          content: "";
          position: absolute;
          display: block;
          width: 10px;
          height: 10px;
          background-color: var(--switch-inner-background);
          border-radius: 5px;
          top: 5px;
          left: 5px;
          transition: left 0.25s ease;
        }
      }
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
