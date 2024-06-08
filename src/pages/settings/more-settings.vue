<template>
  <div>
    Scratch Addons Theme: {{ lightTheme ? "Light" : "Dark" }}
    <button @click="changeTheme">Switch</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { syncStorage } from "../../background/storage";

const theme = "test";
const storage = await syncStorage.get("lightTheme");

const lightTheme = ref(storage.lightTheme);
syncStorage.watch(({ lightTheme: newLightTheme }) => {
  lightTheme.value = newLightTheme;
});
function changeTheme() {
  syncStorage.set({ lightTheme: !lightTheme.value });
}
</script>
