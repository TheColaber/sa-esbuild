function definePreset(preset: Preset) {
  return preset;
}

export type Preset = {
  name: string;
  description: string;
  addons: {
    id: string;
    enabled: boolean;
    settings?: { id: string, value: any }[]
  }[];
};

const devtools = definePreset({
  name: "Griffpatch's editor developer tools",
  description:
    "Handpicked by griffpatch himself to improve project creation productivity.",
  addons: [
    {
      id: "find-bar",
      enabled: true,
    }, {id: "copypaste-code", enabled: true}, {id:"insert-blocks", enabled: true}],
});

export default { devtools };
