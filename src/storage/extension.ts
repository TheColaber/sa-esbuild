import { getBucket } from "@extend-chrome/storage";

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
export const syncStorage = getBucket<SyncStorage>("syncstorage", "sync");

export interface AddonStorage {
  [addonId: string]: {
    [settingId: string]: boolean | string;
  };
}
export const addonStorage = getBucket<SyncStorage>("addonstorage", "sync");

export const addonEnabledStates: SyncStorage["addonsStates"][string][] = [
  "defaultEnabled",
  "dev",
  "enabled",
];

export interface LocalStorage {
  muted?: boolean;
  installedDetails?: chrome.runtime.InstalledDetails;
}
export const localStorage = getBucket<LocalStorage>("localstorage", "local");
