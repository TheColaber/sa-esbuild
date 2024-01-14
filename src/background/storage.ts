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

  async get<K extends keyof T>(...keys: K[]) {
    let prefixedKeys = keys.flatMap((key) => this.prefixKey(key));
    const storage = (await chrome.storage[this.type].get(
      prefixedKeys,
    )) as Partial<T>;
    const unprefixedStorage = keys
      .map((key) => ({ [key]: storage[this.prefixKey(key)] as T[K] }))
      .reduce((all, single) => ({ ...single, ...all }), {});

    return unprefixedStorage;
  }

  set(newStorage: Partial<T>) {
    const entries = Object.entries(newStorage).map(([key, val]) => [
      this.prefixKey(key as keyof T),
      val,
    ]);
    const storage = Object.fromEntries(entries);
    console.log(storage);

    return chrome.storage[this.type].set(storage);
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
    [addonId: string]: (typeof allAddonStates)[number];
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

export const addonDisabledStates = ["defaultDisabled", "disabled"] as const;

export const addonEnabledStates = ["defaultEnabled", "dev", "enabled"] as const;

export const allAddonStates = [
  ...addonDisabledStates,
  ...addonEnabledStates,
] as const;

export interface LocalStorage {
  muted?: boolean;
  installedDetails?: chrome.runtime.InstalledDetails;
}
export const localStorage = new Storage<LocalStorage>("local", "localstorage");
