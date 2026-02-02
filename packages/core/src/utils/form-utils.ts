/**
 * Form utility functions
 * Translated from @abp/ng.core v2.7.0
 *
 * @since 2.7.0
 */

import { ABP } from '../models/common';

/**
 * Map an enum to an array of options for use in form selects
 *
 * @param _enum - The enum object to convert
 * @returns Array of Option objects with key and value
 *
 * @example
 * ```typescript
 * enum Status {
 *   Active = 0,
 *   Inactive = 1,
 *   Pending = 2
 * }
 *
 * const options = mapEnumToOptions(Status);
 * // Returns: [
 * //   { key: 'Active', value: 0 },
 * //   { key: 'Inactive', value: 1 },
 * //   { key: 'Pending', value: 2 }
 * // ]
 * ```
 */
export function mapEnumToOptions<T extends object>(_enum: T): ABP.Option<T>[] {
  // TypeScript numeric enums have reverse mappings (value -> key)
  // We filter these out by checking if the key is not a number
  return Object.keys(_enum)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      key: key as Extract<keyof T, string>,
      value: _enum[key as keyof T] as T[Extract<keyof T, string>],
    }));
}
