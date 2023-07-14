import { syncStorage, addonEnabledStates } from "./storage";

chrome.tabs.onUpdated.addListener(async (tabId, { status }, tab) => {
  if (!tab.url || status !== "loading") return;

  let { addonsStates } = await syncStorage.get("addonsStates");
  const l10nUrls = await getL10NURLs(tab.url);

  dispatch("addonData", { addonsStates, addonEnabledStates, l10nUrls });

  syncStorage.valueStream.subscribe(({ addonsStates: newAddonsStates }) => {
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

async function getL10NURLs(url: string) {
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
