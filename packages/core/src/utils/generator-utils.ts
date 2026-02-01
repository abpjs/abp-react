/**
 * Generate a UUID v4 string
 */
export function uuid(a?: number): string {
  return a
    ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
    : ('' + 1e7 + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => uuid(Number(c)));
}

/**
 * Generate a hash number from a string
 * Uses a simple djb2-like algorithm
 * @since 2.4.0
 */
export function generateHash(value: string): number {
  let hash = 5381;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) + hash + value.charCodeAt(i);
  }
  return hash >>> 0; // Convert to unsigned 32-bit integer
}
