import { version } from "../package.json";

/** @type {chrome.runtime.ManifestV3} */
const manifest = {
  name: "Scratch Addons",
  description: "EXTENSION DESCRIPTION",
  manifest_version: 3,
  version: version.split("-")[0],
  version_name: version,
  action: {
    default_popup: "pages/popup/index.html",
  },
  options_page: "pages/settings/index.html",
  background: {
    service_worker: "background/index.ts",
    type: "module",
  },
};

export default manifest;
