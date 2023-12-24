<template>
  <div :class="$style.container">
    <div :class="$style.loader">
      <div :class="$style.error" v-if="error">
        <template v-if="error === 'failedfetch'"
          >Failed to fetch, please check your internet connection.</template
        >
        <template v-if="error === 'notloggedin'">Not logged in</template>
      </div>
      <div v-else-if="loading !== 100">
        <div :class="$style.bar" :style="{ width: loading + '%' }"></div>
      </div>
    </div>
    <Section
      :length="follows.length"
      title="Follows"
      icon="user-plus"
      :no-row-gap="true"
    >
      <a
        target="_blank"
        v-for="item of follows"
        :href="'https://scratch.mit.edu/users/' + item.actor_username"
        :class="$style.link"
      >
        {{ item.actor_username }}
      </a>
    </Section>
    <Section
      :length="studioInvites.length"
      title="Studio Invites"
      icon="envelope-add"
    >
      <span v-for="item of studioInvites">
        <a
          target="_blank"
          :href="'https://scratch.mit.edu/users/' + item.actor_username"
          :class="$style.link"
        >
          {{ item.actor_username }}
        </a>
        invited you to curate
        <a
          target="_blank"
          :href="'https://scratch.mit.edu/studios/' + item.gallery_id"
          :class="$style.link"
        >
          {{ item.title }}
        </a>
      </span>
    </Section>
    <Section
      :length="studioPromotions.length"
      title="Studio promotions"
      icon="shield-plus"
    >
      <span v-for="item of studioPromotions">
        <a
          target="_blank"
          :href="'https://scratch.mit.edu/users/' + item.actor_username"
          :class="$style.link"
        >
          {{ item.actor_username }}
        </a>
        promoted you to manager for the studio
        <a
          target="_blank"
          :href="'https://scratch.mit.edu/studios/' + item.gallery_id"
          :class="$style.link"
        >
          {{ item.gallery_title }}
        </a>
      </span>
    </Section>
    <Section
      :length="studioPromotions.length"
      title="Studio host transfers"
      icon="users-alt"
    >
      <span v-for="item of studioHostTransfers">
        <span v-if="item.admin_actor">A Scratch Team member</span>
        <a
          v-else
          target="_blank"
          :href="'https://scratch.mit.edu/users/' + item.actor_username"
          :class="$style.link"
        >
          {{ item.actor_username }}
        </a>
        made you the host of the studio
        <a
          target="_blank"
          :href="'https://scratch.mit.edu/studios/' + item.gallery_id"
          :class="$style.link"
        >
          {{ item.gallery_title }}
        </a>
      </span>
    </Section>
    <Section
      :length="forumActivity.length"
      title="Forum activity"
      icon="comments-alt"
    >
      <span v-for="item of forumActivity">
        There are new posts in the forum thread
        <a
          target="_blank"
          :href="
            'https://scratch.mit.edu/discuss/topic/' + item.topic_id + '/unread'
          "
          :class="$style.link"
        >
          {{ item.topic_title }}
        </a>
      </span>
    </Section>
    <Section
      :length="studioActivity.length"
      title="Studio activity"
      icon="folder-exclamation"
    >
      <span v-for="item of studioActivity">
        There was new activity in
        <a
          target="_blank"
          :href="'https://scratch.mit.edu/studios/' + item.gallery_id"
          :class="$style.link"
        >
          {{ item.title }}
        </a>
      </span>
    </Section>
    <Section :length="remixes.length" title="Remixes" icon="arrow-random">
      <span v-for="item of remixes">
        <a
          target="_blank"
          :href="'https://scratch.mit.edu/users/' + item.actor_username"
          :class="$style.link"
        >
          {{ item.actor_username }}
        </a>
        remixed your project "{{ item.parent_title }}" as "<a
          target="_blank"
          :href="'https://scratch.mit.edu/projects/' + item.project_id"
          :class="$style.link"
        >
          {{ item.title }} </a
        >"
      </span>
    </Section>
    <Section
      :length="profile.unreadComments"
      :title="
        profile.username === username
          ? 'Your profile'
          : '{{ profile.username }}\'s profile'
      "
      icon="arrow-random"
      v-for="profile of profilesOrdered"
      v-show="profile.unreadComments && profile.loadedComments"
    >
      {{ profile.unreadComments }}
      {{ profile.loadedComments }}
      <CommentChain
        :chain="profile.commentChains"
        :messages="messages"
        :comments="comments"
        :msgCount="msgCount"
        :resource-id="profile.username"
      />
    </Section>
  </div>
</template>

<script setup lang="ts">
import Section from "./section.vue";
import CommentChain from "./comment-chain.vue";
import PopupAddon from "../../../addon-api/popup";
import { computed, ref } from "vue";

