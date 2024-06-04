import { computed, reactive, ref, watch } from "vue";
import * as addons from "#addons";
import {
  syncStorage,
  addonEnabledStates,
  addonDisabledStates,
  addonProductionStates,
  addonDevelopmentStates,
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
const syncedAddonStorage = reactive({...addonsStates});

export const enabledProductionAddons = computed(() =>
Object.keys(addons).filter((id) => addonProductionStates.some((state) => state === localAddonStorage[id])),
);
export const enabledDevelopmentAddons = computed(() =>
Object.keys(addons).filter((id) => addonDevelopmentStates.some((state) => state === localAddonStorage[id])),
);
export const disabledAddons = computed(() =>
Object.keys(addons).filter((id) => addonDisabledStates.some((state) => state === localAddonStorage[id])),
);

export const enabledStates = computed(() =>
  Object.fromEntries(
    Object.entries(syncedAddonStorage).map(([id, state]) => [
      id,
      addonEnabledStates.some((enabledState) => enabledState === state),
    ]),
  ),
);

export function updateAll() {
  for (const id in syncedAddonStorage) {
    localAddonStorage[id] = syncedAddonStorage[id];
  }
}

export function toggleAddon(id: string) {
  const state = addonEnabledStates.some((enabledState) => enabledState === syncedAddonStorage[id])
  syncedAddonStorage[id] = !state
    ? addons[id].mode === "dev"
      ? "dev"
      : "enabled"
    : "disabled";
  syncStorage.set({ addonsStates: syncedAddonStorage });
}

syncStorage.watch(({ addonsStates: newStates }) => {
  for (const id in newStates) {
    syncedAddonStorage[id] = newStates[id];
  }
});
