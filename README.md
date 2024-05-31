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

- Allow for other languages to be pulled with tx. Thus, it won't need to be included in the source code, and can be pulled for production builds.
- Split up general strings to their source. For instance, settings page strings will go in the settings page folder in a file called `strings.ts`. No need for the json \_locales/en/messages file. Then we will send all of these strings to tx.
- Go through extension manifests to get all addon strings and send those back to tx.

#### Settings Page

- Onboarding
- Fix search bar for running on tab addons
- Fix bug with search bar making addons not right
- More Settings - Maybe find a better name for it?
- Superpresets - Presets of addons. Example: Scratch 2 Editor enables scratch 2 theme, category columns, etc.
- User custom presets and superpresets. Basically setting profiles.
- Support Button

#### Addon API

- API for previewing addons. Specifically editor addons. This api would allow you to create editor tooltips on elements and have a next and previous option to go to the next tooltip.
- Type classes based on addon.ts, such as addon.settings.get(keys)

#### Addon Prio List

- **jump-to-def - 0%**
- **delete-cut-blocks - 0%**
- **make-space - 0%**
- **type-block-name/insert-blocks - 0%**
- **swap-variables - 0%**
- **hide-flyout - 0%**

- category-columns - 100%_ish_
- hide-new-vars - 100% (**buggy??**)

- snap-scripts - 100%
- find-bar - 100%
- copypaste-blocks - 100%
- paste-drag - 100%
