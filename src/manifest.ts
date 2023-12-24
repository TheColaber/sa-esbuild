import { version, homepage } from "../package.json";

// Values that are "__MSG_text__" are localized based on the user's browser language.
// All text that the user sees in the extension should be localized.
// English values can be found in src/_locales/en/messages.json.

// Constants
const ICONS = {
  PRODUCTION: {
    16: "images/icon-16.png",
    32: "images/icon-32.png",
    1024: "images/icon.png",
  },
  DEVELOPMENT: {
    16: "images/icon-blue-16.png",
    32: "images/icon-blue-32.png",
    1024: "images/icon-blue.png",
  },
  MUTED: {
    16: "images/icon-gray-16.png",
    32: "images/icon-gray-32.png",
  },
};

const PAGES = {
  POPUP: {
    INDEX: "pages/popup/index.html",
    FULLSCREEN: "pages/popup/fullscreen/index.html",
  },
  SETTINGS: {
    INDEX: "pages/settings/index.html",
    // TODO: permissions page, etc.
  },
};

const isPrerelease = version.split("-")[1] === "prerelease";
const iconDisplay: keyof typeof ICONS = isPrerelease
  ? "DEVELOPMENT"
  : "PRODUCTION";

const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: "__MSG_name__",
  description: "__MSG_description__",
  version: version.split("-")[0],
  version_name: version,
  homepage_url: homepage,
  author: "Scratch Addons",
  default_locale: "en",
  icons: ICONS[iconDisplay],
  background: {
    service_worker: "background/index.ts",
    type: "module",
  },
  action: { default_popup: PAGES.POPUP.INDEX },
  options_page: PAGES.SETTINGS.INDEX,
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

export const extraIcons = [ICONS.MUTED[16], ICONS.MUTED[32]];
export const extraPages = [PAGES.POPUP.FULLSCREEN];

export default manifest;
