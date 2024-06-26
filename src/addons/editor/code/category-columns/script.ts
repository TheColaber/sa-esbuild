import { stylesheet } from "./styles.css";
export default async () => {
  addon.tab.injectStyle(stylesheet);
  const Blockly = await addon.tab.blocklyReady();

  // https://github.com/scratchfoundation/scratch-blocks/blob/893c7e7ad5bfb416eaed75d9a1c93bdce84e36ab/core/toolbox.js#L235
  const _ToolboxPosition = Blockly.Toolbox.prototype.position;
  Blockly.Toolbox.prototype.position = function () {
    _ToolboxPosition.call(this);

    // Update flyout position when category menu height changes.
    if (this.HtmlDiv && !this.HtmlDiv._observer) {
      this.HtmlDiv._observer = new ResizeObserver(() => {
        this.flyout_.position();
      });
      this.HtmlDiv._observer.observe(this.HtmlDiv);
    }
  };

  // https://github.com/scratchfoundation/scratch-blocks/blob/893c7e7ad5bfb416eaed75d9a1c93bdce84e36ab/core/flyout_vertical.js#L314
  const _VerticalFlyoutPosition = Blockly.VerticalFlyout.prototype.position;
  Blockly.VerticalFlyout.prototype.position = function () {
    _VerticalFlyoutPosition.call(this);
    if (!addon.enabled || !this.isVisible()) {
      return;
    }
    var targetWorkspaceMetrics = this.targetWorkspace_.getMetrics();
    if (!targetWorkspaceMetrics) {
      // Hidden components will return null.
      return;
    }

    // In RTL, subtract the total width of left and right workspace borders and the category menu border
    // from the workspace width.
    var x =
      this.toolboxPosition_ === Blockly.TOOLBOX_AT_RIGHT
        ? targetWorkspaceMetrics.viewWidth - 3
        : 0;

    // TODO: why does this height change depending on if the tab is focused?
    var y = this.parentToolbox_.HtmlDiv.offsetHeight;

    // Addon sets the width of the flyout to the width of the toolbox.
    this.width_ = this.parentToolbox_.getWidth();
    this.height_ = Math.max(0, targetWorkspaceMetrics.viewHeight - y);

    this.setBackgroundPath_(this.width_, this.height_);

    this.svgGroup_.setAttribute("width", this.width_);
    this.svgGroup_.setAttribute("height", this.height_);
    var transform = "translate(" + x + "px," + y + "px)";
    Blockly.utils.setCssTransform(this.svgGroup_, transform);

    // Update the scrollbar (if one exists).
    if (this.scrollbar_) {
      // Set the scrollbars origin to be the top left of the flyout.
      this.scrollbar_.setOrigin(
        x +
          (this.toolboxPosition_ === Blockly.TOOLBOX_AT_RIGHT
            ? 0
            : this.width_ - this.getWidth()),
        y,
      );
      this.scrollbar_.resize();
    }

    // Set CSS variables for the userstyle.
    const container = this.svgGroup_.closest("[class*='gui_tab-panel_']");
    container.style.setProperty("--sa-add-extension-button-y", `${y - 33}px`);
  };

  // https://github.com/scratchfoundation/scratch-blocks/blob/893c7e7ad5bfb416eaed75d9a1c93bdce84e36ab/core/flyout_base.js#L370
  const _VerticalFlyoutGetWidth = Blockly.VerticalFlyout.prototype.getWidth;
  Blockly.VerticalFlyout.prototype.getWidth = function () {
    // In RTL, this will be called by Blockly to position blocks inside the flyout.
    let width = _VerticalFlyoutGetWidth.call(this);
    if (addon.enabled) width += 60;
    return width;
  };

  // https://github.com/scratchfoundation/scratch-blocks/blob/893c7e7ad5bfb416eaed75d9a1c93bdce84e36ab/core/toolbox.js#L595
  const _CategoryMenuCreateDom =
    Blockly.Toolbox.CategoryMenu.prototype.createDom;
  Blockly.Toolbox.CategoryMenu.prototype.createDom = function () {
    _CategoryMenuCreateDom.call(this);
    if (!addon.enabled) return;

    this.secondTable = document.createElement("div");
    this.secondTable.className =
      "scratchCategorySecondMenu " +
      (this.parent_.horizontalLayout_
        ? "scratchCategoryMenuHorizontal"
        : "scratchCategoryMenu");
    this.parentHtml_.appendChild(this.secondTable);
    this.parentHtml_.classList.add("sa-columns-enabled");
  };

  const oParser = new DOMParser();
  const defaultToolbox = oParser.parseFromString(
    Blockly.Blocks.defaultToolbox,
    "text/xml",
  ).documentElement;
  const categoryNames = [...defaultToolbox.children].map((category) =>
    category.getAttribute("name"),
  );

  // https://github.com/scratchfoundation/scratch-blocks/blob/893c7e7ad5bfb416eaed75d9a1c93bdce84e36ab/core/toolbox.js#L606
  const _CategoryMenuPopulate = Blockly.Toolbox.CategoryMenu.prototype.populate;
  Blockly.Toolbox.CategoryMenu.prototype.populate = function (domTree) {
    if (!domTree) return;

    const extensionsNodes = [];
    const extensionTree = domTree.cloneNode(true);
    if (addon.enabled) {
      extensionTree.childNodes.forEach((child) => {
        if (
          child.tagName === "category" &&
          !categoryNames.includes(child.getAttribute("name"))
        ) {
          extensionsNodes.push(child.cloneNode(true));
          child.remove();
        }
      });
    }
    _CategoryMenuPopulate.call(this, extensionTree);
    for (const child of extensionsNodes) {
      const row = document.createElement("div");
      row.className = "scratchCategoryMenuRow";
      this.secondTable.appendChild(row);
      if (child) {
        this.categories_.push(new Blockly.Toolbox.Category(this, row, child));
      }
    }
    if (addon.enabled) {
      this.height_ = this.table.offsetHeight + this.secondTable.offsetHeight;
    }
  };

  // https://github.com/scratchfoundation/scratch-blocks/blob/893c7e7ad5bfb416eaed75d9a1c93bdce84e36ab/core/toolbox.js#L639
  const _CategoryMenuDispose = Blockly.Toolbox.CategoryMenu.prototype.dispose;
  Blockly.Toolbox.CategoryMenu.prototype.dispose = function () {
    _CategoryMenuDispose.call(this);
    if (this.secondTable) {
      this.secondTable.remove();
      this.secondTable = null;
    }
  };

  function updateToolbox() {
    const workspace = Blockly.getMainWorkspace();
    const toolbox = workspace.getToolbox();
    if (!toolbox) return;
    const categoryMenu = toolbox.categoryMenu_;
    if (!categoryMenu) return;

    // Scratch may have already updated the toolbox for us, so no need to update it again.
    if (categoryMenu.secondTable && addon.enabled) return;
    // Must dispose and createDom the category menu so we can run our polluted commands.
    categoryMenu.dispose();
    categoryMenu.createDom();
    // Repopulate the category menu since we've just disposed it.
    toolbox.populate_(workspace.options.languageTree);
    // Reposition the toolbox, since it's likely our addon moved it.
    toolbox.position();
  }

  updateToolbox();
  addon.addEventListener("disabled", updateToolbox);
  addon.addEventListener("reenabled", updateToolbox);

  while (true) {
    const addExtensionContainer = await addon.tab.waitForElement(
      "[class*='gui_extension-button-container']",
      {
        markAsSeen: true,
        reduxEvents: [
          "scratch-gui/mode/SET_PLAYER",
          "fontsLoaded/SET_FONTS_LOADED",
          "scratch-gui/locales/SELECT_LOCALE",
        ],
        condition: () => !addon.tab.redux.state.scratchGui.mode.isPlayerOnly,
      },
    );
    addExtensionContainer.classList.add("sa-columns-enabled");
    const addExtensionButton = addExtensionContainer.firstElementChild;
    const addExtensionLabel = Object.assign(document.createElement("span"), {
      className: "sa-add-extension-label",
      innerText: addExtensionButton.getAttribute("title"),
    });
    addon.tab.displayNoneWhileDisabled(addExtensionLabel);
    addExtensionButton.appendChild(addExtensionLabel);
    addExtensionButton.removeAttribute("title");
  }
};
