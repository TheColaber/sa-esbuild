export default defineAddon({
  name: "Messaging",
  description:
    "Easy reading and replying to your messages: groups messages, shows full comment text and context, allows direct comment replying.",
  versionAdded: "1.0.0",
  credits: ["World_Languages", "griffpatch"],
  tags: ["recommended"],
  enabledByDefault: true,
});

export const popup = definePopup({
  name: "Messages",
  component: () => import("./component.vue"),
  badge: () => import("./badge.vue"),
  icon: () => import("@iconify-icons/tabler/mail"),
});
