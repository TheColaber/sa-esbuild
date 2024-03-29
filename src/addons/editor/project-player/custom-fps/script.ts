export default async () => {
  // console.log("custom-fps is running!");
  // while (true) {
  //   // const controls = await addon.tab.waitForElement("[class^=controls_controls-container]", {markAsSeen: true})
  //   // const key = addon.tab.getInternalKey(controls)
  //   // console.log(key);
  //   // console.log(controls[key]);
  //   // const reactData = controls[key].alternate.return.return.alternate.return.stateNode
  //   // console.log(reactData);
  // }
  addon.tab.redux.addEventListener("statechanged", async (state: CustomEvent) => {
    if (state.detail.action.type === "scratch-gui/menus/OPEN_MENU") {
      if (state.detail.action.menu !== "editMenu") return;
      await addon.tab.scratchClassesReady()
        const menuList = document.querySelector("ul[class^=menu_menu]");
        console.log(menuList);
        const menuItem = menuList.appendChild(document.createElement("li"));
        menuItem.className = (addon.tab.scratchClass("menu_menu-item", "menu_hoverable"))
        const menuItemSpan = menuList.appendChild(document.createElement("span"));
        menuItem.innerText = "Turn on 60FPS"
        //<li class="menu_menu-item_3EwYA menu_hoverable_3u9dt"><span>Turn on Turbo Mode</span></li>
      
    }
  });
};
