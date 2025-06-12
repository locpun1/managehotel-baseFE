import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import viteCompression from 'vite-plugin-compression';
import vitePluginRequire from 'vite-plugin-require';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    //@ts-ignore
    vitePluginRequire.default({ fileRegex: /(config.js)$/ }),
    viteCompression(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['@mui/icons-material'],
    exclude: ['js-big-decimal'],
    esbuildOptions: {
      target: 'esnext',
    },
  },
  server: {
    host: true, // Here
    port: 3000,
  },
  preview: {
    port: 4173,
  },
  build: {
    target: 'esnext',
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler', // or "modern"
      },
    },
  },
});
