import * as workers from "#addon-workers";
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
      worker().then((imported) => imported.default());
    }
  }
  syncStorage.watch(({ addonsStates }) => {
    // console.log(addonsStates);
  });
})();
