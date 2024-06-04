export default defineAddon({
  name: "Custom block colors",
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