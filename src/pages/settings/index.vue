<template>
  <div :class="[$style.container, { theme: true, lightTheme }]">
    <template v-if="!showOnboarding">
      <Header v-model:tab="tab"></Header>
      <Suspense>
        <Content :tab="tab"></Content>
      </Suspense>
      <Footer></Footer>
    </template>
    <Onboarding v-else />
  </div>
</template>

<script setup lang="ts">
import Content from "./content.vue";
import Header from "./components/header.vue";
import { syncStorage } from "../../background/storage";
import pageStorage from "../storage";
import { onMounted, ref, watch } from "vue";
import { updateAll, tab, showOnboarding } from "./store";
import Onboarding from "./onboarding.vue";
import Footer from "./footer.vue";

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
  showOnboarding.value = !onboarded;
});
</script>

<style lang="scss" module>
.container {
  font-family: "Roboto", sans-serif;
  display: flex;
  flex-direction: column;
  background-color: var(--background-primary);
  color: var(--content-text);
  height: 100vh;
}
</style>
