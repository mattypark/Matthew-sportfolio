import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    // the footer's "Last updated" line
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
})
