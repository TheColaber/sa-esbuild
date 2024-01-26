export default defineAddon({
  name: "Pause Button",
  description: "Adds a button next to the green flag to pause the project.",
  versionAdded: "2.0.0",
});

export const scripts = defineScripts([
  {
    script: () => import("./script.ts"),
    matches: ["projects"],
  },
]);