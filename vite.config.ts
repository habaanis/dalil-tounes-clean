import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Rend le <link rel="stylesheet"> généré par Vite non bloquant via la technique
 * preload + onload swap. Le CSS critique du Hero est inline dans index.html,
 * donc l'affichage initial reste correct avant que la feuille complète n'arrive.
 */
const nonBlockingCssPlugin = {
  name: 'non-blocking-css',
  transformIndexHtml(html: string) {
    return html.replace(
      /<link rel="stylesheet"([^>]*?)>/g,
      (match: string) => {
        const attrs = match.slice('<link rel="stylesheet"'.length, -1);
        return (
          `<link rel="preload" as="style"${attrs} onload="this.onload=null;this.rel='stylesheet'">` +
          `<noscript><link rel="stylesheet"${attrs}></noscript>`
        );
      }
    );
  },
};

export default defineConfig({
  plugins: [react(), nonBlockingCssPlugin],
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
          // Contextes React globaux : DOIVENT rester dans le chunk principal
          // (l'entrée), sinon un lazy chunk pourrait importer une seconde copie
          // du module et obtenir un Symbol distinct de celui du Provider,
          // provoquant « useLanguage must be used within LanguageProvider ».
          // Retourner undefined garde ces modules dans l'entry chunk.
          if (id.includes('/src/context/')) {
            return undefined;
          }
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
    // Empêche le preload automatique du chunk Supabase : il reste chargé
    // dynamiquement au premier besoin (focus recherche, fetch Home, auth).
    modulePreload: {
      resolveDependencies: (_filename, deps) =>
        deps.filter((d) => !d.includes('vendor-supabase')),
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
