import { defineVitestConfig } from 'nuxt-vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineVitestConfig({
  plugins: [vue()],
  test: {
    root: '.',
    setupFiles: ['./test/setup.js'],
    globals: true,
    environment: 'jsdom',
  },
})
