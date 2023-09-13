// Type definitions for scratch-blocks
// Project: https://github.com/scratchfoundation/scratch-blocks

import FindBar from "../../src/addons/editor/general/find-bar/find-bar";
declare global {
  export namespace ScratchBlocks {
    class Block {
      id: string;
      type: string;
      inputList: Input[];
      getChildren(): Block[];
      getProcCode(): string;
      getRelativeToSurfaceXY(): { x: number; y: number };
      getDescendants(
        ordered?: boolean,
        opt_ignoreShadows?: boolean,
      ): BlockSvg[];
      getVarModels(): VariableModel[];
      getRootBlock(): Block;
      getOutputShape(): number;
      getSurroundParent(): BlockSvg;
      getColourQuaternary(): string;
      setShadowColour(color: string);
    }

    class Input {
      fieldRow: Field[];
    }

    class Field {
      name: string;
      getText(): string;
    }

    class BlockSvg extends Block {
      width: number;
      height: number;
    }

    interface EventsAbstract {}

    class WorkspaceComment {}

    class Utils {
      createSvgElement(
        name: string,
        attrs: { [attr: string]: string },
        parent: Element,
      ): SVGElement;
    }

    type VariableType = "" | "list" | "broadcast_msg";

    class VariableModel {
      workspace: Workspace;
      name: string;
      type: VariableType;
      id_: string;
      getId(): string;
      isLocal: boolean;
      isCloud: boolean;
    }

    interface VariableModelConstructor {
      new (
        workspace: Workspace,
        name: string,
        type?: VariableType,
        id?: string,
        isLocal?: boolean,
        isCloud?: boolean,
      ): VariableModel;
      compareByName(var1: VariableModel, var2: VariableModel): number;
    }

    class VariableMap {
      variableMap_: Record<string, VariableModel>;
      workspace: Workspace;
      clear(): void;
      renameVariable(variable: VariableModel, newName: string): void;
      renameVariableById(id: string, newName: string): void;
      renameVariableAndUses_(
        variable: VariableModel,
        newName: string,
        uses: Block[],
      ): void;
      renameVariableWithConflict_(
        variable: VariableModel,
        newName: string,
        conflictingVariable: VariableModel,
        uses: Block[],
      ): void;
      createVariable(
        name: string,
        type?: VariableType,
        id?: string,
        isLocal?: boolean,
        isCloud?: boolean,
      ): VariableModel;
      deleteVariable(variable: VariableModel): void;
      deleteVariableById(id: string): void;
      deleteVariableInternal_(variable: VariableModel, uses: Block[]): void;
      getVariable(name: string, type?: VariableType): VariableModel | null;
      getVariableById(id: string): VariableModel | null;
      getVariablesOfType(type: VariableType): VariableModel[];
      getVariableTypes(): VariableType[];
      getAllVariables(): VariableModel[];
      getVariableUsesById(id: string): Block[];
    }

    class Flyout {
      constructor(options);
    }

    class VerticalFlyout extends Flyout {
      show(xmlList: string | any[]);
      init(workspace: Workspace);
      layout_;
      createDom(tagName: string);
    }

    interface WorkspaceOptions {}

    class Workspace {
      id: string;
      options: WorkspaceOptions;
      RTL: boolean;
      horizontalLayout: boolean;
      toolboxPosition: number; // TODO
      topBlocks_: Block[];
      listeners_: Function[];
      tapListeners_: Function[];
      undoStack_: EventsAbstract[];
      redoStack_: EventsAbstract[];
      blockDB_: Record<string, Block>;
      variableMap_: VariableMap;
      getVariableMap(): VariableMap;
      potentialVariableMap_: VariableMap | null;
      getPotentialVariableMap(): VariableMap;
      createPotentialVariableMap(): void;
      // default value defined on prototype
      rendered: boolean;
      // default value defined on prototype
      isClearing: boolean;
      // default value defined on prototype
      MAX_UNDO: 1024;
      refreshToolboxSelection_(): void;
      dispose(): void;
      addTopBlock(block: Block): void;
      removeTopBlock(block: Block): void;
      getTopBlocks(): BlockSvg[];
      addTopComment(comment: WorkspaceComment): void;
      removeTopComment(comment: WorkspaceComment): void;
      getTopComments(): WorkspaceComment[];
      getAllBlocks(): Block[];
      clear(): void;
      renameVariableById(id: string, newName: string): void;
      /**
       * @see {VariableMap.createVariable}
       */
      createVariable(
        name: string,
        type?: VariableType,
        id?: string,
        isLocal?: boolean,
        isCloud?: boolean,
      ): VariableModel;
      /**
       * @see {VariableMap.getVariableUsesById}
       */
      getVariableUsesById(id: string): Block[];
      /**
       * @see {VariableMap.deleteVariableById}
       */
      deleteVariableById(id: string): void;
      /**
       * @see {VariableMap.deleteVariableInternal_}
       */
      deleteVariableInternal_(variable: VariableModel, uses: Block[]): void;
      /**
       * @deprecated always returns -1
       */
      variableIndexOf(name: string): -1;
      /**
       * @see {VariableMap.getVariable}
       */
      getVariable(name: string, type?: VariableType): void;
      /**
       * @see {VariableMap.getVariableById}
       */
      getVariableById(id: string): VariableModel;
      /**
       * @see {VariableMap.getVariablesOfType}
       */
      getVariablesOfType(type: VariableType): VariableModel[];
      /**
       * @see {VariableMap.getVariableTypes}
       */
      getVariableTypes(): VariableType[];
      /**
       * @see {VariableMap.getAllVariables}
       */
      getAllVariables(): VariableModel[];
      getWidth(): number;
      newBlock(opcode: string, id?: string): Block;
      /**
       * @param redo true for redo, false for undo
       */
      undo(redo: boolean): void;
      clearUndo(): void;
      hasRedoStack(): boolean;
      hasUndoStack(): boolean;
      addChangeListener(listener: Function): void;
      removeChangeListener(listener: Function): void;
      fireChangeListener(event: EventsAbstract): void;
      getBlockById(id: string): BlockSvg | null;
      getCommentById(id: string): WorkspaceComment | null;
      getFlyout(): Flyout | null;
      allInputsFilled(shadowBlocksAreFilled?: boolean): boolean;
      toolbox_?: any;
      glowBlock(id, val): void; // TODO: update types
      scrollbar: any;
      // TODO: Remove this
      findBar?: FindBar;
    }

    interface Xml {
      blockToDom(block: Block, opt_moId?: boolean): Element;
    }

    interface WorkspaceConstructor {
      new (options?: WorkspaceOptions): Workspace;
      SCAN_ANGLE: number;
      WorkspaceDB_: Record<string, Workspace>;
      getById(id: string): Workspace | null;
    }

    class WorkspaceSvg extends Workspace {
      svgGroup_?: SVGElement;
      createDom(opt_backgroundClass?: string): SVGElement;
      scale: number;
      getMetrics(): {
        contentHeight: number;
        contentWidth: number;
        contentTop: number;
        contentLeft: number;
        viewHeight: number;
        viewWidth: number;
        viewTop: number;
        viewLeft: number;
        absoluteTop: number;
        absoluteLeft: number;
        toolboxWidth: number;
        toolboxHeight: number;
        flyoutWidth: number;
        flyoutHeight: number;
        toolboxPosition: number;
      };
    }

    class Options {
      hasCategories;
      languageTree;
    }

    class Gesture {
      creatorWorkspace_: Workspace;
      mostRecentEvent_: any;
      startBlock_: BlockSvg;
      jumpToDef: boolean; // TODO: this is fake.
      doBlockClick_(this: this): void;
    }

    type ColorShades = {
      primary: string;
      secondary: string;
      tertiary: string;
      quaternary: string;
    };

    type Colours = {
      motion: ColorShades;
      looks: ColorShades;
      sounds: ColorShades;
      control: ColorShades;
      event: ColorShades;
      sensing: ColorShades;
      pen: ColorShades;
      operators: ColorShades;
      data: ColorShades;
      data_lists: ColorShades;
      more: ColorShades;
      text: string;
      workspace: string;
      toolboxHover: string;
      toolboxSelected: string;
      toolboxText: string;
      toolbox: string;
      flyout: string;
      scrollbar: string;
      scrollbarHover: string;
      textField: string;
      textFieldText: string;
      insertionMarker: string;
      insertionMarkerOpacity: number;
      dragShadowOpacity: number;
      stackGlow: string;
      stackGlowSize: number;
      stackGlowOpacity: number;
      replacementGlow: string;
      replacementGlowSize: number;
      replacementGlowOpacity: number;
      colourPickerStroke: string;
      fieldShadow: string;
      dropDownShadow: string;
      numPadBackground: string;
      numPadBorder: string;
      numPadActiveBackground: string;
      numPadText: string;
      valueReportBackground: string;
      valueReportBorder: string;
      menuHover: string;
    };

    interface RealBlockly {
      Workspace: WorkspaceConstructor;
      WorkspaceSvg: typeof WorkspaceSvg;
      VerticalFlyout: typeof VerticalFlyout;
      Xml: Xml;
      getMainWorkspace(): Workspace | null;
      init_(mainWorkspace: Workspace): void;
      createMainWorkspace_(
        svg: SVGElement,
        options: Options,
        blockDragSurface,
        workspaceDragSurface,
      ): Workspace;
      Colours: Colours;
      Gesture: typeof Gesture;
    }
  }
}
export const Blockly: ScratchBlocks.RealBlockly;
