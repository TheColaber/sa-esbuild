export default class Auth extends EventTarget {
  id: string;
  messageCache: { timestamp: number; value: null | Promise<number> };
  sessionCache: {
    timestamp: number;
    value: null | Promise<{ user: { username: string; token: string } }>;
  };

  constructor(id: string) {
    super();
    this.id = id;
    this.messageCache = { timestamp: 0, value: null };
    this.sessionCache = { timestamp: 0, value: null };

    chrome.cookies.onChanged.addListener(async ({ cookie, removed }) => {
      if (cookie.name === "scratchsessionsid") {
        this.dispatchEvent(new CustomEvent("updatedSession"));
      }
    });
  }

  async getSession() {
    const date = Date.now();
    try {
      if (
        this.sessionCache.value instanceof Promise &&
        date - this.sessionCache.timestamp < 1000
      ) {
        return await this.sessionCache.value;
      }
      this.sessionCache.timestamp = date;
      this.sessionCache.value = fetch("https://scratch.mit.edu/session/", {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      }).then((res) => res.json());
      return await this.sessionCache.value;
    } catch (error) {
      return { error };
    }
  }

  async getMessageCount() {
    const date = Date.now();

    if (
      this.messageCache.value instanceof Promise &&
      date - this.messageCache.timestamp < 1000
    ) {
      return await this.messageCache.value;
    }
    const session = await this.getSession();
    if ("error" in session || !session.user) return 0;
    this.messageCache.timestamp = date;
    this.messageCache.value = fetch(
      `https://api.scratch.mit.edu/users/${session.user.username}/messages/count`,
    )
      .then((res) => res.json())
      .then((val: { count: number }) => val.count);
    return await this.messageCache.value;
  }
}
