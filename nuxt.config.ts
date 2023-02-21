// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Lighthouse',
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
  modules: [
    'nuxt-vitest',
    'bootstrap-vue-next/nuxt',
  ],
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

      asynchronous: '',
      projectId: '',
      studyId: '',
      printers: 'a,b,c',
      uatActions: 'false',
      bioseroCherrypick: 'false',
    },
  },
  ssr: false, // Client-side rendering only because of limitations in bootstrap-vue-next
})
