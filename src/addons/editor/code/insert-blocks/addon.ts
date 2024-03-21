import image from "./image.png";
export default defineAddon({
  name: "Insert blocks",
  description: "todo",
  versionAdded: "2.0.0",
  mode: "dev",
  image,
});

export const scripts = defineScripts([
  {
    script: () => import("./script.ts"),
    matches: ["projects"],
  },
]);
