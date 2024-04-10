import {
  syncStorage,
  addonStorage,
  localStorage,
} from "../../background/storage";

const { addonsStates, lightTheme, onboarded } = await syncStorage.get(
  "addonsStates",
  "lightTheme",
  "onboarded",
);
// const addonSettings = await addonStorage.get();
const { installedDetails, muted } = await localStorage.get(
  "installedDetails",
  "muted",
);
console.table({
  // addonSettings,
  lightTheme,
  onboarded,
  addonsStates,
  installedDetails,
  muted,
});
