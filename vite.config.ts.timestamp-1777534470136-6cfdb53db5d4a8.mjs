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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuLyoqXG4gKiBSZW5kIGxlIDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIj4gZ1x1MDBFOW5cdTAwRTlyXHUwMEU5IHBhciBWaXRlIG5vbiBibG9xdWFudCB2aWEgbGEgdGVjaG5pcXVlXG4gKiBwcmVsb2FkICsgb25sb2FkIHN3YXAuIExlIENTUyBjcml0aXF1ZSBkdSBIZXJvIGVzdCBpbmxpbmUgZGFucyBpbmRleC5odG1sLFxuICogZG9uYyBsJ2FmZmljaGFnZSBpbml0aWFsIHJlc3RlIGNvcnJlY3QgYXZhbnQgcXVlIGxhIGZldWlsbGUgY29tcGxcdTAwRTh0ZSBuJ2Fycml2ZS5cbiAqL1xuY29uc3Qgbm9uQmxvY2tpbmdDc3NQbHVnaW4gPSB7XG4gIG5hbWU6ICdub24tYmxvY2tpbmctY3NzJyxcbiAgdHJhbnNmb3JtSW5kZXhIdG1sKGh0bWw6IHN0cmluZykge1xuICAgIHJldHVybiBodG1sLnJlcGxhY2UoXG4gICAgICAvPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiKFtePl0qPyk+L2csXG4gICAgICAobWF0Y2g6IHN0cmluZykgPT4ge1xuICAgICAgICBjb25zdCBhdHRycyA9IG1hdGNoLnNsaWNlKCc8bGluayByZWw9XCJzdHlsZXNoZWV0XCInLmxlbmd0aCwgLTEpO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIGA8bGluayByZWw9XCJwcmVsb2FkXCIgYXM9XCJzdHlsZVwiJHthdHRyc30gb25sb2FkPVwidGhpcy5vbmxvYWQ9bnVsbDt0aGlzLnJlbD0nc3R5bGVzaGVldCdcIj5gICtcbiAgICAgICAgICBgPG5vc2NyaXB0PjxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiR7YXR0cnN9Pjwvbm9zY3JpcHQ+YFxuICAgICAgICApO1xuICAgICAgfVxuICAgICk7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKSwgbm9uQmxvY2tpbmdDc3NQbHVnaW5dLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgfSxcbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgZXhjbHVkZTogWydsdWNpZGUtcmVhY3QnXSxcbiAgICBpbmNsdWRlOiBbJ2Nvb2tpZSddLFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBobXI6IHsgb3ZlcmxheTogdHJ1ZSB9LFxuICAgIHdhdGNoOiB7IHVzZVBvbGxpbmc6IGZhbHNlIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rcyhpZCkge1xuICAgICAgICAgIC8vIEJpYmxpb3RoXHUwMEU4cXVlcyBjcml0aXF1ZXMgYXUgZFx1MDBFOW1hcnJhZ2UgXHUyMDE0IGNodW5rIGRcdTAwRTlkaVx1MDBFOSBwb3VyIGxlIGNhY2hlIGxvbmcgdGVybWVcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9yZWFjdC8nKSB8fCBpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL3JlYWN0LWRvbS8nKSkge1xuICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3ItcmVhY3QnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9yZWFjdC1yb3V0ZXItZG9tLycpIHx8IGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvcmVhY3Qtcm91dGVyLycpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3ZlbmRvci1yb3V0ZXInO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBTdXBhYmFzZSBjaGFyZ1x1MDBFOSBkZSBmYVx1MDBFN29uIGFzeW5jaHJvbmUgXHUyMDE0IGNodW5rIHNcdTAwRTlwYXJcdTAwRTlcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9Ac3VwYWJhc2UvJykpIHtcbiAgICAgICAgICAgIHJldHVybiAndmVuZG9yLXN1cGFiYXNlJztcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gQ2FydGUgbGVhZmxldCBcdTIwMTQgcmFyZW1lbnQgdXRpbGlzXHUwMEU5ZSwgY2h1bmsgcGFyZXNzZXV4XG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvbGVhZmxldCcpIHx8IGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvcmVhY3QtbGVhZmxldCcpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3ZlbmRvci1tYXAnO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBGcmFtZXItbW90aW9uIFx1MjAxNCBhbmltYXRpb25zLCBub24gY3JpdGlxdWUgYXUgRkNQXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvZnJhbWVyLW1vdGlvbicpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3ZlbmRvci1tb3Rpb24nO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBJY1x1MDBGNG5lcyBsdWNpZGUgXHUyMDE0IHZvbHVtaW5ldXNlcywgaXNvbFx1MDBFOWVzIHBvdXIgdHJlZS1zaGFraW5nIG9wdGltYWxcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9sdWNpZGUtcmVhY3QnKSkge1xuICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3ItaWNvbnMnO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBRUiBjb2RlIFx1MjAxNCB0clx1MDBFOHMgcmFyZW1lbnQgdXRpbGlzXHUwMEU5XG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvcXJjb2RlJykpIHtcbiAgICAgICAgICAgIHJldHVybiAndmVuZG9yLXFyY29kZSc7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBhc3NldEZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdW2V4dG5hbWVdJyxcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdhc3NldHMvW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnYXNzZXRzL1tuYW1lXS1baGFzaF0uanMnLFxuICAgICAgfSxcbiAgICB9LFxuICAgIC8vIEVtcFx1MDBFQWNoZSBsZSBwcmVsb2FkIGF1dG9tYXRpcXVlIGR1IGNodW5rIFN1cGFiYXNlIDogaWwgcmVzdGUgY2hhcmdcdTAwRTlcbiAgICAvLyBkeW5hbWlxdWVtZW50IGF1IHByZW1pZXIgYmVzb2luIChmb2N1cyByZWNoZXJjaGUsIGZldGNoIEhvbWUsIGF1dGgpLlxuICAgIG1vZHVsZVByZWxvYWQ6IHtcbiAgICAgIHJlc29sdmVEZXBlbmRlbmNpZXM6IChfZmlsZW5hbWUsIGRlcHMpID0+XG4gICAgICAgIGRlcHMuZmlsdGVyKChkKSA9PiAhZC5pbmNsdWRlcygndmVuZG9yLXN1cGFiYXNlJykpLFxuICAgIH0sXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiA2MDAsXG4gICAgc291cmNlbWFwOiBmYWxzZSxcbiAgICBtaW5pZnk6ICdlc2J1aWxkJyxcbiAgICB0YXJnZXQ6ICdlc25leHQnLFxuICAgIC8vIFN1cHByaW1lIGNvbnNvbGUubG9nIGV0IGRlYnVnZ2VyIGVuIHByb2R1Y3Rpb25cbiAgICBlc2J1aWxkT3B0aW9uczoge1xuICAgICAgZHJvcDogWydjb25zb2xlJywgJ2RlYnVnZ2VyJ10sXG4gICAgICAvLyBUcmVlLXNoYWtpbmcgYWdyZXNzaWZcbiAgICAgIHRyZWVTaGFraW5nOiB0cnVlLFxuICAgIH0sXG4gICAgLy8gQWN0aXZlciBsZXMgQ1NTIGNvZGUgc3BsaXRzIHBvdXIgbmUgY2hhcmdlciBxdWUgbGVzIHN0eWxlcyBuXHUwMEU5Y2Vzc2FpcmVzXG4gICAgY3NzQ29kZVNwbGl0OiB0cnVlLFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlOLFNBQVMsb0JBQW9CO0FBQ3RQLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFGakIsSUFBTSxtQ0FBbUM7QUFTekMsSUFBTSx1QkFBdUI7QUFBQSxFQUMzQixNQUFNO0FBQUEsRUFDTixtQkFBbUIsTUFBYztBQUMvQixXQUFPLEtBQUs7QUFBQSxNQUNWO0FBQUEsTUFDQSxDQUFDLFVBQWtCO0FBQ2pCLGNBQU0sUUFBUSxNQUFNLE1BQU0seUJBQXlCLFFBQVEsRUFBRTtBQUM3RCxlQUNFLGlDQUFpQyxLQUFLLG9GQUNILEtBQUs7QUFBQSxNQUU1QztBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7QUFFQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxHQUFHLG9CQUFvQjtBQUFBLEVBQ3ZDLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyxjQUFjO0FBQUEsSUFDeEIsU0FBUyxDQUFDLFFBQVE7QUFBQSxFQUNwQjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sS0FBSyxFQUFFLFNBQVMsS0FBSztBQUFBLElBQ3JCLE9BQU8sRUFBRSxZQUFZLE1BQU07QUFBQSxFQUM3QjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sYUFBYSxJQUFJO0FBRWYsY0FBSSxHQUFHLFNBQVMscUJBQXFCLEtBQUssR0FBRyxTQUFTLHlCQUF5QixHQUFHO0FBQ2hGLG1CQUFPO0FBQUEsVUFDVDtBQUNBLGNBQUksR0FBRyxTQUFTLGdDQUFnQyxLQUFLLEdBQUcsU0FBUyw0QkFBNEIsR0FBRztBQUM5RixtQkFBTztBQUFBLFVBQ1Q7QUFFQSxjQUFJLEdBQUcsU0FBUyx5QkFBeUIsR0FBRztBQUMxQyxtQkFBTztBQUFBLFVBQ1Q7QUFFQSxjQUFJLEdBQUcsU0FBUyxzQkFBc0IsS0FBSyxHQUFHLFNBQVMsNEJBQTRCLEdBQUc7QUFDcEYsbUJBQU87QUFBQSxVQUNUO0FBRUEsY0FBSSxHQUFHLFNBQVMsNEJBQTRCLEdBQUc7QUFDN0MsbUJBQU87QUFBQSxVQUNUO0FBRUEsY0FBSSxHQUFHLFNBQVMsMkJBQTJCLEdBQUc7QUFDNUMsbUJBQU87QUFBQSxVQUNUO0FBRUEsY0FBSSxHQUFHLFNBQVMscUJBQXFCLEdBQUc7QUFDdEMsbUJBQU87QUFBQSxVQUNUO0FBQUEsUUFDRjtBQUFBLFFBQ0EsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsTUFDbEI7QUFBQSxJQUNGO0FBQUE7QUFBQTtBQUFBLElBR0EsZUFBZTtBQUFBLE1BQ2IscUJBQXFCLENBQUMsV0FBVyxTQUMvQixLQUFLLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxTQUFTLGlCQUFpQixDQUFDO0FBQUEsSUFDckQ7QUFBQSxJQUNBLHVCQUF1QjtBQUFBLElBQ3ZCLFdBQVc7QUFBQSxJQUNYLFFBQVE7QUFBQSxJQUNSLFFBQVE7QUFBQTtBQUFBLElBRVIsZ0JBQWdCO0FBQUEsTUFDZCxNQUFNLENBQUMsV0FBVyxVQUFVO0FBQUE7QUFBQSxNQUU1QixhQUFhO0FBQUEsSUFDZjtBQUFBO0FBQUEsSUFFQSxjQUFjO0FBQUEsRUFDaEI7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
