import Tab from "./tab";

export default class Editor extends EventTarget {
  tab: Tab;
  constructor(tab: Tab) {
    super();
    this.tab = tab;
  }

  createBlockContextMenu(
    callback: (items: any[], event: MouseEvent) => any[],
    {
      workspace = false,
      blocks = false,
      flyout = false,
      comments = false,
    } = {},
  ) {
    contextMenuCallbacks.push({
      addonId: this.tab.id,
      callback,
      workspace,
      blocks,
      flyout,
      comments,
    });
    contextMenuCallbacks.sort(
      (b, a) =>
        CONTEXT_MENU_ORDER.indexOf(b.addonId) -
        CONTEXT_MENU_ORDER.indexOf(a.addonId),
    );
  }
}

const contextMenuCallbacks = [];
const CONTEXT_MENU_ORDER = [
  "editor-devtools",
  "block-switching",
  "blocks2image",
  "swap-local-global",
];
scratchAddons.getCache().then(({ BlocklyInstance }) => {
  const oldShow = BlocklyInstance.ContextMenu.show;
  BlocklyInstance.ContextMenu.show = function (event, items, rtl) {
    const gesture = BlocklyInstance.mainWorkspace.currentGesture_;
    const block = gesture.targetBlock_;

    for (const {
      callback,
      workspace,
      blocks,
      flyout,
      comments,
    } of contextMenuCallbacks) {
      let injectMenu =
        // Workspace
        (workspace && !block && !gesture.flyout_ && !gesture.startBubble_) ||
        // Block in workspace
        (blocks && block && !gesture.flyout_) ||
        // Block in flyout
        (flyout && gesture.flyout_) ||
        // Comments
        (comments && gesture.startBubble_);
      if (injectMenu) {
        try {
          items = callback(items, event);
        } catch (e) {
          console.error("Error while calling context menu callback: ", e);
        }
      }
    }

    oldShow.call(this, event, items, rtl);

    const blocklyContextMenu = BlocklyInstance.WidgetDiv.DIV.firstChild;
    items.forEach((item, i) => {
      if (i !== 0 && item.separator) {
        const itemElt = blocklyContextMenu.children[i];
        itemElt.style.paddingTop = "2px";
        itemElt.style.borderTop = "1px solid hsla(0, 0%, 0%, 0.15)";
      }
    });
  };
});
