<template>
  <div :class="[$style.popups, { theme: true, lightTheme }]">
    <div :class="$style.sticky">
      <div :class="$style.tabs">
        <button
          :class="[$style.tab, { [$style.sel]: id === selectedTab }]"
          @click="switchTab(id)"
          v-for="id of ORDER"
          v-show="enabledPopups[id]"
        >
          <template v-if="enabledPopups[id]">
            <Icon :class="$style.icon" :icon="enabledPopups[id].icon" />
            <span :class="$style.name">{{ enabledPopups[id].name }}</span>
            <Suspense v-if="enabledPopups[id].badge">
              <component
                :class="$style.badge"
                :is="enabledPopups[id].badge"
                :addon="instances[id]"
              />
            </Suspense>
            <a
              :class="$style.link"
              target="_blank"
              :href="'fullscreen/index.html?id=' + id"
              :title="msg('open_new_tab')"
              v-if="id !== 'settings-page'"
            >
              <Icon :icon="externalLinkIcon" :class="$style.popout" />
            </a>
          </template>
        </button>
      </div>
    </div>
    <template v-for="(popup, id) in enabledPopups">
      <Suspense>
        <component
          v-if="id === selectedTab"
          :is="popup.component"
          :addon="instances[id]"
        />
      </Suspense>
    </template>
  </div>
</template>

<script setup lang="ts">
import { syncStorage } from "../../background/storage";
import pageStorage from "../storage";
import { ref } from "vue";
// TODO: Support other languages
import * as addons from "#addons";
import settingsComponent from "../settings/content.vue";
import PopupAddon from "../../addon-api/popup";
import { Icon } from "@iconify/vue";
import toolIcon from "@iconify-icons/tabler/tool";
import externalLinkIcon from "@iconify-icons/tabler/external-link";

// msg() is used in the component html above
const msg = chrome.i18n.getMessage;
chrome.action.getUserSettings().then(s => s.isOnToolbar)
// Get light theme from the page localStorage and then update it to the value in storage after changes
const lightTheme = ref(pageStorage.get("lightTheme") === true);
syncStorage.watch(["lightTheme"], ({ lightTheme: newLightTheme }) => {
  lightTheme.value = newLightTheme;
});

const { addonsStates = {} } = await syncStorage.get("addonsStates");

const enabledPopups = Object.keys(addons)
  .map((id) => ({ [id]: addonsStates[id] && addons[id].popup }))
  .reduce((all, single) => ({ ...single, ...all }), {});

// Add popup that shows the settings page.
enabledPopups["settings-page"] = {
  name: "Addons",
  icon: toolIcon,
  component: settingsComponent,
};

const instances = Object.keys(enabledPopups)
  .map((id) => ({ [id]: new PopupAddon(id) }))
  .reduce((single, all) => ({ ...single, ...all }), {});

// Set the selected tab to the first tab in the list, but if the user previously selected another one, select that instead.
const ORDER = ["scratch-messaging", "settings-page"].filter((id) => id in enabledPopups);
let selectedTab = ref(ORDER[0]);

const lastSelectedPopup = pageStorage.get("lastSelectedPopup");
if (lastSelectedPopup) {
  const selectedId = ORDER.find((id) => id === lastSelectedPopup);
  if (selectedId) {
    selectedTab.value = selectedId;
  }
}

// When switching tabs, set the lastSelectedPopup in the page localStorage
function switchTab(id) {
  if (id === selectedTab.value) return;
  pageStorage.set("lastSelectedPopup", id);

  selectedTab.value = id;
}
</script>

<style lang="scss" module>
.popups {
  font-family: "Roboto", sans-serif;
  background-color: var(--background-primary);
  color: var(--content-text);
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  .sticky {
    padding: 10px 10px 0px 10px;
    position: sticky;
    top: 0;
    display: flex;
    flex: 0 0 50px;
    /* We repeat this style so nothing will show behind it when scrolling */
    background-color: inherit;
    .tabs {
      border-radius: 4px;
      border: 1px solid var(--background-tertiary);
      background: var(--background-secondary);
      box-shadow: var(--content-shadow);
      padding: 8px;
      display: flex;
      gap: 8px;
      width: 100%;
      overflow: hidden;
      .tab {
        color: inherit;
        display: flex;
        align-items: center;
        padding: 0px 8px;
        font-size: 12px;
        font-weight: 500;
        background: none;
        border: none;
        border-radius: 8px;
        transition: 0.2s ease background;
        font-family: inherit;
        &:has(.link) {
          padding: 0px 15.5px;
        }
        &:hover {
          background-color: var(--button-hover-background);
          padding: 0px 8px;
        }
        &:focus-visible {
          padding: 0px 8px;
          outline: none;
          box-shadow: inset 0 0 0 3px var(--content-text);
        }
        &.sel {
          padding: 0px 8px;
          background-image: var(--gradient);
          color: #fff;
        }
        .icon {
          font-size: 18px;
        }
        .name {
          padding: 0px 0px 0px 5px;
        }
        .badge {
          background-color: #00000044;
          padding: 4px;
          border-radius: 4px;
          margin-left: 4px;
        }
        .link {
          display: none;
          outline: none;
          color: inherit;
        }
        &.sel .link,
        &:focus-visible .link,
        &:hover .link {
          display: flex;
          height: 100%;
          align-items: center;
          .popout {
            margin-left: 1px;
            padding: 2px;
            border-radius: 2px;
            font-size: 10px;
          }

          &:focus-visible .popout,
          &:hover .popout {
            background: #fff;
            color: var(--theme);
          }
        }
      }
    }
  }
}

/* width */
::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}

/* hide track */
::-webkit-scrollbar-track,
::-webkit-scrollbar-corner {
  background: none;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: gray;
  border-radius: 4px;
}
</style>
