import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['cookie'],
  },
  server: {
    hmr: { overlay: true },
    watch: { usePolling: false },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Bibliothèques critiques au démarrage — chunk dédié pour le cache long terme
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/react-router-dom/') || id.includes('node_modules/react-router/')) {
            return 'vendor-router';
          }
          // Supabase chargé de façon asynchrone — chunk séparé
          if (id.includes('node_modules/@supabase/')) {
            return 'vendor-supabase';
          }
          // Carte leaflet — rarement utilisée, chunk paresseux
          if (id.includes('node_modules/leaflet') || id.includes('node_modules/react-leaflet')) {
            return 'vendor-map';
          }
          // Framer-motion — animations, non critique au FCP
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion';
          }
          // Icônes lucide — volumineuses, isolées pour tree-shaking optimal
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          // QR code — très rarement utilisé
          if (id.includes('node_modules/qrcode')) {
            return 'vendor-qrcode';
          }
        },
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    chunkSizeWarningLimit: 600,
    sourcemap: false,
    minify: 'esbuild',
    target: 'esnext',
    // Supprime console.log et debugger en production
    esbuildOptions: {
      drop: ['console', 'debugger'],
      // Tree-shaking agressif
      treeShaking: true,
    },
    // Activer les CSS code splits pour ne charger que les styles nécessaires
    cssCodeSplit: true,
  },
});
