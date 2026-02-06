/**
 * Array Utilities
 * Translated from @abp/ng.core v3.0.0
 *
 * Provides utility functions for array manipulation.
 *
 * @since 3.0.0
 */

/**
 * Creates a function that pushes an element to an array and returns the array
 * Useful for functional composition
 * @param array - The array to push to
 * @returns A function that takes an element and returns the modified array
 * @since 3.0.0
 *
 * @example
 * ```typescript
 * const items: string[] = [];
 * const addItem = pushValueTo(items);
 * addItem('first'); // returns ['first']
 * addItem('second'); // returns ['first', 'second']
 * ```
 */
export function pushValueTo<T>(array: T[]): (element: T) => T[] {
  return (element: T): T[] => {
    array.push(element);
    return array;
  };
}

/**
 * Remove duplicates from an array
 * @param array - The array to deduplicate
 * @param keySelector - Optional function to select comparison key
 * @returns Array with duplicates removed
 * @since 3.0.0
 */
export function uniqueBy<T>(
  array: T[],
  keySelector?: (item: T) => unknown
): T[] {
  if (!keySelector) {
    return [...new Set(array)];
  }

  const seen = new Set<unknown>();
  return array.filter((item) => {
    const key = keySelector(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * Group array items by a key
 * @param array - The array to group
 * @param keySelector - Function to select group key
 * @returns Map of key to array of items
 * @since 3.0.0
 */
export function groupBy<T, K>(
  array: T[],
  keySelector: (item: T) => K
): Map<K, T[]> {
  const map = new Map<K, T[]>();

  for (const item of array) {
    const key = keySelector(item);
    const group = map.get(key);
    if (group) {
      group.push(item);
    } else {
      map.set(key, [item]);
    }
  }

  return map;
}
