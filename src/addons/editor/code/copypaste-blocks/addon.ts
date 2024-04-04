export default defineAddon({
  name: "Copy, cut, and paste blocks",
  description: "todo",
  versionAdded: "2.0.0",
  mode: "dev",
});

export const scripts = defineScripts([
  {
    script: () => import("./script.ts"),
    matches: ["projects"],
  },
]);
