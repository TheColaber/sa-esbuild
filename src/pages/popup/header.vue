<template>
  <div :class="$style.header">
    <img :src="'../../images/icon.svg'" :class="$style.logo" />
    <span :class="$style.text">
      {{ msg("name") }}
      <a
        :class="$style.link"
        href="https://scratchaddons.com/changelog"
        target="_blank"
        :title="msg('changelog')"
      >
        v{{ version }}
      </a>
    </span>
    <button :class="$style.settings" @click="openSettingsPage()">
      <Icon :icon="settingsIcon" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import settingsIcon from "@iconify-icons/tabler/settings";

const msg = chrome.i18n.getMessage;
const openSettingsPage = chrome.runtime.openOptionsPage;

const version = chrome.runtime
  .getManifest()
  .version_name.replace("release", "");
</script>

<style lang="scss" module>
.header {
  font-family: "Sora", sans-serif;
  --theme: #ff7b26;
  --gradient: linear-gradient(to right, var(--theme), hsl(24deg 100% 67%));
  background-image: var(--gradient);
  display: flex;
  align-items: center;
  color: #fff;
  .text {
    font-size: 18px;
    font-weight: 400;
    flex: 1;
    .link {
      color: inherit;
      margin: 5px;
      text-decoration: none;
      opacity: 0.75;
      font-size: 12px;
      border-radius: 4px;
      &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 3px #fff;
      }
    }
  }
  .logo {
    height: 30px;
    padding: 15px 20px;
  }
  .settings {
    height: 100%;
    font-size: 24px;
    padding: 0px 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: none;
    color: inherit;
    &:focus-visible {
      outline: none;
      box-shadow: inset 0 0 0 3px #fff;
    }
  }
}
</style>
