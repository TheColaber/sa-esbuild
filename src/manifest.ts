import { version, homepage } from "../package.json";

// Values that are "__MSG_text__" are localized based on the user's browser language.
// All text that the user sees in the extension should be localized.
// English values can be found in src/_locales/en/messages.json.

const isPrerelease = version.split("-")[1] === "prerelease";
// Show blue icons when we are on a prerelease, normal if not.
const iconPath = "images/icon" + (isPrerelease ? "-blue" : "");

const manifest: chrome.runtime.ManifestV3 = {
  name: "__MSG_name__",
  description: "__MSG_description__",
  version: version.split("-")[0],
  version_name: version,
  manifest_version: 3,
  homepage_url: homepage,
  author: "Scratch Addons",
  default_locale: "en",
  icons: {
    16: iconPath + "-16.png",
    32: iconPath + "-32.png",
    1024: iconPath + ".png",
    // TODO: gray icons - hacky, but like, i dont really feel like using the copy plugin
    1: "images/icon-gray-16.png",
    2: "images/icon-gray-32.png",
  },

  background: {
    service_worker: "background/index.ts",
    type: "module",
  },
  action: { default_popup: "pages/popup/index.html" },
  options_page: "pages/settings/index.html",
  content_scripts: [
    {
      js: ["content-script/index.ts"],
      matches: ["https://scratch.mit.edu/*"],
      /* @ts-ignore - this prop exists, but they dont think it does. */
      world: "MAIN",
      run_at: "document_start",
      all_frames: true,
    },
  ],
  commands: {
    open_settings_page: {
      description: "__MSG_open_settings_page_description__",
      suggested_key: {
        default: "Alt+S",
      },
    },
  },
  host_permissions: ["https://*.scratch.mit.edu/*"],
  permissions: ["storage", "contextMenus", "alarms", "scripting", "cookies"],
};

const [, , ...args] = process.argv;
const isFirefox = args.includes("-ff");
// Firefox requires this here so it can actually load.
if (isFirefox) {
  manifest.browser_specific_settings = {
    gecko: { id: "griffpatch@griffpatch.co.uk" },
  };
}

export default manifest;
