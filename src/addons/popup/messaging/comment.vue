<template>
  {{ commentId }}
</template>

<script setup lang="ts">
defineProps<{
  commentId: any;
  commentsObj: any;
  isParent: any;
  unread: any;
  resourceType: any;
  resourceId: any;
}>();
</script>
