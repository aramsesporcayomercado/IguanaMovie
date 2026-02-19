// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png', 'favicon.ico'],
      manifest: {
        name: 'IguanaMovie — Tu Cine Personal',
        short_name: 'IguanaMovie',
        description: 'Descubre, busca y guarda tus películas favoritas. Funciona offline.',
        theme_color: '#0d0d1a',
        background_color: '#0d0d1a',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        lang: 'es',
        icons: [
          { src: 'icons/icon-72.png',  sizes: '72x72',  type: 'image/png', purpose: 'any maskable' },
          { src: 'icons/icon-96.png',  sizes: '96x96',  type: 'image/png', purpose: 'any maskable' },
          { src: 'icons/icon-128.png', sizes: '128x128',type: 'image/png', purpose: 'any maskable' },
          { src: 'icons/icon-192.png', sizes: '192x192',type: 'image/png', purpose: 'any maskable' },
          { src: 'icons/icon-512.png', sizes: '512x512',type: 'image/png', purpose: 'any maskable' },
        ],
        shortcuts: [
          { name: 'Tendencias', url: '/?section=trending',  description: 'Ver películas en tendencia' },
          { name: 'Favoritas',  url: '/?section=favorites', description: 'Mis películas guardadas' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/image\.tmdb\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'tmdb-images',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/api\.themoviedb\.org\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'tmdb-api',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 6 },
              cacheableResponse: { statuses: [0, 200] },
              networkTimeoutSeconds: 8,
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
})