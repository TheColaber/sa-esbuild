// declare global {
//   class no {

//   }
// }
// export {}
// // Type definitions for scratch-blocks
// // Project: https://github.com/scratchfoundation/scratch-blocks

// declare global {
//   export namespace ScratchBlocks {
//     class Block {
//         id: string;
//         outputConnection: Connection | null;
//         nextConnection: Connection | null;
//         previousConnection: Connection | null;
//         inputList: Input[];
//         inputsInline: boolean | undefined;
//         disabled: boolean;
//         tooltip: string | Function;
//         contextMenu: boolean;
//         parentBlock_: Block | null;
//         childBlocks_: Block[];
//         deletable_: boolean;
//         movable_: boolean;
//         editable_: boolean;
//         isShadow_: boolean;
//         collapsed_: boolean;
//         checkboxInFlyout_: boolean;
//         comment: string | Comment | null;
//         outputShape_: number | null;
//         category_: string | null;
//         xy_: goog.math.Coordinate;
//         workspace: Workspace;
//         isInFlyout: boolean;
//         isInMutator: boolean;
//         RTL: boolean;
//         isInsertionMarker_: boolean;
//         inputsInlineDefault: boolean | undefined;
//         helpUrl: string | Function | null;
//         constructor(workspace: Workspace, prototypeName: string, opt_id?: string);
//         dispose(healStack: boolean): void;
//         initModel(): void;
//         unplug(opt_healStack?: boolean): void;
//         getConnections_(): Connection[];
//         lastConnectionInStack(): Connection | null;
//         bumpNeighbours_(): void;
//         getParent(): Block | null;
//         getInputWithBlock(block: Block): Input | null;
//         getInputWithConnection(conn: Connection): Input | null;
//         getSurroundParent(): Block | null;
//         getNextBlock(): Block | null;
//         getPreviousBlock(): Block | null;
//         getFirstStatementConnection(): Connection | null;
//         getRootBlock(): Block;
//         getChildren(ordered: boolean): Block[];
//         setParent(newParent: Block | null): void;
//         getDescendants(ordered: boolean, opt_ignoreShadows?: boolean): Block[];
//         isDeletable(): boolean;
//         setDeletable(deletable: boolean): void;
//         isMovable(): boolean;
//         setMovable(movable: boolean): void;
//         isShadow(): boolean;
//         setShadow(shadow: boolean): void;
//         isInsertionMarker(): boolean;
//         setInsertionMarker(insertionMarker: boolean): void;
//         isEditable(): boolean;
//         setEditable(editable: boolean): void;
//         setConnectionsHidden(hidden: boolean): void;
//         getMatchingConnection(otherBlock: Block, conn: Connection): Connection | null;
//         setHelpUrl(url: string | Function): void;
//         setTooltip(newTip: string | Function): void;
//         getColour(): string;
//         getColourSecondary(): string;
//         getColourTertiary(): string;
//         getColourQuaternary(): string;
//         getShadowColour(): string;
//         setShadowColour(colour: number | string): void;
//         clearShadowColour(): void;
//         makeColour_(colour: number | string): string;
//         setColour(colour: number | string, colourSecondary?: number | string, colourTertiary?: number | string, colourQuaternary?: number | string): void;
//         setOnChange(onchangeFn: (event: Blockly.Events.Abstract) => void): void;
//         getField(name: string): Field | null;
//     getVars(): string[];
//     getVarModels(): VariableModel[];
//     updateVarName(variable: VariableModel): void;
//     renameVarById(oldId: string, newId: string): void;
//     getFieldValue(name: string): string | null;
//     setFieldValue(newValue: string, name: string): void;
//     setPreviousStatement(newBoolean: boolean, opt_check?: string | string[] | null): void;
//     setNextStatement(newBoolean: boolean, opt_check?: string | string[] | null): void;
//     setOutput(newBoolean: boolean, opt_check?: string | string[] | null): void;
//     setInputsInline(newBoolean: boolean): void;
//     getInputsInline(): boolean;
//     setDisabled(disabled: boolean): void;
//     getInheritedDisabled(): boolean;
//     isCollapsed(): boolean;
//     setCollapsed(collapsed: boolean): void;
//     toString(opt_maxLength?: number, opt_emptyToken?: string): string;
//     appendValueInput(name: string): Input;
//     appendStatementInput(name: string): Input;
//     appendDummyInput(opt_name?: string): Input;
//     jsonInit(json: Object): void;
//     mixin(mixinObj: Object, opt_disableCheck?: boolean): void;
//     setColourFromJson_(json: Object): void;
//     interpolate_(message: string, args: any[], lastDummyAlign?: string): void;
//     appendInput_(type: number, name: string): Input;
//     moveInputBefore(name: string, refName: string | null): void;
//     moveNumberedInputBefore(inputIndex: number, refIndex: number): void;
//     removeInput(name: string, opt_quiet?: boolean): void;
//     getInput(name: string): Input | null;
//     getInputTargetBlock(name: string): Block | null;
//     getCommentText(): string;
//     setCommentText(text: string | null): void;
//     setOutputShape(outputShape: number | null): void;
//     getOutputShape(): number | null;
//     setCategory(category: string | null): void;
//     getCategory(): string | null;
//     setCheckboxInFlyout(hasCheckbox: boolean): void;
//     hasCheckboxInFlyout(): boolean;
//     setWarningText(text: string | null): void;
//     setMutator(mutator: Blockly.Mutator | null): void;
//     getRelativeToSurfaceXY(): goog.math.Coordinate;
//     moveBy(dx: number, dy: number): void;
//     makeConnection_(type: number): Connection;
//     allInputsFilled(opt_shadowBlocksAreFilled?: boolean): boolean;
//     }

