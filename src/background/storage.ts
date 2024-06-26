class Storage<T> {
  private name: string;
  private type: "sync" | "local";
  constructor(type: "sync" | "local", name: string) {
    this.name = name;
    this.type = type;
  }

  prefixKey(key: keyof T) {
    return this.name + "--" + key.toString();
  }

  splitKey(key: keyof T) {
    if (!(typeof key === "string")) return;
    return key.split("--");
  }

  async get<K extends keyof T>(...keys: K[]) {
    let prefixedKeys = keys.flatMap((key) => this.prefixKey(key));
    if (prefixedKeys.length === 0) prefixedKeys = null;
    const storage = (await chrome.storage[this.type].get(prefixedKeys)) as {
      [P in K]: T[P];
    };
    keys = Object.keys(storage).map((key) => this.splitKey(key)[1]);
    const unprefixedStorage = keys
      .map((key) => ({ [key]: storage[this.prefixKey(key)] }))
      .reduce((all, single) => ({ ...single, ...all }), {}) as {
      [P in K]: T[P];
    };

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
      [key in keyof T]?: { newValue: T[key]; oldValue: T[key] };
    }) => any,
  ) {
    return chrome.storage[this.type].onChanged.addListener(
      (changes: {
        [key in keyof T]: { newValue: T[key]; oldValue: T[key] };
      }) => {
        let prefixedKeys = Object.keys(changes) as Array<keyof T>;
        let unprefixedChanges: {
          [key in keyof T]?: { newValue: T[key]; oldValue: T[key] };
        } = {};
        for (const prefixedKey of prefixedKeys) {
          const splitKey = this.splitKey(prefixedKey);
          if (splitKey[0] !== this.name) continue;

          unprefixedChanges[splitKey[1]] = changes[prefixedKey];
        }
        if (Object.keys(unprefixedChanges).length > 0) {
          cb(unprefixedChanges);
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
  onboarded: boolean;
}
export const syncStorage = new Storage<SyncStorage>("sync", "syncstorage");

export interface AddonStorage {
  [addonId: string]: {
    [settingId: string]: number | string;
  };
}
export const addonStorage = new Storage<AddonStorage>("sync", "addonstorage");

export const addonDisabledStates = ["defaultDisabled", "disabled"] as const;
export const addonProductionStates = ["defaultEnabled", "enabled"] as const;
export const addonDevelopmentStates = ["dev"] as const;
export const addonEnabledStates = [
  ...addonProductionStates,
  ...addonDevelopmentStates,
] as const;
export const allAddonStates = [
  ...addonDisabledStates,
  ...addonEnabledStates,
] as const;

export interface LocalStorage {
  muted?: boolean;
  installedDetails?: chrome.runtime.InstalledDetails;
}
export const localStorage = new Storage<LocalStorage>("local", "localstorage");
