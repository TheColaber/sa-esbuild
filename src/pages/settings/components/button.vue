<template>
  <button :class="$style.container">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
// defineEmits(["click"]);
</script>

<style module lang="scss">
.container {
  background: var(--background-primary);
  border: 1px solid var(--border);
  color: var(--content-text);
  padding: 7px 12px;
  border-radius: 4px;
  font-family: inherit;
  font-size: 12px;
  cursor: pointer;
}
</style>
