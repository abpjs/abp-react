import { describe, it, expect } from 'vitest';
import { mapEnumToOptions } from './form-utils';

describe('form-utils (v2.7.0)', () => {
  describe('mapEnumToOptions', () => {
    it('should convert numeric enum to options array', () => {
      enum Status {
        Active = 0,
        Inactive = 1,
        Pending = 2,
      }

      const options = mapEnumToOptions(Status);

      expect(options).toHaveLength(3);
      expect(options[0]).toEqual({ key: 'Active', value: 0 });
      expect(options[1]).toEqual({ key: 'Inactive', value: 1 });
      expect(options[2]).toEqual({ key: 'Pending', value: 2 });
    });

    it('should convert string enum to options array', () => {
      enum Color {
        Red = 'red',
        Green = 'green',
        Blue = 'blue',
      }

      const options = mapEnumToOptions(Color);

      expect(options).toHaveLength(3);
      expect(options[0]).toEqual({ key: 'Red', value: 'red' });
      expect(options[1]).toEqual({ key: 'Green', value: 'green' });
      expect(options[2]).toEqual({ key: 'Blue', value: 'blue' });
    });

    it('should filter out reverse mappings from numeric enums', () => {
      enum Priority {
        Low = 1,
        Medium = 2,
        High = 3,
      }

      // Numeric enums have reverse mappings: Priority[1] === 'Low'
      // mapEnumToOptions should filter these out
      const options = mapEnumToOptions(Priority);

      expect(options).toHaveLength(3);
      options.forEach((opt) => {
        expect(typeof opt.key).toBe('string');
        expect(isNaN(Number(opt.key))).toBe(true);
      });
    });

    it('should handle empty enum', () => {
      enum Empty {}

      const options = mapEnumToOptions(Empty);

      expect(options).toHaveLength(0);
      expect(options).toEqual([]);
    });

    it('should handle single-value enum', () => {
      enum Single {
        Only = 'only-value',
      }

      const options = mapEnumToOptions(Single);

      expect(options).toHaveLength(1);
      expect(options[0]).toEqual({ key: 'Only', value: 'only-value' });
    });

    it('should maintain enum order', () => {
      enum Order {
        First = 'a',
        Second = 'b',
        Third = 'c',
        Fourth = 'd',
      }

      const options = mapEnumToOptions(Order);

      expect(options[0].key).toBe('First');
      expect(options[1].key).toBe('Second');
      expect(options[2].key).toBe('Third');
      expect(options[3].key).toBe('Fourth');
    });

    it('should work with const enum equivalent objects', () => {
      // const enums are erased at compile time, but object literals work the same
      const StatusLike = {
        Draft: 0,
        Published: 1,
        Archived: 2,
      } as const;

      const options = mapEnumToOptions(StatusLike);

      expect(options).toHaveLength(3);
      expect(options).toContainEqual({ key: 'Draft', value: 0 });
      expect(options).toContainEqual({ key: 'Published', value: 1 });
      expect(options).toContainEqual({ key: 'Archived', value: 2 });
    });

    it('should be usable in React select components', () => {
      enum UserRole {
        Admin = 'admin',
        User = 'user',
        Guest = 'guest',
      }

      const options = mapEnumToOptions(UserRole);

      // Simulate usage in a select component
      const selectOptions = options.map((opt) => ({
        label: opt.key,
        value: opt.value,
      }));

      expect(selectOptions).toEqual([
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
        { label: 'Guest', value: 'guest' },
      ]);
    });
  });
});
