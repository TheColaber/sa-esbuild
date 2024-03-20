import { reactive, ref } from "vue";
import * as addons from "#addons";
import {
  syncStorage,
  allAddonStates,
  addonEnabledStates,
} from "../../background/storage";

const { addonsStates } = await syncStorage.get("addonsStates");

const categories = objectArray(
  allAddonStates.map((state) =>
    typedObject(
      state,
      Object.keys(addonsStates)
        .filter((id) => addonsStates[id] === state)
        .map((id) => addons[id]),
    ),
  ),
);

const enabledStates = ref(
  Object.fromEntries(
    Object.entries(addonsStates).map(([id, state]) => [
      id,
      addonEnabledStates.some((enabledState) => enabledState === state),
    ]),
  ),
);

export const store = reactive({
  categories,
  enabledStates,
  toggleAddon(id: string) {
    enabledStates.value[id] = !enabledStates.value[id];
    // const addon = categories[addonsStates[id]].find(((addon) => id === addon.id))
    addonsStates[id] = enabledStates.value[id]
      ? addons[id].mode === "dev"
        ? "dev"
        : "enabled"
      : "disabled";
    syncStorage.set({ addonsStates });
  },
});

function typedObject<T extends string, U>(key: T, value: U) {
  return { [key]: value } as { [K in T]: U };
}
function objectArray<T>(array: T[]) {
  return array.reduce((all, single) => ({ ...single, ...all }), {} as T);
}
