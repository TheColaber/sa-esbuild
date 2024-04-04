# Scratch Addons

Scratch Addons unites various features and themes (called [addons](./src/addons/README.md)) for the Scratch website and project editor, offering them through a user-friendly and customizable browser extension. Our goal is to establish a centralized and constantly updated platform that fosters community development of innovative features and themes for Scratch.

### TODOS

#### Translations

- Allow for other languages to be pulled with tx. Thus, it won't need to be included in the source code, and can be pulled for production builds.
- Split up general strings to their source. For instance, settings page strings will go in the settings page folder in a file called `strings.ts`. No need for the json \_locales/en/messages file. Then we will send all of these strings to tx.
- Go through extension manifests to get all addon strings and send those back to tx.

#### Settings Page

- Onboarding
- Fix search bar
- More Settings - Maybe find a better name for it?
- Superpresets - Presets of addons. Example: Scratch 2 Editor enables scratch 2 theme, category columns, etc.
- User custom presets and superpresets. Basically setting profiles.
- Support Button

#### Addon API

- API for previewing addons. Specifically editor addons. This api would allow you to create editor tooltips on elements and have a next and previous option to go to the next tooltip.

#### Addons

- Finish insert-blocks
