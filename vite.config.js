import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
   plugins: [react({
    jsxRuntime: 'automatic' // ensures JSX works without import React
  })],
  base: '/Elnara-EGC-Glow-Corner/',
})
