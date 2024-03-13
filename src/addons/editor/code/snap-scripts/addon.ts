import image from "./image.png";
export default defineAddon({
  name: "Snap scripts to grid",
  description:
    "Scripts will automatically align its position to the code area dots.",
  versionAdded: "2.0.0",
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
  image,
});

export const scripts = defineScripts([
  {
    script: () => import("./script.ts"),
    matches: ["projects"],
  },
]);
