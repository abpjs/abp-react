/**
 * Required Validator
 * Translated from @abp/ng.core v2.9.0
 *
 * Validates that a value is not empty.
 *
 * @since 2.9.0
 */

import type { ValidatorFn } from './types';

/**
 * Error returned when required validation fails
 */
export interface RequiredError {
  required: true;
}

/**
 * Options for required validation
 */
export interface RequiredOptions {
  /**
   * If true, empty strings are considered valid (default: false)
   */
  allowEmptyStrings?: boolean;
}

/**
 * Validate that a value is not empty
 * @param options - Validation options
 * @returns Validator function that returns RequiredError if validation fails, null otherwise
 * @since 2.9.0
 *
 * @example
 * ```tsx
 * // With react-hook-form
 * const { register } = useForm();
 * <input {...register('name', { validate: validateRequired() })} />
 *
 * // Allow empty strings
 * <input {...register('nickname', { validate: validateRequired({ allowEmptyStrings: true }) })} />
 * ```
 */
export function validateRequired({
  allowEmptyStrings = false,
}: RequiredOptions = {}): ValidatorFn<RequiredError> {
  return (value: any): RequiredError | null => {
    if (value === null || value === undefined) {
      return { required: true };
    }

    if (typeof value === 'string' && !allowEmptyStrings && value.trim() === '') {
      return { required: true };
    }

    if (Array.isArray(value) && value.length === 0) {
      return { required: true };
    }

    return null;
  };
}
