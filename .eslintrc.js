module.exports = {
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'prettier', // Need to be near last. https://github.com/prettier/eslint-config-prettier#installation
  ],
  rules: {
    'no-undef': ['off'], // Nuxt 3 uses auto-imports
    'vue/multi-word-component-names': [
      'error',
      {
        ignores: ['imports', 'index', 'reports'], // These are page names
      },
    ],
  },
}