//     export class Connection {
//       /**
//        * @type {!Blockly.Block}
//        * @protected
//        */
//       sourceBlock_: Block;

//       /** @type {number} */
//       type: number;

//       /**
//        * Connection this connection connects to.  Null if not connected.
//        * @type {Blockly.Connection}
//        */
//       targetConnection: Connection | null;

//       /**
//        * List of compatible value types.  Null if all types are compatible.
//        * @type {Array<string>}
//        * @private
//        */
//       check_: string[] | null;

//       /**
//        * DOM representation of a shadow block, or null if none.
//        * @type {Element}
//        * @private
//        */
//       shadowDom_: Element | null;

//       /**
//        * Horizontal location of this connection.
//        * @type {number}
//        * @protected
//        */
//       x_: number;

//       /**
//        * Vertical location of this connection.
//        * @type {number}
//        * @protected
//        */
//       y_: number;

//       /**
//        * Has this connection been added to the connection database?
//        * @type {boolean}
//        * @protected
//        */
//       inDB_: boolean;

//       /**
//        * Connection database for connections of this type on the current workspace.
//        * @type {Blockly.ConnectionDB}
//        * @protected
//        */
//       db_: ConnectionDB | null;

//       /**
//        * Connection database for connections compatible with this type on the
//        * current workspace.
//        * @type {Blockly.ConnectionDB}
//        * @protected
//        */
//       dbOpposite_: ConnectionDB | null;

//       /**
//        * Whether this connection is hidden (not tracked in a database) or not.
//        * @type {boolean}
//        * @protected
//        */
//       hidden_: boolean | null;

//       /**
//        * Connect two connections together.  This is the connection on the superior
//        * block.
//        * @param {!Blockly.Connection} childConnection Connection on inferior block.
//        * @protected
//        */
//       connect_(childConnection: Connection): void;

//       /**
//        * Sever all links to this connection (not including from the source object).
//        */
//       dispose(): void;

//       /**
//        * @return {boolean} true if the connection is not connected or is connected to
//        *    an insertion marker, false otherwise.
//        */
//       isConnectedToNonInsertionMarker(): boolean;

//       /**
//        * Get the source block for this connection.
//        * @return {Blockly.Block} The source block, or null if there is none.
//        */
//       getSourceBlock(): Block | null;

