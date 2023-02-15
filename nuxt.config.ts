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
    'nuxt-vitest'
  ],
  runtimeConfig: {
    lighthouseBaseURL: '/lighthouse',
    lighthouseApiKey: process.env.LIGHTHOUSE_API_KEY || 'lighthouse_ui_read_write_dev',
    labwhereBaseURL: process.env.LABWHERE_BASE_URL || 'http://labwhere',
    sequencescapeBaseURL: process.env.SEQUENCESCAPE_BASE_URL || 'http://sequencescape',
    sprintBaseURL: process.env.SPRINT_BASE_URL || 'http://sprint',
    baracodaBaseURL: process.env.BARACODA_BASE_URL || 'http://baracoda',
    public: {
      asynchronous: process.env.ASYNCHRONOUS,
      projectId: process.env.PROJECT_ID,
      studyId: process.env.STUDY_ID,
      printers: process.env.PRINTERS || 'a,b,c',
      uatActions: process.env.FEATURE_FLAG_UAT_ACTIONS,
      bioseroCherrypick: process.env.FEATURE_FLAG_BIOSERO_CHERRYPICK,
    },
  },
})
