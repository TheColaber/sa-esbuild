import { reactive, ref } from "vue";
import * as addons from "#addons";
import {
  syncStorage,
  allAddonStates,
  addonEnabledStates,
} from "../../background/storage";

const { addonsStates } = await syncStorage.get("addonsStates");

export const categories = ref(objectArray(
  allAddonStates.map((state) =>
    typedObject(
      state,
      Object.keys(addonsStates)
        .filter((id) => addonsStates[id] === state)
        .map((id) => addons[id]),
    ),
  ),
));

export const enabledStates = ref(
  Object.fromEntries(
    Object.entries(addonsStates).map(([id, state]) => [
      id,
      addonEnabledStates.some((enabledState) => enabledState === state),
    ]),
  ),
);

let reqUpdate = [];

export function updateAll() {  
  for (const update of reqUpdate) {
    const oldCategory = categories.value[update.old]
    const index = oldCategory.findIndex(((addon) => update.id === addon.id));
    oldCategory.splice(index, 1)
  }
  reqUpdate = [];
}

export function toggleAddon(id: string) {
  enabledStates.value[id] = !enabledStates.value[id];
  reqUpdate.push({ id, old: addonsStates[id] });
  addonsStates[id] = enabledStates.value[id]
    ? addons[id].mode === "dev"
      ? "dev"
      : "enabled"
    : "disabled";
  syncStorage.set({ addonsStates });
  const newCategory = categories.value[addonsStates[id]]
  newCategory.push(addons[id])

}

function typedObject<T extends string, U>(key: T, value: U) {
  return { [key]: value } as { [K in T]: U };
}
function objectArray<T>(array: T[]) {
  return array.reduce((all, single) => ({ ...single, ...all }), {} as T);
}
