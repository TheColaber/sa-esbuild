export default defineAddon({
  name: "Zebra striping",
  description: "todo",
  versionAdded: "2.0.0",
});

export const scripts = defineScripts([
  {
    script: () => import("./script.ts"),
    matches: ["projects"],
  },
]);
