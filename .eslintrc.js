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
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
  },
}
