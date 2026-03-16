import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main/index.ts'),
      formats: ['es'],
      fileName: () => 'main.js',
    },
    rollupOptions: {
      external: ['electron', 'sharp', 'p-limit'],
      output: {
        dir: path.resolve(__dirname, 'dist-electron'),
      },
    },
    minify: false,
    outDir: 'dist-electron',
  },
})
