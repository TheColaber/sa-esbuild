export default async () => {
  const Blockly = await addon.tab.blocklyReady()

  addon.tab.editor.createBlockContextMenu((items, e) => {
    if (!addon.enabled) return items;
    
    items.push({
      enabled: true,
      text: "Make Space",
      seperator: true,
      callback: () => {
        const rootBlock = Blockly.selected.getRootBlock();
        const selectedCoords = rootBlock.getRelativeToSurfaceXY();
        const selectedDimensions = rootBlock.getHeightWidth();
        const selectedRight = selectedCoords.x + selectedDimensions.width;
        const selectedBottom = selectedCoords.y + selectedDimensions.height;    
       
        const workspace = Blockly.getMainWorkspace();
        const topBlocks = workspace.getTopBlocks();
        const grid = workspace.getGrid();
        const spacing = grid.getSpacing();

        const ADJUSTED_MOVE_X = 4 * spacing;
        const ADJUSTED_MOVE_Y = 6 * spacing;

        let maxMoveX = 0;
        let maxMoveY = 0;
        const requiredYShifts = new Map<ScratchBlocks.Block, Boolean>();

        for (const topBlock of topBlocks) {
          if (topBlock === rootBlock) continue;

          const blockCoords = topBlock.getRelativeToSurfaceXY();
          const blockDimensions = topBlock.getHeightWidth();
          const blockRight = blockCoords.x + blockDimensions.width;
          const blockBottom = blockCoords.y + blockDimensions.height;    
          const blocksInColumn =
          (selectedCoords.x <= blockCoords.x && blockCoords.x < selectedRight) ||
          (blockCoords.x <= selectedCoords.x && selectedCoords.x < blockRight);
          
          const shouldShiftY = blocksInColumn && blockCoords.y > selectedBottom;          
          const shouldShiftX = !shouldShiftY && blockCoords.x >= selectedCoords.x && blockBottom >= selectedCoords.y
          
          if (!shouldShiftX && !shouldShiftY) continue;
          
          requiredYShifts.set(topBlock, shouldShiftY);
          
          const diffX = ADJUSTED_MOVE_X - blockCoords.x + Math.round(selectedRight / spacing) * spacing;
          const diffY = ADJUSTED_MOVE_Y - blockCoords.y + Math.round(selectedBottom / spacing) * spacing;
          maxMoveX = Math.max(maxMoveX, Number(shouldShiftX) * diffX);
          maxMoveY = Math.max(maxMoveY, Number(shouldShiftY) * diffY);
        }
        
        Blockly.Events.setGroup(true);
        for (const topBlock of topBlocks) {          
          if (!requiredYShifts.has(topBlock)) continue;
          const moveY = Number(requiredYShifts.get(topBlock));
          topBlock.moveBy(Number(!moveY) * maxMoveX, moveY * maxMoveY)
        }
        Blockly.Events.setGroup(false);
      }
    });
    return items;
  }, { blocks: true });
};
