import parser from '@typescript-eslint/parser'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import simpleKeySort from 'eslint-plugin-simple-key-sort'
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
      'simple-key-sort': simpleKeySort,
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
      'simple-key-sort/sort': 'error',
    },
  },
  ...tseslint.configs.recommended,
]
