import "./define";
import "./redux";
import * as addonScripts from "#addon-scripts";
import * as addonStyles from "#addon-styles";
import * as localeEN from "#addon-en";
import { MATCH_PATTERNS } from "./matches";
import UserscriptAddon from "../addon-api/userscript";
import { AddonStorage } from "../background/storage";
import injectStyle from "./inject-style";

let enabledAddons: string[];
let addonSettings: AddonStorage;
let userLangs: string[];
let previewAddon: string | null;

const locales = {
  en: localeEN,
};
scratchAddons.events.addEventListener(
  "addonData",
  async ({
    detail,
  }: CustomEvent<{
    enabledAddons: string[];
    addonSettings: AddonStorage;
    userLangs: string[];
    previewAddon: string | null;
  }>) => {
    if (scratchAddons.addonsLoaded) return;

    enabledAddons = detail.enabledAddons;
    addonSettings = detail.addonSettings;
    userLangs = detail.userLangs;
    previewAddon = detail.previewAddon;

    console.log("Addon data received from storage");

    for (const id of enabledAddons) {
      runAddon(id);
    }

    if (previewAddon) {
      runAddon(previewAddon, { showPreview: true });
    }

    scratchAddons.addonsLoaded = true;
  },
);

scratchAddons.events.addEventListener(
  "dynamicDisable",
  ({ detail: { id } }: CustomEvent) => {
    const addon = scratchAddons.addons[id];
    if (addon) {
      addon.enabled = false;
      addon.dispatchEvent(new CustomEvent("disabled"));
      const style = document.createElement("style");
      style.setAttribute("data-addon-disabled-style-" + id, "");
      style.textContent = `[data-addon-${id}] { display: none !important; }`;
      document.body.appendChild(style);
    }
    const injectedStyles = document.querySelectorAll<HTMLStyleElement>(
      `.scratch-addons-style[data-addon-id='${id}']`,
    );
    injectedStyles.forEach((style) => (style.disabled = true));
  },
);
scratchAddons.events.addEventListener(
  "dynamicEnable",
  ({ detail: { id } }: CustomEvent) => {
    const addon = scratchAddons.addons[id];
    if (addon) {
      addon.enabled = true;
      addon.dispatchEvent(new CustomEvent("reenabled"));
      document.querySelector(`[data-addon-disabled-style-${id}]`).remove();
      const injectedStyles = document.querySelectorAll(
        `.scratch-addons-style[data-addon-id=${id}]`,
      );
      injectedStyles.forEach(
        (style: HTMLStyleElement) => (style.disabled = false),
      );
    } else {
      runAddon(id, { enabledLate: true });
    }
  },
);
scratchAddons.events.addEventListener(
  "settingChange",
  ({ detail: { id, settings } }: CustomEvent) => {
    const addon = scratchAddons.addons[id];
    addonSettings[id] = settings;
    addon.settings.dispatchEvent(
      new CustomEvent("change", { detail: settings }),
    );
  },
);

function runAddon(
  id: string,
  { enabledLate = false, showPreview = false } = {},
) {
  const scripts = addonScripts[id] || [];
  if (scripts.length > 0) {
    const settings = addonSettings[id];

    const addonLocales = {};
    for (const lang of userLangs) {
      if (!locales[lang]) continue;
      for (const key in locales[lang][id]) {
        const string = locales[lang][id][key].string || locales[lang][id][key];
        addonLocales[key] = addonLocales[key] || string;
      }
    }

    const addonInstance = new UserscriptAddon(
      id,
      { enabledLate, showPreview },
      addonLocales,
      settings,
    );
    scratchAddons.addons[id] = addonInstance;
    for (const { script, matches } of scripts) {
      if (!testUrlMatches(matches)) continue;
      script().then((imported) => imported.default());
      console.log(id, "is running");
      scratchAddons.runningAddons.push(id);
    }
  }
  const styles = addonStyles[id] || [];

  for (const { style, matches } of styles) {
    if (!testUrlMatches(matches)) continue;
    injectStyle(style, id);
    scratchAddons.runningAddons.push(id);
  }
}

function testUrlMatches(matches: (keyof typeof MATCH_PATTERNS)[]) {
  let urlMatches = false;
  for (const match of matches) {
    urlMatches = MATCH_PATTERNS[match].test(window.location.pathname);
    if (urlMatches) break;
  }
  return urlMatches;
}

// const el = document.documentElement.appendChild(document.createElement("div"))
// el.style.width = "400px";
// el.style.height = "300px";
// el.style.position = "fixed";
// el.style.zIndex = "999999999999999999";
// el.style.background = "#7cff879e";
// el.style.border = "1px dashed #3d8b43";
// el.style.display = "flex"
// el.style.alignItems = "flex-end"
// el.style.justifyContent = "flex-end"

// const button = el.appendChild(document.createElement("button"));
// button.innerText = "Capture";
// button.style.border = "none";
// button.style.background = "#000000a6";
// button.style.color = "white";
// button.style.padding = "4px 8px";
// button.style.borderTopLeftRadius = "6px";

// button.addEventListener("click", async function () {
//   el.style.display = "none";
//   const stream = await navigator.mediaDevices.getDisplayMedia({
//     preferCurrentTab: true,
//   });

//   const vid = document.createElement("video");
//   vid.addEventListener("loadedmetadata", function () {
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");
//     ctx.canvas.width = 400;
//     ctx.canvas.height = 300;
//     ctx.drawImage(vid, el.offsetLeft, el.offsetTop, vid.videoWidth, vid.videoHeight);

//     stream.getVideoTracks()[0].stop();

//     let a = document.createElement("a");
//     a.download = "image.png";
//     a.href = canvas.toDataURL("image/png");
//     a.click();
//   });
//   vid.srcObject = stream;
//   vid.play();
// })

// let moveX = 0;
// let moveY = 0;
// el.addEventListener('mousedown', (e) => {
//   e.preventDefault();
//   moveX = e.clientX;
//   moveY = e.clientY;
//   document.addEventListener("mouseup", () => {
//     document.removeEventListener("mousemove", onMove);
//   }, {once: true});
//   const onMove = (e) => {
//     e.preventDefault();
//     el.style.left = (el.offsetLeft - moveX + e.clientX) + "px";
//     el.style.top = (el.offsetTop - moveY + e.clientY) + "px";
//     moveX = e.clientX;
//     moveY = e.clientY;
//   };
//   document.addEventListener("mousemove", onMove)
// });