import { describe, it, expect } from 'vitest';
import { AccountConfigOptions } from '../../models/config-options';

describe('AccountConfigOptions interface (v3.0.0)', () => {
  describe('interface structure', () => {
    it('should allow empty object (all properties optional)', () => {
      const options: AccountConfigOptions = {};
      expect(options).toEqual({});
    });

    it('should allow redirectUrl property', () => {
      const options: AccountConfigOptions = {
        redirectUrl: '/dashboard',
      };
      expect(options.redirectUrl).toBe('/dashboard');
    });

    it('should allow undefined redirectUrl', () => {
      const options: AccountConfigOptions = {
        redirectUrl: undefined,
      };
      expect(options.redirectUrl).toBeUndefined();
    });
  });

  describe('redirectUrl property', () => {
    it('should accept root path', () => {
      const options: AccountConfigOptions = {
        redirectUrl: '/',
      };
      expect(options.redirectUrl).toBe('/');
    });

    it('should accept relative paths', () => {
      const options: AccountConfigOptions = {
        redirectUrl: '/admin/dashboard',
      };
      expect(options.redirectUrl).toBe('/admin/dashboard');
    });

    it('should accept absolute URLs', () => {
      const options: AccountConfigOptions = {
        redirectUrl: 'https://example.com/callback',
      };
      expect(options.redirectUrl).toBe('https://example.com/callback');
    });

    it('should accept empty string', () => {
      const options: AccountConfigOptions = {
        redirectUrl: '',
      };
      expect(options.redirectUrl).toBe('');
    });

    it('should accept paths with query parameters', () => {
      const options: AccountConfigOptions = {
        redirectUrl: '/dashboard?tab=overview',
      };
      expect(options.redirectUrl).toBe('/dashboard?tab=overview');
    });

    it('should accept paths with hash fragments', () => {
      const options: AccountConfigOptions = {
        redirectUrl: '/page#section',
      };
      expect(options.redirectUrl).toBe('/page#section');
    });
  });

  describe('type safety', () => {
    it('should be assignable to a variable', () => {
      const options: AccountConfigOptions = { redirectUrl: '/home' };
      const assigned: AccountConfigOptions = options;
      expect(assigned).toEqual(options);
    });

    it('should work with spread operator', () => {
      const base: AccountConfigOptions = { redirectUrl: '/base' };
      const extended: AccountConfigOptions = { ...base, redirectUrl: '/extended' };
      expect(extended.redirectUrl).toBe('/extended');
    });

    it('should work with Object.assign', () => {
      const base: AccountConfigOptions = {};
      const result = Object.assign<AccountConfigOptions, Partial<AccountConfigOptions>>(
        base,
        { redirectUrl: '/assigned' }
      );
      expect(result.redirectUrl).toBe('/assigned');
    });
  });

  describe('default value patterns', () => {
    it('should allow destructuring with defaults', () => {
      const options: AccountConfigOptions = {};
      const { redirectUrl = '/' } = options;
      expect(redirectUrl).toBe('/');
    });

    it('should allow nullish coalescing', () => {
      const options: AccountConfigOptions = {};
      const redirectUrl = options.redirectUrl ?? '/default';
      expect(redirectUrl).toBe('/default');
    });

    it('should preserve explicit undefined over defaults when using nullish coalescing', () => {
      const options: AccountConfigOptions = { redirectUrl: undefined };
      const redirectUrl = options.redirectUrl ?? '/default';
      expect(redirectUrl).toBe('/default');
    });
  });
});
