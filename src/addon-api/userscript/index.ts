import { AddonStorage } from "../../background/storage";
import Settings from "./settings";
import Tab from "./tab";

export default class UserscriptAddon extends EventTarget {
  id: string;
  messages: { [id: string]: string };
  enabledLate: boolean;
  showPreview: boolean;
  tab: Tab;
  console: Console;
  settings: Settings;
  enabled = true;

  constructor(
    id: string,
    options: { enabledLate?: boolean; showPreview?: boolean },

    messages: { [id: string]: string },
    settings: AddonStorage[any],
  ) {
    super();
    this.id = id;
    this.messages = messages;
    this.enabledLate = options.enabledLate;
    this.showPreview = options.showPreview;
    this.tab = new Tab(id);
    this.console = {
      ...scratchAddons.realConsole,
      log: scratchAddons.realConsole.log.bind(
        scratchAddons.realConsole,
        "%csa %c" + id,
        "color: #ff7b26;",
        "color: #ff9a57",
      ),
    };
    this.settings = new Settings(settings);
  }

  msg(msg: string, parameters?: { [param: string]: string }) {
    let message = this.messages[msg];
    if (!message) {
      console.warn(`Message "${msg}" on addon "${this.id}" does not exist.`);
      return msg;
    }
    return message.replace(/\{(.*)\}/g, (full, param) => parameters[param]);
  }
}
