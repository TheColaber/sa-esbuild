import { AddonPopup } from "../addon-helpers";

declare var addons: {
  [id: string]: AddonPopup;
};

export = addons;
