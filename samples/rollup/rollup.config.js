import openfl from "vite-plugin-openfl";
import copy from "rollup-plugin-copy";

export default {
  context: "window",
  input: "project.xml",
  output: {
    dir: "dist",
    format: "es",
  },
  preserveEntrySignatures: false,
  plugins: [
    openfl(),
    copy({
      targets: [{ src: "public/**/*", dest: "dist" }],
    }),
  ],
};
