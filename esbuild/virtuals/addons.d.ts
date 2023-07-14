import { AddonManifest } from "../addon-helpers";

declare var addons: {
  [id: string]: AddonManifest;
};

export = addons;
