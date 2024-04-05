export default defineAddon({
  name: "Msg count badge",
  description: "todo",
  versionAdded: "2.0.0",
  mode: "dev",
});

export const worker = defineWorker(() => import("./worker.ts"));
