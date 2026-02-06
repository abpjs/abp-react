/**
 * ABP Validators
 * Translated from @abp/ng.core v2.9.0
 *
 * Common validators for form validation in ABP applications.
 * These validators are designed to work with React Hook Form and similar libraries.
 *
 * @since 2.9.0
 */

import { validateMinAge } from './age.validator';
import { validateCreditCard } from './credit-card.validator';
import { validateRange } from './range.validator';
import { validateRequired } from './required.validator';
import { validateStringLength } from './string-length.validator';
import { validateUrl } from './url.validator';

// Export common types
export * from './types';

// Export validators - explicitly export only the specific exports (not ValidationResult/ValidatorFn)
export { validateMinAge, type MinAgeError, type MinAgeOptions } from './age.validator';
export { validateCreditCard, type CreditCardError } from './credit-card.validator';
export { validateRange, type RangeError, type RangeOptions } from './range.validator';
export { validateRequired, type RequiredError, type RequiredOptions } from './required.validator';
export {
  validateStringLength,
  type StringLengthError,
  type StringLengthOptions,
} from './string-length.validator';
export { validateUrl, type UrlError } from './url.validator';

/**
 * Email error type
 */
export interface EmailError {
  email: true;
}

/**
 * Email validation pattern
 */
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Validate email address
 * @returns Validator function that returns { email: true } if validation fails, null otherwise
 */
function validateEmailAddress() {
  return (value: any): EmailError | null => {
    if (!value) return null;
    const strValue = String(value);
    return EMAIL_PATTERN.test(strValue) ? null : { email: true };
  };
}

/**
 * ABP Validators collection
 * Provides a unified interface for all ABP validators
 *
 * @example
 * ```tsx
 * import { AbpValidators } from '@abpjs/core';
 *
 * // With react-hook-form
 * const { register } = useForm();
 *
 * <input {...register('email', { validate: AbpValidators.emailAddress() })} />
 * <input {...register('age', { validate: AbpValidators.range({ minimum: 0, maximum: 120 }) })} />
 * <input {...register('password', { validate: AbpValidators.stringLength({ minimumLength: 8 }) })} />
 * ```
 */
export const AbpValidators = {
  /**
   * Validate credit card number using Luhn algorithm
   */
  creditCard: validateCreditCard,

  /**
   * Validate email address format
   */
  emailAddress: validateEmailAddress,

  /**
   * Validate minimum age based on date of birth
   */
  minAge: validateMinAge,

  /**
   * Validate numeric value is within range
   */
  range: validateRange,

  /**
   * Validate required field
   */
  required: validateRequired,

  /**
   * Validate string length
   */
  stringLength: validateStringLength,

  /**
   * Validate URL format
   */
  url: validateUrl,
};