//       /**
//        * Does the connection belong to a superior block (higher in the source stack)?
//        * @return {boolean} True if connection faces down or right.
//        */
//       isSuperior(): boolean;

//       /**
//        * Is the connection connected?
//        * @return {boolean} True if connection is connected to another connection.
//        */
//       isConnected(): boolean;

//       /**
//        * Checks whether the current connection can connect with the target
//        * connection.
//        * @param {Blockly.Connection} target Connection to check compatibility with.
//        * @return {number} Blockly.Connection.CAN_CONNECT if the connection is legal,
//        *    an error code otherwise.
//        * @private
//        */
//       private canConnectWithReason_(target: Connection): number;

//       /**
//        * Checks whether the current connection and target connection are compatible
//        * and throws an exception if they are not.
//        * @param {Blockly.Connection} target The connection to check compatibility
//        *    with.
//        * @private
//        */
//       private checkConnection_(target: Connection): void;

//       /**
//        * Check if the two connections can be dragged to connect to each other.
//        * This is used by the connection database when searching for the closest
//        * connection.
//        * @param {!Blockly.Connection} candidate A nearby connection to check, which
//        *     must be a previous connection.
//        * @return {boolean} True if the connection is allowed, false otherwise.
//        */
//       canConnectToPrevious_(candidate: Connection): boolean;

//       /**
//        * Check if the two connections can be dragged to connect to each other.
//        * This is used by the connection database when searching for the closest
//        * connection.
//        * @param {!Blockly.Connection} candidate A nearby connection to check.
//        * @return {boolean} True if the connection is allowed, false otherwise.
//        */
//       isConnectionAllowed(candidate: Connection): boolean;

//       /**
//        * Connect this connection to another connection.
//        * @param {!Blockly.Connection} otherConnection Connection to connect to.
//        */
//       connect(otherConnection: Connection): void;

//       /**
//        * Update two connections to target each other.
//        * @param {Blockly.Connection} first The first connection to update.
//        * @param {Blockly.Connection} second The second connection to update.
//        * @private
//        */
//       private static connectReciprocally_(first: Connection, second: Connection): void;

//       /**
//        * Does the given block have one and only one connection point that will accept
//        * an orphaned block?
//        * @param {!Blockly.Block} block The superior block.
//        * @param {!Blockly.Block} orphanBlock The inferior block.
//        * @return {Blockly.Connection} The suitable connection point on 'block',
//        *     or null.
//        * @private
//        */
//       private static singleConnection_(block: Block, orphanBlock: Block): Connection | null;

//       /**
//        * Disconnect this connection.
//        */
//       disconnect(): void;

//       /**
//        * Disconnect two blocks that are connected by this connection.
//        * @param {!Blockly.Block} parentBlock The superior block.
//        * @param {!Blockly.Block} childBlock The inferior block.
//        * @protected
//        */
//       private disconnectInternal_(parentBlock: Block, childBlock: Block): void;

//       /**
//        * Respawn the shadow block if there was one connected to the this connection.
//        * @protected
//        */
//       private respawnShadow_(): void;

//       /**
//        * Returns the block that this connection connects to.
//        * @return {Blockly.Block} The connected block or null if none is connected.
//        */
//       targetBlock(): Block | null;

//       /**
//        * Is this connection compatible with another connection with respect to the
//        * value type system.  E.g. square_root("Hello") is not compatible.
//        * @param {!Blockly.Connection} otherConnection Connection to compare against.
//        * @return {boolean} True if the connections share a type.
//        * @protected
//        */
//       private checkType_(otherConnection: Connection): boolean;

//       /**
//        * Function to be called when this connection's compatible types have changed.
//        * @private
//        */
//       private onCheckChanged_(): void;

//       /**
//        * Change a connection's compatibility.
//        * @param {*} check Compatible value type or list of value types.
//        *     Null if all types are compatible.
//        * @return {!Blockly.Connection} The connection being modified
//        *     (to allow chaining).
//        */
//       setCheck(check: string[] | null): Connection;

