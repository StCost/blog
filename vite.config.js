import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
    }),
    visualizer({
      template: "treemap", // or sunburst
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: "dist/bundle-analysis.html",
    }),
  ],
  base: "/blog/",
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  build: {
    outDir: "dist",
  },
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
});
