import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vitejs.dev
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  base: './', // 🚨 मोबाइल की वाइट स्क्रीन को रोकने के लिए सबसे जरूरी लाइन
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: false
  }
});
