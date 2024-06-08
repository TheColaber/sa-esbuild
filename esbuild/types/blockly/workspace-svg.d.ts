declare global {
  namespace ScratchBlocks {
    class WorkspaceSvg extends Workspace {
      highlightedBlocks_: BlockSvg[];
      audioManager_: WorkspaceAudio;
      grid_: Grid | null;
      isFlyout: boolean;
      targetWorkspace: WorkspaceSvg;
      cleanUp(this: this): void;
      getWorkspace(this: this): Workspace;
      getGrid(): Grid;
      getToolbox(): Toolbox;

      createDom(this: this, opt_backgroundClass?: string): Element;
      pasteBlock_(xmlBlock: Element): void;
      paste(xmlBlock: Element): void;
    }
  }
}

export {};
