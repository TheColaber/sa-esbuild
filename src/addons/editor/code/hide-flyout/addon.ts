import image from "./image.png";
export default defineAddon({
  name: "Auto-hiding block palette",
  description: "taco",
  versionAdded: "2.0.0",
  image,
});

export const scripts = defineScripts([
  {
    script: () => import("./script.ts"),
    matches: ["projects"],
  },
]);
