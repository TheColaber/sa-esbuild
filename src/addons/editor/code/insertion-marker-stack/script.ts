export default async () => {
  const Blockly = await addon.tab.blocklyReady()
  console.log("insertion-marker-stack is running!");
  Blockly.InsertionMarkerManager.prototype.createMarkerBlock_ = function(sourceBlock) {
    var imType = sourceBlock.type;
  
    Blockly.Events.disable();
    try {
      var result = this.workspace_.newBlock(imType);
      for (const child of sourceBlock.getChildren()) {
        if (child.isShadow()) continue;
        const block = this.workspace_.newBlock(child.type);
        result.setInsertionMarker(true, child.width);
        block.setParent(result)
      }
      result.setInsertionMarker(true, sourceBlock.width);
      if (sourceBlock.mutationToDom) {
        var oldMutationDom = sourceBlock.mutationToDom();        
        if (oldMutationDom) {
          result.domToMutation(oldMutationDom);
        }
      }
      console.log(result.getSvgRoot());
      
      result.initSvg();
    } finally {
      Blockly.Events.enable();
    }
  
    return result;
  };
};
