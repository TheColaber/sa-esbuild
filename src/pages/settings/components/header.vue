<template>
  <div :class="$style.header">
    <div :class="$style.title">
      <img :src="'../../images/icon.svg'" :class="$style.logo" />
      <span :class="$style.text">
        {{ msg("name") }}
      </span>
    </div>
    <div :class="$style['top-bar']">
      <a
        @click="tab = 'explore'"
        href="#explore"
        :class="[$style.tab, { [$style.selected]: tab === 'explore' }]"
      >
        Explore Addons
      </a>
      <a
        @click="tab = 'enabled'"
        href="#enabled"
        :class="[$style.tab, { [$style.selected]: tab === 'enabled' }]"
      >
        My Addons
      </a>
      <a
        @click="tab = 'themes'"
        href="#themes"
        :class="[$style.tab, { [$style.selected]: tab === 'themes' }]"
      >
        Themes
      </a>
      <!-- <div :class="$style.selectDisplay"></div> -->
      <Search :class="$style.search" />
      <a
        @click="tab = 'hotkeys'"
        href="#hotkeys"
        :class="[
          $style.tab,
          $style.right,
          { [$style.selected]: tab === 'hotkeys' },
        ]"
        >Hotkeys</a
      >
      <a
        @click="tab = 'superpresets'"
        href="#superpresets"
        :class="[
          $style.tab,
          $style.right,
          { [$style.selected]: tab === 'superpresets' },
        ]"
        >Superpresets</a
      >
      <a
        @click="tab = 'more'"
        href="#more"
        :class="[
          $style.tab,
          $style.right,
          { [$style.selected]: tab === 'more' },
        ]"
        >More Settings</a
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import Search from "./search.vue";
import { tab } from "../store";
const msg = chrome.i18n.getMessage;
</script>

<style lang="scss" module>
.header {
  font-family: "Sora", sans-serif;
  background-image: var(--gradient);
  color: #fff;
  display: flex;
  gap: 10px;
  height: 60px;
  min-height: 60px;
  padding: 0px 20px;

  .title {
    display: flex;
    align-items: center;

    .text {
      font-size: 18px;
      font-weight: 400;
      flex: 1;
    }

    .logo {
      height: 30px;
      padding: 15px 12px;
    }
  }
  .top-bar {
    display: flex;
    flex: 1;
    align-items: center;

    .search {
      flex: 1;
      margin: 0px 20px;
    }

    .tab {
      color: inherit;
      margin: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: font-weight 0.2s;
      text-decoration: none;
      border-radius: 4px;

      &::before {
        content: "";
        transition: opacity 0.2s;
        opacity: 0;
        height: 60px;
        width: 108px;
        position: absolute;
        background: radial-gradient(
          ellipse farthest-corner at 50% 1500%,
          #ffffffb0,
          transparent
        );
      }

      &::after {
        content: "";
        opacity: 0;
        transition: opacity 0.2s;
        width: 60px;
        height: 6px;
        position: absolute;
        background: #fff;
        border-radius: 4px 4px 0px 0px;
        top: 54px;
      }

      &.selected::after {
        opacity: 1;
      }

      &:hover,
      &:focus-visible {
        font-weight: bold;
        outline: none;
        &::before {
          opacity: 1;
        }
      }

      &:focus-visible {
        box-shadow: 0 0 0 3px #fff;
      }
    }
  }
}

@media only screen and (max-width: 1230px) {
  .header {
    .title {
      .text {
        display: none;
      }
      .logo {
        padding: 0px;
      }
    }
  }
}

@media only screen and (max-width: 1050px) {
  .header {
    .title {
      .logo {
        display: none;
      }
    }
  }
}

@media only screen and (max-width: 950px) {
  .header {
    .top-bar {
      .right {
        display: none;
      }
    }
  }
}

@media only screen and (max-width: 675px) {
  .header {
    .top-bar {
      justify-content: space-evenly;
      .search {
        display: none;
      }
    }
  }
}
</style>
