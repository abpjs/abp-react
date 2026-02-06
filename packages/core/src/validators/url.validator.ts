/**
 * URL Validator
 * Translated from @abp/ng.core v2.9.0
 *
 * Validates that a value is a valid URL.
 *
 * @since 2.9.0
 */

import type { ValidatorFn } from './types';

/**
 * Error returned when URL validation fails
 */
export interface UrlError {
  url: true;
}

/**
 * URL pattern for validation
 */
const URL_PATTERN = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

/**
 * Validate that a value is a valid URL
 * @returns Validator function that returns UrlError if validation fails, null otherwise
 * @since 2.9.0
 *
 * @example
 * ```tsx
 * // With react-hook-form
 * const { register } = useForm();
 * <input {...register('website', { validate: validateUrl() })} />
 * ```
 */
export function validateUrl(): ValidatorFn<UrlError> {
  return (value: any): UrlError | null => {
    if (!value) return null;

    const strValue = String(value);

    if (!URL_PATTERN.test(strValue)) {
      return { url: true };
    }

    // Additional validation using URL constructor
    try {
      new URL(strValue);
      return null;
    } catch {
      return { url: true };
    }
  };
}
