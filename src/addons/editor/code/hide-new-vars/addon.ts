export default defineAddon({
  name: "Hide new vars",
  description: "",
  versionAdded: "2.0.0",
});

export const scripts = defineScripts([
  {
    script: () => import("./script.ts"),
    matches: ["projects"],
  },
]);
