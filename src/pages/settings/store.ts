import { reactive, ref, toRefs, watch } from "vue";
import * as addons from "#addons";
import {
  syncStorage,
  allAddonStates,
  addonEnabledStates,
} from "../../background/storage";
import { Port } from "../../background/messaging";
export const port = new Port();

export const tab = ref<"explore" | "enabled" | "themes">();
export const searchFilter = ref("");
export const suggestions = ref([]);

import MiniSearch from "minisearch";
const miniSearch = new MiniSearch({
  fields: ["id", "name", "description"],
  searchOptions: {
    boost: { name: 5, id: 2 },
    fuzzy: 1,
    prefix: true,
  },
});

// const stopWords = new Set(["and", "or", "to", "in", "a", "the", "it", "its"]);
const filteredAddons = ref([]);
miniSearch.addAll(Object.values(addons));
watch(searchFilter, (search) => {
  filteredAddons.value = miniSearch.search(search);
  suggestions.value = miniSearch
    .autoSuggest(search, {
      // processTerm: (term) =>
      // stopWords.has(term) ? null : term.toLowerCase(),
    })
    .flatMap((res) => res.terms);
});

const { addonsStates } = await syncStorage.get("addonsStates");

export const categories = reactive(
  objectArray(
    allAddonStates.map((state) =>
      typedObject(
        state,
        Object.keys(addonsStates)
          .filter((id) => addonsStates[id] === state)
          .filter(
            (id) =>
              !searchFilter.value ||
              filteredAddons.value.some((res) => res.id === id),
          )
          .map((id) => addons[id])
          .sort((a, b) => a.name.localeCompare(b.name)),
      ),
    ),
  ),
);

export const enabledStates = ref(
  Object.fromEntries(
    Object.entries(addonsStates).map(([id, state]) => [
      id,
      addonEnabledStates.some((enabledState) => enabledState === state),
    ]),
  ),
);

let reqUpdate: { id: string; old: keyof typeof categories }[] = [];

export function updateAll() {
  for (const update of reqUpdate) {
    const oldCategory = categories[update.old];
    const index = oldCategory.findIndex((addon) => update.id === addon.id);
    oldCategory.splice(index, 1);
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
  const newCategory = categories[addonsStates[id]];
  if (newCategory.includes(addons[id])) return;
  newCategory.push(addons[id]);
  categories[addonsStates[id]] = newCategory.sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

function typedObject<T extends string, U>(key: T, value: U) {
  return { [key]: value } as { [K in T]: U };
}
function objectArray<T>(array: T[]) {
  return array.reduce((all, single) => ({ ...single, ...all }), {} as T);
}
