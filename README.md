# Scratch Addons

Scratch Addons unites various features and themes (called [addons](./src/addons/README.md)) for the Scratch website and project editor, offering them through a user-friendly and customizable browser extension. Our goal is to establish a centralized and constantly updated platform that fosters community development of innovative features and themes for Scratch.

### TODOS

#### Translations

- Allow for other languages to be pulled with tx. Thus, it won't need to be included in the source code, and can be pulled for production builds.
- Split up general strings to their source. For instance, settings page strings will go in the settings page folder in a file called `strings.ts`. No need for the json \_locales/en/messages file. Then we will send all of these strings to tx.
- Go through extension manifests to get all addon strings and send those back to tx.
