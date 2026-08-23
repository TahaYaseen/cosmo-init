import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // development-plan.md §2.4 Lint/Formatter Rules
      // (react-hooks/exhaustive-deps is already set to "error" by
      // eslint-config-next/core-web-vitals, which registers the plugin.)
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': 'warn',
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'coverage/**',
    'playwright-report/**',
    'src/app/(payload)/admin/importMap.js',
  ]),
]);

export default eslintConfig;
