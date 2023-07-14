import * as addons from "#addons";
import { localStorage, syncStorage } from "./storage";

chrome.runtime.onInstalled.addListener(async (details) => {
  const { version } = chrome.runtime.getManifest();

  if (
    details.reason === "install" ||
    (details.reason === "update" && details.previousVersion !== version)
  ) {
    localStorage.set({ installedDetails: details });
    // Open settings page for onboarding
    chrome.runtime.openOptionsPage();
  }
});

chrome.management.getSelf().then(async ({ installType, homepageUrl }) => {
  const devMode = installType === "development";
  if (!devMode) {
    const uiLanguage = chrome.i18n.getUILanguage();
    const url = homepageUrl + uiLanguage.split("-")[0] + "/farewell";
    chrome.runtime.setUninstallURL(url);
  }

  const { addonsStates } = await syncStorage.get("addonsStates");
  for (const id in addons) {
    const manifest = addons[id];
    if (
      addonsStates[id] === undefined ||
      (addonsStates[id] === "dev" && manifest.mode !== "dev")
    ) {
      if (!!manifest.enabledByDefault) {
        addonsStates[id] = "defaultEnabled";
      } else if (devMode && manifest.mode === "dev") {
        addonsStates[id] = "dev";
      } else {
        addonsStates[id] = "defaultDisabled";
      }
    }
  }
  syncStorage.set({ addonsStates });
});
