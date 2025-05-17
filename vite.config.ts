import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'index',
      fileName: () => 'index.js',
      formats: ['es']
    },
  },
  define: {
    global: 'window',
  },
  optimizeDeps: {
    include: [],
  },
});
