import UserscriptAddon from "../src/addon-api/userscript";
import { Component } from "vue";
// import { IconifyIcon } from "@iconify/vue";
import MATCH_PATTERNS from "../src/content-script/matches";

declare global {
  const defineAddon: typeof import("./addon-helpers")["defineAddon"];
  const defineScripts: typeof import("./addon-helpers")["defineScripts"];
  const addon: UserscriptAddon;
}

export function defineAddon(manifest: AddonManifest) {
  return manifest;
}

export function defineScripts(scripts: AddonScript[]) {
  return scripts;
}

export interface AddonManifest {
  name: string;
  description: string;
  versionAdded: string;
  credits?: { name: string }[];

  styles?: {
    style: string;
    matches: (keyof typeof MATCH_PATTERNS)[];
    attachedSetting: string;
  }[];
  popup?: {
    name: string;
    // icon: IconifyIcon;
    component: Component;
    badge?: Component;
  };
  hotkeys?: {
    id: string;
    description: string;
    default: string[];
  }[];
  tags?: string[];
  category?: ("editor" | "popup" | "code" | "general")[];
  mode?: "dev";
  enabledByDefault?: boolean;
}

export interface AddonScript {
  script: () => any;
  matches: (keyof typeof MATCH_PATTERNS)[];
  runAtComplete?: boolean;
}
