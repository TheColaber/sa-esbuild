<template>
  <div :class="$style.presets">
    <div :class="$style.preset" v-for="preset of presets">
      <div>{{ preset.name }}</div>
      <div>{{ preset.description }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import presets from "./presets";
</script>

<style lang="scss" module>
.presets {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.preset {
  color: inherit;
  font-family: inherit;
  text-align: start;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid var(--background-tertiary);
  background: var(--background-secondary);
  box-shadow: var(--content-shadow);
  padding: 6px;

  &:focus-visible {
    box-shadow: 0 0 0 3px #fff;
    outline: none;
  }
}
</style>
