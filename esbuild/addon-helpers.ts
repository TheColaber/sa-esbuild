import UserscriptAddon from "../src/addon-api/userscript";
import { Component } from "vue";
// import { IconifyIcon } from "@iconify/vue";
import MATCH_PATTERNS from "../src/content-script/matches";

declare global {
  const defineAddon: typeof import("./addon-helpers")["defineAddon"];
  const defineScript: typeof import("./addon-helpers")["defineScript"];
}

export function defineAddon(manifest: AddonManifest) {
  return manifest;
}

export function defineScript(
  script: (apis: {
    addon: UserscriptAddon;
    msg: (msg: string, parameters: { [param: string]: string }) => string;
  }) => any | Promise<any>
) {
  return script;
}

export interface AddonManifest {
  name: string;
  description: string;
  versionAdded: string;
  credits?: { name: string }[];
  scripts?: {
    script?: ReturnType<typeof defineScript>;
    matches: (keyof typeof MATCH_PATTERNS)[];
    runAtComplete?: boolean;
  }[];
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
