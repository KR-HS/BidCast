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
        notice: path.resolve(__dirname, 'src/notice/notice.jsx'),
        noticeDetail: path.resolve(__dirname, 'src/notice_detail/noticeDetail.jsx'),
        faq: path.resolve(__dirname, 'src/faq/faq.jsx'),
        inquiry: path.resolve(__dirname, 'src/inquiry/inquiry.jsx'),
        inquiryList: path.resolve(__dirname, 'src/inquiryList/inquiryList.jsx'),
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
