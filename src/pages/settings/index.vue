<template>
  <div :class="[$style.container, { theme: true, lightTheme }]">
    <Header v-model:tab="tab" v-model:search-filter="searchFilter"></Header>
    <Suspense>
      <Content :tab="tab" :searchFilter="searchFilter"></Content>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import Content from "./content.vue";
import Header from "./components/header.vue";
import { syncStorage } from "../../background/storage";
import pageStorage from "../storage";
import { onMounted, ref, watch } from "vue";
import { updateAll } from "./store";

function getTabFromHash() {
  const { hash } = window.location;
let hashValue = hash ? hash.slice(1) : "explore";
let tab: "explore" | "enabled" | "themes" = hashValue;
if (hashValue.startsWith("addon-")) {
  tab = "enabled";
}
if (tab !== "explore" && tab !== "enabled" && tab !== "themes") {
  tab = "explore";
}
return tab;
}

const tab = ref<"explore" | "enabled" | "themes">(getTabFromHash());


onMounted(() => {
  setTimeout(() => {
    const hash = window.location.hash;
    window.location.hash = "";
    window.location.hash = hash;
    window.addEventListener("hashchange", () => {
      updateAll()
      tab.value = getTabFromHash();
    });
  }, 100)
})

const searchFilter = ref("");

const lightTheme = ref(pageStorage.get("lightTheme") === true);
syncStorage.watch(({ lightTheme: newLightTheme }) => {
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
