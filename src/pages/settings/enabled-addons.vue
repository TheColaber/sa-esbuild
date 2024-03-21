<template>
  <div :class="$style.container">
    <Search :class="$style['top-bar']" />
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
      <template v-for="section of sections" v-show="section.hidden">
        <div v-if="section.addons.length > 0">{{ section.name }}</div>
        <ListItem v-for="addon of section.addons" :addon="addon"></ListItem>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as addons from "#addons";
import { computed, ref, watch } from "vue";
import ListItem from "./addon/list-item.vue";
import { categories, port } from "./store";
import Search from "./components/search.vue";

const productionAddons = computed(() => [
  ...categories.value.enabled,
  ...categories.value.defaultEnabled,
]);
const sections = computed(() => [
  {
    id: "running",
    name: "Running on tab",
    addons: [],
    hidden: true,
  },
  {
    id: "development",
    name: "In Development",
    addons: categories.value.dev,
  },
  {
    id: "editor",
    name: "Editor Addons",
    addons: productionAddons.value.filter((addon) =>
      addon.category.includes("editor"),
    ),
  },
  {
    id: "popup",
    name: "Popup Addons",
    addons: productionAddons.value.filter((addon) =>
      addon.category.includes("popup"),
    ),
  },
  {
    id: "disabled",
    name: "Disabled",
    addons: [],
    hidden: true,
  },
]);

const addonsOnTab = await port.send<string[]>("getRunningAddons");
if (addonsOnTab) {
  for (const section of sections.value) {
    section.addons = section.addons.filter(
      ({ id }) => !addonsOnTab.includes(id),
    );
  }
  const runningSection = sections.value.find(({ id }) => id === "running");
  (runningSection.addons = addonsOnTab.map((id) => addons[id])),
    (runningSection.hidden = false);
}

function scrollToAddon(id: string) {
  window.location.hash = "#addon-" + id;
}
</script>

<style lang="scss" module>
.container {
  display: flex;
  height: calc(100vh - 60px);

  .top-bar {
    margin: 10px;
    display: none;
    justify-content: center;
  }

  .sections {
    display: flex;
    width: 300px;
    padding: 10px;
    flex-direction: column;
    gap: 10px;
    overflow-y: auto;
    margin: 0px 12px;

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

          &:focus-visible {
            box-shadow: 0 0 0 3px #fff;
            outline: none;
          }
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
    box-sizing: border-box;
  }
}

@media only screen and (max-width: 635px) {
  .container {
    flex-direction: column;
    .top-bar {
      display: flex;
    }
    .sections {
      display: none;
    }
  }
}
</style>
