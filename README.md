# Scratch Addons

Scratch Addons unites various features and themes (called [addons](./src/addons)) for the Scratch website and project editor, offering them through a user-friendly and customizable browser extension. Our goal is to establish a centralized and constantly updated platform that fosters community development of innovative features and themes for Scratch.

### How to Contribute

1. Download the repo through your favorite git tool
2. Run `yarn install` (or `npm install`)
3. Run `yarn dev` (or `npm run dev`)
4. Load the extention into chrome://extensions
5. If you want to build an addon, use `yarn create-addon` to get started
6. Run `yarn format` at the end and then create a PR!

### TODOS

#### Translations

- Pull translations from tx.. Thus, it won't need to be included in the source code, and can be pulled for production builds. We can't currently try this since it requires an update to how we store strings on tx :/

#### Settings Page

- Onboarding
- More Settings - Maybe find a better name for it?
- Superpresets - Presets of addons. Example: Scratch 2 Editor enables scratch 2 theme, category columns, etc.
- User custom presets and superpresets. Basically setting profiles.
- Support Button

#### Addon API

- Type classes based on addon.ts, such as addon.settings.get(keys)

#### Addon Prio List

- delete-cut-blocks - 0%
- custom-fps - 0%
- block-count - 0%
- swap-variables - 0%
- hide-flyout - 0%
- type-block-name/insert-blocks - 0%
- custom-block-colors - 0%

- jump-to-def - 70%
- category-columns - 100%ish
- hide-new-vars - 100% (buggy??)
- find-bar - 90% - uhhhhh

- make-space - 100%
- snap-scripts - 100%
- copypaste-blocks - 100%
- paste-drag - 100%
- enhanced-cleanup - 100%
- zebra-striping - 100%
- block-cherry-picking - 100% (setting)
- block-duplicate - 100%

### Others

- https://github.com/ScratchAddons/ScratchAddons/issues/2505
- https://github.com/ScratchAddons/ScratchAddons/issues/2670
- https://github.com/ScratchAddons/ScratchAddons/issues/2739
- https://github.com/ScratchAddons/ScratchAddons/issues/3314
- https://github.com/ScratchAddons/ScratchAddons/issues/3316

- https://github.com/ScratchAddons/ScratchAddons/issues?page=19&q=is%3Aissue+is%3Aopen+-label%3A%22new+addon%22
