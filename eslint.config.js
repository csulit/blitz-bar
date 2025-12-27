//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  {
    ignores: ['.output/**', '.vinxi/**'],
  },
  ...tanstackConfig,
  // Relaxed rules for shadcn/ui components which have different patterns
  {
    files: ['src/components/ui/**/*.tsx'],
    rules: {
      'no-shadow': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
    },
  },
]
