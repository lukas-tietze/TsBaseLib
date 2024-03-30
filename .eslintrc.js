module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:jsdoc/recommended-typescript'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jsdoc'],
  root: true,
  overrides: [],
  rules: {
    'jsdoc/require-param-type': 0,
  },
};
