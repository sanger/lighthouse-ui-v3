import { config } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'

vi.mock('#app', () => {
  return {
    navigateTo: vi.fn(),
    useFetch: vi.fn(),
    useRuntimeConfig: vi.fn().mockReturnValue({
      lighthouseBaseURL: 'http://lighthouseBaseURL',
      lighthouseApiKey: 'lighthouse-api-key',
      labwhereBaseURL: 'http://labwhereBaseURL',
      sequencescapeBaseURL: 'http://sequencescapeBaseURL',
      sprintBaseURL: 'http://sprintBaseURL',
      baracodaBaseURL: 'http://baracodaBaseURL',

      appTagline: 'Test Tagline',
      destinationPlateBarcodesGroup: 'VI',
      projectAcronym: 'TEST',
      asynchronous: 'false',
      projectId: '5',
      studyId: '10',
      printers: 'a,b,c',
      uatActions: 'true',
      bioseroCherrypick: 'true',
    }),
  }
})

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
