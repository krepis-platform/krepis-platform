// ============================================================================
// Krepis ADaaS Platform - ESLint Configuration (Flat Config)
// ============================================================================
//
// 🎯 Purpose:
// Enforces code quality standards and architectural rules across the monorepo.
// Uses ESLint v9 flat config format.
//
// 🏛️ ADaaS Vision Alignment:
// - Strict TypeScript type checking
// - Import order enforcement for hexagonal architecture
// - Consistent code patterns across all packages
//
// 📐 Hexagonal Architecture Support:
// - Import restrictions enforce layer boundaries
// - No circular dependencies allowed
// - Domain layer must remain pure
// ============================================================================

import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import prettierConfig from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
  // ─────────────────────────────────────────────────────────────────────────
  // Global Ignores
  // ─────────────────────────────────────────────────────────────────────────
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.turbo/**',
      '**/native/**',
      '**/*.d.ts',
      '**/generated/**',
      'eslint.config.js',
      '*.config.js',
      '*.config.ts',
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Base JavaScript Rules
  // ─────────────────────────────────────────────────────────────────────────
  eslint.configs.recommended,

  // ─────────────────────────────────────────────────────────────────────────
  // TypeScript Configuration
  // ─────────────────────────────────────────────────────────────────────────
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json', './packages/*/tsconfig.json', './apps/*/tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      import: importPlugin,
    },
    rules: {
      // ─────────────────────────────────────────────────────────────────────
      // TypeScript Strict Rules
      // ─────────────────────────────────────────────────────────────────────
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
          allowDirectConstAssertionInArrowFunctions: true,
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: true,
          fixStyle: 'separate-type-imports',
        },
      ],
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/no-import-type-side-effects': 'error',

      // ─────────────────────────────────────────────────────────────────────
      // Import Rules (Hexagonal Architecture Enforcement)
      // ─────────────────────────────────────────────────────────────────────
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'index',
            'type',
          ],
          pathGroups: [
            {
              pattern: '@krepis/**',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['type'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-cycle': 'error',
      'import/no-self-import': 'error',
      'import/no-useless-path-segments': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',

      // ─────────────────────────────────────────────────────────────────────
      // General Code Quality
      // ─────────────────────────────────────────────────────────────────────
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-spread': 'error',
      'prefer-rest-params': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      curly: ['error', 'all'],
      'no-throw-literal': 'error',
      'no-return-await': 'off', // Use @typescript-eslint/return-await instead
      '@typescript-eslint/return-await': ['error', 'in-try-catch'],

      // ─────────────────────────────────────────────────────────────────────
      // Krepis-Specific Rules (Result<T, E> Pattern)
      // ─────────────────────────────────────────────────────────────────────
      // Discourage throw in favor of Result pattern (soft warning)
      'no-throw-literal': 'warn',
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['./tsconfig.json'],
        },
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Test Files Configuration
  // ─────────────────────────────────────────────────────────────────────────
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '**/tests/**/*.ts', '**/__tests__/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      'no-console': 'off',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Prettier Compatibility (must be last)
  // ─────────────────────────────────────────────────────────────────────────
  prettierConfig,
];
