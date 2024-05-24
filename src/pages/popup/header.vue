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
    <a aria-label="settings-link" title="Settings Page" :href="settingsLink" :class="$style.settings" @click.prevent="openSettingsPage()">
      <Icon :class="$style.icon" :icon="settingsIcon" />
    </a>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import settingsIcon from "@iconify-icons/tabler/settings";

const msg = chrome.i18n.getMessage;

const settingsLink = (chrome.runtime.getURL(chrome.runtime.getManifest().options_page));

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
  user-select: none;
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
      &:focus-visible {
        border-radius: 4px;
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
    &::before {
      transition: all 0.5s;
      opacity: 0;
      background: linear-gradient(270deg, #ffffff54, transparent);
      content: "";
      position: absolute;
      height: -webkit-fill-available;
      width: -webkit-fill-available;
    }
    &:focus-visible {
      outline: none;
      box-shadow: inset 0 0 0 3px #fff;
    }
    .icon {
        transition: all 0.5s;
        rotate: 0deg;
      }
    &:hover {
      &::before {
      opacity: 1;
    }
      .icon {
        rotate: 90deg;
      }
    }
  }
}
</style>
