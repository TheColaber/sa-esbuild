<template>
  <div :class="$style.container">
    <div :class="$style.search">
      <input
        ref="inputEl"
        v-model="searchFilter"
        :class="$style.input"
        id="search"
        type="text"
        placeholder="Search for addons"
        autocomplete="on"
        list="suggestions"
      />
      <label :class="$style.icon" for="search"><Icon :icon="search" /></label>
    </div>
    <datalist id="suggestions" :class="$style.suggestions">
      <option :class="$style.suggestion" v-for="suggestion of suggestions">
        {{ suggestion }}
      </option>
    </datalist>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import search from "@iconify-icons/tabler/search";
import { searchFilter, suggestions } from "../store";
import { ref } from "vue";
const inputEl = ref<HTMLInputElement>();
window.addEventListener("keydown", function (e) {
  if ((e.ctrlKey && e.key === "f") || e.key === "/") {
    e.preventDefault();
    inputEl.value.focus();
  } else if (e.key === "Escape" && document.activeElement === inputEl.value) {
    e.preventDefault();
    searchFilter.value = "";
  }
});
</script>

<style lang="scss" module>
.container {
  display: flex;
  justify-content: center;

  .search {
    min-height: 40px;
    display: flex;
    align-items: center;
    background: #00000020;
    height: 40px;
    width: min(100%, 650px);
    border-radius: 6px;
    color: inherit;
    font-size: 18px;

    &:has(:focus-visible) {
      box-shadow: 0 0 0 3px #fff;
    }

    .input {
      padding: 0px 15px;

      width: 100%;
      background: none;
      border: none;
      font-size: inherit;
      color: inherit;
      font-family: inherit;
      height: 100%;

      &::-webkit-calendar-picker-indicator {
        display: none !important;
      }

      &::placeholder {
        color: inherit;
        opacity: 0.6;
      }

      &:focus-visible {
        outline: none;
      }
    }
    .icon {
      padding: 0px 15px;
    }
  }
  .suggestions {
    position: absolute;
    background-color: white;
    border: 1px solid blue;
    border-radius: 0 0 5px 5px;
    border-top: none;
    font-family: sans-serif;
    width: 350px;
    padding: 5px;
    max-height: 10rem;
    overflow-y: auto;

    .suggestion {
      background-color: white;
      padding: 4px;
      color: blue;
      margin-bottom: 1px;
      font-size: 18px;
      cursor: pointer;
    }
  }
}
</style>
