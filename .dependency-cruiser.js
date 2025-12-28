// ============================================================================
// Krepis ADaaS Platform - Dependency Cruiser Configuration
// ============================================================================
//
// 🎯 Purpose:
// Enforces Hexagonal Architecture layer boundaries at build time.
// Prevents architectural violations before they enter the codebase.
//
// 🏛️ ADaaS Vision Alignment:
// - Domain layer must remain pure (no infrastructure dependencies)
// - Application layer orchestrates domain but cannot import infrastructure directly
// - Infrastructure adapts ports to external systems
//
// 📐 Hexagonal Architecture Layers:
// ┌─────────────────────────────────────────────────────────────────────────┐
// │                           INFRASTRUCTURE                                │
// │  (Adapters: Prisma, Redis, HTTP Controllers, gRPC, Message Brokers)     │
// │                                  ▲                                      │
// │                                  │ implements                           │
// ├──────────────────────────────────┼──────────────────────────────────────┤
// │                           APPLICATION                                   │
// │  (Use Cases, Command/Query Handlers, Ports/Interfaces)                  │
// │                                  ▲                                      │
// │                                  │ orchestrates                         │
// ├──────────────────────────────────┼──────────────────────────────────────┤
// │                              DOMAIN                                     │
// │  (Entities, Value Objects, Domain Events, Specifications)               │
// │                     ★ PURE - NO EXTERNAL DEPENDENCIES ★                 │
// └─────────────────────────────────────────────────────────────────────────┘
//
// ⚠️ CRITICAL: This file is the guardian of Krepis' architectural integrity.
//              Modifying these rules requires K-ACA approval.
// ============================================================================

