/**
 * Range Validator
 * Translated from @abp/ng.core v2.9.0
 *
 * Validates that a numeric value is within a specified range.
 *
 * @since 2.9.0
 */

import type { ValidatorFn } from './types';

/**
 * Error returned when range validation fails
 */
export interface RangeError {
  range: {
    max: number;
    min: number;
  };
}

/**
 * Options for range validation
 */
export interface RangeOptions {
  /**
   * The maximum allowed value
   */
  maximum?: number;
  /**
   * The minimum allowed value
   */
  minimum?: number;
}

/**
 * Validate that a numeric value is within a specified range
 * @param options - Validation options including minimum and maximum values
 * @returns Validator function that returns RangeError if validation fails, null otherwise
 * @since 2.9.0
 *
 * @example
 * ```tsx
 * // With react-hook-form
 * const { register } = useForm();
 * <input {...register('age', { validate: validateRange({ minimum: 0, maximum: 120 }) })} />
 * ```
 */
export function validateRange({
  maximum = Number.MAX_SAFE_INTEGER,
  minimum = Number.MIN_SAFE_INTEGER,
}: RangeOptions = {}): ValidatorFn<RangeError> {
  return (value: any): RangeError | null => {
    if (value === null || value === undefined || value === '') return null;

    const numValue = typeof value === 'number' ? value : parseFloat(value);

    if (isNaN(numValue)) return null;

    if (numValue < minimum || numValue > maximum) {
      return {
        range: {
          max: maximum,
          min: minimum,
        },
      };
    }

    return null;
  };
}
