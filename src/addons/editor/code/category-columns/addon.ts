import image from "./image.png";
export default defineAddon({
  name: "Category columns",
  description: "todo tbh",
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
