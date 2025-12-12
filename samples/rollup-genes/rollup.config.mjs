import openfl from "vite-plugin-openfl";
import copy from "rollup-plugin-copy";
import { defineConfig } from "rollup";

export default defineConfig({
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
});
