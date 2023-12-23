<template>
  <div>
    <div v-if="show">{{ messageCount }}</div>
  </div>
</template>

<script setup lang="ts">
import PopupAddon from "../../../../src/addon-api/popup";

const { addon } = defineProps<{ addon: PopupAddon }>();
const session = await addon.auth.getSession();
const show = !session.error && !!session.user;

const messageCount = await addon.auth.getMessageCount();
</script>
