<template>
  <div :class="[$style.container, { theme: true }]">
    <template v-if="true">
      <div>Welcome to Scratch Addons</div>
      <img :src="'../../images/icon.svg'">
      <div>It's time to give you complete control over scratch.</div>
      <button>Get Started!</button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { syncStorage } from '../../background/storage';

syncStorage.set({onboarded: true})
</script>

<style lang="scss" module>
.container {
  display: flex;
  flex-direction: column;
  background: var(--gradient);
  color: #fff;
  min-height: 100vh;
}
</style>
