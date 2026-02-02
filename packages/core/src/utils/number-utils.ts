/**
 * Number utility functions
 * Translated from @abp/ng.core v2.7.0
 *
 * @since 2.7.0
 */

/**
 * Check if a value is a valid number (or numeric string)
 *
 * @param value - The value to check
 * @returns true if the value is a number or can be parsed as a number
 *
 * @example
 * ```typescript
 * isNumber(42);      // true
 * isNumber('42');    // true
 * isNumber('3.14');  // true
 * isNumber('abc');   // false
 * isNumber('');      // false
 * isNumber(NaN);     // false
 * ```
 */
export function isNumber(value: string | number): boolean {
  if (typeof value === 'number') {
    return !isNaN(value) && isFinite(value);
  }

  if (typeof value === 'string') {
    if (value.trim() === '') {
      return false;
    }
    const num = Number(value);
    return !isNaN(num) && isFinite(num);
  }

  return false;
}
