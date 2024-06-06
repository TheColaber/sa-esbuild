import image from "./image2.png";
import demo from "./demo.gif";
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
      min: 1,
      presets: {
        default: 40,
        wholeBlock: 48,
        halfBlock: 24,
      },
    },
  ],
  presetNames: {
    wholeBlock: "Whole Block",
    halfBlock: "Half Block",
  },
  image,
  demo,
});

export const scripts = defineScripts([
  {
    script: () => import("./script.ts"),
    matches: ["projects"],
  },
]);
