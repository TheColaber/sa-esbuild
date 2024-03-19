<template>
  <div :class="$style.container">
    <div :class="$style.sections">
      <div
        :class="$style.section"
        v-for="section of sections"
        v-show="section.addons.length > 0"
      >
        <div :class="$style.name">{{ section.name }}</div>
        <div :class="$style.addons">
          <button
            :class="$style.addon"
            @click="scrollToAddon(addon.id)"
            v-for="addon of section.addons"
          >
            {{ addon.name }}
          </button>
        </div>
      </div>
    </div>
    <div :class="$style['extended-list']">
      <template v-for="section of sections">
        <div v-if="section.addons.length > 0">{{ section.name }}</div>
        <ListItem v-for="addon of section.addons" :addon="addon"></ListItem>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as addons from "#addons";
import { Port } from "../../background/messaging";
import ListItem from "./addon/list-item.vue";
import { store } from "./store";
const { categories } = store;

const productionAddons = [...categories.enabled, ...categories.defaultEnabled];
const sections = [
  {
    name: "In Development",
    addons: categories.dev,
  },
  {
    name: "Editor Addons",
    addons: productionAddons.filter((addon) =>
      addon.category.includes("editor"),
    ),
  },
  {
    name: "Popup Addons",
    addons: productionAddons.filter((addon) =>
      addon.category.includes("popup"),
    ),
  },
];

const port = new Port();
const addonsOnTab = await port.send<string[]>("getRunningAddons");
if (addonsOnTab) {
  for (const section of sections) {
    section.addons = section.addons.filter(
      ({ id }) => !addonsOnTab.includes(id),
    );
  }
  sections.unshift({
    name: "Running on tab",
    addons: addonsOnTab.map((id) => addons[id]),
  });
}

function scrollToAddon(id: string) {
  window.location.hash = "#addon-" + id;
}
</script>

<style lang="scss" module>
.container {
  display: flex;
  height: calc(100vh - 60px);

  .sections {
    display: flex;
    width: 300px;
    padding: 10px;
    flex-direction: column;
    gap: 10px;
    overflow-y: auto;

    .section {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 2px;

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
        flex-direction: column;
        gap: 6px;

        .addon {
          color: inherit;
          border: none;
          font-family: inherit;
          width: 100%;
          text-align: start;
          font-size: 14px;
          border-radius: 4px;
          border: 1px solid var(--background-tertiary);
          background: var(--background-secondary);
          box-shadow: var(--content-shadow);
          padding: 6px;
        }
      }
    }
  }

  .extended-list {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 10px;
    gap: 10px;
    overflow-y: auto;
    scroll-behavior: smooth;
  }
}

@media only screen and (max-width: 520px) {
  .container {
    .sections {
      display: none;
    }
  }
}
</style>
