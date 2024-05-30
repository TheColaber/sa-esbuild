export default async () => {
  const Blockly = await addon.tab.blocklyReady();
  const mouse = { x: 0, y: 0 };
  const _pasteBlock = Blockly.WorkspaceSvg.prototype.pasteBlock_;
  Blockly.WorkspaceSvg.prototype.pasteBlock_ = function (xmlBlock) {
    _pasteBlock.call(this, xmlBlock);

    const block = Blockly.selected.svgGroup_.getBoundingClientRect();

    Blockly.selected.moveBy(
      (mouse.x - block.x) / this.scale,
      (mouse.y - block.y) / this.scale,
    );

    this.setResizesEnabled(false);

    var fakeEvent = {
      clientX: mouse.x,
      clientY: mouse.y,
      type: "mousedown",
      preventDefault: function () {},
      stopPropagation: function () {},
      target: document,
    };
    this.startDragWithFakeEvent(fakeEvent, Blockly.selected);

    // "Resizes will be reenabled at the end of the drag." (according to scratch)
  };

  document.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });
};
