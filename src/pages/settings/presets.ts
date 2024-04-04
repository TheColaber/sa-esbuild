function definePreset(preset: Preset) {
  return preset;
}

type Preset = {
  name: string;
  description: string;
  addons: string[];
};

const devtools = definePreset({
  name: "Griffpatch's editor developer tools",
  description:
    "Handpicked by griffpatch himself to improve project creation productivity.",
  addons: ["find-bar", "copypaste-code", "insert-blocks"],
});

export default { devtools };
