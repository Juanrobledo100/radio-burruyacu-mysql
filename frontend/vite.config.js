import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendTarget = env.VITE_API || 'http://localhost:5000'

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: false
        },
        includeAssets: ['favicon.svg', 'logo-radio.jpg', 'logo-radio-180.png'],
        manifest: {
          name: 'Radio Del Rosario 100.7 FM',
          short_name: 'Radio Rosario',
          description: 'Radio Del Rosario 100.7 FM en vivo',
          lang: 'es',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          theme_color: '#000000',
          background_color: '#000000',
          icons: [
            {
              src: '/logo-radio-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: '/logo-radio-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        }
      })
    ],
    server: {
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true
        },
        '/uploads': {
          target: backendTarget,
          changeOrigin: true
        }
      }
    }
  }
})
