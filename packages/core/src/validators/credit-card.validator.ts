/**
 * Credit Card Validator
 * Translated from @abp/ng.core v2.9.0
 *
 * Validates credit card numbers using the Luhn algorithm.
 *
 * @since 2.9.0
 */

import type { ValidatorFn } from './types';

/**
 * Error returned when credit card validation fails
 */
export interface CreditCardError {
  creditCard: true;
}

/**
 * Validate a credit card number using the Luhn algorithm
 * @returns Validator function that returns CreditCardError if validation fails, null otherwise
 * @since 2.9.0
 *
 * @example
 * ```tsx
 * // With react-hook-form
 * const { register } = useForm();
 * <input {...register('cardNumber', { validate: validateCreditCard() })} />
 * ```
 */
export function validateCreditCard(): ValidatorFn<CreditCardError> {
  return (value: any): CreditCardError | null => {
    if (!value) return null;

    const cardNumber = String(value).replace(/\D/g, '');

    if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
      return { creditCard: true };
    }

    // Luhn algorithm
    let sum = 0;
    let isEven = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    if (sum % 10 !== 0) {
      return { creditCard: true };
    }

    return null;
  };
}
