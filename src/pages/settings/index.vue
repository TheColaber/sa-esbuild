<template>
  <div :class="[$style.container, { theme: true, lightTheme }]">
    <!-- <Header v-model:lightTheme="lightTheme"></Header> -->
    <Suspense>
      <Content></Content>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import Content from "./content.vue";
// import Header from "./header.vue";
import { syncStorage } from "../../background/storage";
import pageStorage from "../storage";
import { ref, watch } from "vue";

const lightTheme = ref(pageStorage.get("lightTheme") === true);
syncStorage.watch(["lightTheme"], ({ lightTheme: newLightTheme }) => {
  lightTheme.value = newLightTheme;
  pageStorage.set("lightTheme", lightTheme.value);
});

watch(lightTheme, (newVal) => {
  syncStorage.set({ lightTheme: newVal });
});
</script>

<style lang="scss" module>
.container {
  display: flex;
  flex-direction: column;
  background-color: var(--background-primary);
  color: var(--content-text);
}
</style>
