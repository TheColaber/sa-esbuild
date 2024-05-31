export default defineAddon({
  name: "Enhanced cleanup",
  description: "todo",
  versionAdded: "2.0.0",
  settings: [
    {
      id: "orphansPrompt",
      name: "Ask to delete orphaned blocks",
      presets: { default: true },
      type: "boolean",
    },
    {
      id: "unusedVariablesPrompt",
      name: "Ask to delete unused variables and lists",
      presets: { default: true },
      type: "boolean",
    },
  ],
});

export const scripts = defineScripts([
  {
    script: () => import("./script.ts"),
    matches: ["projects"],
  },
]);
