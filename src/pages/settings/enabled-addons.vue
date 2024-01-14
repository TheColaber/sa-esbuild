<template>
  <div :class="$style.container">
    <div :class="$style.sections">
      <div
        :class="$style.section"
        v-for="section of sections"
        v-show="section.addons.length"
      >
        <button :class="$style.name">{{ section.name }}</button>
        <div :class="$style.addons">
          <button :class="$style.addon" v-for="addon of section.addons">
            {{ addon.name }}
          </button>
        </div>
      </div>
    </div>
    <div :class="$style['extended-list']">
      <template v-for="section of sections">
        <div :class="$style.addon" v-for="addon of section.addons">
          <div>{{ addon.name }}</div>
          <button @click="toggleAddon(addon.id)">
            {{ enabledStates[addon.id] ? "Disable Addon" : "Reenable Addon" }}
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as addons from "#addons";
import { ref } from "vue";
import {
  syncStorage,
  allAddonStates,
  addonEnabledStates,
} from "../../background/storage";
const { addonsStates } = await syncStorage.get("addonsStates");
const enabledStates = ref(
  Object.fromEntries(
    Object.entries(addonsStates).map(([id, state]) => [
      id,
      addonEnabledStates.some((enabledState) => enabledState === state),
    ]),
  ),
);
function typedObject<T extends string, U>(key: T, value: U) {
  return { [key]: value } as { [K in T]: U };
}
function objectArray<T>(array: T[]) {
  return array.reduce((all, single) => ({ ...single, ...all }), {} as T);
}
const categories = objectArray(
  allAddonStates.map((state) =>
    typedObject(
      state,
      Object.keys(addonsStates)
        .filter((id) => addonsStates[id] === state)
        .map((id) => addons[id]),
    ),
  ),
);
const productionAddons = [...categories.enabled, ...categories.defaultEnabled];
const sections = [
  {
    name: "In Development",
    addons: categories.dev,
  },
  {
    name: "Editor Addons",
    addons: productionAddons.filter(
      (addon) =>
        addon.category.includes("editor") && addon.category.includes("general"),
    ),
  },
  {
    name: "Popup Addons",
    addons: productionAddons.filter((addon) =>
      addon.category.includes("popup"),
    ),
  },
];

function toggleAddon(id: string) {
  enabledStates.value[id] = !enabledStates.value[id];
  addonsStates[id] = enabledStates.value[id] ? "enabled" : "disabled";
  syncStorage.set({ addonsStates });
}
</script>

<style lang="scss" module>
.container {
  display: flex;
  .sections {
    display: flex;
    width: 300px;
    padding: 10px;
    flex-direction: column;
    gap: 15px;
    .section {
      display: flex;
      flex-direction: column;
      width: 100%;
      .name {
        font-size: 16px;
        background: none;
        color: inherit;
        border: none;
        font-family: inherit;
        text-align: start;
      }

      .addons {
        display: flex;
        .addon {
          background: var(--background-tertiary);
          color: inherit;
          border: none;
          font-family: inherit;
          padding: 5px 10px;
          width: 100%;
          text-align: start;
          border-radius: 6px;
          font-size: 14px;
        }
      }
    }
  }

  .extended-list {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 10px;
    .addon {
      display: flex;
    }
  }
}
</style>
