declare global {
  namespace ScratchBlocks {
    class WorkspaceSvg extends Workspace {
      highlightedBlocks_: BlockSvg[];
      audioManager_: WorkspaceAudio;
      grid_: Grid | null;
      cleanUp(this: this): void;
      getWorkspace(this: this): Workspace;
      getGrid(): Grid;

      createDom(this: this, opt_backgroundClass?: string): Element;
    }
  }
}

export {};
