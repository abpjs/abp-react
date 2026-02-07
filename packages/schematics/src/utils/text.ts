/**
 * Text Case Conversion Utilities
 * Translated from @abp/ng.schematics v3.2.0
 *
 * Replaces @angular-devkit/core/strings with standalone implementations.
 */

/**
 * Replaces dots with underscores for consistent word-boundary detection.
 */
function prepareDots(text: string): string {
  return text.replace(/\./g, '_');
}

/**
 * Splits text into words by detecting boundaries:
 * camelCase, PascalCase, kebab-case, snake_case, spaces, dots, etc.
 */
function toWords(text: string): string[] {
  return text
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/[-_./\\]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

/** Lowercase */
export const lower = (text: string): string => text.toLowerCase();

/** Uppercase */
export const upper = (text: string): string => text.toUpperCase();

/**
 * camelCase
 * @example camel('user-name') → 'userName'
 * @example camel('Volo.Abp.Users') → 'voloAbpUsers'
 */
export const camel = (text: string): string => {
  const words = toWords(prepareDots(text));
  return words
    .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join('');
};

/**
 * PascalCase
 * @example pascal('user-name') → 'UserName'
 */
export const pascal = (text: string): string => {
  const words = toWords(prepareDots(text));
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
};

/**
 * kebab-case
 * @example kebab('UserName') → 'user-name'
 */
export const kebab = (text: string): string => {
  const words = toWords(prepareDots(text));
  return words.map((w) => w.toLowerCase()).join('-');
};

/**
 * snake_case
 * @example snake('UserName') → 'user_name'
 */
export const snake = (text: string): string => {
  const words = toWords(prepareDots(text));
  return words.map((w) => w.toLowerCase()).join('_');
};

/**
 * MACRO_CASE (uppercase snake)
 * @example macro('UserName') → 'USER_NAME'
 */
export const macro = (text: string): string => upper(snake(text));

/**
 * Converts a dot-separated namespace to a directory path using kebab-case segments.
 * @example dir('Services.Models') → 'services/models'
 * @example dir('Volo.Abp.Users') → 'volo/abp/users'
 */
export const dir = (text: string): string =>
  text
    .replace(/\./g, '/')
    .replace(/\/\//g, '/')
    .split('/')
    .map((segment) => {
      const words = toWords(segment);
      return words.map((w) => w.toLowerCase()).join('-');
    })
    .join('/');
