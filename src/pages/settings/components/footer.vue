<template>
  <div :class="$style.container">
    <div :class="$style.bar">
      <button :class="$style.button">Support</button>
      <button :class="$style.button">Feedback</button>
      <a
        href="https://scratchaddons.com/credits"
        target="_blank"
        :class="$style.button"
        >Credits</a
      >
      <a
        href="https://scratchaddons.com/translate"
        target="_blank"
        :class="$style.button"
        >Help Translate</a
      >
      <a href="https://scratchaddons.com" target="_blank" :class="$style.button"
        >Website</a
      >
      <a
        href="https://github.com/ScratchAddons/ScratchAddons"
        target="_blank"
        :class="$style.button"
        >Github</a
      >
    </div>
  </div>
</template>

<style lang="scss" module>
.container {
  flex: 1;
  display: flex;
  align-items: flex-end;

  .bar {
    display: flex;
    background-color: var(--background-secondary);
    border-top: 1px solid var(--border);
    justify-content: center;
    width: 100%;

    .button {
      background: none;
      border: none;
      color: inherit;
      padding: 6px max(14px, 1.5%);
      font-family: inherit;
      cursor: pointer;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
