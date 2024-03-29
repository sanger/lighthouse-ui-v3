import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'url'
import VueI18nVitePlugin from '@intlify/unplugin-vue-i18n/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: `${process.env.NUXT_PUBLIC_APP_TITLE || 'App Title'} ${
        process.env.NUXT_PUBLIC_APP_TAGLINE?.toUpperCase() || 'TAGLINE'
      }`,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: process.env.npm_package_description || '',
        },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
  css: ['bootstrap/dist/css/bootstrap.min.css'],
  modules: ['nuxt-vitest', '@bootstrap-vue-next/nuxt'],
  runtimeConfig: {
    public: {
      // TODO: Make values in this section private by moving them out to the root level of this runtimeConfig.
      //       This can only be done when the ssr value below can be set to true.
      lighthouseBaseURL: 'http://lighthouse',
      lighthouseApiKey: 'lighthouse_ui_read_write_dev',
      labwhereBaseURL: 'http://labwhere',
      sequencescapeBaseURL: 'http://sequencescape',
      sprintBaseURL: 'http://sprint',
      baracodaBaseURL: 'http://baracoda',

      appTitle: 'Title',
      appTagline: 'Tagline',
      destinationPlateBarcodesGroup: '',
      projectAcronym: '',
      asynchronous: '',
      projectId: '',
      studyId: '',
      printers: 'a,b,c',
      enabledNavItems: 'box_buster',
    },
  },
  ssr: false, // Client-side rendering only because of limitations in bootstrap-vue-next
  vite: {
    plugins: [
      VueI18nVitePlugin({
        include: [resolve(dirname(fileURLToPath(import.meta.url)), './locales/*.json')],
      }),
    ],
  },
})
