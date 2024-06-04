import { computed, reactive, ref, watch } from "vue";
import * as addons from "#addons";
import {
  syncStorage,
  allAddonStates,
  addonEnabledStates,
} from "../../background/storage";
import { Port } from "../../background/messaging";
import MiniSearch from "minisearch";

// PORT: Used to send messages from page to BG.
export const port = new Port();

// TAB: Used by header and content to show current tab.
export const tab = ref<
  "explore" | "enabled" | "themes" | "hotkeys" | "superpresets" | "more"
>();
// SHOWONBOARDING: Determines if onboarding component should show.
export const showOnboarding = ref(false);
// SEARCHFILTER: Used by search bar and content to filter page.
export const searchFilter = ref("");
// SUGGESTIONS: Used by search bar to show search suggestions
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
const localAddonStorage = reactive({...addonsStates});
export const syncedAddonStorage = reactive({...addonsStates});

export const categories = objectArray(
  allAddonStates.map((state) =>
    typedObject(
      state,
      computed(() => {
        return Object.keys(localAddonStorage)
          .filter((id) => localAddonStorage[id] === state)
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

export const enabledStates = computed(() =>
  Object.fromEntries(
    Object.entries(syncedAddonStorage).map(([id, state]) => [
      id,
      addonEnabledStates.some((enabledState) => enabledState === state),
    ]),
  ),
);

let reqUpdate: { id: string; new: keyof typeof categories }[] = [];

export function updateAll() {
  for (const update of reqUpdate) {
    localAddonStorage[update.id] = update.new;
  }
  
  reqUpdate = [];
}

export function toggleAddon(id: string) {
  const state = addonEnabledStates.some((enabledState) => enabledState === syncedAddonStorage[id])
  syncedAddonStorage[id] = !state
    ? addons[id].mode === "dev"
      ? "dev"
      : "enabled"
    : "disabled";
  
  reqUpdate.push({ id, new: syncedAddonStorage[id] });
  syncStorage.set({ addonsStates: syncedAddonStorage });
}

syncStorage.watch(({ addonsStates: newStates }) => {
  for (const id in newStates) {
    const enabled = addonEnabledStates.some(
      (enabledState) => enabledState === newStates[id],
    );
    enabledStates.value[id] = enabled;
    syncedAddonStorage[id] = newStates[id];
    reqUpdate.push({ id, new: syncedAddonStorage[id] });
  }
});

function typedObject<T extends string, U>(key: T, value: U) {
  return { [key]: value } as { [K in T]: U };
}
function objectArray<T>(array: T[]) {
  return array.reduce((all, single) => ({ ...single, ...all }), {} as T);
}
