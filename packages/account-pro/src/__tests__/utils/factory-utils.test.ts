import { describe, it, expect } from 'vitest';
import { accountOptionsFactory } from '../../utils/factory-utils';
import { AccountConfigOptions } from '../../models/config-options';

describe('accountOptionsFactory (v3.0.0)', () => {
  describe('function signature', () => {
    it('should be a function', () => {
      expect(typeof accountOptionsFactory).toBe('function');
    });

    it('should accept AccountConfigOptions parameter', () => {
      const options: AccountConfigOptions = {};
      expect(() => accountOptionsFactory(options)).not.toThrow();
    });

    it('should return an object', () => {
      const result = accountOptionsFactory({});
      expect(typeof result).toBe('object');
      expect(result).not.toBeNull();
    });
  });

  describe('default values', () => {
    it('should return default redirectUrl when empty options provided', () => {
      const result = accountOptionsFactory({});
      expect(result.redirectUrl).toBe('/');
    });

    it('should return default redirectUrl when undefined', () => {
      const result = accountOptionsFactory({ redirectUrl: undefined });
      expect(result.redirectUrl).toBe('/');
    });
  });

  describe('custom values', () => {
    it('should use provided redirectUrl', () => {
      const result = accountOptionsFactory({ redirectUrl: '/dashboard' });
      expect(result.redirectUrl).toBe('/dashboard');
    });

    it('should accept root path', () => {
      const result = accountOptionsFactory({ redirectUrl: '/' });
      expect(result.redirectUrl).toBe('/');
    });

    it('should accept empty string', () => {
      const result = accountOptionsFactory({ redirectUrl: '' });
      expect(result.redirectUrl).toBe('');
    });

    it('should accept deep paths', () => {
      const result = accountOptionsFactory({ redirectUrl: '/admin/settings/profile' });
      expect(result.redirectUrl).toBe('/admin/settings/profile');
    });

    it('should accept paths with query strings', () => {
      const result = accountOptionsFactory({ redirectUrl: '/page?param=value' });
      expect(result.redirectUrl).toBe('/page?param=value');
    });

    it('should accept paths with hash fragments', () => {
      const result = accountOptionsFactory({ redirectUrl: '/page#section' });
      expect(result.redirectUrl).toBe('/page#section');
    });

    it('should accept absolute URLs', () => {
      const result = accountOptionsFactory({
        redirectUrl: 'https://example.com/callback',
      });
      expect(result.redirectUrl).toBe('https://example.com/callback');
    });
  });

  describe('return type', () => {
    it('should always return an object with redirectUrl string', () => {
      const result = accountOptionsFactory({});
      expect(typeof result.redirectUrl).toBe('string');
    });

    it('should return object with exact structure', () => {
      const result = accountOptionsFactory({ redirectUrl: '/test' });
      expect(result).toEqual({ redirectUrl: '/test' });
    });

    it('should only contain redirectUrl property', () => {
      const result = accountOptionsFactory({ redirectUrl: '/test' });
      const keys = Object.keys(result);
      expect(keys).toHaveLength(1);
      expect(keys[0]).toBe('redirectUrl');
    });
  });

  describe('nullish coalescing behavior', () => {
    it('should use default for undefined redirectUrl', () => {
      const result = accountOptionsFactory({ redirectUrl: undefined });
      expect(result.redirectUrl).toBe('/');
    });

    it('should not use default for empty string (falsy but not nullish)', () => {
      const result = accountOptionsFactory({ redirectUrl: '' });
      expect(result.redirectUrl).toBe('');
    });
  });

  describe('immutability', () => {
    it('should return a new object each time', () => {
      const result1 = accountOptionsFactory({});
      const result2 = accountOptionsFactory({});
      expect(result1).not.toBe(result2);
      expect(result1).toEqual(result2);
    });

    it('should not modify input options', () => {
      const input: AccountConfigOptions = { redirectUrl: '/test' };
      const inputCopy = { ...input };
      accountOptionsFactory(input);
      expect(input).toEqual(inputCopy);
    });
  });

  describe('edge cases', () => {
    it('should handle whitespace-only redirectUrl', () => {
      const result = accountOptionsFactory({ redirectUrl: '   ' });
      expect(result.redirectUrl).toBe('   ');
    });

    it('should handle special characters in path', () => {
      const result = accountOptionsFactory({ redirectUrl: '/path/with%20spaces' });
      expect(result.redirectUrl).toBe('/path/with%20spaces');
    });

    it('should handle unicode paths', () => {
      const result = accountOptionsFactory({ redirectUrl: '/путь/日本語' });
      expect(result.redirectUrl).toBe('/путь/日本語');
    });
  });
});
