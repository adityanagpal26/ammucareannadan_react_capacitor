import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Add base path for Capacitor
  base: './',
  // Server options for mobile testing
  server: {
    host: true,
    port: 3000,
    strictPort: true,
  },
  // Build options for better mobile compatibility
  build: {
    outDir: 'dist',
    minify: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
