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

  unprefixKey(key: keyof T) {
    if (!(typeof key === "string")) return;
    return key.split(this.name + "-")[1];
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

    return chrome.storage[this.type].set(storage);
  }

  clear() {
    return chrome.storage[this.type].clear();
  }

  watch(
    cb: (newStorage: {
      [key in keyof T]: { newValue: T[key]; oldValue: T[key] } | undefined;
    }) => any,
  ) {
    return chrome.storage[this.type].onChanged.addListener(
      (changes: {
        [key in keyof T]: { newValue: T[key]; oldValue: T[key] };
      }) => {
        let prefixedKeys = Object.keys(changes) as Array<keyof T>;
        let unprefixedChanges = {};
        for (const prefixedKey of prefixedKeys) {
          unprefixedChanges[this.unprefixKey(prefixedKey)] =
            changes[prefixedKey];
        }
        cb(
          unprefixedChanges as {
            [key in keyof T]: { newValue: T[key]; oldValue: T[key] };
          },
        );
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
    [settingId: string]: number | string;
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
