<template>
  <button :class="$style['switch-background']">
    <div :class="$style.switch"></div>
  </button>
</template>

<script lang="ts" setup></script>

<style lang="scss" module>
.switch-background {
  background-image: var(--gradient);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  border: none;
  color: inherit;
  padding: 0px;
  min-width: 40px;
  height: 20px;

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--content-text);
  }

  &[state="true"] {
    .switch {
      background-color: transparent;
      &::before {
        background-color: #fff;
        left: 25px;
      }
    }
  }

  .switch {
    display: flex;
    background-color: var(--switch-background);
    height: 20px;
    position: relative;
    cursor: pointer;
    transition: all 0.25s ease;
    &::before {
      content: "";
      position: absolute;
      display: block;
      width: 10px;
      height: 10px;
      background-color: var(--disabled);
      border-radius: 5px;
      top: 5px;
      left: 5px;
      transition: left 0.25s ease;
    }
  }
}
</style>
