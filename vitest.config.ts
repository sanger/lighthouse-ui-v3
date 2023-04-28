import { defineVitestConfig } from 'nuxt-vitest/config'

export default defineVitestConfig({
  test: {
    root: '.',
    setupFiles: ['./test/setup.js'],
    globals: true,
    environment: 'jsdom',
  },
})