/** @type {import('dependency-cruiser').IConfiguration} */
const config = {
  forbidden: [
    // ─────────────────────────────────────────────────────────────────────────
    // RULE 001: Domain Layer Purity (Spec-001~003 Compliance)
    // ─────────────────────────────────────────────────────────────────────────
    {
      name: 'domain-cannot-depend-on-infrastructure',
      comment:
        'Domain layer must be pure. It cannot import from infrastructure layer. ' +
        'This violates Hexagonal Architecture and Krepis Spec-002 (Interface-First).',
      severity: 'error',
      from: {
        path: [
          'packages/.*/src/domain/.*',
          'apps/.*/src/domain/.*',
        ],
      },
      to: {
        path: [
          'packages/.*/src/infrastructure/.*',
          'apps/.*/src/infrastructure/.*',
          '@krepis/adapter-.*',
        ],
      },
    },
    {
      name: 'domain-cannot-depend-on-application',
      comment:
        'Domain layer is the innermost layer. It cannot depend on application layer. ' +
        'Domain logic must be completely isolated.',
      severity: 'error',
      from: {
        path: [
          'packages/.*/src/domain/.*',
          'apps/.*/src/domain/.*',
        ],
      },
      to: {
        path: [
          'packages/.*/src/application/.*',
          'apps/.*/src/application/.*',
        ],
      },
    },
    {
      name: 'domain-cannot-import-external-orm',
      comment:
        'Domain entities must not depend on ORM libraries directly. ' +
        'Use repository interfaces (Ports) instead.',
      severity: 'error',
      from: {
        path: [
          'packages/.*/src/domain/.*',
          'apps/.*/src/domain/.*',
        ],
      },
      to: {
        path: [
          'node_modules/@prisma/.*',
          'node_modules/prisma/.*',
          'node_modules/typeorm/.*',
          'node_modules/sequelize/.*',
          'node_modules/mongoose/.*',
        ],
      },
    },
    {
      name: 'domain-cannot-import-http-frameworks',
      comment:
        'Domain layer cannot depend on HTTP/transport frameworks. ' +
        'It must be protocol-agnostic (Krepis Core Principle #1).',
      severity: 'error',
      from: {
        path: [
          'packages/.*/src/domain/.*',
          'apps/.*/src/domain/.*',
        ],
      },
      to: {
        path: [
          'node_modules/express/.*',
          'node_modules/fastify/.*',
          'node_modules/@nestjs/.*',
          'node_modules/hono/.*',
          'node_modules/koa/.*',
        ],
      },
    },

    // ─────────────────────────────────────────────────────────────────────────
    // RULE 002: Application Layer Boundaries
    // ─────────────────────────────────────────────────────────────────────────
    {
      name: 'application-cannot-depend-on-infrastructure-implementation',
      comment:
        'Application layer can only depend on Ports (interfaces), not concrete implementations. ' +
        'Infrastructure concerns must be injected via DI (Spec-002).',
      severity: 'error',
      from: {
        path: [
          'packages/.*/src/application/.*',
          'apps/.*/src/application/.*',
        ],
      },
      to: {
        path: [
          'packages/.*/src/infrastructure/(?!.*ports?).*',
          'apps/.*/src/infrastructure/(?!.*ports?).*',
        ],
        pathNot: [
          '.*ports.*',
          '.*interfaces.*',
          '.*contracts.*',
        ],
      },
    },

    // ─────────────────────────────────────────────────────────────────────────
    // RULE 003: Adapter Layer Constraints
    // ─────────────────────────────────────────────────────────────────────────
    {
      name: 'adapters-must-implement-ports',
      comment:
        'Adapter packages (@krepis/adapter-*) should only implement core ports. ' +
        'They should not introduce new domain concepts.',
      severity: 'warn',
      from: {
        path: 'packages/adapter-.*/src/.*',
      },
      to: {
        path: 'packages/.*/src/domain/entities/.*',
        pathNot: '@krepis/core/.*',
      },
    },

    // ─────────────────────────────────────────────────────────────────────────
    // RULE 004: No Circular Dependencies
    // ─────────────────────────────────────────────────────────────────────────
    {
      name: 'no-circular-dependencies',
      comment:
        'Circular dependencies create coupling and make the system harder to understand. ' +
        'Use dependency injection or event-driven patterns instead.',
      severity: 'error',
      from: {},
      to: {
        circular: true,
      },
    },

    // ─────────────────────────────────────────────────────────────────────────
    // RULE 005: Core Package Independence
    // ─────────────────────────────────────────────────────────────────────────
    {
      name: 'core-cannot-depend-on-adapters',
      comment:
        '@krepis/core must be infrastructure-agnostic. ' +
        'It defines interfaces that adapters implement.',
      severity: 'error',
      from: {
        path: 'packages/core/src/.*',
      },
      to: {
        path: 'packages/adapter-.*/.*',
      },
    },
    {
      name: 'core-cannot-depend-on-apps',
      comment:
        '@krepis/core is a library package. It cannot depend on application code.',
      severity: 'error',
      from: {
        path: 'packages/.*/src/.*',
      },
      to: {
        path: 'apps/.*/src/.*',
      },
    },

    // ─────────────────────────────────────────────────────────────────────────
    // RULE 006: No Direct Node.js Imports in Domain
    // ─────────────────────────────────────────────────────────────────────────
    {
      name: 'domain-no-node-builtins',
      comment:
        'Domain layer should be runtime-agnostic. ' +
        'Node.js specific APIs should be wrapped in infrastructure.',
      severity: 'warn',
      from: {
        path: [
          'packages/.*/src/domain/.*',
          'apps/.*/src/domain/.*',
        ],
      },
      to: {
        dependencyTypes: ['core'],
        pathNot: [
          'node:crypto',  // Allowed for UUID generation
        ],
      },
    },

    // ─────────────────────────────────────────────────────────────────────────
    // RULE 007: Testing Boundaries
    // ─────────────────────────────────────────────────────────────────────────
    {
      name: 'no-test-files-in-production',
      comment: 'Production code should not import from test files.',
      severity: 'error',
      from: {
        pathNot: [
          '.*\\.test\\.ts$',
          '.*\\.spec\\.ts$',
          '.*/__tests__/.*',
          '.*/__mocks__/.*',
        ],
      },
      to: {
        path: [
          '.*\\.test\\.ts$',
          '.*\\.spec\\.ts$',
          '.*/__tests__/.*',
          '.*/__mocks__/.*',
        ],
      },
    },

    // ─────────────────────────────────────────────────────────────────────────
    // RULE 008: Orphan Module Detection
    // ─────────────────────────────────────────────────────────────────────────
    {
      name: 'no-orphan-modules',
      comment:
        'Modules that are not imported anywhere might be dead code. ' +
        'Consider removing them or documenting their purpose.',
      severity: 'info',
      from: {
        orphan: true,
        pathNot: [
          '(^|/)index\\.ts$',
          '\\.d\\.ts$',
          '.*\\.test\\.ts$',
          '.*\\.spec\\.ts$',
          'vitest\\.config\\.ts$',
          'tsup\\.config\\.ts$',
        ],
      },
      to: {},
    },

    // ─────────────────────────────────────────────────────────────────────────
    // RULE 009: Deprecated Module Warning
    // ─────────────────────────────────────────────────────────────────────────
    {
      name: 'no-deprecated-imports',
      comment: 'This module is deprecated. Please migrate to the recommended alternative.',
      severity: 'warn',
      from: {},
      to: {
        dependencyTypes: ['deprecated'],
      },
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // Allowed Dependencies (Exceptions)
  // ─────────────────────────────────────────────────────────────────────────────
  allowed: [
    // Core packages can use each other
    {
      from: { path: 'packages/core/src/.*' },
      to: { path: 'packages/shared/src/.*' },
    },
    // Application can use domain
    {
      from: { path: '.*/application/.*' },
      to: { path: '.*/domain/.*' },
    },
    // Infrastructure can use application and domain
    {
      from: { path: '.*/infrastructure/.*' },
      to: { path: ['.*/application/.*', '.*/domain/.*'] },
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // Module Resolution Options
  // ─────────────────────────────────────────────────────────────────────────────
  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    exclude: {
      path: [
        'node_modules',
        '\\.d\\.ts$',
        'dist',
        'coverage',
        '\\.turbo',
        'native',
      ],
    },
    includeOnly: {
      path: ['packages', 'apps'],
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: './tsconfig.json',
    },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
      mainFields: ['module', 'main', 'types'],
    },
    reporterOptions: {
      dot: {
        collapsePattern: 'node_modules/(@[^/]+/[^/]+|[^/]+)',
      },
      archi: {
        collapsePattern:
          '^(packages|apps)/[^/]+/(src/(domain|application|infrastructure))/.*',
      },
    },
    progress: { type: 'performance-log' },
    cache: {
      strategy: 'content',
      folder: 'node_modules/.cache/dependency-cruiser',
    },
  },
};

export default config;