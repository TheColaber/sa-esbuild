import { computed, reactive, ref, toRefs, watch } from "vue";
import * as addons from "#addons";
import {
  syncStorage,
  allAddonStates,
  addonEnabledStates,
} from "../../background/storage";
import { Port } from "../../background/messaging";
import MiniSearch from "minisearch";

export const port = new Port();

export const tab = ref<
  "explore" | "enabled" | "themes" | "hotkeys" | "superpresets" | "more"
>();
export const showOnboarding = ref(false);
export const searchFilter = ref("");
export const suggestions = ref([]);

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
const addonStorage = ref(addonsStates);
export const categories = objectArray(
  allAddonStates.map((state) =>
    typedObject(
      state,
      computed(() => {
        return Object.keys(addonStorage.value)
          .filter((id) => addonStorage.value[id] === state)
          .filter(
            (id) =>
              !searchFilter.value ||
              filteredAddons.value.some((res) => res.id === id),
          )
          .sort((a, b) => addons[a].name.localeCompare(addons[b].name));
      }),
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

let reqUpdate: { id: string; new: keyof typeof categories }[] = [];

export function updateAll() {
  for (const update of reqUpdate) {
    addonsStates[update.id] = update.new;
  }
  addonStorage.value = addonsStates;
  reqUpdate = [];
}

export function toggleAddon(id: string) {
  enabledStates.value[id] = !enabledStates.value[id];
  addonsStates[id] = enabledStates.value[id]
    ? addons[id].mode === "dev"
      ? "dev"
      : "enabled"
    : "disabled";
  reqUpdate.push({ id, new: addonsStates[id] });
  syncStorage.set({ addonsStates });
}

syncStorage.watch(({ addonsStates: newStates }) => {
  for (const id in newStates) {
    const enabled = addonEnabledStates.some(
      (enabledState) => enabledState === newStates[id],
    );
    enabledStates.value[id] = enabled;
    addonsStates[id] = newStates[id];
    reqUpdate.push({ id, new: addonsStates[id] });
  }
});

function typedObject<T extends string, U>(key: T, value: U) {
  return { [key]: value } as { [K in T]: U };
}
function objectArray<T>(array: T[]) {
  return array.reduce((all, single) => ({ ...single, ...all }), {} as T);
}
