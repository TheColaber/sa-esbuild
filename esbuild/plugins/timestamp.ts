import { writeFile } from "fs/promises";

export default () => ({
  name: "timestamp",
  setup(build) {
    const out = build.initialOptions.outdir;
    build.onEnd(() => {
      writeFile(out + "/timestamp.json", new Date().getTime().toString());
    });
  },
});
