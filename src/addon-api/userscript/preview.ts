export default class Preview extends EventTarget {
  createEditorTooltip(
    content: string,
    attach: Element,
    place: "left" | "right" | "bottom" | "top" = "bottom",
  ) {
    const tooltipDiv = document.body.appendChild(document.createElement("div"));
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
    const tooltipSpan = tooltipDiv.appendChild(document.createElement("span"));
    tooltipSpan.textContent = content;
    const rect = attach.getBoundingClientRect();
    let top = 0;
    let left = 0;
    if (place === "bottom") {
      top = rect.bottom;
      left = rect.left;
    } else if (place === "right") {
      top = rect.top;
      left = rect.right;
    }
    tooltipDiv.style.top = top + "px";
    tooltipDiv.style.left = left + "px";
    return tooltipDiv;
  }
}
