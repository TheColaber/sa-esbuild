declare global {
  namespace ScratchBlocks {
    class Options {
      RTL: boolean;
      oneBasedIndex: boolean;
      collapse: boolean;
      comments: boolean;
      disable: boolean;
      readOnly: boolean;
      pathToMedia: string;
      hasCategories: boolean;
      hasScrollbars: boolean;
      hasTrashcan: boolean;
      hasSounds: boolean;
      hasCss: boolean;
      horizontalLayout: boolean;
      languageTree: Node | null;
      gridOptions: {
        spacing: number;
        colour: string;
        length: number;
        snap: boolean;
      };
      zoomOptions: {
        controls: boolean;
        wheel: boolean;
        startScale: number;
        maxScale: number;
        minScale: number;
        scaleSpeed: number;
      };
      toolboxPosition: number;

      parentWorkspace: Workspace | null;
      setMetrics: (() => void) | null;
      getMetrics: (() => Object) | null;

      constructor(options: Object);
    }
  }
}
export {};
