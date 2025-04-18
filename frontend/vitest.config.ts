import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './__tests__/testSetup.js',
    exclude: ['./node_modules/'],
  },
})
