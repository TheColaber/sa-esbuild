import { syncStorage, addonEnabledStates } from "./storage";

chrome.tabs.onUpdated.addListener(async (tabId, { status }, tab) => {
  if (!tab.url || status !== "loading") return;

  let { addonsStates } = await syncStorage.get("addonsStates");
  const userLangs = await getUserLangs(tab.url);

  dispatch("addonData", { addonsStates, addonEnabledStates, userLangs });

  syncStorage.watch(["addonsStates"], ({ addonsStates: {oldValue, newValue} }) => {        
    for (const id in newValue) {
      if (oldValue[id] !== newValue[id]) {
        console.log(newValue[id],addonEnabledStates);
        
        if (addonEnabledStates.some((state) => newValue[id] === state)) {
          dispatch("dynamicEnable", { id });
        } else {
          dispatch("dynamicDisable", { id });
        }
      }
    }
    addonsStates = newValue;
  });

  function dispatch(type: string, detail: any) {
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
