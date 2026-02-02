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

/**
 * Generate a random password with specified length
 * Includes lowercase, uppercase, digits, and special characters
 *
 * @param length - The desired password length (default: 16)
 * @returns A randomly generated password string
 *
 * @since 2.7.0
 *
 * @example
 * ```typescript
 * const password = generatePassword();     // 16 character password
 * const short = generatePassword(8);       // 8 character password
 * const long = generatePassword(32);       // 32 character password
 * ```
 */
export function generatePassword(length: number = 16): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  const allChars = lowercase + uppercase + digits + special;

  // Ensure at least one character from each category
  let password = '';
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += digits[Math.floor(Math.random() * digits.length)];
  password += special[Math.floor(Math.random() * special.length)];

  // Fill the rest with random characters from all categories
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password to avoid predictable positions
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}
