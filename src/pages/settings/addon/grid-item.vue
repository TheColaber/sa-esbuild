<template>
  <div
    :class="$style.addon"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <img
      :class="$style.thumbnail"
      :src="(hovering && addon.demo) || addon.image"
    />
    <div :class="$style.info">
      <span :class="$style.name">{{ addon.name }}</span>
      <span :class="$style.description">{{ addon.description }}</span>

      <div :class="$style.buttons">
        <Button
          :class="$style['try-button']"
          @click="tryAddon"
          v-if="addon.userPreview"
        >
          Try
        </Button>
        <Button :class="$style['enable-button']" @click="buttonClick">
          {{ enabledStates[addon.id] ? "Edit" : "Enable" }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { enabledStates, toggleAddon, port } from "../store";
import Button from "../components/button.vue";
import * as addons from "#addons";
import { ref } from "vue";
const { id } = defineProps<{ id: string }>();
const addon = addons[id];

const hovering = ref(false);

function buttonClick() {
  if (enabledStates.value[addon.id] === true) {
    window.location.hash = "#addon-" + addon.id;
  } else {
    toggleAddon(addon.id);
  }
}

function tryAddon() {
  port.send("openScratchEditor", addon.id);
}
</script>

<style lang="scss" module>
.addon {
  display: flex;
  flex-direction: column;
  width: 270px;
  border-radius: 4px;
  border: 2px solid var(--content-text);
  background: var(--background-secondary);
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 0 10px 1px;
  }

  .thumbnail {
    border-radius: 0px 0px 4px 4px;
    box-shadow: 0 0 8px 0px var(--content-shadow);
  }
  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 10px;
    gap: 6px;

    .name {
      font-size: 18px;
      background-image: linear-gradient(
        45deg,
        var(--theme),
        hsl(24 100% 80% / 1),
        var(--theme) 80%
      );
      color: transparent;
      font-weight: 900;
      background-clip: text;
      background-size: 200%;
      animation: pulse 4.5s infinite;
      animation-timing-function: linear;
      user-select: none;

      @keyframes pulse {
        100% {
          background-position: 200%;
        }
      }
    }

    .description {
      font-size: 12px;
      flex: 1;
      color: var(--description-text);
    }

    .buttons {
      display: flex;
      gap: 5px;
      justify-content: flex-end;

      .try-button {
        background: none;
        border: hsl(24 100% 70% / 1) 2px solid;
        color: hsl(24 100% 70% / 1);
        transition: 0.3s all ease;
        width: 50px;
        &:hover {
          box-shadow: inset 0 0 0 2em hsl(24 100% 70% / 1);
          color: #fff;
          font-weight: 700;
        }
      }

      .enable-button {
        background: none;
        border: var(--content-text) 2px solid;
        color: var(--content-text);
        transition: 0.3s all ease;
        width: 70px;
        &:hover {
          box-shadow: inset 0 0 0 2em var(--content-text);
          color: var(--background-primary);
          font-weight: 700;
        }
      }
      //   background: var(--gradient);
      //   transition: all 0.5s ease-in-out;
      //   overflow: hidden;
      //   position: relative;

      //   &::before {
      //     content: "";
      //   }

      //   &:hover {
      //     animation: pulse 0.6s;
      //     box-shadow: 0 0 0 10px transparent;

      //     @keyframes pulse {
      //       0% { box-shadow: 0 0 0 0 var(--theme) }
      //     }

      //     &:after {
      //       left: 120%;
      //       transition: all 550ms cubic-bezier(0.19, 1, 0.22, 1);
      //     }
      //   }
      //   &:after {
      //     background: #fff;
      //     content: "";
      //     height: 155px;
      //     left: -75px;
      //     opacity: 0.2;
      //     position: absolute;
      //     top: -50px;
      //     transform: rotate(35deg);
      //     transition: all 550ms cubic-bezier(0.19, 1, 0.22, 1);
      //     width: 50px;
      //   }
      // }
    }
  }
}
</style>
