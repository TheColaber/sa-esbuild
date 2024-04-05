import { Script } from "../addon-helpers";

declare var addons: {
  [id: string]: Script;
};

export = addons;
