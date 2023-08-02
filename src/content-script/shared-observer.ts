type PendingItem = {
  condition?: () => boolean;
  query: string;
  seen?: WeakSet<Element> | null;
  elementCondition?: (match: Element) => boolean;
};

type PendingSet = PendingItem & { resolve: (match: Element) => void };

export default class SharedObserver {
  inactive: boolean;
  pending: Set<PendingSet>;
  observer: MutationObserver;

  constructor() {
    this.inactive = true;
    this.pending = new Set();
    this.observer = new MutationObserver(() => {
      for (const item of this.pending) {
        let el = this.queryItem(item);
        if (el) {
          this.pending.delete(item);
          item.resolve(el);
        }
      }

      if (this.pending.size === 0) {
        this.inactive = true;
        this.observer.disconnect();
      }
    });
  }

  queryItem(item: PendingItem) {
    if (item.condition && !item.condition()) return;

    for (const match of document.querySelectorAll(item.query)) {
      if (item.seen?.has(match)) continue;
      if (item.elementCondition && !item.elementCondition(match)) continue;
      item.seen?.add(match);
      return match;
    }
  }

  watch(opts: PendingItem): Promise<Element> {
    let el = this.queryItem(opts);
    if (el) return Promise.resolve(el);

    if (this.inactive) {
      this.inactive = false;
      this.observer.observe(document.documentElement, {
        subtree: true,
        childList: true,
      });
    }

    return new Promise((resolve) =>
      this.pending.add({
        resolve,
        ...opts,
      }),
    );
  }
}
