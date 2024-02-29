import { sep } from "path";
import prompts from "prompts";
import {
  existsSync,
  readdirSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
} from "fs";
const pkg = JSON.parse(readFileSync("package.json", { encoding: "utf-8" }));
const [node, source, addonId] = process.argv;

const { category, subcategory, id, name, description } = await prompts([
  {
    type: "select",
    name: "category",
    message: "Category",
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
    type: (prev) => (prev === "editor" ? "select" : null),
    name: "subcategory",
    message: "Subcategory",
    choices: [
      {
        title: "General",
        description: "Addon will run in multiple places around the editor.",
        value: "general",
      },
      {
        title: "Code",
        description: "Addon will run in code editor tab.",
        value: "code",
      },
      {
        title: "Paint",
        description: "Addon will run in paint editor tab.",
        value: "paint",
      },
      {
        title: "Project Player",
        description: "Addon will run in stage.",
        value: "project-player",
      },
    ],
  },
  {
    type: "text",
    name: "id",
    message: "ID",
    initial: addonId || null,
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
if (!id) throw "no id";
let dir =
  process.cwd() +
  sep +
  "src" +
  sep +
  "addons" +
  sep +
  category +
  (subcategory ? sep + subcategory : "") +
  sep +
  id;

if (existsSync(dir)) {
  if (readdirSync(dir).length) {
    throw (
      "\x1b[31m%s" +
      "[Error] A folder with this addon ID already exists!" +
      "\x1b[0m"
    );
  }
} else mkdirSync(dir, { recursive: true });

const file = [
  `export default defineAddon({
  name: "${name}",
  description: "${description}",
  versionAdded: "${pkg.version.split("-")[0]}",
  mode: true,
});`,
];

if (category === "editor") {
  file.push(`export const scripts = defineScripts([
  {
    script: () => import("./script.ts"),
    matches: ["projects"],
  },
]);`);
  const script = `export default async () => {
  console.log("${id} is running!");
};\n`;
  writeFileSync(dir + sep + "script.ts", script);
}

writeFileSync(dir + sep + "addon.ts", file.join("\n\n"));

console.log("\x1b[34m%s", "Addon created:", "\x1b[0m", dir);
