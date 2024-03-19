import { ExtraAddonManifest } from "../addon-helpers";

declare var addons: {
  [id: string]: ExtraAddonManifest;
};

export = addons;
