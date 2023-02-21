import { defineVitestConfig } from 'nuxt-vitest/config'

export default defineVitestConfig({
  test: {
    root: '.',
    globals: true,
    environment: "jsdom",
  },
})
