export default defineAddon({
  name: "Copy, cut, and paste blocks",
  description: "todo",
  versionAdded: "2.0.0",
});

export const scripts = defineScripts([
  {
    script: () => import("./script.ts"),
    matches: ["projects"],
  },
]);

export const strings = defineStrings({
  // TODO copy and paste strings can be taken from redux strings.
  copy: "Copy",
  paste: "Paste",
  cut: "Cut",
});
