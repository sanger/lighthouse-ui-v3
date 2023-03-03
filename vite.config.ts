import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'url'
import VueI18nVitePlugin from '@intlify/unplugin-vue-i18n/vite'

export default defineConfig({
  plugins: [
    {
      ...vue(),
      apply: (config) => {
        return config.mode === 'test'
      },
    },
    VueI18nVitePlugin({
      include: [resolve(dirname(fileURLToPath(import.meta.url)), './locales/*.json')],
    }),
  ],
})
