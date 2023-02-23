import { config } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'en',
  messages: {
    en,
  },
})

config.global.plugins = [i18n]
config.global.stubs = { transition: false }
