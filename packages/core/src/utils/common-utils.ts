/**
 * Common utility functions
 * @since 2.4.0
 * @updated 4.0.0 - Added isNode, isObjectAndNotArrayNotNode
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

/**
 * Check if a value is null or undefined
 * @since 3.1.0
 */
export function isNullOrUndefined(obj: unknown): obj is null | undefined {
  return obj === null || obj === undefined;
}

/**
 * Check if a value exists (is not null or undefined)
 * @since 3.1.0
 */
export function exists<T>(obj: T | null | undefined): obj is T {
  return !isNullOrUndefined(obj);
}

/**
 * Check if a value is an object
 * @since 3.1.0
 */
export function isObject(obj: unknown): obj is object {
  return obj !== null && typeof obj === 'object';
}

/**
 * Check if a value is an array
 * @since 3.1.0
 */
export function isArray(obj: unknown): obj is unknown[] {
  return Array.isArray(obj);
}

/**
 * Check if a value is an object but not an array
 * @since 3.1.0
 */
export function isObjectAndNotArray(
  obj: unknown
): obj is Record<string, unknown> {
  return isObject(obj) && !isArray(obj);
}

/**
 * Check if a value is a DOM Node
 * @since 4.0.0
 */
export function isNode(obj: unknown): boolean {
  return typeof Node !== 'undefined' && obj instanceof Node;
}

/**
 * Check if a value is an object but not an array and not a DOM Node
 * @since 4.0.0
 */
export function isObjectAndNotArrayNotNode(
  obj: unknown
): obj is Record<string, unknown> {
  return isObjectAndNotArray(obj) && !isNode(obj);
}
