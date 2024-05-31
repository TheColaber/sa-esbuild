export default async () => {
  const Blockly = await addon.tab.blocklyReady();

  const oldCleanUpFunc = Blockly.WorkspaceSvg.prototype.cleanUp;
  Blockly.WorkspaceSvg.prototype.cleanUp = function () {
    if (!addon.enabled) return oldCleanUpFunc.call(this);

    const orphansPrompt = addon.settings.get("orphansPrompt");
    const unusedVariablesPrompt = addon.settings.get("unusedVariablesPrompt");

    const topBlocks = this.getTopBlocks();
    const maxWidths = {};
    const orphans = [];

    Blockly.Events.setGroup(true);

    const columns = [];
    // TODO: Revist this constant
    const MAX_COLUMN_DISTANCE = 200;

    for (const topBlock of topBlocks) {
      const position = topBlock.getRelativeToSurfaceXY();
      let closestColumn = null;
      let closestDistance = MAX_COLUMN_DISTANCE;

      if (orphansPrompt && topBlock.outputConnection) {
        orphans.push(topBlock);
        continue;
      }

      // Find the closest column to the block, but still not outside of the MAX_COLUMN_DISTANCE
      for (const column of columns) {
        const distFromColumn = Math.abs(position.x - column.x);
        if (distFromColumn < closestDistance) {
          closestDistance = distFromColumn;
          closestColumn = column;
        }
      }

      if (closestColumn) {
        // reaverage the column x position with the new included column.
        closestColumn.x =
          (closestColumn.x * closestColumn.count + position.x) /
          ++closestColumn.count;
        closestColumn.blocks.push(topBlock);
      } else {
        columns.push({ x: position.x, count: 1, blocks: [topBlock] });
      }
    }

    if (orphans.length > 0) {
      if (confirm(`Delete ${orphans.length} orphaned reporter blocks?`)) {
        for (const orphan of orphans) {
          orphan.dispose();
        }
      } else {
        columns.push({ x: Infinity, count: 0, blocks: orphans });
      }
    }

    columns.sort((a, b) => a.x - b.x);

    const grid = this.getGrid();
    const spacing = grid.getSpacing();
    const half = spacing / 2;
    let gridX = half;
    for (const column of columns) {
      column.blocks.sort(
        (a, b) => a.getRelativeToSurfaceXY().y - b.getRelativeToSurfaceXY().y,
      );

      let gridY = half;
      let maxWidth = 0;

      for (const block of column.blocks) {
        const extraWidth = 0;
        const extraHeight = spacing;
        let { x, y } = block.getRelativeToSurfaceXY();
        if (gridX - x !== 0 || gridY - y !== 0) {
          block.moveBy(gridX - x, gridY - y);
        }
        let heightWidth = block.getHeightWidth();
        gridY +=
          Math.round((heightWidth.height + extraHeight) / spacing) * spacing;

        let maxWidthWithComments = maxWidths[block.id] || 0;
        maxWidth = Math.max(
          maxWidth,
          Math.max(heightWidth.width + extraWidth, maxWidthWithComments),
        );
      }

      gridX += Math.round((maxWidth + spacing * 2) / spacing) * spacing;
    }

    let topComments = this.getTopComments();
    for (const comment of topComments) {
      if (comment.setVisible) {
        comment.setVisible(false);
        comment.needsAutoPositioning_ = true;
        comment.setVisible(true);
      }
    }

    if (unusedVariablesPrompt) {
      const variableMap = this.getVariableMap();
      const variables = variableMap.getVariablesOfType("");
      const unusedVariables = [];
      for (const variable of variables) {
        if (variable.isLocal) {
          const usages = variableMap.getVariableUsesById(variable.getId());
          if (usages.length === 0) {
            unusedVariables.push(variable);
          }
        }
      }

      if (unusedVariables.length > 0) {
        const unusedVariableNames = unusedVariables
          .map((v) => v.name)
          .join(", ");
        if (
          confirm("Delete unused variables? They are:\n" + unusedVariableNames)
        ) {
          for (const variable of unusedVariables) {
            this.deleteVariableById(variable.getId());
          }
        }
      }

      const lists = variableMap.getVariablesOfType("list");
      const unusedLists = [];
      for (const list of lists) {
        if (list.isLocal) {
          const usages = variableMap.getVariableUsesById(list.getId());
          if (usages.length === 0) {
            unusedLists.push(list);
          }
        }
      }

      if (unusedLists.length > 0) {
        const unusedListNames = unusedLists.map((v) => v.name).join(", ");
        if (confirm("Delete unused lists? They are:\n" + unusedListNames)) {
          for (const list of unusedLists) {
            this.deleteVariableById(list.getId());
          }
        }
      }
    }
  };
};
