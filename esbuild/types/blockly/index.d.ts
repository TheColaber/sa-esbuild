declare global {
  namespace ScratchBlocks {
    /**
     * The main workspace most recently used.
     * Set by Blockly.WorkspaceSvg.prototype.markFocused
     * @see {@link https://github.com/scratchfoundation/scratch-blocks/blob/develop/core/blockly.js#L79}
     */
    let mainWorkspace: Workspace | null;
    /**
     * Currently selected block.
     * @see {@link https://github.com/scratchfoundation/scratch-blocks/blob/develop/core/blockly.js#L85}
     */
    let selected: Block | null;
    /**
     * All of the connections on blocks that are currently being dragged.
     * @see {@link https://github.com/scratchfoundation/scratch-blocks/blob/develop/core/blockly.js#L92}
     * @private
     */
    let draggingConnections_: Connection[];
    /**
     * Contents of the local clipboard.
     * @see {@link https://github.com/scratchfoundation/scratch-blocks/blob/develop/core/blockly.js#L99}
     * @private
     */
    let clipboardXml_: Element | null;
    /**
     * Source of the local clipboard.
     * @see {@link https://github.com/scratchfoundation/scratch-blocks/blob/develop/core/blockly.js#L106}
     * @private
     */
    let clipboardSource_: WorkspaceSvg | null;
    /**
     * Cached value for whether 3D is supported.
     * @see {@link https://github.com/scratchfoundation/scratch-blocks/blob/develop/core/blockly.js#L113}
     * @private
     */
    let cache3dSupported_: boolean | null;
    /**
     * Convert a hue (HSV model) into an RGB hex triplet.
     * @param {number} hue Hue on a colour wheel (0-360).
     * @return {string} RGB code, e.g. '#5ba65b'.
     * @see {@link https://github.com/scratchfoundation/scratch-blocks/blob/develop/core/blockly.js#L120}
     */
    function hueToRgb(hue: number): string;

    function svgSize(svg: Element): { width: number; height: number };

    function resizeSvgContents(workspace: WorkspaceSvg): void;

    function svgResize(workspace: WorkspaceSvg): void;

    function onKeyDown_(e: Event): void;

    function onContextMenu_(e: Event): void;

    function hideChaff(opt_allowToolbox?: boolean): void;

    function hideChaffOnResize(opt_allowToolbox?: boolean): void;

    function hideChaffInternal_(opt_allowToolbox?: boolean): void;

    function getMainWorkspace(): WorkspaceSvg;

    function alert(message: string, opt_callback?: () => void): void;

    function confirm(
      message: string,
      callback: (response: boolean) => void,
    ): void;

    function prompt(
      message: string,
      defaultValue: string,
      callback: (response: string) => void,
      _opt_title?: string | null,
      _opt_varType?: string | null,
    ): void;

    function statusButtonCallback(id: string): void;

    function refreshStatusButtons(workspace: Workspace): void;

    function defineBlocksWithJsonArray(jsonArray: Array<Object>): void;

    function jsonInitFactory_(jsonDef: Object): () => void;

    let Blocks: { [key: string]: { init: () => void } };

    function bindEventWithChecks_(
      node: EventTarget,
      name: string,
      thisObject: Object,
      func: (e: Event) => void,
      opt_noCaptureIdentifier?: boolean,
      opt_noPreventDefault?: boolean,
    ): Array<Array<any>>;

    function bindEvent_(
      node: EventTarget,
      name: string,
      thisObject: Object,
      func: (e: Event) => void,
    ): Array<Array<any>>;

    function unbindEvent_(bindData: Array<Array<any>>): (e: Event) => void;

    function isNumber(str: string): boolean;
  }
}
export const Blockly: typeof ScratchBlocks;
