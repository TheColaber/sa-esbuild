export default defineAddon({
  name: "Snap scripts to grid",
  description:
    "Scripts will automatically align its position to the code area dots.",
  versionAdded: "2.0.0",
  mode: "dev",
  settings: [
    {
      id: "grid",
      name: "Grid spacing",
      type: "integer",
      presets: {
        default: 40,
        wholeBlock: 48,
        halfBlock: 24,
      },
    },
  ],
});

export const scripts = defineScripts([
  {
    script: () => import("./script.ts"),
    matches: ["projects"],
  },
]);
