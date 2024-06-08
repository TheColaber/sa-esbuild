import WorkerAddon from "../../../addon-api/worker";

export default (addon: WorkerAddon) => {
  updateBadge();
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "updateMessageCount") {
      updateBadge();
    }
  });

  async function updateBadge() {
    chrome.alarms.create("updateMessageCount", { delayInMinutes: 0.5 });
    const count = await addon.auth.getMessageCount();
    if (count === 0) return;
    chrome.action.setBadgeText({ text: count.toString() });
  }
};
