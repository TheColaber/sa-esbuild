import { syncStorage, addonEnabledStates } from "./storage";
const tabIds = [];
chrome.tabs.query({}).then((tabs) => {
  tabIds.push(...tabs.filter((tab) => tab.url).map((tab) => tab.id));
});

chrome.tabs.onUpdated.addListener(async (tabId, { status }, tab) => {
  if (!tab.url || status !== "loading") return;
  tabIds.push(tabId);

  let { addonsStates } = await syncStorage.get("addonsStates");
  const userLangs = await getUserLangs(tab.url);

  dispatch("addonData", { addonsStates, addonEnabledStates, userLangs }, tabId);
});

syncStorage.watch(
  ["addonsStates"],
  ({ addonsStates: { oldValue, newValue } }) => {
    for (const id in newValue) {
      if (oldValue[id] !== newValue[id]) {
        for (const tabId of tabIds) {
          if (addonEnabledStates.some((state) => newValue[id] === state)) {
            dispatch("dynamicEnable", { id }, tabId);
          } else {
            dispatch("dynamicDisable", { id }, tabId);
          }
        }
      }
    }
  },
);

function dispatch(type: string, detail: any, tabId: number) {
  chrome.scripting.executeScript({
    target: { tabId },
    injectImmediately: process.env.MODE !== "development",
    world: "MAIN",
    func: async (type, detail: any) => {
      scratchAddons.events.dispatchEvent(new CustomEvent(type, { detail }));
    },
    args: [type, detail],
  });
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
