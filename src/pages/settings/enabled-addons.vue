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
        <div
          :class="$style.addon"
          :id="'addon-' + addon.id"
          v-for="addon of section.addons"
          :ref="(el) => (addonEls[addon.id] = el)"
        >
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

          <div v-if="addon.settings && addon.settings.length > 0">
            <div v-for="setting of addon.settings">
              <div>{{ setting.name }}</div>
              <input
                v-if="setting.type === 'integer'"
                type="number"
                v-model="settings[addon.id][setting.id]"
                @change="updateSettings(addon.id)"
              />
            </div>
          </div>
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
  addonStorage,
} from "../../background/storage";
import { Port } from "../../background/messaging";
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

const enabledAddons = [
  ...categories.enabled,
  ...categories.defaultEnabled,
  ...categories.dev,
];
const settings = await addonStorage.get(
  ...enabledAddons.map((addon) => addon.id),
);

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

function toggleAddon(id: string) {
  enabledStates.value[id] = !enabledStates.value[id];
  addonsStates[id] = enabledStates.value[id]
    ? addons[id].mode === "dev"
      ? "dev"
      : "enabled"
    : "disabled";
  syncStorage.set({ addonsStates });
}

function updateSettings(addon: string) {
  addonStorage.set({ [addon]: settings[addon] });
}
const addonEls = ref<{ [addon: string]: Element }>({});
function scrollToAddon(id) {
  window.location.hash = "#" + addonEls.value[id].id;
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
    }
  }
}

@media only screen and (max-width: 520px) {
  .container {
    .sections {
      display: none;
    }
  }
}

@keyframes addon-flash {
  50% {
    background: green;
  }
}
</style>
