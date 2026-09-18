import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Registration is done manually via virtual:pwa-register/react
      // (see src/pwa/useAppUpdate.js), so no auto-injected register script.
      injectRegister: false,
      registerType: 'prompt',
      devOptions: { enabled: true, type: 'module' },
      workbox: {
        // Without this, navigations bypass the SW and always hit the network
        // directly — which makes "check for updates" meaningless once this is
        // deployed behind a host/CDN that caches HTML. Precaching the shell
        // and falling back to it here is what makes the update check (and an
        // offline-installed app) actually reflect what's been fetched.
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: 'WhoYouAre',
        short_name: 'WhoYouAre',
        description: 'A guide to roleplaying as the character you feel like today.',
        theme_color: '#6C4CE0',
        background_color: '#FAF8FF',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
    }),
  ],
})
