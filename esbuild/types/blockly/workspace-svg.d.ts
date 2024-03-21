declare global {
  namespace ScratchBlocks {
    class WorkspaceSvg extends Workspace {
      highlightedBlocks_: BlockSvg[];
      audioManager_: WorkspaceAudio;
      grid_: Grid | null;

      createDom(this: this, opt_backgroundClass?: string): Element;
    }
  }
}

export {};
