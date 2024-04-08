<template>
  <div :class="$style.addon">
    <img :class="$style.thumbnail" :src="addon.image" />
    <span :class="$style.name">{{ addon.name }}</span>
    <div :class="$style.info">
      <span :class="$style.description">{{ addon.description }}</span>
      <!-- <Toggle :id="addon.id" /> -->
    </div>
    <div :class="$style.buttons">
      <Button @click="tryAddon" v-if="addon.userPreview"> Try </Button>
      <Button @click="buttonClick">
        {{ enabledStates[addon.id] ? "Edit" : "Enable" }}
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { enabledStates, toggleAddon, port } from "../store";
import Button from "../components/button.vue";
import * as addons from "#addons";
const { id } = defineProps<{ id: string }>();
const addon = addons[id];

function buttonClick() {
  if (enabledStates.value[addon.id] === true) {
    window.location.hash = "#addon-" + addon.id;
  } else {
    toggleAddon(addon.id);
  }
}

function tryAddon() {
  port.send("openScratchEditor", addon.id);
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
    flex: 1;
    font-size: 12px;

    .description {
      flex: 1;
    }
  }
  .buttons {
    display: flex;
    gap: 5px;
    justify-content: flex-end;
  }
}
</style>
