import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Tree shaking: remove unused code
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        unused: true,
      },
    },
    rollupOptions: {
      output: {
        // Code splitting strategy based on dependency patterns
        manualChunks(id) {
          // Vendor chunks (dependencies)
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('redux')) return 'vendor-state';
            if (id.includes('lucide-react')) return 'vendor-ui';
            if (id.includes('i18next')) return 'vendor-i18n';
            if (id.includes('date-fns')) return 'vendor-utils';
            return 'vendor-other';
          }
        },
      },
    },
    // Enable chunk size warnings for optimization
    chunkSizeWarningLimit: 500,
  },
});
