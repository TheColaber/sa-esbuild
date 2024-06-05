export default defineAddon({
  name: "Block duplicate",
  description: "tod",
  versionAdded: "2.0.0",
  mode: "dev",
});

export const scripts = defineScripts([
  {
    script: () => import("./script.ts"),
    matches: ["projects"],
  },
]);
