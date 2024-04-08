<template>
  <div :class="[$style.background, { theme: true }]">
    <div :class="$style.container">
      <template v-if="page === 0">
        <img :class="$style.logo" :src="'../../images/icon.svg'" />
        <div :class="$style.title">Welcome to Scratch Addons!</div>
        <div :class="$style.description">
          Soon, you'll have access to hundreds of addons giving you complete
          control over your Scratch expirience. With so many addons to choose
          and configure, it's easy to get overwelmed. Let's start by looking
          through some of our popular addons!
        </div>
        <Button :class="$style.button" @click="next">Get Started!</Button>
      </template>
      <template v-else-if="page === 1">
        <div :class="$style.title">Necessary Editor Addons</div>
        <div :class="$style.description">
          These addons increase your productivity in the Scratch Editor.
        </div>
        <div>
          <GridItem :id="'find-bar'" />
        </div>
        <Button :class="$style.button" @click="exit">Next</Button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { syncStorage } from "../../background/storage";
import Button from "./components/button.vue";
import { showOnboarding } from "./store";
import GridItem from "./addon/grid-item.vue";

function next() {
  page.value++;
}

function exit() {
  showOnboarding.value = false;
  syncStorage.set({ onboarded: true });
}

const page = ref(0);
</script>

<style lang="scss" module>
.background {
  display: flex;
  background: var(--gradient);
  color: #fff;
  height: 100%;
  padding: 30px;
  box-sizing: border-box;
  .container {
    background: var(--background-secondary);
    border: 1px solid var(--background-tertiary);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;

    .logo {
      height: 256px;
      margin-bottom: 30px;
    }
    .title {
      font-family: "Sora", sans-serif;
      font-size: 36px;
    }
    .description {
      display: flex;
      justify-content: center;
      text-align: center;
      font-size: 14px;
      width: 500px;
      margin-bottom: 20px;
    }
    .button {
      font-size: 18px;
      padding: 10px 20px;
    }
  }
}
</style>
