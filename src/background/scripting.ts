import { onPortConnection } from "./messaging";
import { syncStorage, addonEnabledStates, addonStorage } from "./storage";

const previewTabs = {};

(async () => {
  let { addonsStates } = await syncStorage.get("addonsStates");
  chrome.tabs.onUpdated.addListener(async (tabId, { status }, tab) => {
    console.log(tab);

    if (!tab.url || status !== "loading") return;

    const enabledAddons = [];
    for (const id in addonsStates) {
      if (
        addonEnabledStates.some(
          (enabledState) => enabledState === addonsStates[id],
        )
      ) {
        enabledAddons.push(id);
      }
    }
    const addonSettings = await addonStorage.get(...enabledAddons);
    const userLangs = await getUserLangs(tab.url);

    const previewAddon = previewTabs[tabId];
    dispatch(
      "addonData",
      {
        enabledAddons,
        addonSettings,
        userLangs,
        previewAddon,
      },
      tabId,
    );
  });

  syncStorage.watch(({ addonsStates: newAddonStates }) => {
    if (!addonsStates) return;
    for (const id in newAddonStates) {
      if (addonsStates[id] !== newAddonStates[id]) {
        if (addonEnabledStates.some((state) => newAddonStates[id] === state)) {
          dispatch("dynamicEnable", { id });
        } else {
          dispatch("dynamicDisable", { id });
        }
      }
    }
    addonsStates = newAddonStates;
  });
})();
addonStorage.watch((changes) => {
  for (const id in changes) {
    dispatch("settingChange", { id, settings: changes[id] });
  }
});

onPortConnection((port) => {
  port.onMessage("getRunningAddons", async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tab && tab.url) {
      const [res] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        injectImmediately: process.env.MODE !== "development",
        world: "MAIN",
        func: () => {
          return (
            (window.scratchAddons && window.scratchAddons.runningAddons) || []
          );
        },
      });
      return res.result;
    }
    return [];
  });
  port.onMessage("openScratchEditor", async (data) => {
    const tab = await chrome.tabs.create({
      url: "https://scratch.mit.edu/projects/editor",
    });
    previewTabs[tab.id] = data;
  });
});

async function dispatch(type: string, detail: any, ...tabIds: number[]) {
  if (tabIds.length === 0) {
    await chrome.tabs.query({}).then((tabs) => {
      tabIds = tabs.filter((tab) => tab.url).map((tab) => tab.id);
    });
  }
  for (const tabId of tabIds) {
    chrome.scripting.executeScript({
      target: { tabId },
      injectImmediately: process.env.MODE !== "development",
      world: "MAIN",
      func: async (type, detail: any) => {
        if (!window.scratchAddons) return;
        scratchAddons.events.dispatchEvent(new CustomEvent(type, { detail }));
      },
      args: [type, detail],
    });
  }
}

async function getUserLangs(url: string) {
  const cookie = await chrome.cookies.get({ url, name: "scratchlanguage" });
  const langCode = cookie ? cookie.value || "en" : "en";

  const urls = [langCode];
  if (langCode === "pt") {
    urls.push("pt-br");
  }

  if (langCode.includes("-")) {
    urls.push(langCode.split("-")[0]);
  }
  if (!urls.includes("en")) urls.push("en");
  return urls;
}
