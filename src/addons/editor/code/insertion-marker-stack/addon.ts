export default defineAddon({
  name: "Insertion marker stack",
  description: "tdo",
  versionAdded: "2.0.0",
  mode: "dev",
});

export const scripts = defineScripts([
  {
    script: () => import("./script.ts"),
    matches: ["projects"],
  },
]);
