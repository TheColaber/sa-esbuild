import { sep } from "path";
import prompts from "prompts";
import { existsSync, readdirSync, mkdirSync, writeFileSync } from "fs";
import pkg from "../package.json" assert { type: "json" };

const [node, source, addonId] = process.argv;

const { type, id, name, description } = await prompts([
  {
    type: "select",
    name: "type",
    message: "Type",
    choices: [
      {
        title: "Editor",
        description: "Addon will run in editor",
        value: "editor",
      },
      {
        title: "Popup",
        description: "Add creates new tab in popup",
        value: "popup",
      },
      {
        title: "Website",
        description: "Addon will run on scratch website",
        value: "website",
      },
    ],
  },
  {
    type: "text",
    name: "id",
    message: "ID",
    initial: addonId || null,
    onState(state) {
      // console.log(state);
    },
    validate: (v) =>
      v.toLowerCase() === v ? true : "ID must be all lowercase",
  },
  {
    type: "text",
    name: "name",
    message: "Name",
    initial: (prev) => {
      const firstLetter = prev.charAt(0).toUpperCase();
      return firstLetter + prev.slice(1).replaceAll("-", " ");
    },
  },
  {
    type: "text",
    name: "description",
    message: "Description",
  },
]);
throw "hi";
let dir = process.cwd() + sep + "src" + sep + "addons" + sep + type + sep + id;

if (existsSync(dir)) {
  if (readdirSync(dir).length) {
    throw (
      ("\x1b[31m%s",
      "[Error] A folder with this addon ID already exists!",
      "\x1b[0m")
    );
  }
} else mkdirSync(dir);

let imports = [];
let additionalProps = [];
if (type === "editor") {
  imports.push(`import script from "./userscript";`);
  additionalProps.push(
    `  scripts: [
    {
      script,
      matches: ["projects"]
    }
  ],`,
  );
  const userscript = `export default defineScript(({ addon, msg }) => {
  console.log("${id} is running!")
})\n`;
  writeFileSync(dir + sep + "userscript.ts", userscript);
}

writeFileSync(
  dir + sep + "addon.ts",
  `${imports.join(() => "\n")}

export default defineAddon({
  name: "${name}",
  description: "${description}",
  versionAdded: "${pkg.version.split("-")[0]}",
${additionalProps.join(() => "\n")}
});`,
);

console.log("\x1b[34m%s", "Addon created:", "\x1b[0m", dir);
