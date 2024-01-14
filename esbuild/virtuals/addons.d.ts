import { AddonManifest } from "../addon-helpers";

declare var addons: {
  [id: string]: AddonManifest & {
    id: string;
    category: ("editor" | "general" | "popup")[];
  };
};

export = addons;
