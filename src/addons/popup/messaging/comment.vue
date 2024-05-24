<template>
  <div class="comment"
    :class="{ 'child-comment': !isParent, 'unread': unread, 'comment-me': comment.author === username }">
    <a class="comment-author nolink" rel="noopener noreferrer" target="_blank"
      href="https://scratch.mit.edu/users/{{ comment.author }}/">{{ comment.author }}</a>{{
      comment.scratchTeam ? "*" : "" }}
    <span class="comment-time" v-show="deleteStep !== 1 && !deleted">
      · {{ commentTimeAgo }}
      <a rel="noopener noreferrer" target="_blank" :href="commentURL">
        <Icon :icon="'uil:popout'" class="popout-comment" :title="'Open in new tab'" />
      </a>
    </span>
    <a @click="deleteComment()" class="delete-btn" :class="{ 'bold': deleteStep === 1 }" v-show="!deleted"
      v-if="canDeleteComment">{{ deleteStep === 0 ? "Delete" : "Confirm" }}
    </a>
    <bdo dir="ltr">
      <!-- prevents LTR comments from being messed up in RTL layout - not ideal, but consistent with Scratch -->
      <div class="comment-content" :class="{ 'comment-self': comment.author === username }">
        <div class="comment-content-text">
          <span v-show="deleting">{{ "Deleting" }}</span>
          <span v-show="deleted && !deleting">{{ "Deleted" }}</span>
          {{ comment.content.innerText }}
          <!-- <dom-element-renderer :element="comment.content" v-show="!deleted"></dom-element-renderer> -->
        </div>
        <a class="reply-button-comment" @click="replying = true" :class="{ 'replying': replying }"
          :style="{ 'visibility': replying ? 'hidden' : 'visible' }" v-show="!deleted">{{ "Reply" }}</a>
      </div>
    </bdo>
    <div class="reply-box-comment" v-show="replying">
      <textarea class="reply-textarea" maxlength="500" v-model="replyBoxValue"
        @keyup.enter="($event.ctrlKey || $event.metaKey) && postComment()"></textarea>
      <div class="reply-box-buttons">
        <button @click="postComment()" class="large-button post-button" :disabled="postingComment">
          {{ postingComment ? "Posting" : "Post" }}
        </button>
        <button @click="replying = false" v-show="!postingComment" class="large-button">
          {{ "Cancel" }}
        </button>
        <span class="comment-chars"> {{ charactersLeft + " characters left" }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import PopupAddon from '../../../addon-api/popup';
import { Icon } from '@iconify/vue';

const {commentsObj, commentId, resourceType, resourceId, username } = defineProps<{
  // addon: PopupAddon
  commentId: any;
  commentsObj: any;
  isParent: any;
  unread: any;
  resourceType: any;
  resourceId: any;
  username: string;
}>();

const replying = ref(false);
const replyBoxValue = ref("");
const deleted = ref(false);
const deleting = ref(false);
const deleteStep = ref(0);
const postingComment = ref(false);

const comment = commentsObj[commentId];

const dateNow = Date.now();

const commentTimeAgo = computed(() => {
  // TODO: lang
  const timeFormatter = new Intl.RelativeTimeFormat("en", {
    localeMatcher: "best fit",
    numeric: "auto",
    style: "short",
  });
  const commentTimestamp = new Date(comment.date).getTime();
  const timeDiffSeconds = (dateNow - commentTimestamp) / 1000;
  let options;
  if (timeDiffSeconds < 60) return timeFormatter.format(0, "second");
  else if (timeDiffSeconds < 3600) options = { unit: "minute", divideBy: 60 };
  else if (timeDiffSeconds < 86400) options = { unit: "hour", divideBy: 60 * 60 };
  else options = { unit: "day", divideBy: 60 * 60 * 24 };
  return timeFormatter.format(-Math.round(timeDiffSeconds / options.divideBy), options.unit);
});
const urlPath =
          resourceType === "user" ? "users" : resourceType === "gallery" ? "studios" : "projects";
        const commentPath = resourceType === "gallery" ? "comments/" : "";
const commentURL = `https://scratch.mit.edu/${urlPath}/${
          resourceId
        }/${commentPath}#comments-${commentId.substring(2)}`;

let canDeleteComment = true;
if (resourceType === "user") canDeleteComment = resourceId === username;
if (resourceType === "project") canDeleteComment = comment.project === username;

const charactersLeft = computed(() => 500 - replyBoxValue.value.length)

function deleteComment() {
  console.log("delete comment");
}
function postComment() {
  console.log("post comment");
}
</script>

<style lang="scss">
.comment {
  padding: 3px 8px;
  background: var(--background-primary);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 12px;
}
.fullscreen .comment {
  margin-inline: 12px;
}
.comment.unread,
.unread .comment {
  /* TODO */
  background-color: #000;
}
.comment-content {
  word-break: break-word;
  clip-path: inset(0 0 0 0); /* keep zalgo in this box */
}
.comment-content-text {
  display: inline-block;
}
.comment-content-text > span,
.comment-content-text .dom-element-renderer > * {
  margin-right: 10px;
  /* For multi-line comments */
  white-space: break-spaces;
}
.comment-author {
  font-weight: 600;
  color: var(--dark-red-text);
}
.comment-me .comment-author {
  font-weight: 700;
  color: var(--green-text);
}
.unread .comment-author {
  font-weight: 700;
}
.comment-time {
  /*font-weight: 200;*/
  opacity: 0.5;
}
.popout-comment {
  cursor: pointer;
  height: 10px;
  vertical-align: baseline;
  padding-left: 2px;
  filter: var(--content-icon-filter);
}
[dir="rtl"] .popout-comment {
  transform: scaleX(-1);
}
.delete-btn {
  float: right;
  opacity: 0;
  color: var(--gray-text);
  font-size: 0.65rem;
  padding-top: 2px;
}
.bold {
  font-weight: 600;
  color: var(--red);
}
.child-comment {
  margin-inline-start: 3em;
}
.fullscreen .child-comment {
  margin-inline-start: calc(3em + 12px);
}
.unread {
  font-weight: 500;
}
.reply-button-comment {
  opacity: 0;
  color: var(--blue-text);
  font-weight: 600;
  user-select: none;
  cursor: pointer;
  text-decoration: none;
}
.comment:hover .reply-button-comment,
.comment:hover .delete-btn {
  opacity: 1;
}
.reply-textarea {
  display: block;
  width: 100%;
  box-sizing: border-box;
  height: 5rem;
  font-family: Arial, sans-serif;
  padding: 8px;
  resize: vertical;
  margin-top: 8px;
  font-size: 12px;
  border-radius: 4px;
  border: 1px solid var(--border);
  background-color: var(--background-primary);
  color: var(--content-text);
  transition: 0.2s ease;
}
.reply-textarea:focus {
  outline: none;
  border-color: var(--theme);
  /* TODO */
  box-shadow: var(0 0 0 3px var(rgba(255, 123, 38, 0.35)));
}
.reply-box-buttons {
  display: flex;
  align-items: center;
  margin-top: 8px;
  margin-bottom: 5px;
}
.reply-box-buttons > button {
  margin-inline-end: 8px;
}
.post-button {
  background-color: var(--blue);
  color: #fff;
}
.post-button:hover:not([disabled]) {
  background-color: var(--blue);
  border-color: #0e44b8;
}
.post-button:focus-visible {
  border-color: #0e44b8;
}
.comment-chars {
  margin-inline-start: auto;
  font-weight: normal;
  font-variant: tabular-nums;
}
</style>