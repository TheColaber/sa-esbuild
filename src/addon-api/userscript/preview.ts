export default class Preview extends EventTarget {
  createEditorTooltip(
    content: string,
    place: "left" | "right" | "bottom" | "top" = "bottom",
  ) {
    const tooltipDiv = document.createElement("div");
    const list = [
      "__react_component_tooltip",
      "place-" + place,
      "type-dark",
      "coming-soon_coming-soon_3x7RD",
      "menu-bar_coming-soon-tooltip_20GhI",
      "coming-soon_" + place + "_2raz4",
      "show",
    ];
    tooltipDiv.className = list.join(" ");
    tooltipDiv.style.position = "relative";
    tooltipDiv.style.top = "0px";
    tooltipDiv.style.left = "0px";
    const tooltipSpan = tooltipDiv.appendChild(document.createElement("span"));
    tooltipSpan.textContent = content;
    return tooltipDiv;
  }
}
