import typedStorage from "typed-local-store/dist/typedStorage";

interface storage {
  lightTheme: boolean;
}

export default new typedStorage.default<storage>();
