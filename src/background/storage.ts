class Storage<T> {
  private name: string;
  private type: "sync" | "local";
  constructor(type: "sync" | "local", name: string) {
    this.name = name;
    this.type = type;
  }

  prefixKey(key: keyof T) {
    return this.name + "-" + key.toString();
  }

  get(...keys: (keyof T)[]) {
    let prefixedKeys = keys.flatMap((key) => this.prefixKey(key));
    return chrome.storage[this.type].get(prefixedKeys) as Promise<Partial<T>>;
  }

  set(newStorage: Partial<T>) {
    return chrome.storage[this.type].set(newStorage);
  }

  clear() {
    return chrome.storage[this.type].clear();
  }

  watch<U extends (keyof T)[]>(
    keys: U,
    cb: (newStorage: Pick<T, U[number]>) => any,
  ) {
    return chrome.storage[this.type].onChanged.addListener(
      (changes: Partial<T>) => {
        let prefixedKeys = Object.keys(this.prefixKey) as Array<keyof T>;
        for (const prefixedKey of prefixedKeys) {
          let unprefixedKey = keys.find(
            (key) => this.prefixKey(key) === prefixedKey,
          );
          if (unprefixedKey) {
            let unprefixedChanges = {
              [unprefixedKey as string]: changes[prefixedKey],
            } as Pick<T, U[number]>;
            cb(unprefixedChanges);
          }
        }
      },
    );
  }
}

export interface SyncStorage {
  addonsStates: {
    [addonId: string]:
      | "defaultEnabled"
      | "dev"
      | "defaultDisabled"
      | "enabled"
      | "disabled";
  };
  lightTheme: boolean;
}
export const syncStorage = new Storage<SyncStorage>("sync", "syncstorage");

export interface AddonStorage {
  [addonId: string]: {
    [settingId: string]: boolean | string;
  };
}
export const addonStorage = new Storage<AddonStorage>("sync", "addonstorage");

export const addonEnabledStates: SyncStorage["addonsStates"][string][] = [
  "defaultEnabled",
  "dev",
  "enabled",
];

export interface LocalStorage {
  muted?: boolean;
  installedDetails?: chrome.runtime.InstalledDetails;
}
export const localStorage = new Storage<LocalStorage>("local", "localstorage");
