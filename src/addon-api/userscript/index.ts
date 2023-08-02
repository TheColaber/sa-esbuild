import Tab from "./tab";

export default class UserscriptAddon extends EventTarget {
  id: string;
  messages: { [id: string]: string };
  enabledLate: boolean;
  tab: Tab;
  console: Console;

  constructor(
    id: string,
    messages: { [id: string]: string },
    enabledLate: boolean,
  ) {
    super();
    this.id = id;
    this.tab = new Tab(id);
    this.messages = messages;
    this.enabledLate = enabledLate;
    this.console = {
      ...scratchAddons.realConsole,
      log: scratchAddons.realConsole.log.bind(
        scratchAddons.realConsole,
        "%csa %c" + id,
        "color: #ff7b26;",
        "color: #ff9a57",
      ),
    };
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
