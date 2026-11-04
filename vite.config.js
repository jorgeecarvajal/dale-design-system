import { defineConfig } from 'vite';

// Library build: one ES module, React left to the app.
export default defineConfig({
  esbuild: { jsx: 'automatic' },
  build: {
    lib: { entry: 'src/index.js', formats: ['es'], fileName: () => 'index.js' },
    rollupOptions: { external: ['react', 'react-dom', 'react/jsx-runtime'] },
    sourcemap: true,
    emptyOutDir: true,
  },
});
