/**
 * Utility Types
 * Translated from @abp/ng.schematics v3.1.0
 */

/**
 * Makes specified keys optional while keeping others required.
 * @template T - The base type
 * @template K - Keys to make optional
 */
export type Omissible<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;
