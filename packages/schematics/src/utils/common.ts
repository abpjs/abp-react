/**
 * Common Utilities
 * Translated from @abp/ng.schematics v3.2.0
 */

/**
 * Interpolates a template string with positional parameters.
 * @example interpolate('Hello {0}, you are {1}', 'world', 'great') → 'Hello world, you are great'
 */
export function interpolate(text: string, ...params: (string | number)[]): string {
  params.forEach((param, i) => {
    const pattern = new RegExp('\\{\\s*' + i + '\\s*\\}');
    text = text.replace(pattern, String(param));
  });
  return text;
}

/**
 * Type guard for null or undefined values.
 */
export function isNullOrUndefined(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Removes `__default` placeholder values from a parameters object.
 * Replaces them with undefined so they can be handled by defaults downstream.
 */
export function removeDefaultPlaceholders<T extends Record<string, unknown>>(
  oldParams: T
): { [K in keyof T]: T[K] | undefined } {
  const newParams = {} as Record<string, unknown>;
  Object.entries(oldParams).forEach(([key, value]) => {
    newParams[key] = value === '__default' ? undefined : value;
  });
  return newParams as { [K in keyof T]: T[K] | undefined };
}
