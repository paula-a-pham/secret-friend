import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

/** Inline CSS <link> tags as <style> blocks to eliminate render-blocking requests. */
function inlineCssPlugin() {
  return {
    name: 'vite-plugin-inline-css',
    enforce: 'post',
    apply: 'build',
    generateBundle(_, bundle) {
      const htmlEntry = Object.values(bundle).find(
        (c) => c.fileName === 'index.html' && c.type === 'asset',
      )
      if (!htmlEntry) return

      let html =
        typeof htmlEntry.source === 'string'
          ? htmlEntry.source
          : new TextDecoder().decode(htmlEntry.source)

      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type !== 'asset' || !fileName.endsWith('.css')) continue
        const css =
          typeof chunk.source === 'string'
            ? chunk.source
            : new TextDecoder().decode(chunk.source)
        const escaped = fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const re = new RegExp(`<link[^>]*href="/?${escaped}"[^>]*/?>`)
        if (re.test(html)) {
          html = html.replace(re, `<style>${css}</style>`)
          delete bundle[fileName]
        }
      }

      htmlEntry.source = html
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Secret Friend',
        short_name: 'SecretFriend',
        description: 'A fun gift-exchange game for groups',
        theme_color: '#e11d48',
        background_color: '#fff1f2',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api/],
      },
    }),
    inlineCssPlugin(),
  ],
  build: {
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'vendor'
          }
        },
      },
    },
  },
})
