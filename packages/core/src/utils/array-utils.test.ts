import { describe, it, expect } from 'vitest';
import { pushValueTo, uniqueBy, groupBy } from './array-utils';

describe('array-utils', () => {
  describe('pushValueTo', () => {
    it('should return a function that pushes elements to array', () => {
      const items: string[] = [];
      const addItem = pushValueTo(items);

      addItem('first');

      expect(items).toEqual(['first']);
    });

    it('should return the modified array after push', () => {
      const items: string[] = [];
      const addItem = pushValueTo(items);

      const result = addItem('first');

      expect(result).toBe(items);
      expect(result).toEqual(['first']);
    });

    it('should accumulate multiple pushes', () => {
      const items: string[] = [];
      const addItem = pushValueTo(items);

      addItem('first');
      addItem('second');
      addItem('third');

      expect(items).toEqual(['first', 'second', 'third']);
    });

    it('should work with objects', () => {
      interface Item {
        id: number;
        name: string;
      }

      const items: Item[] = [];
      const addItem = pushValueTo(items);

      addItem({ id: 1, name: 'first' });
      addItem({ id: 2, name: 'second' });

      expect(items).toHaveLength(2);
      expect(items[0].id).toBe(1);
      expect(items[1].id).toBe(2);
    });

    it('should work with numbers', () => {
      const numbers: number[] = [];
      const addNumber = pushValueTo(numbers);

      addNumber(1);
      addNumber(2);
      addNumber(3);

      expect(numbers).toEqual([1, 2, 3]);
    });

    it('should allow adding duplicates', () => {
      const items: string[] = [];
      const addItem = pushValueTo(items);

      addItem('same');
      addItem('same');

      expect(items).toEqual(['same', 'same']);
    });
  });

  describe('uniqueBy', () => {
    it('should remove duplicates from primitive array without keySelector', () => {
      const numbers = [1, 2, 2, 3, 3, 3, 4];

      const result = uniqueBy(numbers);

      expect(result).toEqual([1, 2, 3, 4]);
    });

    it('should remove duplicates from string array without keySelector', () => {
      const strings = ['a', 'b', 'b', 'c', 'a'];

      const result = uniqueBy(strings);

      expect(result).toEqual(['a', 'b', 'c']);
    });

    it('should use keySelector to determine uniqueness', () => {
      interface Item {
        id: number;
        name: string;
      }

      const items: Item[] = [
        { id: 1, name: 'first' },
        { id: 2, name: 'second' },
        { id: 1, name: 'duplicate' },
        { id: 3, name: 'third' },
      ];

      const result = uniqueBy(items, (item) => item.id);

      expect(result).toHaveLength(3);
      expect(result.map((i) => i.id)).toEqual([1, 2, 3]);
      expect(result[0].name).toBe('first'); // Keeps first occurrence
    });

    it('should return empty array for empty input', () => {
      const result = uniqueBy([]);

      expect(result).toEqual([]);
    });

    it('should return same elements for array with no duplicates', () => {
      const items = [1, 2, 3, 4, 5];

      const result = uniqueBy(items);

      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should preserve order (keeps first occurrence)', () => {
      const items = ['c', 'a', 'b', 'a', 'c', 'd'];

      const result = uniqueBy(items);

      expect(result).toEqual(['c', 'a', 'b', 'd']);
    });

    it('should work with complex keys', () => {
      interface Item {
        category: string;
        type: string;
        value: number;
      }

      const items: Item[] = [
        { category: 'A', type: 'X', value: 1 },
        { category: 'A', type: 'Y', value: 2 },
        { category: 'A', type: 'X', value: 3 },
        { category: 'B', type: 'X', value: 4 },
      ];

      const result = uniqueBy(items, (item) => `${item.category}-${item.type}`);

      expect(result).toHaveLength(3);
      expect(result[0].value).toBe(1);
      expect(result[1].value).toBe(2);
      expect(result[2].value).toBe(4);
    });

    it('should not mutate original array', () => {
      const original = [1, 2, 2, 3];
      const copy = [...original];

      uniqueBy(original);

      expect(original).toEqual(copy);
    });

    it('should handle null and undefined values', () => {
      const items = [null, undefined, null, 1, undefined, 2];

      const result = uniqueBy(items);

      expect(result).toEqual([null, undefined, 1, 2]);
    });
  });

  describe('groupBy', () => {
    it('should group items by key', () => {
      interface Item {
        category: string;
        name: string;
      }

      const items: Item[] = [
        { category: 'A', name: 'item1' },
        { category: 'B', name: 'item2' },
        { category: 'A', name: 'item3' },
        { category: 'B', name: 'item4' },
        { category: 'C', name: 'item5' },
      ];

      const result = groupBy(items, (item) => item.category);

      expect(result.size).toBe(3);
      expect(result.get('A')).toHaveLength(2);
      expect(result.get('B')).toHaveLength(2);
      expect(result.get('C')).toHaveLength(1);
    });

    it('should return empty Map for empty array', () => {
      const result = groupBy([], (item: string) => item);

      expect(result.size).toBe(0);
    });

    it('should preserve order within groups', () => {
      const items = [
        { type: 'A', order: 1 },
        { type: 'A', order: 2 },
        { type: 'A', order: 3 },
      ];

      const result = groupBy(items, (item) => item.type);

      const group = result.get('A')!;
      expect(group[0].order).toBe(1);
      expect(group[1].order).toBe(2);
      expect(group[2].order).toBe(3);
    });

    it('should work with numeric keys', () => {
      const items = [
        { year: 2020, value: 'a' },
        { year: 2021, value: 'b' },
        { year: 2020, value: 'c' },
      ];

      const result = groupBy(items, (item) => item.year);

      expect(result.get(2020)).toHaveLength(2);
      expect(result.get(2021)).toHaveLength(1);
    });

    it('should work with boolean keys', () => {
      const items = [
        { active: true, name: 'a' },
        { active: false, name: 'b' },
        { active: true, name: 'c' },
      ];

      const result = groupBy(items, (item) => item.active);

      expect(result.get(true)).toHaveLength(2);
      expect(result.get(false)).toHaveLength(1);
    });

    it('should handle null keys', () => {
      interface Item {
        category: string | null;
        name: string;
      }

      const items: Item[] = [
        { category: 'A', name: 'item1' },
        { category: null, name: 'item2' },
        { category: 'A', name: 'item3' },
        { category: null, name: 'item4' },
      ];

      const result = groupBy(items, (item) => item.category);

      expect(result.get('A')).toHaveLength(2);
      expect(result.get(null)).toHaveLength(2);
    });

    it('should work with computed keys', () => {
      const items = [
        { value: 1 },
        { value: 2 },
        { value: 3 },
        { value: 4 },
        { value: 5 },
      ];

      const result = groupBy(items, (item) => (item.value % 2 === 0 ? 'even' : 'odd'));

      expect(result.get('odd')).toHaveLength(3);
      expect(result.get('even')).toHaveLength(2);
    });

    it('should not mutate original array', () => {
      const original = [
        { type: 'A', value: 1 },
        { type: 'B', value: 2 },
      ];
      const copy = JSON.parse(JSON.stringify(original));

      groupBy(original, (item) => item.type);

      expect(original).toEqual(copy);
    });

    it('should work with single item per group', () => {
      const items = [
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
        { id: 3, name: 'c' },
      ];

      const result = groupBy(items, (item) => item.id);

      expect(result.size).toBe(3);
      expect(result.get(1)).toHaveLength(1);
      expect(result.get(2)).toHaveLength(1);
      expect(result.get(3)).toHaveLength(1);
    });
  });
});
