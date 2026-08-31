import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  base: '/launch/',
  plugins: [react(), svgr()],
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.json'],
  },
  build: {
    outDir: 'build',
  },
  server: {
    port: 3000,
  },
  test: {
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        url: 'http://localhost:3000/launch/',
      },
    },
    globals: true,
    setupFiles: ['./src/testSetup.js'],
    snapshotFormat: {
      printBasicPrototype: true,
    },
  },
})
