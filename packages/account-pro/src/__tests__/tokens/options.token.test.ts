import { describe, it, expect } from 'vitest';
import {
  ACCOUNT_OPTIONS,
  DEFAULT_ACCOUNT_OPTIONS,
  AccountOptionsToken,
} from '../../tokens/options.token';

describe('options.token (v3.0.0)', () => {
  describe('ACCOUNT_OPTIONS', () => {
    it('should be a symbol', () => {
      expect(typeof ACCOUNT_OPTIONS).toBe('symbol');
    });

    it('should have description ACCOUNT_OPTIONS', () => {
      expect(ACCOUNT_OPTIONS.description).toBe('ACCOUNT_OPTIONS');
    });

    it('should be unique', () => {
      const anotherSymbol = Symbol('ACCOUNT_OPTIONS');
      expect(ACCOUNT_OPTIONS).not.toBe(anotherSymbol);
    });

    it('should be usable as object key', () => {
      const obj = { [ACCOUNT_OPTIONS]: 'test' };
      expect(obj[ACCOUNT_OPTIONS]).toBe('test');
    });

    it('should be usable with Map', () => {
      const map = new Map();
      map.set(ACCOUNT_OPTIONS, { redirectUrl: '/test' });
      expect(map.get(ACCOUNT_OPTIONS)).toEqual({ redirectUrl: '/test' });
    });

    it('should work with WeakMap', () => {
      // Note: Symbols can't be used as WeakMap keys, but we can store them as values
      const weakMap = new WeakMap();
      const key = {};
      weakMap.set(key, ACCOUNT_OPTIONS);
      expect(weakMap.get(key)).toBe(ACCOUNT_OPTIONS);
    });
  });

  describe('DEFAULT_ACCOUNT_OPTIONS', () => {
    it('should be an object', () => {
      expect(typeof DEFAULT_ACCOUNT_OPTIONS).toBe('object');
      expect(DEFAULT_ACCOUNT_OPTIONS).not.toBeNull();
    });

    it('should have redirectUrl property', () => {
      expect(DEFAULT_ACCOUNT_OPTIONS).toHaveProperty('redirectUrl');
    });

    it('should have redirectUrl set to /', () => {
      expect(DEFAULT_ACCOUNT_OPTIONS.redirectUrl).toBe('/');
    });

    it('should have correct default structure', () => {
      expect(DEFAULT_ACCOUNT_OPTIONS).toEqual({
        redirectUrl: '/',
      });
    });

    it('should be usable as default options', () => {
      const options = { ...DEFAULT_ACCOUNT_OPTIONS };
      expect(options.redirectUrl).toBe('/');
    });

    it('should be overridable with spread', () => {
      const customOptions = {
        ...DEFAULT_ACCOUNT_OPTIONS,
        redirectUrl: '/dashboard',
      };
      expect(customOptions.redirectUrl).toBe('/dashboard');
    });
  });

  describe('AccountOptionsToken type', () => {
    it('should be the type of ACCOUNT_OPTIONS', () => {
      const token: AccountOptionsToken = ACCOUNT_OPTIONS;
      expect(token).toBe(ACCOUNT_OPTIONS);
    });
  });

  describe('dependency injection pattern', () => {
    it('should work with React Context pattern', () => {
      // Simulating how this would be used with React Context
      const contextValue = new Map<symbol, any>();
      contextValue.set(ACCOUNT_OPTIONS, DEFAULT_ACCOUNT_OPTIONS);

      const retrieved = contextValue.get(ACCOUNT_OPTIONS);
      expect(retrieved).toEqual(DEFAULT_ACCOUNT_OPTIONS);
    });

    it('should work with service locator pattern', () => {
      // Simulating service locator pattern
      const services: Record<symbol, any> = {
        [ACCOUNT_OPTIONS]: { redirectUrl: '/custom' },
      };

      expect(services[ACCOUNT_OPTIONS]).toEqual({ redirectUrl: '/custom' });
    });
  });

  describe('token uniqueness', () => {
    it('should maintain identity when referenced multiple times', () => {
      // Verify the symbol is the same reference
      const reference1 = ACCOUNT_OPTIONS;
      const reference2 = ACCOUNT_OPTIONS;
      expect(reference1).toBe(reference2);
    });

    it('should not equal a different symbol with same description', () => {
      const differentSymbol = Symbol('ACCOUNT_OPTIONS');
      expect(ACCOUNT_OPTIONS).not.toBe(differentSymbol);
    });
  });
});
