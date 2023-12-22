import UserscriptAddon from "../src/addon-api/userscript";
import { Component } from "vue";
import { IconifyIcon } from "@iconify/vue";
import MATCH_PATTERNS from "../src/content-script/matches";

declare global {
  const defineAddon: typeof import("./addon-helpers").defineAddon
  const defineScripts: typeof import("./addon-helpers").defineScripts
  const defineStyles: typeof import("./addon-helpers").defineStyles
  const definePopup: typeof import("./addon-helpers").definePopup
  const addon: UserscriptAddon;
}

export function defineAddon(manifest: AddonManifest) {
  return manifest;
}

export function defineScripts(scripts?: AddonScript[]) {
  return scripts;
}

export function defineStyles(styles: AddonStyle[]) {
  return styles;
}

export function definePopup(popup: AddonPopup) {
  return popup;
}

export interface AddonManifest {
  /** 
   * The name for the addon:
   * - Keep it to no more than 3 words.
   * - Use sentence case.
   *    - Correct: Find bar
   *    - Incorrect: Find Bar
   * - Opt for a noun, not a verb.
   *    - Correct: Find bar
   *    - Incorrect: Find in code
   * - Avoid redundant words.
   *    - Correct: Find bar
   *    - Incorrect: Editor find bar
   * 
   * The addon's name will appear on the settings page and be shared with translators. Please ensure the addon's name is clear and understandable for developers, translators, and users.
   * 
   * Example:
   * ```js
   * {
   *    name: "Find bar"
   * }
   * ```
   */
  name: string;
  /** 
   * The description for the addon:
   * - Should describe what the addon should output.
   * - Use proper casing and punctuation.
   * - Should usually answer the questions of:
   *    - What? (what does the addon do)
   *    - Where? (where does it do it)
   *    - Why? (why should the user use this/what will this allow ther user to do)
   * 
   * The addon's description will appear on the settings page and be shared with translators. Please ensure the addon's description is clear and understandable for developers, translators, and users.
   *
   * Example:
   * ```js
   * {
   *    description: "Creates a search bar next to the sounds tab to find and jump to scripts, costumes and sounds."
   * }
   * ```
   */
  description: string;
  /**
   * The version the addon was added:
   * 
   * The addon's versionAdded will be compared to the current verion of the extension to check if the addon should be categorized higher.
   * 
   * Example:
   * ```js
   * {
   *    versionAdded: "12.45.3"
   * }
   * ```
   */
  versionAdded: string;
    /**
   * The credits for the addon
   * 
   * The addon's credits will be displayed in the settings page under the addon name and description.
   * 
   * Example:
   * ```js
   * {
   *    credits: ["griffpatch", "patchjunior"]
   * }
   * ```
   */
  credits?: string[];
  /**
   * The tags for the addon
   * - recommended: This addon is recommended to be enabled. This tag should only be added if approved by developers.
   * - TODO: finish this
   * 
   * The addon's tags will used to categorize the addons.
   * 
   * Example:
   * ```js
   * {
   *    tags: ["codeEditor", "codeEditor"]
   * }
   * ```
   */
  tags: ("recommended"|"costumeEditor"|"codeEditor")[];
  // category?: ("editor" | "popup" | "code" | "general")[];
  mode?: "dev"|"prod";
  enabledByDefault?: boolean;
  // hotkeys?: {
  //   id: string;
  //   description: string;
  //   default: string[];
  // }[];
}

export interface AddonScript {
  script: () => Promise<{ default: () => any }>;
  matches: (keyof typeof MATCH_PATTERNS)[];
  runAtComplete?: boolean;
}

export interface AddonStyle {
  style: string;
  matches: (keyof typeof MATCH_PATTERNS)[];
  attachedSetting: string;
}

export interface AddonPopup {
  name: string;
  icon: IconifyIcon;
  component: Component;
  badge?: Component;
}
