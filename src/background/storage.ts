import { getBucket } from "@extend-chrome/storage";

export interface SyncStorage {
  addonsStates: {
    [id: string]:
      | "defaultEnabled"
      | "dev"
      | "defaultDisabled"
      | "enabled"
      | "disabled";
  };
  lightTheme: boolean;
}
export const syncStorage = getBucket<SyncStorage>("syncstorage", "sync");
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
