// addon to make blocks underneath selected delete
// when using hotkey (ctrl+x) on top block

export default async () => {
  const Blockly = await addon.tab.blocklyReady();
  addon.tab.editor.createBlockContextMenu(
    (items) => {
      items.push({
        enabled: Blockly.clipboardXml_,
        text: "Paste",
        separator: true,
        callback: () => {
          Blockly.Events.setGroup(true);
          var workspace = Blockly.clipboardSource_;
          if (workspace.isFlyout) {
            workspace = workspace.targetWorkspace;
          }
          workspace.paste(Blockly.clipboardXml_);
          Blockly.Events.setGroup(false);
        },
      });
      return items;
    },
    { workspace: true },
  );

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
