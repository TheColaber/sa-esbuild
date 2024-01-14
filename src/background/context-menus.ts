import { localStorage, syncStorage } from "./storage";

const periods = [
  { id: "15min", mins: 15 },
  { id: "1hour", mins: 60 },
  { id: "8hours", mins: 480 },
  { id: "24hours", mins: 1440 },
  { id: "untilEnabled", mins: Infinity },
];

const MUTE = "MUTE";
const UNMUTE = "UNMUTE";
const MUTE_MESSAGE = "mute";
const UNMUTE_MESSAGE = "unmute";
const MUTED_ALARM = "MUTED_ALARM";
const DEV_GROUP = "DEV_GROUP";
const DEV_RESET_SETTINGS = "DEV_RESET_SETTINGS";

create();

async function create() {
  await chrome.contextMenus.removeAll();
  createContextMenu(UNMUTE, chrome.i18n.getMessage(UNMUTE_MESSAGE));
  createContextMenu(MUTE, chrome.i18n.getMessage(MUTE_MESSAGE));

  for (const period of periods) {
    createContextMenu(period.id, chrome.i18n.getMessage(period.id), MUTE);
  }

  update((await localStorage.get("muted")).muted);

  const { installType } = await chrome.management.getSelf();
  if (installType === "development") {
    createContextMenu(DEV_GROUP, "Developer");
    createContextMenu(DEV_RESET_SETTINGS, "Reset settings", DEV_GROUP);
  }
}

chrome.contextMenus.onClicked.addListener((info) => {
  const { parentMenuItemId, menuItemId } = info;

  if (parentMenuItemId === MUTE) {
    const period = periods.find(({ id }) => menuItemId === id);
    if (!period) throw new Error("Unknown context menu item");

    update(true);

    if (period.mins !== Infinity) {
      chrome.alarms.create(MUTED_ALARM, { delayInMinutes: period.mins });
    }
  } else if (menuItemId === UNMUTE) {
    update(false);
  } else if (menuItemId === DEV_RESET_SETTINGS) {
    syncStorage.clear();
    localStorage.clear();
    chrome.runtime.reload();
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === MUTED_ALARM) {
    update(false);
  }
});

function createContextMenu(id: string, title: string, parentId?: string) {
  chrome.contextMenus.create({
    id,
    title,
    contexts: ["action"],
    parentId,
  });
}

function update(muted: boolean = false) {
  chrome.contextMenus.update(MUTE, { visible: !muted });
  chrome.contextMenus.update(UNMUTE, { visible: muted });
  localStorage.set({ muted });

  const versionName = chrome.runtime.getManifest().version_name || "";
  const prerelease = versionName.includes("-prerelease");
  const icon = muted ? "-gray" : prerelease ? "-blue" : "";
  chrome.action.setIcon({
    path: {
      16: `../images/icon${icon}-16.png`,
      32: `../images/icon${icon}-32.png`,
    },
  });
}
