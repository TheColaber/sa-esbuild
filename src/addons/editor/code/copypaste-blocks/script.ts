// addon to make pasted items go to mouse pointer
// addon to make blocks delete when cut top block

export default async () => {
  const Blockly = await addon.tab.blocklyReady();
  addon.tab.editor.createBlockContextMenu(
    (items, event) => {
      items.push({
        enabled: Blockly.clipboardXml_,
        text: "Paste",
        separator: true,
        _isDevtoolsFirstItem: true,
        callback: () => {
          Blockly.Events.setGroup(true);
          // Pasting always pastes to the main workspace, even if the copy started
          // in a flyout workspace.
          var workspace = Blockly.clipboardSource_;
          if (workspace.isFlyout) {
            workspace = workspace.targetWorkspace;
          }
          workspace.paste(Blockly.clipboardXml_);
          Blockly.Events.setGroup(false);
          console.log(event);
          console.log(Blockly.selected.workspace);

          // workspace.startDragWithFakeEvent(event, Blockly.selected);
        },
      });
      return items;
    },
    { workspace: true },
  );

  // const oldDipose = Blockly.Block.prototype.dispose;
  // Blockly.Block.prototype.dispose = function(healStack) {
  //   oldDipose.call(this, false);
  //   console.log("?");

  // }

  addon.tab.editor.createBlockContextMenu(
    (items) => {
      items.push(
        {
          enabled: true,
          text: "Copy",
          callback: () => {
            Blockly.hideChaff();
            Blockly.copy_(Blockly.selected);
          },
          separator: true,
        },
        // {
        //   enabled: true,
        //   text: "Copy Block",
        //   callback: () => {
        //     Blockly.hideChaff();
        //     const nextBlock = Blockly.selected.getNextBlock();
        //     if (nextBlock) {
        //       nextBlock.unplug(false);
        //     }
        //     Blockly.copy_(Blockly.selected);
        //   },
        // },
        {
          enabled: true,
          text: "Cut",
          callback: () => {
            Blockly.copy_(Blockly.selected);
            Blockly.Events.setGroup(true);
            Blockly.hideChaff();
            Blockly.selected.dispose();
            Blockly.Events.setGroup(false);
          },
        },
      );
      return items;
    },
    { blocks: true },
  );
};
