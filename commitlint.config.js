// ============================================================================
// Krepis ADaaS Platform - Commitlint Configuration
// ============================================================================
//
// 🎯 Purpose:
// Enforces Conventional Commits specification for all commit messages.
// Enables automated changelog generation and semantic versioning.
//
// 🏛️ ADaaS Vision Alignment:
// - Consistent commit history for enterprise auditing
// - Automated release notes generation
// - Clear tracking of specification changes
//
// 📖 Commit Format:
// <type>(<scope>): <description>
//
// [optional body]
//
// [optional footer(s)]
// ============================================================================

/** @type {import('@commitlint/types').UserConfig} */
const config = {
  extends: ['@commitlint/config-conventional'],

  // ─────────────────────────────────────────────────────────────────────────────
  // Custom Rules
  // ─────────────────────────────────────────────────────────────────────────────
  rules: {
    // ─────────────────────────────────────────────────────────────────────────
    // Type Rules
    // ─────────────────────────────────────────────────────────────────────────
    'type-enum': [
      2,
      'always',
      [
        // Standard Conventional Commits types
        'feat',      // New feature
        'fix',       // Bug fix
        'docs',      // Documentation only changes
        'style',     // Formatting, missing semicolons, etc.
        'refactor',  // Code change that neither fixes a bug nor adds a feature
        'perf',      // Performance improvement
        'test',      // Adding or updating tests
        'build',     // Build system or external dependencies
        'ci',        // CI configuration
        'chore',     // Other changes that don't modify src or test files
        'revert',    // Reverts a previous commit
        
        // Krepis-specific types
        'spec',      // Specification (Spec-001~014) updates
        'arch',      // Architecture changes
        'security',  // Security-related changes
        'wip',       // Work in progress (should be squashed before merge)
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],

    // ─────────────────────────────────────────────────────────────────────────
    // Scope Rules
    // ─────────────────────────────────────────────────────────────────────────
    'scope-enum': [
      1, // Warning only - allow custom scopes
      'always',
      [
        // Core packages
        'core',
        'context',
        'di',
        'pipeline',
        'cqrs',
        'uow',
        'events',
        'specification',
        
        // Infrastructure packages
        'resilience',
        'config',
        'cache',
        'cli',
        
        // Adapter packages
        'prisma',
        'redis',
        
        // Utility packages
        'shared',
        'testing',
        
        // Applications
        'baas',
        'api',
        
        // Meta
        'deps',       // Dependency updates
        'release',    // Release-related
        'monorepo',   // Monorepo configuration
        'native',     // Rust native modules
        '*',          // All packages
      ],
    ],
    'scope-case': [2, 'always', 'lower-case'],
    'scope-empty': [1, 'never'], // Warning if no scope

    // ─────────────────────────────────────────────────────────────────────────
    // Subject Rules
    // ─────────────────────────────────────────────────────────────────────────
    'subject-case': [
      2,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-min-length': [2, 'always', 10], // Minimum 10 characters for clarity

    // ─────────────────────────────────────────────────────────────────────────
    // Header Rules
    // ─────────────────────────────────────────────────────────────────────────
    'header-max-length': [2, 'always', 100],

    // ─────────────────────────────────────────────────────────────────────────
    // Body Rules
    // ─────────────────────────────────────────────────────────────────────────
    'body-leading-blank': [2, 'always'],
    'body-max-line-length': [2, 'always', 100],

    // ─────────────────────────────────────────────────────────────────────────
    // Footer Rules
    // ─────────────────────────────────────────────────────────────────────────
    'footer-leading-blank': [2, 'always'],
    'footer-max-line-length': [2, 'always', 100],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Help Messages
  // ─────────────────────────────────────────────────────────────────────────────
  helpUrl: 'https://github.com/krepis/krepis/blob/main/CONTRIBUTING.md#commit-convention',

  // ─────────────────────────────────────────────────────────────────────────────
  // Prompt Configuration (for interactive commit)
  // ─────────────────────────────────────────────────────────────────────────────
  prompt: {
    questions: {
      type: {
        description: "Select the type of change you're committing",
        enum: {
          feat: {
            description: 'A new feature',
            title: 'Features',
            emoji: '✨',
          },
          fix: {
            description: 'A bug fix',
            title: 'Bug Fixes',
            emoji: '🐛',
          },
          docs: {
            description: 'Documentation only changes',
            title: 'Documentation',
            emoji: '📚',
          },
          style: {
            description: 'Changes that do not affect the meaning of the code',
            title: 'Styles',
            emoji: '💎',
          },
          refactor: {
            description: 'A code change that neither fixes a bug nor adds a feature',
            title: 'Code Refactoring',
            emoji: '📦',
          },
          perf: {
            description: 'A code change that improves performance',
            title: 'Performance Improvements',
            emoji: '🚀',
          },
          test: {
            description: 'Adding missing tests or correcting existing tests',
            title: 'Tests',
            emoji: '🚨',
          },
          build: {
            description: 'Changes that affect the build system or external dependencies',
            title: 'Builds',
            emoji: '🛠',
          },
          ci: {
            description: 'Changes to CI configuration files and scripts',
            title: 'Continuous Integrations',
            emoji: '⚙️',
          },
          chore: {
            description: "Other changes that don't modify src or test files",
            title: 'Chores',
            emoji: '♻️',
          },
          revert: {
            description: 'Reverts a previous commit',
            title: 'Reverts',
            emoji: '🗑',
          },
          spec: {
            description: 'Specification (Spec-001~014) updates',
            title: 'Specifications',
            emoji: '📑',
          },
          arch: {
            description: 'Architecture changes',
            title: 'Architecture',
            emoji: '🏛️',
          },
          security: {
            description: 'Security-related changes',
            title: 'Security',
            emoji: '🔒',
          },
        },
      },
      scope: {
        description: 'What is the scope of this change (e.g. core, di, prisma)',
      },
      subject: {
        description: 'Write a short, imperative tense description of the change',
      },
      body: {
        description: 'Provide a longer description of the change',
      },
      isBreaking: {
        description: 'Are there any breaking changes?',
      },
      breakingBody: {
        description: 'A BREAKING CHANGE commit requires a body. Please enter a longer description',
      },
      breaking: {
        description: 'Describe the breaking changes',
      },
      isIssueAffected: {
        description: 'Does this change affect any open issues?',
      },
      issuesBody: {
        description: 'If issues are closed, the commit requires a body. Please enter a longer description',
      },
      issues: {
        description: 'Add issue references (e.g. "fix #123", "re #123".)',
      },
    },
  },
};

export default config;
