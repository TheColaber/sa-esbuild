import image from "./image2.png";
import demo from "./demo.gif";
export default defineAddon({
  name: "Two-column category menu",
  description:
    "Splits the block category menu into two columns and moves it to the top of the block palette, like in Scratch 2.0.",
  versionAdded: "2.0.0",
  image,
  demo,
});

export const scripts = defineScripts([
  {
    script: () => import("./script.ts"),
    matches: ["projects"],
  },
]);
