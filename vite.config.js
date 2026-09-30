import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // same /ingest → PostHog proxy that vercel.json does in production
  server: {
    proxy: {
      '/ingest/static': {
        target: 'https://us-assets.i.posthog.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/ingest/, ''),
      },
      '/ingest': {
        target: 'https://us.i.posthog.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/ingest/, ''),
      },
    },
  },
  define: {
    // the footer's "Last updated" line
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
})
