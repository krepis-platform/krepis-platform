# 🏛️ Krepis

> **Architecture Development as a Service (ADaaS)**
>
> Enterprise-grade Backend Framework with Hexagonal Architecture

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-9.x-orange.svg)](https://pnpm.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 Vision

Krepis is a **world-first Architecture Autonomous Driving Platform** where AI clusters and human architects collaborate to autonomously perform software **design, generation, verification, communication, and maintenance**.

### Core Pillars

| Pillar | Description | Technical Realization |
|--------|-------------|----------------------|
| **Inviolable Structure** | Architectural integrity enforcement | Build-time AST analysis |
| **Hybrid Power** | Native-level performance | Rust/Napi-rs hybrid bridge |
| **Autonomous Dev** | Automated development & verification | Shadow Testing + AI PR generation |
| **Privacy First** | Source code IP protection | De-identified AST-based AI learning |

---

## 📦 Package Structure

```
krepis/
├── packages/
│   ├── core/          # @krepis/core - Hexagonal Architecture Framework
│   │   ├── context/   # Spec-001: Context Propagation
│   │   ├── di/        # Spec-002: Dependency Injection
│   │   ├── pipeline/  # Spec-003/010: Unified Pipeline
│   │   ├── cqrs/      # Spec-003: CQRS Handlers
│   │   ├── uow/       # Spec-005: Unit of Work
│   │   ├── events/    # Spec-007: Domain Events
│   │   └── specification/ # Spec-009: Specification Pattern
│   ├── resilience/    # @krepis/resilience - Spec-008: Resilience Policies
│   ├── config/        # @krepis/config - Spec-013: Configuration
│   ├── cache/         # @krepis/cache - Spec-014: Caching
│   ├── adapter-prisma/# @krepis/adapter-prisma - Prisma ORM Adapter
│   ├── adapter-redis/ # @krepis/adapter-redis - Redis Adapter
│   ├── cli/           # @krepis/cli - CLI Tools & Generators
│   ├── testing/       # @krepis/testing - Test Utilities
│   └── shared/        # @krepis/shared - Common Utilities
├── apps/              # BaaS Applications
├── native/            # Rust Native Modules (KNUL, Crypto)
└── docs/              # Documentation
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 20.0.0
- **pnpm** >= 9.0.0
- **Rust** >= 1.75 (optional, for native modules)

### Installation

```bash
# Clone the repository
git clone https://github.com/krepis/krepis.git
cd krepis

# Install dependencies
pnpm install

# Setup Git hooks
pnpm prepare

# Build all packages
pnpm build

# Run tests
pnpm test
```

### Development

```bash
# Start development mode (watch all packages)
pnpm dev

# Run linting
pnpm lint

# Check types
pnpm typecheck

# Validate architecture
pnpm arch:validate

# Generate dependency graph
pnpm arch:graph
```

---

## 🏗️ Architecture Principles

### 1. Hexagonal Architecture (Ports & Adapters)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           INFRASTRUCTURE                                │
│  (Adapters: Prisma, Redis, HTTP Controllers, gRPC, Message Brokers)     │
│                                  ▲                                      │
│                                  │ implements                           │
├──────────────────────────────────┼──────────────────────────────────────┤
│                           APPLICATION                                   │
│  (Use Cases, Command/Query Handlers, Ports/Interfaces)                  │
│                                  ▲                                      │
│                                  │ orchestrates                         │
├──────────────────────────────────┼──────────────────────────────────────┤
│                              DOMAIN                                     │
│  (Entities, Value Objects, Domain Events, Specifications)               │
│                     ★ PURE - NO EXTERNAL DEPENDENCIES ★                 │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2. Result-Based Error Handling

```typescript
// ❌ Anti-pattern: Throwing exceptions
function getUser(id: string): User {
  throw new Error('User not found');
}

// ✅ Krepis pattern: Explicit Result<T, E>
function getUser(id: string): Result<User, UserNotFoundError> {
  return Fail({ code: 'USER_NOT_FOUND', message: 'User not found' });
}
```

### 3. Context Propagation

```typescript
import { RequestContext, ContextKey } from '@krepis/core/context';

const TRACE_ID = new ContextKey<string>('traceId');

await RequestContext.run(store.set(TRACE_ID, 'abc-123'), async () => {
  // Anywhere in this async scope:
  const traceId = RequestContext.current().get(TRACE_ID);
  // Works across async boundaries, even into Rust native modules!
});
```

---

## 📜 Specifications

| Spec | Module | Description |
|------|--------|-------------|
| 001 | Context | Context Propagation with AsyncLocalStorage |
| 002 | DI | Zero-Reflection Dependency Injection |
| 003 | Pipeline/CQRS | Unified Pipeline & CQRS |
| 005 | UoW | Unit of Work with Transactional Outbox |
| 006 | Bootstrap | Application Bootstrapper |
| 007 | Events | Domain Events with Reliable Delivery |
| 008 | Resilience | Circuit Breaker, Retry, Bulkhead |
| 009 | Specification | Specification Pattern |
| 010 | Pipeline | Advanced Middleware System |
| 013 | Config | Unified Configuration |
| 014 | Cache | Multi-tier Caching |

---

## 🤝 Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat(core): add context serialization for Rust bridge
fix(di): resolve circular dependency detection
spec(007): update domain event ordering specification
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

<p align="center">
  <strong>Built with ❤️ by the Krepis Team</strong>
</p>