//       /**
//        * Returns a shape enum for this connection.
//        * Used in scratch-blocks to draw unoccupied inputs.
//        * @return {number} Enum representing shape.
//        */
//       getOutputShape(): number;

//       /**
//        * Change a connection's shadow block.
//        * @param {Element} shadow DOM representation of a block or null.
//        */
//       setShadowDom(shadow: Element | null): void;

//       /**
//        * Return a connection's shadow block.
//        * @return {Element} shadow DOM representation of a block or null.
//        */
//       getShadowDom(): Element | null;

//       /**
//        * Find all nearby compatible connections to this connection.
//        * Type checking does not apply, since this function is used for bumping.
//        *
//        * Headless configurations (the default) do not have neighboring connection,
//        * and always return an empty list (the default).
//        * {@link Blockly.RenderedConnection} overrides this behavior with a list
//        * computed from the rendered positioning.
//        * @param {number} maxLimit The maximum radius to another connection.
//        * @return {!Array.<!Blockly.Connection>} List of connections.
//        * @private
//        */
//       private neighbours_(maxLimit: number): Connection[];

//       /**
//        * This method returns a string describing this Connection in developer terms
//        * (English only). Intended to on be used in console logs and errors.
//        * @return {string} The description.
//        */
//       toString(): string;
//     }

//     class Input {
//       fieldRow: (Field | FieldVariable | FieldVariableGetter)[];
//       name: string;
//     }

//     class Field {
//       name: string;
//       getText(): string;
//     }

//     class FieldVariable extends Field {
//       getVariable(): VariableModel;
//     }

//     class FieldVariableGetter extends FieldVariable {}

//     class BlockSvg extends Block {
//       width: number;
//       height: number;
//     }

//     class FieldDropdown extends Field {}

//     interface EventsAbstract {}

//     class WorkspaceComment {}

//     class Utils {
//       createSvgElement(
//         name: string,
//         attrs: { [attr: string]: string },
//         parent: Element,
//       ): SVGElement;
//     }

//     type VariableType = "" | "list" | "broadcast_msg";

//     class VariableModel {
//       workspace: Workspace;
//       name: string;
//       type: VariableType;
//       id_: string;
//       getId(): string;
//       isLocal: boolean;
//       isCloud: boolean;
//     }

//     interface VariableModelConstructor {
//       new (
//         workspace: Workspace,
//         name: string,
//         type?: VariableType,
//         id?: string,
//         isLocal?: boolean,
//         isCloud?: boolean,
//       ): VariableModel;
//       compareByName(var1: VariableModel, var2: VariableModel): number;
//     }

//     class VariableMap {
//       variableMap_: Record<string, VariableModel>;
//       workspace: Workspace;
//       clear(): void;
//       renameVariable(variable: VariableModel, newName: string): void;
//       renameVariableById(id: string, newName: string): void;
//       renameVariableAndUses_(
//         variable: VariableModel,
//         newName: string,
//         uses: Block[],
//       ): void;
//       renameVariableWithConflict_(
//         variable: VariableModel,
//         newName: string,
//         conflictingVariable: VariableModel,
//         uses: Block[],
//       ): void;
//       createVariable(
//         name: string,
//         type?: VariableType,
//         id?: string,
//         isLocal?: boolean,
//         isCloud?: boolean,
//       ): VariableModel;
//       deleteVariable(variable: VariableModel): void;
//       deleteVariableById(id: string): void;
//       deleteVariableInternal_(variable: VariableModel, uses: Block[]): void;
//       getVariable(name: string, type?: VariableType): VariableModel | null;
//       getVariableById(id: string): VariableModel | null;
//       getVariablesOfType(type: VariableType): VariableModel[];
//       getVariableTypes(): VariableType[];
//       getAllVariables(): VariableModel[];
//       getVariableUsesById(id: string): Block[];
//     }