const { addon } = defineProps<{ addon: PopupAddon }>();
const username = ref<string>();
let follows = ref<followuser[]>([]);
let studioInvites = ref<curatorinvite[]>([]);
let studioPromotions = ref<becomeownerstudio[]>([]);
let studioHostTransfers = ref<becomehoststudio[]>([]);
let forumActivity = ref<forumpost[]>([]);
let studioActivity = ref<studioactivity[]>([]);
let remixes = ref<remixproject[]>([]);
const comments = ref([]);
const messages = ref([]);
const msgCount = ref<number>();
const profiles = ref<
  {
    username: string;
    unreadComments: number;
    commentChains: string[];
    loadedComments: boolean;
  }[]
>([]);
const profilesOrdered = computed(() => {
  // Own profile first, then others
  return [
    ...profiles.value.filter((profile) => profile.username === username.value),
    ...profiles.value.filter((profile) => profile.username !== username.value),
  ];
});
const studios = ref<
  {
    id: number;
    title: string;
    unreadComments: number;
    commentChains: string[];
    loadedComments: boolean;
  }[]
>([]);
const projects = ref<
  {
    id: number;
    title: string;
    unreadComments: number;
    commentChains: string[];
    loveCount: number;
    favoriteCount: number;
    loversAndFavers: { username: string; loved: boolean; faved: boolean }[];
    loadedComments: boolean;
  }[]
>([]);
const commentLocations = {
  0: [], // Projects
  1: [], // Profiles
  2: [], // Studios
};

let loading = ref<number>(0);
let error = ref<"failedfetch" | "notloggedin">(null);

async function loadMessages() {
  const session = await addon.auth.getSession();
  if ("error" in session) {
    error.value = "failedfetch";
    return;
  }
  if (!session.user) {
    error.value = "notloggedin";
    return;
  }
  username.value = session.user.username;
  const messageCount = await addon.auth.getMessageCount();
  msgCount.value = messageCount;
  const maxPages = Math.min(Math.ceil(msgCount.value / 40) + 1, 25);
  for (let i = 0; i < maxPages; i++, loading.value = (100 * i) / maxPages) {
    const page: (
      | followuser
      | curatorinvite
      | becomeownerstudio
      | becomehoststudio
      | forumpost
      | studioactivity
      | remixproject
      | loveproject
      | favoriteproject
      | addcomment
    )[] = await (
      await fetch(
        `https://api.scratch.mit.edu/users/${
          username.value
        }/messages?limit=40&offset=${40 * i}`,
        {
          headers: {
            "x-token": session.user.token,
          },
        },
      )
    ).json();
    for (const message of page) {
      messages.value.push(message);
      switch (message.type) {
        case "followuser":
          follows.value.push(message);
          break;
        case "curatorinvite":
          studioInvites.value.push(message);
          break;
        case "becomeownerstudio":
          studioPromotions.value.push(message);
          break;
        case "becomehoststudio":
          studioHostTransfers.value.push(message);
          break;
        case "forumpost":
          forumActivity.value.push(message);
          break;
        case "studioactivity":
          studioActivity.value.push(message);
          break;
        case "remixproject":
          remixes.value.push(message);
          break;
        case "loveproject": {
          const project = getProject(message.project_id, message.title);
          project.loveCount++;
          const findLover = project.loversAndFavers.find(
            (obj) => obj.username === message.actor_username,
          );
          if (findLover) findLover.loved = true;
          else
            project.loversAndFavers.push({
              username: message.actor_username,
              loved: true,
              faved: false,
            });
          break;
        }
        case "favoriteproject": {
          const project = getProject(message.project_id, message.project_title);
          project.favoriteCount++;
          const findFaver = project.loversAndFavers.find(
            (obj) => obj.username === message.actor_username,
          );
          if (findFaver) findFaver.faved = true;
          else
            project.loversAndFavers.push({
              username: message.actor_username,
              loved: false,
              faved: true,
            });
          break;
        }
        case "addcomment":
          const resourceId =
            message.comment_type === 1
              ? message.comment_obj_title
              : message.comment_obj_id;
          let location = commentLocations[message.comment_type].find(
            (obj) => obj.resourceId === resourceId,
          );
          if (!location) {
            location = { resourceId, commentIds: [] };
            commentLocations[message.comment_type].push(location);
          }
          location.commentIds.push(message.comment_id);
          if (message.comment_type === 1) {
            console.log({ ...commentLocations[1][0] }, [
              ...location.commentIds,
            ]);
          }
          let resourceObject;
          if (message.comment_type === 0)
            resourceObject = getProject(
              message.comment_obj_id,
              message.comment_obj_title,
            );
          else if (message.comment_type === 1)
            resourceObject = getProfile(message.comment_obj_title);
          else if (message.comment_type === 2)
            resourceObject = getStudio(resourceId, message.comment_obj_title);
          resourceObject.unreadComments++;
          break;
        default:
          console.error("UNKNOWN MESSAGE! Please send to SA Devs:", message);
          break;
      }
      if (commentLocations?.[1]?.[0]?.commentIds.length === 0) {
        console.log(commentLocations[1]);

        throw "aBRUHHHHHHHHHHHHHHHHHHHh";
      }
    }

    for (const profile of profilesOrdered.value) {
      const location = commentLocations[1].find(
        (obj) => obj.resourceId === profile.username,
      );

      if (location) {
        await checkCommentLocation(
          "user",
          location.resourceId,
          location.commentIds,
          profile,
        );
      }
    }
  }
}
loadMessages();

