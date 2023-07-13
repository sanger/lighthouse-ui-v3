import { defineVitestConfig } from 'nuxt-vitest/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        domEnvironment: 'jsdom'
      }
    },
    globals: true,
    root: '.',
    setupFiles: ['./test/setup.js'],
  }
})