//     class Flyout {
//       constructor(options);
//       init(this: this, targetWorkspace: Workspace)
//       eventWrappers_
//       svgGroup_
//       wheel_
//       scrollbar_
//     }

//     class VerticalFlyout extends Flyout {
//       show(xmlList: string | any[]);
//       init(workspace: Workspace);
//       layout_;
//       createDom(tagName: string);
//       position(this: this);
//       targetWorkspace_: WorkspaceSvg;
//       parentToolbox_: any;
//       width_: number;
//       toolboxPosition_:0|1|2|3   }

//     interface WorkspaceOptions {}

//     class Workspace {
//       id: string;
//       options: WorkspaceOptions;
//       RTL: boolean;
//       horizontalLayout: boolean;
//       toolboxPosition: number; // TODO
//       topBlocks_: Block[];
//       listeners_: Function[];
//       tapListeners_: Function[];
//       undoStack_: EventsAbstract[];
//       redoStack_: EventsAbstract[];
//       blockDB_: Record<string, Block>;
//       variableMap_: VariableMap;
//       getVariableMap(): VariableMap;
//       potentialVariableMap_: VariableMap | null;
//       getPotentialVariableMap(): VariableMap;
//       createPotentialVariableMap(): void;
//       // default value defined on prototype
//       rendered: boolean;
//       // default value defined on prototype
//       isClearing: boolean;
//       // default value defined on prototype
//       MAX_UNDO: 1024;
//       refreshToolboxSelection_(): void;
//       dispose(): void;
//       addTopBlock(block: Block): void;
//       removeTopBlock(block: Block): void;
//       getTopBlocks(): BlockSvg[];
//       addTopComment(comment: WorkspaceComment): void;
//       removeTopComment(comment: WorkspaceComment): void;
//       getTopComments(): WorkspaceComment[];
//       getAllBlocks(): Block[];
//       clear(): void;
//       renameVariableById(id: string, newName: string): void;
//       /**
//        * @see {VariableMap.createVariable}
//        */
//       createVariable(
//         name: string,
//         type?: VariableType,
//         id?: string,
//         isLocal?: boolean,
//         isCloud?: boolean,
//       ): VariableModel;
//       /**
//        * @see {VariableMap.getVariableUsesById}
//        */
//       getVariableUsesById(id: string): Block[];
//       /**
//        * @see {VariableMap.deleteVariableById}
//        */
//       deleteVariableById(id: string): void;
//       /**
//        * @see {VariableMap.deleteVariableInternal_}
//        */
//       deleteVariableInternal_(variable: VariableModel, uses: Block[]): void;
//       /**
//        * @deprecated always returns -1
//        */
//       variableIndexOf(name: string): -1;
//       /**
//        * @see {VariableMap.getVariable}
//        */
//       getVariable(name: string, type?: VariableType): void;
//       /**
//        * @see {VariableMap.getVariableById}
//        */
//       getVariableById(id: string): VariableModel;
//       /**
//        * @see {VariableMap.getVariablesOfType}
//        */
//       getVariablesOfType(type: VariableType): VariableModel[];
//       /**
//        * @see {VariableMap.getVariableTypes}
//        */
//       getVariableTypes(): VariableType[];
//       /**
//        * @see {VariableMap.getAllVariables}
//        */
//       getAllVariables(): VariableModel[];
//       getWidth(): number;
//       newBlock(opcode: string, id?: string): Block;
//       /**
//        * @param redo true for redo, false for undo
//        */
//       undo(redo: boolean): void;
//       clearUndo(): void;
//       hasRedoStack(): boolean;
//       hasUndoStack(): boolean;
//       addChangeListener(listener: Function): void;
//       removeChangeListener(listener: Function): void;
//       fireChangeListener(event: EventsAbstract): void;
//       getBlockById(id: string): BlockSvg | null;
//       getCommentById(id: string): WorkspaceComment | null;
//       getFlyout(): Flyout | null;
//       allInputsFilled(shadowBlocksAreFilled?: boolean): boolean;
//       toolbox_?: any;
//       glowBlock(id, val): void;
//       scrollbar: any;
//     }