function getProject(projectId: number, title: string) {
  const search = projects.value.find((project) => project.id === projectId);
  if (search) return search;
  const project = {
    id: projectId,
    title,
    unreadComments: 0,
    commentChains: [],
    loveCount: 0,
    favoriteCount: 0,
    loversAndFavers: [],
    loadedComments: false,
  };
  projects.value.push(project);
  return project;
}

function getProfile(username) {
  const search = profiles.value.find((obj) => obj.username === username);
  if (search) return search;
  const obj = {
    username,
    unreadComments: 0,
    commentChains: [],
    loadedComments: false,
  };
  profiles.value.push(obj);

  return obj;
}
function getStudio(studioId, title) {
  const search = studios.value.find((obj) => obj.id === studioId);
  if (search) return search;
  const obj = {
    id: studioId,
    title,
    unreadComments: 0,
    commentChains: [],
    loadedComments: false,
  };
  studios.value.push(obj);
  return obj;
}

function checkCommentLocation(
  resourceType,
  resourceId,
  commentIds,
  elementObject,
) {
  return fetchComments(addon, {
    resourceType,
    resourceId,
    commentIds,
  }).then((fetchedComments) => {
    if (Object.keys(fetchedComments).length === 0) {
      elementObject.unreadComments = 0;
    }
    for (const commentId of Object.keys(fetchedComments)) {
      const commentObject = fetchedComments[commentId];
      let domContent = commentObject.content; // TODO: fixCommentContent(commentObject.content);
      if (resourceType !== "user") {
        // Re-wrap elements from <body> to <div>
        const newElement = document.createElement("div");
        if (commentObject.replyingTo) {
          // We need to append the replyee ourselves
          newElement.append(
            Object.assign(document.createElement("a"), {
              href: `https://scratch.mit.edu/users/${commentObject.replyingTo}`,
              textContent: "@" + commentObject.replyingTo,
            }),
          );
          newElement.append(" ");
        }
        newElement.append(...domContent.childNodes);
        domContent = newElement;
      }
      commentObject.content = domContent;
      comments.value[commentId] = commentObject;
    }

    // Preserve chronological sort when using JSON API
    const parentComments = Object.entries(comments).filter(
      (c) => c[1].childOf === null,
    );
    const sortedParentComments = parentComments.sort(
      (a, b) => new Date(b[1].date).getTime() - new Date(a[1].date).getTime(),
    );
    const sortedIds = sortedParentComments.map((arr) => arr[0]);
    const resourceGetFunction =
      resourceType === "project"
        ? getProject
        : resourceType === "user"
          ? getProfile
          : getStudio;

    const resourceObject = resourceGetFunction(resourceId);
    for (const sortedId of sortedIds)
      resourceObject.commentChains.push(sortedId);

    elementObject.loadedComments = true;
  });
}

function fetchComments(
  addon,
  { resourceType, resourceId, commentIds, page = 1, commentsObj = {} },
) {
  if (resourceType === "user")
    return fetchLegacyComments(addon, {
      resourceType,
      resourceId,
      commentIds,
      page,
      commentsObj,
    });
  // return fetchMigratedComments(addon, { resourceType, resourceId, commentIds, page, commentsObj });
}

const parser = new DOMParser();

