import { describe, it, expect } from 'vitest';
import { deepMerge } from './object-utils';

describe('object-utils (v3.1.0)', () => {
  describe('deepMerge', () => {
    it('should merge flat objects', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3, c: 4 };
      const result = deepMerge(target, source);

      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should not mutate the original target', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3 };
      const result = deepMerge(target, source);

      expect(target).toEqual({ a: 1, b: 2 });
      expect(result).not.toBe(target);
    });

    it('should deeply merge nested objects', () => {
      const target = {
        level1: {
          level2: {
            a: 1,
            b: 2,
          },
          other: 'value',
        },
      };
      const source = {
        level1: {
          level2: {
            b: 3,
            c: 4,
          },
        },
      };
      const result = deepMerge(target, source);

      expect(result).toEqual({
        level1: {
          level2: {
            a: 1,
            b: 3,
            c: 4,
          },
          other: 'value',
        },
      });
    });

    it('should replace arrays (not merge them)', () => {
      const target = { items: [1, 2, 3] };
      const source = { items: [4, 5] };
      const result = deepMerge(target, source);

      expect(result).toEqual({ items: [4, 5] });
    });

    it('should create a copy of source arrays', () => {
      const sourceArray = [1, 2, 3];
      const target = { items: [] as number[] };
      const source = { items: sourceArray };
      const result = deepMerge(target, source);

      // Modify the source array
      sourceArray.push(4);

      // Result array should not be affected
      expect(result.items).toEqual([1, 2, 3]);
      expect(result.items).not.toBe(sourceArray);
    });

    it('should handle mixed nested objects and arrays', () => {
      const target = {
        config: {
          items: [1, 2],
          settings: {
            enabled: true,
            values: ['a'],
          },
        },
      };
      const source = {
        config: {
          items: [3, 4, 5],
          settings: {
            values: ['b', 'c'],
            newProp: 'new',
          },
        },
      };
      const result = deepMerge(target, source);

      expect(result).toEqual({
        config: {
          items: [3, 4, 5],
          settings: {
            enabled: true,
            values: ['b', 'c'],
            newProp: 'new',
          },
        },
      });
    });

    it('should handle null values in source', () => {
      const target = { a: 1, b: { nested: true } };
      const source = { b: null as unknown as { nested: boolean } };
      const result = deepMerge(target, source);

      expect(result).toEqual({ a: 1, b: null });
    });

    it('should handle undefined values in source', () => {
      const target = { a: 1, b: 2 };
      const source = { b: undefined };
      const result = deepMerge(target, source);

      expect(result).toEqual({ a: 1, b: undefined });
    });

    it('should handle empty source object', () => {
      const target = { a: 1, b: 2 };
      const source = {};
      const result = deepMerge(target, source);

      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('should handle empty target object', () => {
      const target = {};
      const source = { a: 1, b: 2 };
      const result = deepMerge(target, source);

      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('should replace primitive values with objects', () => {
      const target = { a: 1 } as Record<string, unknown>;
      const source = { a: { nested: true } };
      const result = deepMerge(target, source);

      expect(result).toEqual({ a: { nested: true } });
    });

    it('should replace objects with primitive values', () => {
      const target = { a: { nested: true } };
      const source = { a: 1 as unknown as { nested: boolean } };
      const result = deepMerge(target, source);

      expect(result).toEqual({ a: 1 });
    });

    it('should handle deeply nested structures', () => {
      const target = {
        level1: {
          level2: {
            level3: {
              level4: {
                value: 'original',
                keep: 'this',
              },
            },
          },
        },
      };
      const source = {
        level1: {
          level2: {
            level3: {
              level4: {
                value: 'updated',
              },
            },
          },
        },
      };
      const result = deepMerge(target, source);

      expect(result.level1.level2.level3.level4).toEqual({
        value: 'updated',
        keep: 'this',
      });
    });

    it('should handle multiple types in source', () => {
      const target = {
        string: 'old',
        number: 1,
        boolean: false,
        array: [1],
        object: { a: 1 },
      };
      const source = {
        string: 'new',
        number: 2,
        boolean: true,
        array: [2, 3],
        object: { b: 2 },
      };
      const result = deepMerge(target, source);

      expect(result).toEqual({
        string: 'new',
        number: 2,
        boolean: true,
        array: [2, 3],
        object: { a: 1, b: 2 },
      });
    });

    it('should preserve properties not in source', () => {
      const target = { a: 1, b: 2, c: 3 };
      const source = { b: 20 };
      const result = deepMerge(target, source);

      expect(result).toEqual({ a: 1, b: 20, c: 3 });
    });
  });
});
