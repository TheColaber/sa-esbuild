export default defineAddon({
  name: "Find bar",
  description:
    "Creates a search bar next to the sounds tab to find and jump to scripts, costumes and sounds.",
  tags: ["recommended"],
  versionAdded: "1.0.0",
  credits: ["TheColaber", "griffpatch"],
  enabledByDefault: true,
  // hotkeys: [
  //   {
  //     id: "openFindBar",
  //     name: "Open find bar",
  //     description:
  //       "Use to open the find bar",
  //     default: [["Ctrl", "F"], ["F3"]],
  //     try: [["F"]] // is this a good idea? A hotkey that the user might want to try?
  //   },
  //   {
  //     id: "carouselNext",
  //     name: "Next block",
  //     description:
  //       "Go to the next block.",
  //     default: [["F2"]],
  //   },
  //   {
  //     id: "carouselPrevious",
  //     name: "Previous block",
  //     description:
  //       "Go to the previous block.",
  //     default: [["Shift", "F2"]],
  //   },
  //   {
  //     id: "blockLink",
  //     name: "Block link",
  //     description: "Click block while using hotkey to open the find bar with the block selected",
  //     default: [["WheelButton"], ["Shift"]],
  //     action: "Block"
  //   }
  // ],
});

export const scripts = defineScripts([
  {
    script: () => import("./script.ts"),
    matches: ["projects"],
    runAtComplete: false,
  },
]);

export const strings = defineStrings( {
  "find-placeholder": "Find (Ctrl+F)",
  "var-local": {
    string: "var {name}",
    comment: "Lowercase 'var' refers to a local variable."
  },
  "var-global": {
    string: "VAR {name}",
    comment: "Uppercase 'VAR' refers to a global variable."
  },
  "list-local": {
    string: "list {name}",
    comment: "Lowercase 'list' refers to a local list."
  },
  "list-global": {
    string: "LIST {name}",
    comment: "Uppercase 'LIST' refers to a global list."
  },
  "event": "event {name}"
});
