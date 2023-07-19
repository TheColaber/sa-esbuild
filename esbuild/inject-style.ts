export default function injectStyle(css: string) {
  const style = document.createElement("style");
  style.textContent = css;

  if (document.body) document.body.after(style);
  else document.documentElement.appendChild(style);
}
