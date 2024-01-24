# Addons Folder
This folder hold all of the addons Scratch Addons has to offer. An addon mainly consists of scripts and/or styles that run on the on specific places in the Scratch website. All addons are organized into 3 different categories. [editor](./editor/README.md) addons, [wesbite](./wesbite/README.md) addons, or [popup](./popup/README.md) addons. Each run in their respective context and are organized in the settings page.

# Composition of an addon

## Addon Manifest
Every single addon declares its own addon manifest inside their addon folder. The file is named `addon.ts`, and it specifies under which circumstances each one of its scripts and styles should be injected into the page. It also contains user-facing information, such as the description of the feature, and information about the addon's settings. An example addon manifest looks like this:
```ts
export default defineAddon({
  name: "Addon Name",
  description:
    "This is a summary of what this addon does...",
  versionAdded: "1.0.0",
  credits: ["UnknownUser"],
});

export const scripts = defineScripts([
  {
    script: () => import("./script.ts"),
    matches: ["projects"],
    runAtComplete: false,
  },
]);

export const strings = {
  "translatable-string": "Translate Me",
};
```
As you may notice, every part of the addon is divided into sections. These include the default export, scripts, styles, popup, and strings.

## TODO

Addon scripts have access to addon.* APIs. They can use these built-in utilities for various purposes: waiting until a certain element exists on the page, listening to settings change events, getting a reference to the Scratch VM object, reacting to the addon switching to disabled, etc.

Addons are designed to be compatible with each other. They are also developed with performance, internationalization, accessibility, and privacy in mind.