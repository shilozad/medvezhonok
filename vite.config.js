import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/medvezhonok/',
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
  ],
  esbuild: {
    jsx: 'automatic',
  },
  build: {
    assetsDir: 'assets',
    sourcemap: true,
  },
});
