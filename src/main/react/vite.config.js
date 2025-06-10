import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: 'src/main/react',
  build: {
    outDir: '../resources/static/bundle',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname,'src/bid/main.jsx'),
        main2:path.resolve(__dirname,'src/test/main.jsx')
        // app: path.resolve(__dirname,'src/App.jsx'),
        // videoGrid: path.resolve(__dirname,'src/VideoGrid.jsx'),
        // 필요한 만큼 entry 추가 가능
      },
      output: {
        entryFileNames: 'js/[name].bundle.js',
        assetFileNames: 'css/[name].[ext]',
        chunkFileNames: 'chunk/[name].chunk.js',
      }
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
