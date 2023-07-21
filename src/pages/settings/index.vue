<template>
  <!-- <div :class="[$style.container, { theme: true, lightTheme }]">
    <Header v-model:lightTheme="lightTheme"></Header>
    <Suspense>
      <Content></Content>
    </Suspense>
  </div> -->
</template>

<script setup lang="ts">
// import Content from "./content.vue";
// import Header from "./header.vue";
import { syncStorage } from "../../storage/extension";
import pageStorage from "../../storage/pages";
import { ref, watch } from "vue";

const lightTheme = ref(pageStorage.getItem("lightTheme") === true);
syncStorage.valueStream.subscribe((values) => {
  if ("lightTheme" in values) {
    lightTheme.value = values.lightTheme;
    pageStorage.setItem("lightTheme", lightTheme.value);
  }
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
