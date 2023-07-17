import { AddonScript } from "../addon-helpers";

declare var addons: {
  [id: string]: AddonScript[];
};

export = addons;
