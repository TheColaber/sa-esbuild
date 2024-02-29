declare global {
  namespace ScratchBlocks {
      let mainWorkspace: Blockly.WorkspaceSvg | null;
      let selected: Block | null;
      let draggingConnections_: Connection[];
      let clipboardXml_: Element | null;
      let clipboardSource_: WorkspaceSvg | null;
      let cache3dSupported_: boolean | null;

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
