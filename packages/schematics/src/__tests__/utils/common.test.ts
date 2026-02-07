/**
 * Common Utilities Tests
 */

import { describe, expect, it } from 'vitest';
import { interpolate, isNullOrUndefined, removeDefaultPlaceholders } from '../../utils/common';

describe('Common Utils', () => {
  describe('interpolate', () => {
    it('should replace single placeholder', () => {
      expect(interpolate('Hello {0}', 'world')).toBe('Hello world');
    });

    it('should replace multiple placeholders', () => {
      expect(interpolate('Hello {0}, you are {1}', 'world', 'great')).toBe(
        'Hello world, you are great'
      );
    });

    it('should handle numeric params', () => {
      expect(interpolate('Count: {0}', 42)).toBe('Count: 42');
    });

    it('should handle placeholders with spaces', () => {
      expect(interpolate('Hello { 0 }', 'world')).toBe('Hello world');
    });

    it('should leave unmatched placeholders', () => {
      expect(interpolate('Hello {0} {1}', 'world')).toBe('Hello world {1}');
    });

    it('should return text as-is when no params', () => {
      expect(interpolate('Hello world')).toBe('Hello world');
    });
  });

  describe('isNullOrUndefined', () => {
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

    it('should return false for objects', () => {
      expect(isNullOrUndefined({})).toBe(false);
    });
  });

  describe('removeDefaultPlaceholders', () => {
    it('should replace __default values with undefined', () => {
      const result = removeDefaultPlaceholders({ name: '__default', value: 'real' });
      expect(result.name).toBeUndefined();
      expect(result.value).toBe('real');
    });

    it('should keep non-default values', () => {
      const result = removeDefaultPlaceholders({ name: 'test', count: 42 });
      expect(result.name).toBe('test');
      expect(result.count).toBe(42);
    });

    it('should handle empty object', () => {
      const result = removeDefaultPlaceholders({});
      expect(result).toEqual({});
    });

    it('should handle all defaults', () => {
      const result = removeDefaultPlaceholders({ a: '__default', b: '__default' });
      expect(result.a).toBeUndefined();
      expect(result.b).toBeUndefined();
    });
  });
});
