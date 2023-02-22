import { defineVitestConfig } from 'nuxt-vitest/config'

export default defineVitestConfig({
  test: {
    root: '.',
    setupFiles: ['./test/no_stubs.js'],
    globals: true,
    environment: 'jsdom',
  },
})
