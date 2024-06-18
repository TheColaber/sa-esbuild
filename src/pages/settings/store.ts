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

export const port = new Port();

export const tab = ref<
  "explore" | "enabled" | "themes" | "hotkeys" | "superpresets" | "more"
>();
export const showOnboarding = ref(false);
export const searchValue = ref("");
export const suggestions = ref([]);

const miniSearch = new MiniSearch({
  fields: ["id", "name", "description"],
  searchOptions: {
    boost: { name: 5, id: 2 },
    fuzzy: 1,
    prefix: true,
  },
});

// import { create, search, insertMultiple } from '@orama/orama'
// const db = await create({
//   schema: {
//     id: 'string',
//     name: 'string',
//     description: 'string',
//   }
// });

// await insertMultiple(db, Object.values(addons));

const filteredAddons = ref([]);
miniSearch.addAll(Object.values(addons));
watch(searchValue, async (term) => {
  suggestions.value = miniSearch.autoSuggest(term).flatMap((res) => res.terms);
  filteredAddons.value = miniSearch.search(term);
  // const searchResult = await search(db, {
  //   term,
  // });
  // console.log(searchResult);

  // filteredAddons.value = searchResult.hits.map(h => h.document)
});

const { addonsStates } = await syncStorage.get("addonsStates");
const localAddonStorage = reactive({ ...addonsStates });
const syncedAddonStorage = reactive({ ...addonsStates });

const filteredSortedAddons = computed(() =>
  Object.keys(addons)
    .filter(
      (id) =>
        !searchValue.value || filteredAddons.value.some((res) => res.id === id),
    )
    .sort((a, b) => {
      if (searchValue.value.length > 0) {
        return (
          filteredAddons.value.findIndex((addon) => addon.id === a) -
          filteredAddons.value.findIndex((addon) => addon.id === b)
        );
      }
      return addons[a].name.localeCompare(addons[b].name);
    }),
);
export const enabledProductionAddons = computed(() =>
  filteredSortedAddons.value.filter((id) =>
    addonProductionStates.some((state) => state === localAddonStorage[id]),
  ),
);
export const enabledDevelopmentAddons = computed(() =>
  filteredSortedAddons.value.filter((id) =>
    addonDevelopmentStates.some((state) => state === localAddonStorage[id]),
  ),
);
export const disabledAddons = computed(() =>
  filteredSortedAddons.value.filter((id) =>
    addonDisabledStates.some((state) => state === localAddonStorage[id]),
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

export function toggleAddon(id: string) {
  const state = addonEnabledStates.some(
    (enabledState) => enabledState === syncedAddonStorage[id],
  );
  syncedAddonStorage[id] = !state
    ? addons[id].mode === "dev"
      ? "dev"
      : "enabled"
    : "disabled";
  syncStorage.set({ addonsStates: syncedAddonStorage });
}

watch(tab, () => {
  for (const id in syncedAddonStorage) {
    localAddonStorage[id] = syncedAddonStorage[id];
  }
});

syncStorage.watch(({ addonsStates: newStates }) => {
  for (const id in newStates.newValue) {
    syncedAddonStorage[id] = newStates.newValue[id];
  }
});
