module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: ['babel-preset-expo'],
    },
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  globals: {
    require: 'readonly',
    module: 'readonly',
    __dirname: 'readonly',
    global: 'readonly',
    fetch: 'readonly',
  },
  plugins: ['react', 'react-hooks', 'react-native'],
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
  settings: { react: { version: 'detect' } },
  rules: {
    'no-unused-vars': ['warn', { args: 'none' }],
    'react/prop-types': 'off',
    'react/no-unescaped-entities': 'off',
    'react/display-name': 'off',
    'no-undef': 'error',
  },
};
