/// <reference types="vitest" />
import path from 'node:path'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { generateThemeCss } from './src/styles/themeCss'

// Serves the generated theme/event CSS variable blocks (built from the single
// source in src/styles/themePalettes.ts) as `virtual:theme.css`. Vite watches the
// config's imports, so editing the palettes restarts dev and regenerates.
function themeCssPlugin() {
  const virtualId = 'virtual:theme.css'
  const resolvedId = '\0' + virtualId
  return {
    name: 'theme-css',
    resolveId(id: string) {
      if (id === virtualId) return resolvedId
    },
    load(id: string) {
      if (id === resolvedId) return generateThemeCss()
    },
  }
}

// Full config options: https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), themeCssPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'lucide-react': path.resolve(__dirname, 'src/shared/ui/icons/cozyIcons.tsx'),
    },
  },
  
  // PERFORMANCE: Build optimizations
  build: {
    // Target modern browsers for smaller bundles
    target: 'es2020',
    
    // Enable minification
    minify: 'esbuild',
    
    // Code splitting for better caching
    rollupOptions: {
      output: {
        // Split vendor chunks for better caching
        manualChunks: {
          // React core - rarely changes
          'react-vendor': ['react', 'react-dom'],
          // React Router - separate chunk
          'router': ['react-router-dom'],
          // TanStack Query - data fetching
          'query': ['@tanstack/react-query'],
          // Framer Motion - large animation library
          'motion': ['motion'],
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
      '/api': {
        target: 'https://api.mogtome.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: true,
      },
      '/eventsHub': {
        target: 'https://api.mogtome.com',
        changeOrigin: true,
        secure: true,
        ws: true, // Enable WebSocket proxying for SignalR
      },
    },
  },
  
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        'src/main.tsx',
        'src/vite-env.d.ts',
      ],
    },
  },
})
