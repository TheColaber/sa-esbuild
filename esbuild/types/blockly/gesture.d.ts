declare global {
  namespace ScratchBlocks {
    class Gesture {
      mouseDownXY_: goog.math.Coordinate | null;
      currentDragDeltaXY_: goog.math.Coordinate | null;
      startBubble_: Blockly.Bubble | null;
      startField_: Blockly.Field | null;
      startBlock_: Blockly.BlockSvg | null;
      targetBlock_: Blockly.BlockSvg | null;
      startWorkspace_: Blockly.WorkspaceSvg | null;
      creatorWorkspace_: Blockly.WorkspaceSvg;
      hasExceededDragRadius_: boolean;
      isDraggingWorkspace_: boolean;
      isDraggingBlock_: boolean;
      isDraggingBubble_: boolean;
      mostRecentEvent_: Event;
      onMoveWrapper_: Array<Array<any>> | null;
      onUpWrapper_: Array<Array<any>> | null;
      bubbleDragger_: Blockly.BubbleDragger | null;
      blockDragger_: Blockly.BlockDragger | null;
      workspaceDragger_: Blockly.WorkspaceDragger | null;
      flyout_: Blockly.Flyout | null;
      calledUpdateIsDragging_: boolean;
      hasStarted_: boolean;
      isEnding_: boolean;
      shouldDuplicateOnDrag_: boolean;

      constructor(e: Event, creatorWorkspace: Blockly.WorkspaceSvg);

      dispose(): void;

      updateFromEvent_(e: Event): void;

      updateDragDelta_(currentXY: goog.math.Coordinate): boolean;

      updateIsDraggingFromFlyout_(): boolean;

      updateIsDraggingBubble_(): boolean;

      updateIsDraggingBlock_(): boolean;

      updateIsDraggingWorkspace_(): void;

      updateIsDragging_(): void;

      startDraggingBlock_(): void;

      startDraggingBubble_(): void;

      duplicateOnDrag_(): void;

      bringBlockToFront_(): void;

      doStart(e: Event): void;

      bindMouseEvents(e: Event): void;

      handleMove(e: Event): void;

      handleUp(e: Event): void;

      cancel(): void;

      handleRightClick(e: Event): void;

      handleWsStart(e: Event, ws: Blockly.WorkspaceSvg): void;

      handleFlyoutStart(e: Event, flyout: Blockly.Flyout): void;

      handleBlockStart(e: Event, block: Blockly.BlockSvg): void;

      handleBubbleStart(e: Event, bubble: Blockly.Bubble): void;

      doBubbleClick_(): void;

      doFieldClick_(): void;

      doBlockClick_(): void;

      doWorkspaceClick_(): void;

      setStartField(field: Blockly.Field): void;

      setStartBubble(bubble: Blockly.Bubble): void;

      setStartBlock(block: Blockly.BlockSvg): void;

      setTargetBlock_(block: Blockly.BlockSvg): void;

      setStartWorkspace_(ws: Blockly.WorkspaceSvg): void;

      setStartFlyout_(flyout: Blockly.Flyout): void;

      isBubbleClick_(): boolean;

      isBlockClick_(): boolean;

      isFieldClick_(): boolean;

      isWorkspaceClick_(): boolean;

      hasStarted(): boolean;

      isDragging(): boolean;

      forceStartBlockDrag(fakeEvent: any, block: Blockly.BlockSvg): void;

      duplicateOnDrag_(): void;
  }
  }
}
export {};
