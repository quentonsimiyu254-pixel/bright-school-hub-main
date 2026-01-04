import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // We removed lovable-tagger from here to fix the "Cannot find module" error
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-data-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24,
              },
            },
          },
        ],
      },
      manifest: {
        name: 'Edusphere Intelligent OS',
        short_name: 'Edusphere',
        description: 'Predictive School Infrastructure Built for Africa',
        theme_color: '#05070A',
        background_color: '#05070A',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/og-image.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/og-image.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));