/**
 * Common Validator Types
 * Translated from @abp/ng.core v2.9.0
 *
 * @since 2.9.0
 */

/**
 * General validation result type - can be any error object or null
 */
export type ValidationResult<T = any> = T | null;

/**
 * Validator function type (React Hook Form compatible)
 */
export type ValidatorFn<T = any> = (value: any) => ValidationResult<T>;
