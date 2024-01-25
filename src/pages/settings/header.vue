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
        <button
          @click="$emit('update:tab', 'explore')"
          :class="[$style.tab, { [$style.selected]: tab === 'explore' }]"
        >
          Explore Addons
        </button>
        <button
          @click="$emit('update:tab', 'enabled')"
          :class="[$style.tab, { [$style.selected]: tab === 'enabled' }]"
        >
          My Addons
        </button>
        <button
          @click="$emit('update:tab', 'themes')"
          :class="[$style.tab, { [$style.selected]: tab === 'themes' }]"
        >
          Themes
        </button>
        <div :class="$style.selectDisplay"></div>
      </div>
      <div :class="$style.search">
        <input :class="$style.input" type="text" />
      </div>
      <div :class="$style.buttons">
        <button :class="$style.button">More Settings</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const msg = chrome.i18n.getMessage;

const { tab } = defineProps<{ tab: "explore" | "enabled" | "themes" }>();
defineEmits(["update:tab"]);
</script>

<style lang="scss" module>
.header {
  font-family: "Sora", sans-serif;
  background-image: var(--gradient);
  color: #fff;
  display: flex;
  gap: 25px;
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
      padding: 15px 20px;
    }
  }
  .top-bar {
    display: flex;
    flex: 1;
    gap: 20px;

    .tabs {
      display: flex;
      gap: 15px;

      .tab {
        border: none;
        background: none;
        color: inherit;
        font-family: inherit;
        font-size: inherit;
        padding: 0px;
        width: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: font-weight 0.2s;
        outline: none;

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
          position: fixed;
          background: radial-gradient(
            ellipse farthest-corner at 50% 1500%,
            #ffffffb0,
            transparent
          );
        }

        &:hover,
        &:focus-visible {
          font-weight: bold;
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
        position: fixed;
        background: #fff;
        align-self: flex-end;
        border-radius: 4px 4px 0px 0px;
      }
    }

    .search {
      flex: 1;
      display: flex;
      align-items: center;

      .input {
        background: #00000020;
        border: none;
        height: 40px;
        width: 100%;
        max-width: 500px;
        min-width: 250px;
        border-radius: 6px;
      }
    }

    .buttons {
      display: flex;
      padding-right: 20px;
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
</style>
