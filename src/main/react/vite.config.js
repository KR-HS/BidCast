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
    cssCodeSplit: true,  // CSS 분리 유지
    rollupOptions: {
      input: {
        bid: path.resolve(__dirname, 'src/bid/bid.jsx'),
        home: path.resolve(__dirname, 'src/home/home.jsx'),
        login: path.resolve(__dirname, 'src/login/login.jsx'),
        join: path.resolve(__dirname, 'src/join/join.jsx'),
        searchId: path.resolve(__dirname, 'src/search_id/searchId.jsx'),
        searchPw: path.resolve(__dirname, 'src/search_pw/searchPw.jsx'),
        changePw: path.resolve(__dirname, 'src/change_pw/changePw.jsx'),
        findComplete: path.resolve(__dirname, 'src/findcomplete/findComplete.jsx'),
        schedule: path.resolve(__dirname, 'src/schedule/schedule.jsx'),
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
