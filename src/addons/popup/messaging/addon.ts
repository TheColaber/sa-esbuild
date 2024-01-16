import component from "./component.vue";
import badge from "./badge.vue";
import mailIcon from "@iconify-icons/tabler/mail";

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
  component,
  badge,
  icon: mailIcon,
});
