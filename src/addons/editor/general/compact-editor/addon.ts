import { stylesheet } from "./style.css";

export default defineAddon({
  name: "Compact editor",
  description: "todo",
  versionAdded: "2.0.0",
  mode: "dev",
});

export const styles = defineStyles([
  {
    style: stylesheet,
    matches: ["projects"],
  },
]);
