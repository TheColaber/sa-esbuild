<template>
  <div :class="$style.header">
    <div :class="$style.title">
      <img :src="'../../images/icon.svg'" :class="$style.logo" />
      <span :class="$style.text">
        {{ msg("name") }}
      </span>
    </div>
    <div :class="$style['top-bar']">
      <div :class="$style.tabs">
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
        <div :class="$style.selectDisplay"></div>
      </div>
      <Search :class="$style.search" />
      <div :class="$style.buttons">
        <button :class="$style.button">More Settings</button>
      </div>
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
  gap: 25px;
  height: 60px;
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
    }
  }
  .top-bar {
    display: flex;
    flex: 1;
    gap: 20px;
    align-items: center;

    .search {
      flex: 1;
    }

    .tabs {
      display: flex;
      gap: 15px;

      .tab {
        color: inherit;
        width: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: font-weight 0.2s;
        text-decoration: none;

        @for $i from 1 through 3 {
          &.selected:nth-child(#{$i}) ~ .selectDisplay {
            transform: translateX(calc(20px + 115px * (#{$i} - 1)));
          }
        }

        &::before {
          content: "";
          transition: opacity 0.2s;
          opacity: 0;
          height: 60px;
          width: 150px;
          position: absolute;
          background: radial-gradient(
            ellipse farthest-corner at 50% 1500%,
            #ffffffb0,
            transparent
          );
        }

        &:hover,
        &:focus-visible {
          font-weight: bold;
          outline: none;
          &::before {
            opacity: 1;
          }
        }
      }

      .selectDisplay {
        transition: 0.2s ease-out;
        width: 60px;
        display: block;
        height: 6px;
        position: absolute;
        background: #fff;
        align-self: flex-end;
        border-radius: 4px 4px 0px 0px;
        top: 54px;
      }
    }

    .buttons {
      display: flex;
      .button {
        border: none;
        background: none;
        color: inherit;
        font-family: inherit;
        font-size: inherit;
        padding: 0px;
      }
    }
  }
}

@media only screen and (max-width: 960px) {
  .header {
    .top-bar {
      .buttons {
        display: none;
      }
    }
  }
}

@media only screen and (max-width: 845px) {
  .header {
    .title {
      display: none;
    }
  }
}

@media only screen and (max-width: 635px) {
  .header {
    .top-bar {
      .search {
        display: none;
      }
      .buttons {
        display: flex;
        flex: 1;
        justify-content: flex-end;
      }
    }
  }
}
</style>
