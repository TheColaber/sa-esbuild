import { AddonStorage } from "../../background/storage";

export default class Settings extends EventTarget {
  private settings: AddonStorage[any];
  constructor(settings) {
    super();

    this.settings = settings;

    this.addEventListener("change", (event: CustomEvent) => {
      this.settings = event.detail;
    });
  }

  get(id: string) {
    return this.settings[id];
  }
}
