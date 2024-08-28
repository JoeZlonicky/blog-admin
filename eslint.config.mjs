import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('./', import.meta.url));
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  ...compat.extends('@vue/eslint-config-typescript/recommended'),
  ...compat.extends('@vue/eslint-config-prettier/skip-formatting'),

  {
    rules: {
      eqeqeq: 'error',
      'prefer-const': 'error',
    },
  },
];
