/// <reference types="vitest" />
import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { generateThemeCss } from "./src/shared/theme/themeCss";

// Serves the generated theme/event CSS variable blocks (built from the single
// source in src/shared/theme/themePalettes.ts) as `virtual:theme.css`. Vite watches
// the config's imports, so editing the palettes restarts dev and regenerates.
function themeCssPlugin() {
  const virtualId = "virtual:theme.css";
  const resolvedId = "\0" + virtualId;
  return {
    name: "theme-css",
    resolveId(id: string) {
      if (id === virtualId) return resolvedId;
    },
    load(id: string) {
      if (id === resolvedId) return generateThemeCss();
    },
  };
}

// Full config options: https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), themeCssPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "lucide-react": path.resolve(
        __dirname,
        "src/shared/ui/icons/cozyIcons.tsx",
      ),
    },
  },

  // PERFORMANCE: Build optimizations
  build: {
    // Target modern browsers for smaller bundles
    target: "es2020",

    // Enable minification (Vite 8 uses the built-in oxc minifier; esbuild is
    // no longer bundled and would need to be installed separately).
    minify: "oxc",

    // Code splitting for better caching. Vite 8 (Rolldown) dropped the object
    // form of manualChunks, so we group vendors with the function form instead.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          // React Router first - its path also contains "react".
          if (/[\\/]react-router/.test(id)) return "router";
          // TanStack Query - data fetching
          if (/[\\/]@tanstack[\\/]/.test(id)) return "query";
          // Motion - large animation library (motion, motion-dom, motion-utils)
          if (/[\\/]motion(-dom|-utils)?[\\/]/.test(id)) return "motion";
          // React core - rarely changes
          if (/[\\/](react|react-dom|scheduler)[\\/]/.test(id))
            return "react-vendor";
        },
      },
    },

    // Disable source maps for production to reduce bundle size
    sourcemap: false,

    // Inline assets smaller than 4kb
    assetsInlineLimit: 4096,
  },

  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://api.mogtome.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        secure: true,
      },
      "/eventsHub": {
        target: "https://api.mogtome.com",
        changeOrigin: true,
        secure: true,
        ws: true, // Enable WebSocket proxying for SignalR
      },
    },
  },

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/shared/test/setup.ts",
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/shared/test/",
        "**/*.d.ts",
        "src/app/main.tsx",
        "src/vite-env.d.ts",
      ],
    },
  },
});
