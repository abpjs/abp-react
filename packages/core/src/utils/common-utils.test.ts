import { describe, it, expect } from 'vitest';
import { noop, isUndefinedOrEmptyString } from './common-utils';

describe('common-utils (v2.4.0)', () => {
  describe('noop', () => {
    it('should return a function', () => {
      const result = noop();
      expect(typeof result).toBe('function');
    });

    it('should return a function that does nothing', () => {
      const fn = noop();
      expect(fn()).toBeUndefined();
    });

    it('should return a new function each time', () => {
      const fn1 = noop();
      const fn2 = noop();
      // Both should be functions that return undefined
      expect(fn1()).toBeUndefined();
      expect(fn2()).toBeUndefined();
    });
  });

  describe('isUndefinedOrEmptyString', () => {
    it('should return true for undefined', () => {
      expect(isUndefinedOrEmptyString(undefined)).toBe(true);
    });

    it('should return true for empty string', () => {
      expect(isUndefinedOrEmptyString('')).toBe(true);
    });

    it('should return false for null', () => {
      expect(isUndefinedOrEmptyString(null)).toBe(false);
    });

    it('should return false for non-empty string', () => {
      expect(isUndefinedOrEmptyString('hello')).toBe(false);
    });

    it('should return false for whitespace string', () => {
      expect(isUndefinedOrEmptyString('   ')).toBe(false);
    });

    it('should return false for numbers', () => {
      expect(isUndefinedOrEmptyString(0)).toBe(false);
      expect(isUndefinedOrEmptyString(123)).toBe(false);
    });

    it('should return false for boolean', () => {
      expect(isUndefinedOrEmptyString(false)).toBe(false);
      expect(isUndefinedOrEmptyString(true)).toBe(false);
    });

    it('should return false for objects', () => {
      expect(isUndefinedOrEmptyString({})).toBe(false);
      expect(isUndefinedOrEmptyString([])).toBe(false);
    });
  });
});
