import parser from '@typescript-eslint/parser'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import simpleSortKeys from 'eslint-plugin-simple-sort-keys'
import tseslint from 'typescript-eslint'

export default [
  { ignores: ['**/*.d.*', '**/*.js', 'dist', 'node_modules'] },
  { files: ['**/*.ts', '**/*.tsx'] },
  {
    languageOptions: {
      parser,
      parserOptions: { ecmaFeatures: { jsx: true } },
      sourceType: 'script',
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
      'simple-sort-keys': simpleSortKeys,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-console': ['warn', { allow: ['error', 'info'] }],
      'no-duplicate-imports': ['error', { includeExports: true }],
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': 'error',
      'simple-sort-keys/sort': 'error',
    },
  },
  ...tseslint.configs.recommended,
]
