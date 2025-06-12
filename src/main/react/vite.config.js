import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: 'src/main/react',
  build: {
    outDir: '../resources/static/bundle',
    chunkSizeWarningLimit:1500,
    emptyOutDir: true,
    cssCodeSplit: true,  // CSS 분리 유지
    rollupOptions: {
      input: {
        bid: path.resolve(__dirname, 'src/bid/bid.jsx'),
      },
      preserveEntrySignatures: 'strict',
      output: {
        entryFileNames: 'js/[name].bundle.js',
        chunkFileNames: 'chunk/[name].chunk.js',
        assetFileNames: `css/[name].css`,
      },
    },
  },
  server: {
    https: {
      key: fs.readFileSync('certs/key.pem'),
      cert: fs.readFileSync('certs/cert.pem'),
    },
    host: '0.0.0.0',
    port: 3200,
  },
});
