import Auth from "./auth";

export default class PopupAddon extends EventTarget {
  id: string;
  auth: Auth;

  constructor(id: string) {
    super();
    this.id = id;
    this.auth = new Auth(id);
  }
}
