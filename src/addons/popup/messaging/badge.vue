<template>
  <div v-if="show">
    <div>{{ messageCount }}</div>
  </div>
</template>

<script setup lang="ts">
import PopupAddon from "../../../../src/addon-api/popup";

const { addon } = defineProps<{ addon: PopupAddon }>();
const session = await addon.auth.getSession();
const show = !("error" in session) && !!session.user;

const messageCount = await addon.auth.getMessageCount();
</script>
