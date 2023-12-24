<template>
  <div class="message-type-details" v-show="chain.length">
    <div
      class="comment-chain"
      v-for="parentCommentId of chain"
      :class="{ unread: isCommentUnread(parentCommentId) }"
    >
      <comment
        :comment-id="parentCommentId"
        :comments-obj="comments"
        :is-parent="true"
        :unread="false"
        resource-type="user"
        :resource-id="resourceId"
      ></comment>
      <comment
        v-for="childCommentId of comments[parentCommentId].children"
        :comment-id="childCommentId"
        :comments-obj="comments"
        :is-parent="false"
        :unread="isCommentUnread(childCommentId)"
        resource-type="user"
        :resource-id="resourceId"
      ></comment>
    </div>
  </div>
</template>

<script setup lang="ts">
const { comments, messages, msgCount } = defineProps<{
  chain: any;
  messages: any;
  comments: any;
  msgCount: any;
  resourceId: any;
}>();

function isCommentUnread(commentId: string) {
  const realCommentId = Number(commentId.substring(2));
  const messageIndex = messages.findIndex(
    (msg) => msg.comment_id === realCommentId,
  );
  if (messageIndex === -1) return false;
  else if (messageIndex < msgCount) {
    if (comments[commentId].childOf) {
      if (isCommentUnread(comments[commentId].childOf)) return false;
      else return true;
    } else return true;
  } else return false;
}
</script>
