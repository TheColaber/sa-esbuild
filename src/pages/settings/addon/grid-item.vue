<template>
  <div :class="$style.addon">
    <img :class="$style.thumbnail" :src="addon.image" />
    <span :class="$style.name">{{ addon.name }}</span>
    <div :class="$style.info">
    <span :class="$style.description">{{ addon.description }}</span>
    <!-- <Toggle :id="addon.id" /> -->
    <button @click="buttonClick" :class="$style.button">{{enabledStates[addon.id] ? "Edit" : "Enable"}}</button>
  </div>
  </div>
</template>

<script lang="ts" setup>
import { ExtraAddonManifest } from "../../../../esbuild/addon-helpers";
const { addon } = defineProps<{ addon: ExtraAddonManifest }>();
import { enabledStates, toggleAddon } from "../store";

function buttonClick() {
  if (enabledStates.value[addon.id] === true) {
    window.location.hash = "#addon-" + addon.id 
  } else {
    toggleAddon(addon.id);
  }
}
</script>

<style lang="scss" module>
.addon {
  display: flex;
    flex-direction: column;
    width: 250px;
    border-radius: 4px;
    border: 1px solid var(--background-tertiary);
    background: var(--background-secondary);
    box-shadow: var(--content-shadow);
    padding: 10px;
    .thumbnail {
      border-radius: 4px;

  }
  .name {
      font-size: 18px;
    }

  .info {
    display: flex;
    align-items: flex-end;

    .description {

    }

    .button {
      background: var(--background-primary);
    border: 1px solid var(--button-border);
    color: var(--content-text);
    padding: 7px 12px;
    border-radius: 4px;
    font-family: inherit;
    font-size: 12px;
    }
  }
}
</style>
