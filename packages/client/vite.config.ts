import { defineConfig } from 'vite';
import { resolve, join } from 'path';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import dotenv from 'dotenv';
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  server: {
    port: Number(process.env.CLIENT_PORT) || 3000,
  },
  define: {
    __SERVER_PORT__: process.env.SERVER_PORT,
    __EXTERNAL_SERVER_URL__: JSON.stringify(process.env.EXTERNAL_SERVER_URL),
    __INTERNAL_SERVER_URL__: JSON.stringify(process.env.INTERNAL_SERVER_URL),
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "src/styles/variables" as *;`,
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
  plugins: [react(), svgr()],
  ssr: {
    format: 'cjs',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      util: 'node:util',
    },
  },
  build: {
    outDir: join(__dirname, 'dist/client'),
  },
});
