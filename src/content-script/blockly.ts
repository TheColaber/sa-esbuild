function getDataFromEl(elem: Element): {
  ScratchBlocks: ScratchBlocks.RealBlockly;
  workspace: ScratchBlocks.Workspace;
  props: { vm: any };
} {
  if (!isProject()) {
    throw new Error(`Cannot access Blockly on page (${location.pathname})`);
  }
  const internalKey = getInternalKey(elem);

  const internal: any | { child: any; stateNode: any } = elem[internalKey];
  let childable = internal;
  while (
    !(childable = childable.child) ||
    !childable.stateNode ||
    !childable.stateNode.ScratchBlocks
  ) {}
  return childable.stateNode;
}

export async function getCache() {
  if (scratchAddons.cache.BlocklyInstance && scratchAddons.cache.vm)
    return scratchAddons.cache;

  const elem = await scratchAddons.sharedObserver.watch({
    query: '[class^="gui_blocks-wrapper"]',
  });
  const data = getDataFromEl(elem);
  scratchAddons.cache.BlocklyInstance = data.ScratchBlocks;
  scratchAddons.cache.vm = data.props.vm;
  if (!scratchAddons.cache.BlocklyInstance) {
    throw new Error(
      `Blockly was type ${typeof scratchAddons.cache
        .BlocklyInstance} on page (${location.pathname})`,
    );
  }
  return scratchAddons.cache;
}

export function getMainWorkspace() {
  const elem = document.querySelector('[class^="gui_blocks-wrapper"]');
  const data = getDataFromEl(elem);
  if (!data.workspace) {
    throw new Error(
      `Blockly was type ${typeof data.workspace} on page (${
        location.pathname
      })`,
    );
  }
  return data.workspace;
}

let reactInternalKey: keyof Element | null = null;
export function getInternalKey(elem) {
  if (!reactInternalKey) {
    const key = Object.keys(elem).find((key) =>
      key.startsWith("__reactInternalInstance$"),
    );
    if (!key) throw "Element is not a react element.";
    reactInternalKey = key as keyof Element;
  }
  return reactInternalKey;
}

export function isProject() {
  return (
    location.pathname.split("/")[1] === "projects" &&
    !["embed", "remixes", "studios"].includes(location.pathname.split("/")[3])
  );
}
