import { describe, it, expect } from 'vitest';
import { accountOptionsFactory } from '../../utils/factory-utils';

/**
 * Tests for factory-utils.ts
 * @since 3.0.0
 */
describe('factory-utils (v3.0.0)', () => {
  describe('accountOptionsFactory', () => {
    it('should return options with default redirectUrl when not provided', () => {
      const result = accountOptionsFactory({});
      expect(result.redirectUrl).toBe('/');
    });

    it('should use provided redirectUrl', () => {
      const result = accountOptionsFactory({ redirectUrl: '/dashboard' });
      expect(result.redirectUrl).toBe('/dashboard');
    });

    it('should handle empty string redirectUrl', () => {
      const result = accountOptionsFactory({ redirectUrl: '' });
      expect(result.redirectUrl).toBe('');
    });

    it('should return a Required<AccountOptions> object', () => {
      const result = accountOptionsFactory({});
      expect(result).toHaveProperty('redirectUrl');
      expect(typeof result.redirectUrl).toBe('string');
    });

    it('should override default values with provided options', () => {
      const customUrl = '/custom/path';
      const result = accountOptionsFactory({ redirectUrl: customUrl });
      expect(result.redirectUrl).toBe(customUrl);
    });

    it('should handle absolute URLs', () => {
      const result = accountOptionsFactory({ redirectUrl: 'https://example.com/dashboard' });
      expect(result.redirectUrl).toBe('https://example.com/dashboard');
    });

    it('should preserve path with query parameters', () => {
      const result = accountOptionsFactory({ redirectUrl: '/dashboard?tab=settings' });
      expect(result.redirectUrl).toBe('/dashboard?tab=settings');
    });
  });
});
