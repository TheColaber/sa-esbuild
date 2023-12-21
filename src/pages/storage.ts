class Storage<T> {
  public get<U extends keyof T>(key: U): T[U] | null {
    const item = window.localStorage.getItem(key.toString());
    try {
      return JSON.parse(item) as T[U];
    } catch (error) {
      return null;
    }
  }

  public set<U extends keyof T>(key: U, value: T[U]): void {
    window.localStorage.setItem(key.toString(), JSON.stringify(value));
  }

  // public removeItem<U extends keyof T>(key: U): void {
  //   this.storage?.removeItem(key.toString());
  // }

  // public clear(): void {
  //   this.storage?.clear();
  // }
}

type PageStorage = {
  lightTheme: boolean;
  lastSelectedPopup: string;
}
const storage = new Storage<PageStorage>();
export default storage;