//     interface Xml {
//       blockToDom(block: Block, opt_moId?: boolean): Element;
//     }

//     interface WorkspaceConstructor {
//       new (options?: WorkspaceOptions): Workspace;
//       SCAN_ANGLE: number;
//       WorkspaceDB_: Record<string, Workspace>;
//       getById(id: string): Workspace | null;
//     }

//     class WorkspaceSvg extends Workspace {
//       svgGroup_?: SVGElement;
//       createDom(opt_backgroundClass?: string): SVGElement;
//       scale: number;
//       getMetrics(): {
//         contentHeight: number;
//         contentWidth: number;
//         contentTop: number;
//         contentLeft: number;
//         viewHeight: number;
//         viewWidth: number;
//         viewTop: number;
//         viewLeft: number;
//         absoluteTop: number;
//         absoluteLeft: number;
//         toolboxWidth: number;
//         toolboxHeight: number;
//         flyoutWidth: number;
//         flyoutHeight: number;
//         toolboxPosition: number;
//       };
//     }

//     class Options {
//       hasCategories;
//       languageTree;
//     }

//     class Gesture {
//       creatorWorkspace_: Workspace;
//       mostRecentEvent_: any;
//       startBlock_: BlockSvg;
//       jumpToDef: boolean; // TODO: this is fake.
//       doBlockClick_(this: this): void;
//     }

//     type ColorShades = {
//       primary: string;
//       secondary: string;
//       tertiary: string;
//       quaternary: string;
//     };

//     type Colours = {
//       motion: ColorShades;
//       looks: ColorShades;
//       sounds: ColorShades;
//       control: ColorShades;
//       event: ColorShades;
//       sensing: ColorShades;
//       pen: ColorShades;
//       operators: ColorShades;
//       data: ColorShades;
//       data_lists: ColorShades;
//       more: ColorShades;
//       text: string;
//       workspace: string;
//       toolboxHover: string;
//       toolboxSelected: string;
//       toolboxText: string;
//       toolbox: string;
//       flyout: string;
//       scrollbar: string;
//       scrollbarHover: string;
//       textField: string;
//       textFieldText: string;
//       insertionMarker: string;
//       insertionMarkerOpacity: number;
//       dragShadowOpacity: number;
//       stackGlow: string;
//       stackGlowSize: number;
//       stackGlowOpacity: number;
//       replacementGlow: string;
//       replacementGlowSize: number;
//       replacementGlowOpacity: number;
//       colourPickerStroke: string;
//       fieldShadow: string;
//       dropDownShadow: string;
//       numPadBackground: string;
//       numPadBorder: string;
//       numPadActiveBackground: string;
//       numPadText: string;
//       valueReportBackground: string;
//       valueReportBorder: string;
//       menuHover: string;
//     };

//     interface RealBlockly {
//       Workspace: WorkspaceConstructor;
//       WorkspaceSvg: typeof WorkspaceSvg;
//       Flyout: typeof Flyout;
//       VerticalFlyout: typeof VerticalFlyout;
//       Xml: Xml;
//       getMainWorkspace(): Workspace | null;
//       init_(mainWorkspace: Workspace): void;
//       createMainWorkspace_(
//         svg: SVGElement,
//         options: Options,
//         blockDragSurface,
//         workspaceDragSurface,
//       ): Workspace;
//       bindEventWithChecks_(node: EventTarget, name: string, thisObject: any, func: Function, opt_noCaptureIdentifier?:boolean, opt_noPreventDefault?:boolean): [][]
//       Colours: Colours;
//       Gesture: typeof Gesture;
//       Field: typeof Field;
//       FieldVariable: typeof FieldVariable;
//       FieldVariableGetter: typeof FieldVariableGetter;
//       FieldDropdown: typeof FieldDropdown;
//       hideChaff();
//       TOOLBOX_AT_RIGHT: 0;
//     }
//   }
// }
// export const Blockly: ScratchBlocks.RealBlockly;
