declare global {
  namespace ScratchBlocks {
    class Workspace {
      id: string;
      options: Options;
      RTL: boolean;
      horizontalLayout: boolean;
      toolboxPosition: any;
      topBlocks_: Block[];
      topComments_: WorkspaceComment[];
      commentDB_: { [id: string]: WorkspaceComment };
      listeners_: Function[];
      tapListeners_: Function[];
      undoStack_: Events.Abstract[];
      redoStack_: Events.Abstract[];
      blockDB_: { [id: string]: Block };
      variableMap_: VariableMap;
      potentialVariableMap_: VariableMap | null;

      rendered: boolean;
      isClearing: boolean;
      MAX_UNDO: number;

      static SCAN_ANGLE: number;

      constructor(opt_options?: Options);

      refreshToolboxSelection_(): void;

      dispose(): void;

      addTopBlock(block: Block): void;

      removeTopBlock(block: Block): void;

      getTopBlocks(ordered?: boolean): Block[];

      addTopComment(comment: WorkspaceComment): void;

      removeTopComment(comment: WorkspaceComment): void;

      getTopComments(ordered?: boolean): WorkspaceComment[];

      getAllBlocks(ordered: boolean): Block[];

      clear(): void;

      renameVariableById(id: string, newName: string): void;

      createVariable(
        name: string,
        opt_type?: string | null,
        opt_id?: string,
        opt_isLocal?: boolean,
        opt_isCloud?: boolean,
      ): VariableMap | null;

      getVariableUsesById(id: string): Block[];

      deleteVariableById(id: string): void;

      getWidth(): number;

      newBlock(prototypeName: string | null, opt_id?: string): Block;

      undo(redo: boolean): void;

      clearUndo(): void;

      hasRedoStack(): boolean;

      hasUndoStack(): boolean;

      addChangeListener(func: Function): Function;

      removeChangeListener(func: Function): void;

      fireChangeListener(event: Events.Abstract): void;

      getBlockById(id: string): Block | null;

      getCommentById(id: string): WorkspaceComment | null;

      getFlyout(): Flyout | null;

      allInputsFilled(opt_shadowBlocksAreFilled?: boolean): boolean;

      getPotentialVariableMap(): VariableMap | null;

      createPotentialVariableMap(): void;

      getVariableMap(): VariableMap | null;

      static getById(id: string): Workspace | null;
    }
  }
}

export {};
