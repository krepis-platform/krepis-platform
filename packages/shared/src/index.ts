/**
 * @packageDocumentation
 * @module @krepis/shared
 *
 * Krepis Shared - Common utilities and types used across all packages
 *
 * This module provides foundational types and utilities that are
 * shared across the entire Krepis platform.
 */

/**
 * Represents an object that can be disposed to release resources.
 */
export interface IDisposable {
  dispose(): void | Promise<void>;
}

/**
 * Represents an async disposable object (using Symbol.asyncDispose).
 */
export interface IAsyncDisposable {
  [Symbol.asyncDispose](): Promise<void>;
}

/**
 * Utility type for making specific properties optional.
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Utility type for making specific properties required.
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Utility type for extracting the resolved type of a Promise.
 */
export type Awaited<T> = T extends Promise<infer U> ? U : T;

/**
 * Brand type for nominal typing.
 */
export type Brand<T, B> = T & { readonly __brand: B };

/**
 * Version constant
 */
export const VERSION = '0.0.0';
