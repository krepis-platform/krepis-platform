/**
 * @packageDocumentation
 * @module @krepis/core
 *
 * Krepis Core - Enterprise-grade Hexagonal Architecture Framework
 *
 * This module provides the foundational building blocks for building
 * scalable, maintainable backend applications following Hexagonal
 * Architecture principles.
 *
 * ## Core Modules
 *
 * - **Context** (Spec-001): Request context propagation with AsyncLocalStorage
 * - **DI** (Spec-002): Zero-reflection dependency injection container
 * - **Pipeline** (Spec-003/010): Unified request processing pipeline with behaviors
 * - **CQRS** (Spec-003): Command Query Responsibility Segregation handlers
 * - **UoW** (Spec-005): Unit of Work with Transactional Outbox
 * - **Events** (Spec-007): Domain events with reliable delivery
 * - **Specification** (Spec-009): Business rule specification pattern
 *
 * @example
 * ```typescript
 * import { KrepisFactory, RequestContext } from '@krepis/core';
 * import { InjectionToken } from '@krepis/core/di';
 * import { BaseHandler, Result, Ok, Fail } from '@krepis/core/cqrs';
 *
 * const app = await KrepisFactory.create(AppModule);
 * await app.start(3000);
 * ```
 */

// Re-export all submodules
export * from './context/index.js';
export * from './di/index.js';
export * from './pipeline/index.js';
export * from './cqrs/index.js';
export * from './uow/index.js';
export * from './events/index.js';
export * from './specification/index.js';

// Version export
export const VERSION = '0.0.0';
