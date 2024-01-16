
const fs = require('fs')
const path = require('path')

const prettierOptions = JSON.parse(fs.readFileSync(path.resolve(__dirname, '.prettierrc.json'), 'utf8'));

module.exports = {
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:react/jsx-runtime', 'plugin:react-hooks/recommended', 'prettier'],
  plugins: ['prettier', 'react', 'react-hooks'],
  ignorePatterns: ['dist', 'node_modules', '.eslintrc.cjs'],
  rules: {
    'prettier/prettier': ['error', prettierOptions],
  },
  overrides: [
    {
      files: ['**/*.js?(x)', '**/*.html'],
      rules: { 'prettier/prettier': ['warn', prettierOptions] },
    },
  ],
};
