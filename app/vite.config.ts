import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './',
  define: { __BUILD__: JSON.stringify(new Date().toISOString().slice(0, 16).replace('T', ' ')) },
  resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false, // registered in main.tsx so a new version reloads the page
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Fiesta Gas Delivery (prototype)',
        short_name: 'Fiesta Gas',
        description: 'LPG ordering, delivery and refill reminders: clickable prototype',
        theme_color: '#0b2a57',
        background_color: '#f3f5f9',
        display: 'standalone',
        start_url: './',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      // Cache map tiles at runtime so previously viewed areas work offline.
      workbox: { runtimeCaching: [{ urlPattern: /^https:\/\/tile\.openstreetmap\.org\/.*/, handler: 'CacheFirst', options: { cacheName: 'osm-tiles', expiration: { maxEntries: 300 } } }] },
    }),
  ],
})
