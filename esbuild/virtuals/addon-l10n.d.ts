import locale from "./addon-en";

declare var locales: {
  [lang: string]: typeof locale;
};
export default locales;
