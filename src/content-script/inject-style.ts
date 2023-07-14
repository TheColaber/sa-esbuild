export default function injectStyle(css: string, id?: string) {
  const style = document.createElement("style");
  if (id) {
    style.classList.add("scratch-addons-style");
    style.dataset.addonId = id;
  }
  style.textContent = css;

  if (document.body) document.body.after(style);
  else document.documentElement.appendChild(style);
}
