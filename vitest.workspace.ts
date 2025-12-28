// ============================================================================
// Krepis ADaaS Platform - Vitest Workspace Configuration
// ============================================================================
//
// 🎯 Purpose:
// Enables parallel test execution across all workspace packages.
// Each package can have its own vitest.config.ts that extends this configuration.
//
// 🏛️ ADaaS Vision Alignment:
// - Isolated test environments per package
// - Parallel execution for CI/CD efficiency
// - Package-specific configurations when needed
// ============================================================================

import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  // ─────────────────────────────────────────────────────────────────────────────
  // Core Packages
  // ─────────────────────────────────────────────────────────────────────────────
  {
    extends: './vitest.config.ts',
    test: {
      name: '@krepis/core',
      root: './packages/core',
      include: ['src/**/*.{test,spec}.ts', '__tests__/**/*.{test,spec}.ts'],
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: '@krepis/shared',
      root: './packages/shared',
      include: ['src/**/*.{test,spec}.ts', '__tests__/**/*.{test,spec}.ts'],
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: '@krepis/resilience',
      root: './packages/resilience',
      include: ['src/**/*.{test,spec}.ts', '__tests__/**/*.{test,spec}.ts'],
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: '@krepis/config',
      root: './packages/config',
      include: ['src/**/*.{test,spec}.ts', '__tests__/**/*.{test,spec}.ts'],
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: '@krepis/cache',
      root: './packages/cache',
      include: ['src/**/*.{test,spec}.ts', '__tests__/**/*.{test,spec}.ts'],
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: '@krepis/cli',
      root: './packages/cli',
      include: ['src/**/*.{test,spec}.ts', '__tests__/**/*.{test,spec}.ts'],
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: '@krepis/testing',
      root: './packages/testing',
      include: ['src/**/*.{test,spec}.ts', '__tests__/**/*.{test,spec}.ts'],
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Adapter Packages
  // ─────────────────────────────────────────────────────────────────────────────
  {
    extends: './vitest.config.ts',
    test: {
      name: '@krepis/adapter-prisma',
      root: './packages/adapter-prisma',
      include: ['src/**/*.{test,spec}.ts', '__tests__/**/*.{test,spec}.ts'],
      // Integration tests may need longer timeout
      testTimeout: 60000,
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: '@krepis/adapter-redis',
      root: './packages/adapter-redis',
      include: ['src/**/*.{test,spec}.ts', '__tests__/**/*.{test,spec}.ts'],
      testTimeout: 60000,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Applications (BaaS)
  // ─────────────────────────────────────────────────────────────────────────────
  // Add app-specific configurations here as they are created
  // Example:
  // {
  //   extends: './vitest.config.ts',
  //   test: {
  //     name: 'baas-api',
  //     root: './apps/baas-api',
  //     include: ['src/**/*.{test,spec}.ts', '__tests__/**/*.{test,spec}.ts'],
  //   },
  // },
]);
