/**
 * String utility functions
 * Translated from @abp/ng.core v3.2.0
 *
 * @since 3.1.0
 * @updated 3.2.0 - Added interpolate function
 */

/**
 * Create a token parser that extracts tokens from a string based on a format
 *
 * @example
 * const parser = createTokenParser('{0}.{1}');
 * parser('tenant.user'); // { '0': ['tenant'], '1': ['user'] }
 *
 * @since 3.1.0
 */
export function createTokenParser(
  format: string
): (str: string) => Record<string, string[]> {
  // Escape special regex characters except for {} placeholders
  const escapedFormat = format.replace(/[.*+?^$|()[\]\\]/g, '\\$&');

  // Replace {n} with capture groups
  const pattern = escapedFormat.replace(/\{(\d+)\}/g, '(.+?)');
  const regex = new RegExp(`^${pattern}$`);

  // Extract placeholder names in order
  const placeholders: string[] = [];
  const placeholderRegex = /\{(\d+)\}/g;
  let match: RegExpExecArray | null;
  while ((match = placeholderRegex.exec(format)) !== null) {
    placeholders.push(match[1]);
  }

  return (str: string): Record<string, string[]> => {
    const result: Record<string, string[]> = {};
    const matches = str.match(regex);

    if (matches) {
      placeholders.forEach((placeholder, index) => {
        if (!result[placeholder]) {
          result[placeholder] = [];
        }
        result[placeholder].push(matches[index + 1]);
      });
    }

    return result;
  };
}

/**
 * Interpolate parameters into a text string
 * Replaces {0}, {1}, etc. with the corresponding params array values
 *
 * @example
 * interpolate('Hello {0}, you have {1} messages', ['John', '5']);
 * // Returns: 'Hello John, you have 5 messages'
 *
 * @param text - The text containing placeholders like {0}, {1}, etc.
 * @param params - Array of values to substitute
 * @returns The interpolated string
 * @since 3.2.0
 */
export function interpolate(text: string, params: string[]): string {
  if (!params || params.length === 0) {
    return text;
  }

  return params.reduce((result, param, index) => {
    return result.replace(new RegExp(`\\{${index}\\}`, 'g'), param);
  }, text);
}
