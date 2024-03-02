export default async () => {
  const Blockly = await addon.tab.blocklyReady();
  const _doWorkspaceClick_ = Blockly.Gesture.prototype.doWorkspaceClick_;
  Blockly.Gesture.prototype.doWorkspaceClick_ = function () {
    if (
      addon.enabled &&
      (this.mostRecentEvent_.button === 1 || this.mostRecentEvent_.shiftKey)
    ) {
      // Wheel button...
      // show input
      // floatingInput.show(this.mostRecentEvent_);
    }

    _doWorkspaceClick_.call(this);
  };
};
