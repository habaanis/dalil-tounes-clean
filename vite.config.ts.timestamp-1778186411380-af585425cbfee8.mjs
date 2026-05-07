// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.js";
import path from "path";
var __vite_injected_original_dirname = "/home/project";
var nonBlockingCssPlugin = {
  name: "non-blocking-css",
  transformIndexHtml(html) {
    return html.replace(
      /<link rel="stylesheet"([^>]*?)>/g,
      (match) => {
        const attrs = match.slice('<link rel="stylesheet"'.length, -1);
        return `<link rel="preload" as="style"${attrs} onload="this.onload=null;this.rel='stylesheet'"><noscript><link rel="stylesheet"${attrs}></noscript>`;
      }
    );
  }
};
var vite_config_default = defineConfig({
  plugins: [react(), nonBlockingCssPlugin],
  esbuild: {
    drop: ["console", "debugger"]
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
    include: ["cookie"]
  },
  server: {
    hmr: { overlay: true },
    watch: { usePolling: false }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/src/context/")) {
            return void 0;
          }
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
            return "vendor-react";
          }
          if (id.includes("node_modules/react-router-dom/") || id.includes("node_modules/react-router/")) {
            return "vendor-router";
          }
          if (id.includes("node_modules/@supabase/")) {
            return "vendor-supabase";
          }
          if (id.includes("node_modules/leaflet") || id.includes("node_modules/react-leaflet")) {
            return "vendor-map";
          }
          if (id.includes("node_modules/framer-motion")) {
            return "vendor-motion";
          }
          if (id.includes("node_modules/lucide-react")) {
            return "vendor-icons";
          }
          if (id.includes("node_modules/qrcode")) {
            return "vendor-qrcode";
          }
        },
        assetFileNames: "assets/[name]-[hash][extname]",
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js"
      }
    },
    // Empêche le preload automatique du chunk Supabase : il reste chargé
    // dynamiquement au premier besoin (focus recherche, fetch Home, auth).
    modulePreload: {
      resolveDependencies: (_filename, deps) => deps.filter((d) => !d.includes("vendor-supabase"))
    },
    chunkSizeWarningLimit: 600,
    sourcemap: false,
    minify: "esbuild",
    target: "esnext",
    // Supprime console.log et debugger en production
    esbuildOptions: {
      drop: ["console", "debugger"],
      // Tree-shaking agressif
      treeShaking: true
    },
    // Activer les CSS code splits pour ne charger que les styles nécessaires
    cssCodeSplit: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuLyoqXG4gKiBSZW5kIGxlIDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIj4gZ1x1MDBFOW5cdTAwRTlyXHUwMEU5IHBhciBWaXRlIG5vbiBibG9xdWFudCB2aWEgbGEgdGVjaG5pcXVlXG4gKiBwcmVsb2FkICsgb25sb2FkIHN3YXAuIExlIENTUyBjcml0aXF1ZSBkdSBIZXJvIGVzdCBpbmxpbmUgZGFucyBpbmRleC5odG1sLFxuICogZG9uYyBsJ2FmZmljaGFnZSBpbml0aWFsIHJlc3RlIGNvcnJlY3QgYXZhbnQgcXVlIGxhIGZldWlsbGUgY29tcGxcdTAwRTh0ZSBuJ2Fycml2ZS5cbiAqL1xuY29uc3Qgbm9uQmxvY2tpbmdDc3NQbHVnaW4gPSB7XG4gIG5hbWU6ICdub24tYmxvY2tpbmctY3NzJyxcbiAgdHJhbnNmb3JtSW5kZXhIdG1sKGh0bWw6IHN0cmluZykge1xuICAgIHJldHVybiBodG1sLnJlcGxhY2UoXG4gICAgICAvPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiKFtePl0qPyk+L2csXG4gICAgICAobWF0Y2g6IHN0cmluZykgPT4ge1xuICAgICAgICBjb25zdCBhdHRycyA9IG1hdGNoLnNsaWNlKCc8bGluayByZWw9XCJzdHlsZXNoZWV0XCInLmxlbmd0aCwgLTEpO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIGA8bGluayByZWw9XCJwcmVsb2FkXCIgYXM9XCJzdHlsZVwiJHthdHRyc30gb25sb2FkPVwidGhpcy5vbmxvYWQ9bnVsbDt0aGlzLnJlbD0nc3R5bGVzaGVldCdcIj5gICtcbiAgICAgICAgICBgPG5vc2NyaXB0PjxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiR7YXR0cnN9Pjwvbm9zY3JpcHQ+YFxuICAgICAgICApO1xuICAgICAgfVxuICAgICk7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKSwgbm9uQmxvY2tpbmdDc3NQbHVnaW5dLFxuICBlc2J1aWxkOiB7XG4gICAgZHJvcDogWydjb25zb2xlJywgJ2RlYnVnZ2VyJ10sXG4gIH0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcbiAgICB9LFxuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBleGNsdWRlOiBbJ2x1Y2lkZS1yZWFjdCddLFxuICAgIGluY2x1ZGU6IFsnY29va2llJ10sXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIGhtcjogeyBvdmVybGF5OiB0cnVlIH0sXG4gICAgd2F0Y2g6IHsgdXNlUG9sbGluZzogZmFsc2UgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgbWFudWFsQ2h1bmtzKGlkKSB7XG4gICAgICAgICAgLy8gQ29udGV4dGVzIFJlYWN0IGdsb2JhdXggOiBET0lWRU5UIHJlc3RlciBkYW5zIGxlIGNodW5rIHByaW5jaXBhbFxuICAgICAgICAgIC8vIChsJ2VudHJcdTAwRTllKSwgc2lub24gdW4gbGF6eSBjaHVuayBwb3VycmFpdCBpbXBvcnRlciB1bmUgc2Vjb25kZSBjb3BpZVxuICAgICAgICAgIC8vIGR1IG1vZHVsZSBldCBvYnRlbmlyIHVuIFN5bWJvbCBkaXN0aW5jdCBkZSBjZWx1aSBkdSBQcm92aWRlcixcbiAgICAgICAgICAvLyBwcm92b3F1YW50IFx1MDBBQiB1c2VMYW5ndWFnZSBtdXN0IGJlIHVzZWQgd2l0aGluIExhbmd1YWdlUHJvdmlkZXIgXHUwMEJCLlxuICAgICAgICAgIC8vIFJldG91cm5lciB1bmRlZmluZWQgZ2FyZGUgY2VzIG1vZHVsZXMgZGFucyBsJ2VudHJ5IGNodW5rLlxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnL3NyYy9jb250ZXh0LycpKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBCaWJsaW90aFx1MDBFOHF1ZXMgY3JpdGlxdWVzIGF1IGRcdTAwRTltYXJyYWdlIFx1MjAxNCBjaHVuayBkXHUwMEU5ZGlcdTAwRTkgcG91ciBsZSBjYWNoZSBsb25nIHRlcm1lXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvcmVhY3QvJykgfHwgaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9yZWFjdC1kb20vJykpIHtcbiAgICAgICAgICAgIHJldHVybiAndmVuZG9yLXJlYWN0JztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvcmVhY3Qtcm91dGVyLWRvbS8nKSB8fCBpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL3JlYWN0LXJvdXRlci8nKSkge1xuICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3Itcm91dGVyJztcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gU3VwYWJhc2UgY2hhcmdcdTAwRTkgZGUgZmFcdTAwRTdvbiBhc3luY2hyb25lIFx1MjAxNCBjaHVuayBzXHUwMEU5cGFyXHUwMEU5XG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvQHN1cGFiYXNlLycpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3ZlbmRvci1zdXBhYmFzZSc7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIENhcnRlIGxlYWZsZXQgXHUyMDE0IHJhcmVtZW50IHV0aWxpc1x1MDBFOWUsIGNodW5rIHBhcmVzc2V1eFxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL2xlYWZsZXQnKSB8fCBpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL3JlYWN0LWxlYWZsZXQnKSkge1xuICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3ItbWFwJztcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gRnJhbWVyLW1vdGlvbiBcdTIwMTQgYW5pbWF0aW9ucywgbm9uIGNyaXRpcXVlIGF1IEZDUFxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL2ZyYW1lci1tb3Rpb24nKSkge1xuICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3ItbW90aW9uJztcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gSWNcdTAwRjRuZXMgbHVjaWRlIFx1MjAxNCB2b2x1bWluZXVzZXMsIGlzb2xcdTAwRTllcyBwb3VyIHRyZWUtc2hha2luZyBvcHRpbWFsXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvbHVjaWRlLXJlYWN0JykpIHtcbiAgICAgICAgICAgIHJldHVybiAndmVuZG9yLWljb25zJztcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gUVIgY29kZSBcdTIwMTQgdHJcdTAwRThzIHJhcmVtZW50IHV0aWxpc1x1MDBFOVxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL3FyY29kZScpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3ZlbmRvci1xcmNvZGUnO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICdhc3NldHMvW25hbWVdLVtoYXNoXVtleHRuYW1lXScsXG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiAnYXNzZXRzL1tuYW1lXS1baGFzaF0uanMnLFxuICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdLmpzJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgICAvLyBFbXBcdTAwRUFjaGUgbGUgcHJlbG9hZCBhdXRvbWF0aXF1ZSBkdSBjaHVuayBTdXBhYmFzZSA6IGlsIHJlc3RlIGNoYXJnXHUwMEU5XG4gICAgLy8gZHluYW1pcXVlbWVudCBhdSBwcmVtaWVyIGJlc29pbiAoZm9jdXMgcmVjaGVyY2hlLCBmZXRjaCBIb21lLCBhdXRoKS5cbiAgICBtb2R1bGVQcmVsb2FkOiB7XG4gICAgICByZXNvbHZlRGVwZW5kZW5jaWVzOiAoX2ZpbGVuYW1lLCBkZXBzKSA9PlxuICAgICAgICBkZXBzLmZpbHRlcigoZCkgPT4gIWQuaW5jbHVkZXMoJ3ZlbmRvci1zdXBhYmFzZScpKSxcbiAgICB9LFxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogNjAwLFxuICAgIHNvdXJjZW1hcDogZmFsc2UsXG4gICAgbWluaWZ5OiAnZXNidWlsZCcsXG4gICAgdGFyZ2V0OiAnZXNuZXh0JyxcbiAgICAvLyBTdXBwcmltZSBjb25zb2xlLmxvZyBldCBkZWJ1Z2dlciBlbiBwcm9kdWN0aW9uXG4gICAgZXNidWlsZE9wdGlvbnM6IHtcbiAgICAgIGRyb3A6IFsnY29uc29sZScsICdkZWJ1Z2dlciddLFxuICAgICAgLy8gVHJlZS1zaGFraW5nIGFncmVzc2lmXG4gICAgICB0cmVlU2hha2luZzogdHJ1ZSxcbiAgICB9LFxuICAgIC8vIEFjdGl2ZXIgbGVzIENTUyBjb2RlIHNwbGl0cyBwb3VyIG5lIGNoYXJnZXIgcXVlIGxlcyBzdHlsZXMgblx1MDBFOWNlc3NhaXJlc1xuICAgIGNzc0NvZGVTcGxpdDogdHJ1ZSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5TixTQUFTLG9CQUFvQjtBQUN0UCxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FB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
