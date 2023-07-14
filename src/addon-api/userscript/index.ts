import Tab from "./tab";

export default class UserscriptAddon extends EventTarget {
  id: string;
  enabledLate: boolean;
  tab: Tab;

  constructor(id: string, enabledLate: boolean) {
    super();
    this.id = id;
    this.tab = new Tab(id);
    this.enabledLate = enabledLate;
  }
}
