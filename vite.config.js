import { defineConfig } from 'vite';

export default defineConfig({
  base: '/medvezhonok/',
  esbuild: {
    jsx: 'automatic',
  },
  build: {
    assetsDir: 'assets',
    sourcemap: true,
  },
});
