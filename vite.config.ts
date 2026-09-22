import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()], // बिल्कुल क्लीन और सुरक्षित प्लगइन सेटअप
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
