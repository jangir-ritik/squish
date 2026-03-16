import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    target: "node16",
    lib: {
      entry: {
        main: path.resolve(__dirname, "src/main/index.ts"),
        preload: path.resolve(__dirname, "src/main/preload.ts"),
      },
      formats: ["cjs"],
    },
    rollupOptions: {
      external: [
        "electron",
        "sharp",
        "p-limit",
        "path",
        "fs",
        "fs/promises",
        "url",
        "os",
        "child_process",
      ],
      output: {
        dir: path.resolve(__dirname, "dist-electron"),
        entryFileNames: "[name].js",
      },
    },
    minify: false,
    outDir: "dist-electron",
  },
});
