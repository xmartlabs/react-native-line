import parser from '@typescript-eslint/parser'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import sortKeysFix from 'eslint-plugin-sort-keys-fix'
import tseslint from 'typescript-eslint'

export default [
  { ignores: ['**/*.d.*', '**/*.js', 'android', 'ios', 'node_modules'] },
  { files: ['**/*.ts', '**/*.tsx'] },
  {
    languageOptions: {
      globals: {},
      parser,
      parserOptions: { ecmaFeatures: { jsx: true } },
      sourceType: 'script',
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
      'sort-keys-fix': sortKeysFix,
    },
    rules: {
      'no-console': ['warn', { allow: ['error'] }],
      'no-duplicate-imports': ['error', { includeExports: true }],
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': 'error',
      'sort-keys-fix/sort-keys-fix': 'error',
    },
  },
  ...tseslint.configs.recommended,
]
