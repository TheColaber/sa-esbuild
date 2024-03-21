declare global {
  namespace ScratchBlocks {
    class Gesture {
      mouseDownXY_: goog.math.Coordinate | null;
      currentDragDeltaXY_: goog.math.Coordinate | null;
      startBubble_: Bubble | null;
      startField_: Field | null;
      startBlock_: BlockSvg | null;
      targetBlock_: BlockSvg | null;
      startWorkspace_: WorkspaceSvg | null;
      creatorWorkspace_: WorkspaceSvg;
      hasExceededDragRadius_: boolean;
      isDraggingWorkspace_: boolean;
      isDraggingBlock_: boolean;
      isDraggingBubble_: boolean;
      mostRecentEvent_: Event;
      onMoveWrapper_: Array<Array<any>> | null;
      onUpWrapper_: Array<Array<any>> | null;
      bubbleDragger_: BubbleDragger | null;
      blockDragger_: BlockDragger | null;
      workspaceDragger_: WorkspaceDragger | null;
      flyout_: Flyout | null;
      calledUpdateIsDragging_: boolean;
      hasStarted_: boolean;
      isEnding_: boolean;
      shouldDuplicateOnDrag_: boolean;

      constructor(e: Event, creatorWorkspace: WorkspaceSvg);

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

      handleWsStart(e: Event, ws: WorkspaceSvg): void;

      handleFlyoutStart(e: Event, flyout: Flyout): void;

      handleBlockStart(e: Event, block: BlockSvg): void;

      handleBubbleStart(e: Event, bubble: Bubble): void;

      doBubbleClick_(): void;

      doFieldClick_(): void;

      doBlockClick_(): void;

      doWorkspaceClick_(): void;

      setStartField(field: Field): void;

      setStartBubble(bubble: Bubble): void;

      setStartBlock(block: BlockSvg): void;

      setTargetBlock_(block: BlockSvg): void;

      setStartWorkspace_(ws: WorkspaceSvg): void;

      setStartFlyout_(flyout: Flyout): void;

      isBubbleClick_(): boolean;

      isBlockClick_(): boolean;

      isFieldClick_(): boolean;

      isWorkspaceClick_(): boolean;

      hasStarted(): boolean;

      isDragging(): boolean;

      forceStartBlockDrag(fakeEvent: any, block: BlockSvg): void;

      duplicateOnDrag_(): void;
    }
  }
}
export {};
