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
        return `<link rel="preload" as="style" fetchpriority="low"${attrs} onload="this.onload=null;this.rel='stylesheet'"><noscript><link rel="stylesheet"${attrs}></noscript>`;
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
    cssCodeSplit: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuLyoqXG4gKiBSZW5kIGxlIDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIj4gZ1x1MDBFOW5cdTAwRTlyXHUwMEU5IHBhciBWaXRlIG5vbiBibG9xdWFudCB2aWEgbGEgdGVjaG5pcXVlXG4gKiBwcmVsb2FkICsgb25sb2FkIHN3YXAuIExlIENTUyBjcml0aXF1ZSBkdSBIZXJvIGVzdCBpbmxpbmUgZGFucyBpbmRleC5odG1sLFxuICogZG9uYyBsJ2FmZmljaGFnZSBpbml0aWFsIHJlc3RlIGNvcnJlY3QgYXZhbnQgcXVlIGxhIGZldWlsbGUgY29tcGxcdTAwRTh0ZSBuJ2Fycml2ZS5cbiAqL1xuY29uc3Qgbm9uQmxvY2tpbmdDc3NQbHVnaW4gPSB7XG4gIG5hbWU6ICdub24tYmxvY2tpbmctY3NzJyxcbiAgdHJhbnNmb3JtSW5kZXhIdG1sKGh0bWw6IHN0cmluZykge1xuICAgIHJldHVybiBodG1sLnJlcGxhY2UoXG4gICAgICAvPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiKFtePl0qPyk+L2csXG4gICAgICAobWF0Y2g6IHN0cmluZykgPT4ge1xuICAgICAgICBjb25zdCBhdHRycyA9IG1hdGNoLnNsaWNlKCc8bGluayByZWw9XCJzdHlsZXNoZWV0XCInLmxlbmd0aCwgLTEpO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIGA8bGluayByZWw9XCJwcmVsb2FkXCIgYXM9XCJzdHlsZVwiIGZldGNocHJpb3JpdHk9XCJsb3dcIiR7YXR0cnN9IG9ubG9hZD1cInRoaXMub25sb2FkPW51bGw7dGhpcy5yZWw9J3N0eWxlc2hlZXQnXCI+YCArXG4gICAgICAgICAgYDxub3NjcmlwdD48bGluayByZWw9XCJzdHlsZXNoZWV0XCIke2F0dHJzfT48L25vc2NyaXB0PmBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICApO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCksIG5vbkJsb2NraW5nQ3NzUGx1Z2luXSxcbiAgZXNidWlsZDoge1xuICAgIGRyb3A6IFsnY29uc29sZScsICdkZWJ1Z2dlciddLFxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgfSxcbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgZXhjbHVkZTogWydsdWNpZGUtcmVhY3QnXSxcbiAgICBpbmNsdWRlOiBbJ2Nvb2tpZSddLFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBobXI6IHsgb3ZlcmxheTogdHJ1ZSB9LFxuICAgIHdhdGNoOiB7IHVzZVBvbGxpbmc6IGZhbHNlIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rcyhpZCkge1xuICAgICAgICAgIC8vIENvbnRleHRlcyBSZWFjdCBnbG9iYXV4IDogRE9JVkVOVCByZXN0ZXIgZGFucyBsZSBjaHVuayBwcmluY2lwYWxcbiAgICAgICAgICAvLyAobCdlbnRyXHUwMEU5ZSksIHNpbm9uIHVuIGxhenkgY2h1bmsgcG91cnJhaXQgaW1wb3J0ZXIgdW5lIHNlY29uZGUgY29waWVcbiAgICAgICAgICAvLyBkdSBtb2R1bGUgZXQgb2J0ZW5pciB1biBTeW1ib2wgZGlzdGluY3QgZGUgY2VsdWkgZHUgUHJvdmlkZXIsXG4gICAgICAgICAgLy8gcHJvdm9xdWFudCBcdTAwQUIgdXNlTGFuZ3VhZ2UgbXVzdCBiZSB1c2VkIHdpdGhpbiBMYW5ndWFnZVByb3ZpZGVyIFx1MDBCQi5cbiAgICAgICAgICAvLyBSZXRvdXJuZXIgdW5kZWZpbmVkIGdhcmRlIGNlcyBtb2R1bGVzIGRhbnMgbCdlbnRyeSBjaHVuay5cbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJy9zcmMvY29udGV4dC8nKSkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gQmlibGlvdGhcdTAwRThxdWVzIGNyaXRpcXVlcyBhdSBkXHUwMEU5bWFycmFnZSBcdTIwMTQgY2h1bmsgZFx1MDBFOWRpXHUwMEU5IHBvdXIgbGUgY2FjaGUgbG9uZyB0ZXJtZVxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL3JlYWN0LycpIHx8IGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvcmVhY3QtZG9tLycpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3ZlbmRvci1yZWFjdCc7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL3JlYWN0LXJvdXRlci1kb20vJykgfHwgaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9yZWFjdC1yb3V0ZXIvJykpIHtcbiAgICAgICAgICAgIHJldHVybiAndmVuZG9yLXJvdXRlcic7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIFN1cGFiYXNlIGNoYXJnXHUwMEU5IGRlIGZhXHUwMEU3b24gYXN5bmNocm9uZSBcdTIwMTQgY2h1bmsgc1x1MDBFOXBhclx1MDBFOVxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL0BzdXBhYmFzZS8nKSkge1xuICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3Itc3VwYWJhc2UnO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBDYXJ0ZSBsZWFmbGV0IFx1MjAxNCByYXJlbWVudCB1dGlsaXNcdTAwRTllLCBjaHVuayBwYXJlc3NldXhcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9sZWFmbGV0JykgfHwgaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9yZWFjdC1sZWFmbGV0JykpIHtcbiAgICAgICAgICAgIHJldHVybiAndmVuZG9yLW1hcCc7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIEZyYW1lci1tb3Rpb24gXHUyMDE0IGFuaW1hdGlvbnMsIG5vbiBjcml0aXF1ZSBhdSBGQ1BcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9mcmFtZXItbW90aW9uJykpIHtcbiAgICAgICAgICAgIHJldHVybiAndmVuZG9yLW1vdGlvbic7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIEljXHUwMEY0bmVzIGx1Y2lkZSBcdTIwMTQgdm9sdW1pbmV1c2VzLCBpc29sXHUwMEU5ZXMgcG91ciB0cmVlLXNoYWtpbmcgb3B0aW1hbFxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL2x1Y2lkZS1yZWFjdCcpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3ZlbmRvci1pY29ucyc7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIFFSIGNvZGUgXHUyMDE0IHRyXHUwMEU4cyByYXJlbWVudCB1dGlsaXNcdTAwRTlcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9xcmNvZGUnKSkge1xuICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3ItcXJjb2RlJztcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiAnYXNzZXRzL1tuYW1lXS1baGFzaF1bZXh0bmFtZV0nLFxuICAgICAgICBjaHVua0ZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdLmpzJyxcbiAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdhc3NldHMvW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICB9LFxuICAgIH0sXG4gICAgLy8gRW1wXHUwMEVBY2hlIGxlIHByZWxvYWQgYXV0b21hdGlxdWUgZHUgY2h1bmsgU3VwYWJhc2UgOiBpbCByZXN0ZSBjaGFyZ1x1MDBFOVxuICAgIC8vIGR5bmFtaXF1ZW1lbnQgYXUgcHJlbWllciBiZXNvaW4gKGZvY3VzIHJlY2hlcmNoZSwgZmV0Y2ggSG9tZSwgYXV0aCkuXG4gICAgbW9kdWxlUHJlbG9hZDoge1xuICAgICAgcmVzb2x2ZURlcGVuZGVuY2llczogKF9maWxlbmFtZSwgZGVwcykgPT5cbiAgICAgICAgZGVwcy5maWx0ZXIoKGQpID0+ICFkLmluY2x1ZGVzKCd2ZW5kb3Itc3VwYWJhc2UnKSksXG4gICAgfSxcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDYwMCxcbiAgICBzb3VyY2VtYXA6IGZhbHNlLFxuICAgIG1pbmlmeTogJ2VzYnVpbGQnLFxuICAgIHRhcmdldDogJ2VzbmV4dCcsXG4gICAgY3NzQ29kZVNwbGl0OiB0cnVlLFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlOLFNBQVMsb0JBQW9CO0FBQ3RQLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFGakIsSUFBTSxtQ0FBbUM7QUFTekMsSUFBTSx1QkFBdUI7QUFBQSxFQUMzQixNQUFNO0FBQUEsRUFDTixtQkFBbUIsTUFBYztBQUMvQixXQUFPLEtBQUs7QUFBQSxNQUNWO0FBQUEsTUFDQSxDQUFDLFVBQWtCO0FBQ2pCLGNBQU0sUUFBUSxNQUFNLE1BQU0seUJBQXlCLFFBQVEsRUFBRTtBQUM3RCxlQUNFLHFEQUFxRCxLQUFLLG9GQUN2QixLQUFLO0FBQUEsTUFFNUM7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGO0FBRUEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sR0FBRyxvQkFBb0I7QUFBQSxFQUN2QyxTQUFTO0FBQUEsSUFDUCxNQUFNLENBQUMsV0FBVyxVQUFVO0FBQUEsRUFDOUI7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyxjQUFjO0FBQUEsSUFDeEIsU0FBUyxDQUFDLFFBQVE7QUFBQSxFQUNwQjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sS0FBSyxFQUFFLFNBQVMsS0FBSztBQUFBLElBQ3JCLE9BQU8sRUFBRSxZQUFZLE1BQU07QUFBQSxFQUM3QjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sYUFBYSxJQUFJO0FBTWYsY0FBSSxHQUFHLFNBQVMsZUFBZSxHQUFHO0FBQ2hDLG1CQUFPO0FBQUEsVUFDVDtBQUVBLGNBQUksR0FBRyxTQUFTLHFCQUFxQixLQUFLLEdBQUcsU0FBUyx5QkFBeUIsR0FBRztBQUNoRixtQkFBTztBQUFBLFVBQ1Q7QUFDQSxjQUFJLEdBQUcsU0FBUyxnQ0FBZ0MsS0FBSyxHQUFHLFNBQVMsNEJBQTRCLEdBQUc7QUFDOUYsbUJBQU87QUFBQSxVQUNUO0FBRUEsY0FBSSxHQUFHLFNBQVMseUJBQXlCLEdBQUc7QUFDMUMsbUJBQU87QUFBQSxVQUNUO0FBRUEsY0FBSSxHQUFHLFNBQVMsc0JBQXNCLEtBQUssR0FBRyxTQUFTLDRCQUE0QixHQUFHO0FBQ3BGLG1CQUFPO0FBQUEsVUFDVDtBQUVBLGNBQUksR0FBRyxTQUFTLDRCQUE0QixHQUFHO0FBQzdDLG1CQUFPO0FBQUEsVUFDVDtBQUVBLGNBQUksR0FBRyxTQUFTLDJCQUEyQixHQUFHO0FBQzVDLG1CQUFPO0FBQUEsVUFDVDtBQUVBLGNBQUksR0FBRyxTQUFTLHFCQUFxQixHQUFHO0FBQ3RDLG1CQUFPO0FBQUEsVUFDVDtBQUFBLFFBQ0Y7QUFBQSxRQUNBLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRjtBQUFBO0FBQUE7QUFBQSxJQUdBLGVBQWU7QUFBQSxNQUNiLHFCQUFxQixDQUFDLFdBQVcsU0FDL0IsS0FBSyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsU0FBUyxpQkFBaUIsQ0FBQztBQUFBLElBQ3JEO0FBQUEsSUFDQSx1QkFBdUI7QUFBQSxJQUN2QixXQUFXO0FBQUEsSUFDWCxRQUFRO0FBQUEsSUFDUixRQUFRO0FBQUEsSUFDUixjQUFjO0FBQUEsRUFDaEI7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
