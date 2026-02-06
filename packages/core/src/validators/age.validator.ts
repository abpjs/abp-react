/**
 * Age Validator
 * Translated from @abp/ng.core v2.9.0
 *
 * Validates minimum age based on a date value.
 *
 * @since 2.9.0
 */

import type { ValidatorFn } from './types';

/**
 * Error returned when minimum age validation fails
 */
export interface MinAgeError {
  minAge: {
    age: number;
  };
}

/**
 * Options for minimum age validation
 */
export interface MinAgeOptions {
  /**
   * The minimum age required (default: 18)
   */
  age?: number;
}

/**
 * Validate minimum age based on a date of birth
 * @param options - Validation options including minimum age
 * @returns Validator function that returns MinAgeError if validation fails, null otherwise
 * @since 2.9.0
 *
 * @example
 * ```tsx
 * // With react-hook-form
 * const { register } = useForm();
 * <input {...register('birthDate', { validate: validateMinAge({ age: 18 }) })} />
 * ```
 */
export function validateMinAge({ age = 18 }: MinAgeOptions = {}): ValidatorFn<MinAgeError> {
  return (value: any): MinAgeError | null => {
    if (!value) return null;

    const birthDate = value instanceof Date ? value : new Date(value);
    if (isNaN(birthDate.getTime())) return null;

    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }

    if (calculatedAge < age) {
      return { minAge: { age } };
    }

    return null;
  };
}
