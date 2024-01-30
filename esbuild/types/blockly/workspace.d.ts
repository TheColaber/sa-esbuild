declare global {
  namespace ScratchBlocks {
    namespace Blockly {
      export class Workspace {
        id: string;
        options: Blockly.Options;
        RTL: boolean;
        horizontalLayout: boolean;
        toolboxPosition: any;
        topBlocks_: Blockly.Block[];
        topComments_: Blockly.WorkspaceComment[];
        commentDB_: { [id: string]: Blockly.WorkspaceComment };
        listeners_: Function[];
        tapListeners_: Function[];
        undoStack_: Blockly.Events.Abstract[];
        redoStack_: Blockly.Events.Abstract[];
        blockDB_: { [id: string]: Blockly.Block };
        variableMap_: Blockly.VariableMap;
        potentialVariableMap_: Blockly.VariableMap | null;

        rendered: boolean;
        isClearing: boolean;
        MAX_UNDO: number;

        static SCAN_ANGLE: number;

        constructor(opt_options?: Blockly.Options);

        refreshToolboxSelection_(): void;

        dispose(): void;

        addTopBlock(block: Blockly.Block): void;

        removeTopBlock(block: Blockly.Block): void;

        getTopBlocks(ordered: boolean): Blockly.Block[];

        addTopComment(comment: Blockly.WorkspaceComment): void;

        removeTopComment(comment: Blockly.WorkspaceComment): void;

        getTopComments(ordered: boolean): Blockly.WorkspaceComment[];

        getAllBlocks(ordered: boolean): Blockly.Block[];

        clear(): void;

        renameVariableById(id: string, newName: string): void;

        createVariable(
          name: string,
          opt_type?: string | null,
          opt_id?: string,
          opt_isLocal?: boolean,
          opt_isCloud?: boolean,
        ): Blockly.VariableMap | null;

        getVariableUsesById(id: string): Blockly.Block[];

        deleteVariableById(id: string): void;

        getWidth(): number;

        newBlock(prototypeName: string | null, opt_id?: string): Blockly.Block;

        undo(redo: boolean): void;

        clearUndo(): void;

        hasRedoStack(): boolean;

        hasUndoStack(): boolean;

        addChangeListener(func: Function): Function;

        removeChangeListener(func: Function): void;

        fireChangeListener(event: Blockly.Events.Abstract): void;

        getBlockById(id: string): Blockly.Block | null;

        getCommentById(id: string): Blockly.WorkspaceComment | null;

        getFlyout(): Blockly.Flyout | null;

        allInputsFilled(opt_shadowBlocksAreFilled?: boolean): boolean;

        getPotentialVariableMap(): Blockly.VariableMap | null;

        createPotentialVariableMap(): void;

        getVariableMap(): Blockly.VariableMap | null;

        static getById(id: string): Blockly.Workspace | null;
      }
    }
  }
}
export {};
