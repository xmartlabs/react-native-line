import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import parser from '@typescript-eslint/parser'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import sortKeysFix from 'eslint-plugin-sort-keys-fix'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  allConfig: js.configs.all,
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
})

export default [
  {
    ignores: ['**/*.d.*', '**/*.js', 'android/', 'ios/', 'node_modules/'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ),
  {
    languageOptions: {
      ecmaVersion: 14,
      globals: {},
      parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      sourceType: 'script',
    },

    plugins: {
      '@typescript-eslint': typescriptEslint,
      'simple-import-sort': simpleImportSort,
      'sort-keys-fix': sortKeysFix,
    },

    rules: {
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': ['warn', { allow: ['error'] }],
      'no-duplicate-imports': ['error', { includeExports: true }],
      'simple-import-sort/imports': 'error',
      'sort-keys-fix/sort-keys-fix': 'error',
    },
  },
]
