<template>
  <div
    v-if="!showOnboarding"
    :class="[$style.container, { theme: true, lightTheme }]"
  >
    <Header v-model:tab="tab"></Header>
    <Suspense>
      <Content :tab="tab"></Content>
    </Suspense>
  </div>
  <Onboarding v-else />
</template>

<script setup lang="ts">
import Content from "./content.vue";
import Header from "./components/header.vue";
import { syncStorage } from "../../background/storage";
import pageStorage from "../storage";
import { onMounted, ref, watch } from "vue";
import { updateAll, tab, showOnboarding } from "./store";
import Onboarding from "./onboarding.vue";

function getTabFromHash() {
  const { hash } = window.location;
  let hashValue = hash ? hash.slice(1) : "explore";
  if (hashValue.startsWith("addon-")) {
    return (tab.value = "enabled");
  }
  if (
    hashValue !== "explore" &&
    hashValue !== "enabled" &&
    hashValue !== "themes" &&
    hashValue !== "hotkeys" &&
    hashValue !== "superpresets" &&
    hashValue !== "more"
  ) {
    return (tab.value = "explore");
  }
  tab.value = hashValue;
}

getTabFromHash();

onMounted(() => {
  setTimeout(() => {
    const hash = window.location.hash;
    window.location.hash = "";
    window.location.hash = hash;

    window.addEventListener("hashchange", () => {
      updateAll();
      getTabFromHash();
    });
  }, 100);
});

const lightTheme = ref(pageStorage.get("lightTheme") === true);
syncStorage.watch(({ lightTheme: newLightTheme }) => {
  lightTheme.value = newLightTheme;
  pageStorage.set("lightTheme", lightTheme.value);
});

watch(lightTheme, (newVal) => {
  syncStorage.set({ lightTheme: newVal });
});

syncStorage.get("onboarded").then(({ onboarded = false }) => {
  showOnboarding.value = true || !onboarded;
});
</script>

<style lang="scss" module>
.container {
  display: flex;
  flex-direction: column;
  background-color: var(--background-primary);
  color: var(--content-text);
  height: 100vh;
}
</style>
