<template>
  <div :class="[$style.wrapper, { theme: true, lightTheme }]">
    <Suspense>
      <component :is="addon.component" :addon="addonInstance" />
    </Suspense>
  </div>
</template>

<script setup lang="ts">
// TODO: Support other languages.
import * as addons from "#addon-popups";
import { syncStorage } from "../../../background/storage";
import pageStorage from "../../storage";
import PopupAddon from "../../../addon-api/popup";
import { ref } from "vue";

const id = new URL(location.href).searchParams.get("id");
if (!id) throw "id missing";
const addon = addons[id];
if (!addon) throw "addon not valid";
const addonInstance = new PopupAddon(id);

const lightTheme = ref(pageStorage.get("lightTheme") === true);
syncStorage.watch(["lightTheme"], ({ lightTheme: { newValue } }) => {
  lightTheme.value = newValue;
});
</script>

<style lang="scss" module>
.wrapper {
  height: 100vh;
  background: var(--background-primary);
}
</style>
