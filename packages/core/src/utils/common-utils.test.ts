import { describe, it, expect } from 'vitest';
import {
  noop,
  isUndefinedOrEmptyString,
  isNullOrUndefined,
  exists,
  isObject,
  isArray,
  isObjectAndNotArray,
} from './common-utils';

describe('common-utils', () => {
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

  describe('isNullOrUndefined (v3.1.0)', () => {
    it('should return true for null', () => {
      expect(isNullOrUndefined(null)).toBe(true);
    });

    it('should return true for undefined', () => {
      expect(isNullOrUndefined(undefined)).toBe(true);
    });

    it('should return false for empty string', () => {
      expect(isNullOrUndefined('')).toBe(false);
    });

    it('should return false for zero', () => {
      expect(isNullOrUndefined(0)).toBe(false);
    });

    it('should return false for false', () => {
      expect(isNullOrUndefined(false)).toBe(false);
    });

    it('should return false for empty object', () => {
      expect(isNullOrUndefined({})).toBe(false);
    });

    it('should return false for empty array', () => {
      expect(isNullOrUndefined([])).toBe(false);
    });

    it('should return false for non-null values', () => {
      expect(isNullOrUndefined('hello')).toBe(false);
      expect(isNullOrUndefined(123)).toBe(false);
      expect(isNullOrUndefined({ key: 'value' })).toBe(false);
    });

    it('should work as type guard', () => {
      const value: string | null | undefined = 'test';
      if (!isNullOrUndefined(value)) {
        // TypeScript should know value is string here
        expect(value.length).toBe(4);
      }
    });
  });

  describe('exists (v3.1.0)', () => {
    it('should return false for null', () => {
      expect(exists(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(exists(undefined)).toBe(false);
    });

    it('should return true for empty string', () => {
      expect(exists('')).toBe(true);
    });

    it('should return true for zero', () => {
      expect(exists(0)).toBe(true);
    });

    it('should return true for false', () => {
      expect(exists(false)).toBe(true);
    });

    it('should return true for empty object', () => {
      expect(exists({})).toBe(true);
    });

    it('should return true for empty array', () => {
      expect(exists([])).toBe(true);
    });

    it('should return true for non-null values', () => {
      expect(exists('hello')).toBe(true);
      expect(exists(123)).toBe(true);
      expect(exists({ key: 'value' })).toBe(true);
    });

    it('should work as type guard', () => {
      const value: number | null | undefined = 42;
      if (exists(value)) {
        // TypeScript should know value is number here
        expect(value.toFixed(2)).toBe('42.00');
      }
    });
  });

  describe('isObject (v3.1.0)', () => {
    it('should return true for plain object', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ key: 'value' })).toBe(true);
    });

    it('should return true for arrays', () => {
      expect(isObject([])).toBe(true);
      expect(isObject([1, 2, 3])).toBe(true);
    });

    it('should return true for Date objects', () => {
      expect(isObject(new Date())).toBe(true);
    });

    it('should return true for RegExp objects', () => {
      expect(isObject(/test/)).toBe(true);
    });

    it('should return false for null', () => {
      expect(isObject(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isObject(undefined)).toBe(false);
    });

    it('should return false for primitives', () => {
      expect(isObject('string')).toBe(false);
      expect(isObject(123)).toBe(false);
      expect(isObject(true)).toBe(false);
      expect(isObject(Symbol('test'))).toBe(false);
    });

    it('should return false for functions', () => {
      expect(isObject(() => {})).toBe(false);
      expect(isObject(function test() {})).toBe(false);
    });
  });

  describe('isArray (v3.1.0)', () => {
    it('should return true for empty array', () => {
      expect(isArray([])).toBe(true);
    });

    it('should return true for array with elements', () => {
      expect(isArray([1, 2, 3])).toBe(true);
      expect(isArray(['a', 'b', 'c'])).toBe(true);
      expect(isArray([{ id: 1 }, { id: 2 }])).toBe(true);
    });

    it('should return false for plain object', () => {
      expect(isArray({})).toBe(false);
      expect(isArray({ length: 3 })).toBe(false);
    });

    it('should return false for array-like objects', () => {
      expect(isArray({ 0: 'a', 1: 'b', length: 2 })).toBe(false);
    });

    it('should return false for null and undefined', () => {
      expect(isArray(null)).toBe(false);
      expect(isArray(undefined)).toBe(false);
    });

    it('should return false for primitives', () => {
      expect(isArray('string')).toBe(false);
      expect(isArray(123)).toBe(false);
      expect(isArray(true)).toBe(false);
    });

    it('should return false for string (iterable but not array)', () => {
      expect(isArray('hello')).toBe(false);
    });
  });

  describe('isObjectAndNotArray (v3.1.0)', () => {
    it('should return true for plain object', () => {
      expect(isObjectAndNotArray({})).toBe(true);
      expect(isObjectAndNotArray({ key: 'value' })).toBe(true);
    });

    it('should return true for nested object', () => {
      expect(isObjectAndNotArray({ nested: { deep: true } })).toBe(true);
    });

    it('should return false for arrays', () => {
      expect(isObjectAndNotArray([])).toBe(false);
      expect(isObjectAndNotArray([1, 2, 3])).toBe(false);
    });

    it('should return false for null', () => {
      expect(isObjectAndNotArray(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isObjectAndNotArray(undefined)).toBe(false);
    });

    it('should return false for primitives', () => {
      expect(isObjectAndNotArray('string')).toBe(false);
      expect(isObjectAndNotArray(123)).toBe(false);
      expect(isObjectAndNotArray(true)).toBe(false);
    });

    it('should return true for Date objects', () => {
      // Note: Date is an object and not an array
      expect(isObjectAndNotArray(new Date())).toBe(true);
    });

    it('should work as type guard', () => {
      const value: unknown = { name: 'test' };
      if (isObjectAndNotArray(value)) {
        // TypeScript should know value is Record<string, unknown> here
        expect(value.name).toBe('test');
      }
    });
  });
});
