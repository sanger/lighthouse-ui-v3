module.exports = {
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:nuxt/recommended',
    'plugin:vue/vue3-recommended',
    'prettier', // Need to be near last. https://github.com/prettier/eslint-config-prettier#installation
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  rules: {
    'no-undef': 'off', // Nuxt 3 uses auto-imports
    'prefer-const': 'error',
    'vue/multi-word-component-names': [
      'error',
      {
        ignores: ['imports', 'health', 'index', 'reports'], // These are page names
      },
    ],
  },
}
