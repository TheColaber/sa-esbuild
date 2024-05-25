import Auth from "../common/auth";

export default class WorkerAddon extends EventTarget {
  id: string;
  auth: Auth;

  constructor(id: string) {
    super();
    this.id = id;
    this.auth = new Auth(id);
  }
}
