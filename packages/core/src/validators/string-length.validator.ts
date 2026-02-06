/**
 * String Length Validator
 * Translated from @abp/ng.core v2.9.0
 *
 * Validates that a string's length is within a specified range.
 *
 * @since 2.9.0
 */

import type { ValidatorFn } from './types';

/**
 * Error returned when string length validation fails
 */
export interface StringLengthError {
  maxlength?: {
    requiredLength: number;
  };
  minlength?: {
    requiredLength: number;
  };
}

/**
 * Options for string length validation
 */
export interface StringLengthOptions {
  /**
   * The maximum allowed length
   */
  maximumLength?: number;
  /**
   * The minimum required length
   */
  minimumLength?: number;
}

/**
 * Validate that a string's length is within a specified range
 * @param options - Validation options including minimum and maximum length
 * @returns Validator function that returns StringLengthError if validation fails, null otherwise
 * @since 2.9.0
 *
 * @example
 * ```tsx
 * // With react-hook-form
 * const { register } = useForm();
 * <input {...register('username', {
 *   validate: validateStringLength({ minimumLength: 3, maximumLength: 20 })
 * })} />
 * ```
 */
export function validateStringLength({
  maximumLength,
  minimumLength,
}: StringLengthOptions = {}): ValidatorFn<StringLengthError> {
  return (value: any): StringLengthError | null => {
    if (value === null || value === undefined) return null;

    const strValue = String(value);
    const length = strValue.length;

    const errors: StringLengthError = {};

    if (minimumLength !== undefined && length < minimumLength) {
      errors.minlength = { requiredLength: minimumLength };
    }

    if (maximumLength !== undefined && length > maximumLength) {
      errors.maxlength = { requiredLength: maximumLength };
    }

    return Object.keys(errors).length > 0 ? errors : null;
  };
}
