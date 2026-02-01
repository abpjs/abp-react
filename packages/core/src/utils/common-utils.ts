/**
 * Common utility functions
 * @since 2.4.0
 */

/**
 * A no-operation function
 */
export function noop(): () => void {
  return () => {};
}

/**
 * Check if a value is undefined or an empty string
 * @since 2.4.0
 */
export function isUndefinedOrEmptyString(value: unknown): boolean {
  return value === undefined || value === '';
}
