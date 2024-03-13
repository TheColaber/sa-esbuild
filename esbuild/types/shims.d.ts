declare module "*.vue" {
  import { Component } from "vue";
  const component: Component;
  export default component;
}

declare module "*.png" {
  const image: string;
  export default image;
}
