import { defineConfig } from "vite";
import openflPlugin from "vite-plugin-openfl";

export default defineConfig({
  plugins: [openflPlugin()],
  build: {
    chunkSizeWarningLimit: 2000,
  },
});
