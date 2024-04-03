import { createApp } from "vue";
import component from "./index.vue";

createApp(component).mount("body");

const getBuildTimestamp = async () => {
  return fetch("/timestamp.json")
    .then((v) => v.json())
    .then((stamps) => stamps.settings);
};
let buildStamp = await getBuildTimestamp();
setInterval(async () => {
  const newStamp = await getBuildTimestamp();
  if (newStamp !== buildStamp) {
    window.location.reload();
  }
}, 500);
