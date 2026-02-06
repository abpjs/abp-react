/**
 * Object utility functions
 * Translated from @abp/ng.core v3.1.0
 *
 * @since 3.1.0
 */

import { isObjectAndNotArray, isArray } from './common-utils';

/**
 * Deep merge two objects
 * Arrays are replaced, objects are recursively merged
 * @since 3.1.0
 */
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>
): T {
  const output = { ...target };

  if (isObjectAndNotArray(target) && isObjectAndNotArray(source)) {
    Object.keys(source).forEach((key) => {
      const sourceValue = source[key];
      const targetValue = target[key];

      if (isObjectAndNotArray(sourceValue) && isObjectAndNotArray(targetValue)) {
        (output as Record<string, unknown>)[key] = deepMerge(
          targetValue as Record<string, unknown>,
          sourceValue as Record<string, unknown>
        );
      } else if (isArray(sourceValue)) {
        (output as Record<string, unknown>)[key] = [...sourceValue];
      } else {
        (output as Record<string, unknown>)[key] = sourceValue;
      }
    });
  }

  return output;
}