async function fetchLegacyComments(
  addon,
  { resourceType, resourceId, commentIds, page = 1, commentsObj = {} },
) {
  const res = await fetch(
    `https://scratch.mit.edu/site-api/comments/${resourceType}/${resourceId}/?page=${page}`,
    {
      credentials: "omit",
    },
  );
  if (!res.ok) {
    console.warn(
      `Ignoring comments ${resourceType}/${resourceId} page ${page}, status ${res.status}`,
    );
    return commentsObj;
  }
  const text = await res.text();
  const dom = parser.parseFromString(text, "text/html");
  for (const commentChain of dom.querySelectorAll(
    ".top-level-reply:not(.removed)",
  )) {
    if (commentIds.length === 0) {
      // We found all comments we had to look for
      return commentsObj;
    }
    let foundComment = false;
    const parentComment = commentChain.querySelector("div");
    const parentId = Number(parentComment.getAttribute("data-comment-id"));

    const childrenComments = {};
    const children = commentChain.querySelectorAll("li.reply:not(.removed)");
    for (const child of children) {
      const childId = Number(
        child.querySelector("div").getAttribute("data-comment-id"),
      );
      if (commentIds.includes(childId)) {
        foundComment = true;
        commentIds.splice(
          commentIds.findIndex((commentId) => commentId === childId),
          1,
        );
      }
      const author = child.querySelector(".name").textContent.trim();
      childrenComments[`${resourceType[0]}_${childId}`] = {
        author: author.replace(/\*/g, ""),
        authorId: Number(
          child.querySelector(".reply").getAttribute("data-commentee-id"),
        ),
        content: child.querySelector(".content"),
        date: child.querySelector(".time").getAttribute("title"),
        children: null,
        childOf: `${resourceType[0]}_${parentId}`,
        scratchTeam: author.includes("*"),
      };
    }

    if (commentIds.includes(parentId)) {
      foundComment = true;
      commentIds.splice(
        commentIds.findIndex((commentId) => commentId === parentId),
        1,
      );
    }

    if (foundComment) {
      const parentAuthor = parentComment
        .querySelector(".name")
        .textContent.trim();
      commentsObj[`${resourceType[0]}_${parentId}`] = {
        author: parentAuthor.replace(/\*/g, ""),
        authorId: Number(
          parentComment
            .querySelector(".reply")
            .getAttribute("data-commentee-id"),
        ),
        content: parentComment.querySelector(".content"),
        date: parentComment.querySelector(".time").getAttribute("title"),
        children: Object.keys(childrenComments),
        childOf: null,
        scratchTeam: parentAuthor.includes("*"),
      };
      for (const childCommentId of Object.keys(childrenComments)) {
        commentsObj[childCommentId] = childrenComments[childCommentId];
      }
    }
  }
  // We haven't found some comments
  if (page < 3)
    return await fetchLegacyComments(addon, {
      resourceType,
      resourceId,
      commentIds,
      page: page + 1,
      commentsObj,
    });
  else {
    console.log(
      "Could not find all comments for ",
      resourceType,
      " ",
      resourceId,
      ", remaining ids: ",
      JSON.parse(JSON.stringify(commentIds)),
    );
    return commentsObj;
  }
}

type followuser = {
  type: "followuser";
  actor_username: string;
};
type curatorinvite = {
  type: "curatorinvite";
  actor_username: string;
  gallery_id: string;
  title: string;
};
type becomeownerstudio = {
  type: "becomeownerstudio";
  actor_username: string;
  gallery_id: string;
  gallery_title: string;
};
type becomehoststudio = {
  type: "becomehoststudio";
  admin_actor: boolean;
  actor_username: string;
  gallery_id: string;
  gallery_title: string;
};
type forumpost = {
  type: "forumpost";
  topic_id: string;
  topic_title: string;
};
type studioactivity = {
  type: "studioactivity";
  gallery_id: string;
  title: string;
};
type remixproject = {
  type: "remixproject";
  actor_username: string;
  parent_title: string;
  title: string;
  project_id: string;
};
type loveproject = {
  type: "loveproject";
  project_id: number;
  title: string;
  actor_username: string;
};
type favoriteproject = {
  type: "favoriteproject";
  project_id: number;
  project_title: string;
  actor_username: string;
};
type addcomment = {
  type: "addcomment";
  comment_type: 0 | 1 | 2;
  id: number;
  actor_id: number;
  actor_username: string;
  comment_fragment: string;
  comment_id: number;
  comment_obj_id: number;
  comment_obj_title: string;
  commentee_username: null;
  datetime_created: Date;
};
</script>

<style lang="scss" module>
.container {
  flex: 1;
  display: flex;
  gap: 10px;
  flex-direction: column;
  margin: 0px 10px;
  padding-bottom: 10px;

  .loader {
    overflow: hidden;
    font-weight: 600;
    .error {
      display: flex;
      justify-content: center;
      margin-top: 10px;
    }
    .bar {
      border-radius: 8px;
      height: 4px;
      background-image: var(--gradient);
    }
  }
}

.link {
  color: var(--blue-text);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    border-radius: 4px;
    outline: none;
    box-shadow: 0 0 0 3px #fff;
  }
}
</style>
