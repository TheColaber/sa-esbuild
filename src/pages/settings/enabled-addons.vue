<template>
  <div :class="$style.container">
    <Search :class="$style['top-bar']" />
    <div :class="$style.sections">
      <template v-for="section of sections">
        <div
          :class="$style.section"
          v-if="!section.hidden && section.addons.length > 0"
        >
          <div :class="$style.name">{{ section.name }}</div>
          <div :class="$style.addons">
            <button
              :class="$style.addon"
              @click="scrollToAddon(addon)"
              v-for="addon of section.addons"
            >
              {{ addons[addon].name }}
            </button>
          </div>
        </div>
      </template>
    </div>
    <div :class="$style['extended-list']">
      <template v-for="section of sections">
        <template v-if="!section.hidden && section.addons.length > 0">
          <div>{{ section.name }}</div>
          <ListItem v-for="addon of section.addons" :key="addon" :id="addon"></ListItem>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ListItem from "./addon/list-item.vue";
import { categories, port, searchFilter } from "./store";
import Search from "./components/search.vue";
import * as addons from "#addons";
const { inPopup } = defineProps<{ inPopup?: boolean }>();

const addonsOnTab = await port.send<string[]>("getRunningAddons");

const productionAddons = computed(() =>
  [...categories.enabled.value, ...categories.defaultEnabled.value].filter(
    (id) => !addonsOnTab.includes(id),
  ),
);
const sections = computed(() => [
  {
    id: "running",
    name: "Running on tab",
    addons: addonsOnTab,
    hidden: addonsOnTab.length === 0,
  },
  {
    id: "development",
    name: "In Development",
    addons: categories.dev.value.filter((id) => !addonsOnTab.includes(id)),
  },
  {
    id: "editor",
    name: "Editor Addons",
    addons: productionAddons.value.filter((id) =>
      addons[id].category.includes("editor"),
    ),
  },
  {
    id: "popup",
    name: "Popup Addons",
    addons: productionAddons.value.filter((id) =>
      addons[id].category.includes("popup"),
    ),
  },
  {
    id: "disabled",
    name: "Disabled",
    addons: [...categories.defaultDisabled.value, ...categories.disabled.value],
    hidden: !inPopup || searchFilter.value.length === 0,
  },
]);

function scrollToAddon(id: string) {
  window.location.hash = "#addon-" + id;
}
</script>

<style lang="scss" module>
.container {
  display: flex;
  // overflow: hidden;
  overflow-y: auto;
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
      gap: 6px;

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
    gap: 6px;
    overflow-y: auto;
    scroll-behavior: smooth;
    box-sizing: border-box;
    font-size: 16px;
  }
}

@media only screen and (max-width: 675px) {
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
