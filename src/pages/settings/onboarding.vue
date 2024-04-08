<template>
  <div :class="[$style.background, { theme: true }]">
    <div :class="$style.container">
      <template v-if="true">
        <img :class="$style.logo" :src="'../../images/icon.svg'" />
        <div>Welcome to Scratch Addons</div>
        <div>It's time to give you complete control over scratch.</div>
        <Button @click="exit">Get Started!</Button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { syncStorage } from "../../background/storage";
import Button from "./components/button.vue";
import { showOnboarding } from "./store";
showOnboarding
function exit() {
  showOnboarding.value = false;
  syncStorage.set({ onboarded: true });
}
</script>

<style lang="scss" module>
.background {
  display: flex;
  background: var(--gradient);
  color: #fff;
  min-height: 100vh;
  padding: 30px;
  box-sizing: border-box;
.container {
  background: var(--background-primary);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
    justify-content: center;
    width: 100%;
    .logo {
      height: 256px;
    }
}
}
</style>
