<template>
  <div :class="$style.details" v-show="chain.length">
    <div
      v-for="parentCommentId of chain"
      :class="{
        [$style.chain]: true,
        unread: isCommentUnread(parentCommentId),
      }"
    >
      <Comment
        :comment-id="parentCommentId"
        :comments-obj="comments"
        :is-parent="true"
        :unread="false"
        resource-type="user"
        :resource-id="resourceId"
        :username="username"
      ></Comment>
      <Comment
        v-for="childCommentId of comments[parentCommentId].children"
        :comment-id="childCommentId"
        :comments-obj="comments"
        :is-parent="false"
        :unread="isCommentUnread(childCommentId)"
        resource-type="user"
        :resource-id="resourceId"
        :username="username"
      ></Comment>
    </div>
  </div>
</template>

<script setup lang="ts">
import Comment from "./comment.vue";

const { comments, messages, msgCount, chain } = defineProps<{
  chain: any;
  messages: any;
  comments: any;
  msgCount: any;
  resourceId: any;
  username: string;
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

<style lang="scss" module>
.details,
.chain {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
