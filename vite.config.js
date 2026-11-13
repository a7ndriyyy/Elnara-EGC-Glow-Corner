
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves the site from /Elnara-EGC-Glow-Corner/, Vercel from the
// domain root. Vercel sets VERCEL=1 during its build, so pick the right base.
const base = process.env.VERCEL ? '/' : '/Elnara-EGC-Glow-Corner/'

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
  ],
  base,
})
