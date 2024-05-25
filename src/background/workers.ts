import * as workers from "#addon-workers";
import WorkerAddon from "../addon-api/worker";
import { addonEnabledStates, syncStorage } from "./storage";

(async () => {
  const { addonsStates } = await syncStorage.get("addonsStates");

  for (const id in workers) {
    const worker = workers[id];
    if (
      worker &&
      addonEnabledStates.some(
        (enabledState) => enabledState === addonsStates[id],
      )
    ) {
      const addon = new WorkerAddon(id);
      worker().then((imported) => imported.default(addon));
    }
  }
  syncStorage.watch(({ addonsStates }) => {
    // console.log(addonsStates);
  });
})();
