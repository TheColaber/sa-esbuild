import { syncStorage, addonEnabledStates } from "./storage";

chrome.tabs.onUpdated.addListener(async (tabId, { status }, tab) => {
  if (!tab.url || status !== "loading") return;
  chrome.scripting.executeScript({
    target: { tabId },
    injectImmediately: true,
    world: "MAIN",
    func: async () => {
      console.log("test");
    },
  });

  let { addonsStates } = await syncStorage.get("addonsStates");
  const userLangs = await getUserLangs(tab.url);

  dispatch("addonData", { addonsStates, addonEnabledStates, userLangs });

  syncStorage.watch(["addonsStates"], ({ addonsStates: newAddonsStates }) => {
    for (const id in addonsStates) {
      if (addonsStates[id] !== newAddonsStates[id]) {
        if (addonEnabledStates.includes(newAddonsStates[id])) {
          dispatch("dynamicEnable", { id });
        } else {
          dispatch("dynamicDisable", { id });
        }
      }
    }
    addonsStates = newAddonsStates;
  });

  function dispatch(type: string, detail: any) {
    chrome.scripting.executeScript({
      target: { tabId },
      injectImmediately: true,
      world: "MAIN",
      func: async (type, detail: any) => {
        scratchAddons.events.dispatchEvent(new CustomEvent(type, { detail }));
      },
      args: [type, detail],
    });
  }
});

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
