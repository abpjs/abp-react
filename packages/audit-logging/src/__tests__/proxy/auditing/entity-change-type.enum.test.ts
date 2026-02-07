/**
 * Tests for EntityChangeType enum and entityChangeTypeOptions (Proxy)
 * @abpjs/audit-logging v3.2.0
 */
import { describe, it, expect } from 'vitest';
import {
  EntityChangeType,
  entityChangeTypeOptions,
} from '../../../proxy/auditing/entity-change-type.enum';
import { eEntityChangeType } from '../../../enums/entity-change';

describe('EntityChangeType enum (v3.2.0)', () => {
  describe('enum values', () => {
    it('should have Created with value 0', () => {
      expect(EntityChangeType.Created).toBe(0);
    });

    it('should have Updated with value 1', () => {
      expect(EntityChangeType.Updated).toBe(1);
    });

    it('should have Deleted with value 2', () => {
      expect(EntityChangeType.Deleted).toBe(2);
    });
  });

  describe('enum structure', () => {
    it('should have exactly 3 named keys', () => {
      const namedKeys = Object.keys(EntityChangeType).filter(
        (key) => isNaN(Number(key))
      );
      expect(namedKeys).toHaveLength(3);
    });

    it('should have all expected keys', () => {
      const namedKeys = Object.keys(EntityChangeType).filter(
        (key) => isNaN(Number(key))
      );
      expect(namedKeys).toContain('Created');
      expect(namedKeys).toContain('Updated');
      expect(namedKeys).toContain('Deleted');
    });

    it('should support reverse mapping (value to key)', () => {
      expect(EntityChangeType[0]).toBe('Created');
      expect(EntityChangeType[1]).toBe('Updated');
      expect(EntityChangeType[2]).toBe('Deleted');
    });
  });

  describe('compatibility with eEntityChangeType', () => {
    it('should have the same values as eEntityChangeType', () => {
      expect(EntityChangeType.Created).toBe(eEntityChangeType.Created);
      expect(EntityChangeType.Updated).toBe(eEntityChangeType.Updated);
      expect(EntityChangeType.Deleted).toBe(eEntityChangeType.Deleted);
    });

    it('should be usable interchangeably with eEntityChangeType values', () => {
      const value1: number = EntityChangeType.Created;
      const value2: number = eEntityChangeType.Created;
      expect(value1).toBe(value2);
    });
  });

  describe('type safety', () => {
    it('should work with EntityChangeType type annotation', () => {
      const created: EntityChangeType = EntityChangeType.Created;
      const updated: EntityChangeType = EntityChangeType.Updated;
      const deleted: EntityChangeType = EntityChangeType.Deleted;

      expect(created).toBe(0);
      expect(updated).toBe(1);
      expect(deleted).toBe(2);
    });

    it('should be usable as numeric values', () => {
      const value: number = EntityChangeType.Updated;
      expect(value).toBe(1);
      expect(typeof value).toBe('number');
    });
  });

  describe('usage patterns', () => {
    it('should work in switch statements', () => {
      const getChangeTypeLabel = (type: EntityChangeType): string => {
        switch (type) {
          case EntityChangeType.Created:
            return 'Created';
          case EntityChangeType.Updated:
            return 'Updated';
          case EntityChangeType.Deleted:
            return 'Deleted';
          default:
            return 'Unknown';
        }
      };

      expect(getChangeTypeLabel(EntityChangeType.Created)).toBe('Created');
      expect(getChangeTypeLabel(EntityChangeType.Updated)).toBe('Updated');
      expect(getChangeTypeLabel(EntityChangeType.Deleted)).toBe('Deleted');
    });

    it('should work for filtering entity changes', () => {
      const entityChanges = [
        { id: '1', changeType: EntityChangeType.Created },
        { id: '2', changeType: EntityChangeType.Updated },
        { id: '3', changeType: EntityChangeType.Deleted },
        { id: '4', changeType: EntityChangeType.Updated },
      ];

      const createdChanges = entityChanges.filter(
        (c) => c.changeType === EntityChangeType.Created
      );
      const updatedChanges = entityChanges.filter(
        (c) => c.changeType === EntityChangeType.Updated
      );
      const deletedChanges = entityChanges.filter(
        (c) => c.changeType === EntityChangeType.Deleted
      );

      expect(createdChanges).toHaveLength(1);
      expect(updatedChanges).toHaveLength(2);
      expect(deletedChanges).toHaveLength(1);
    });

    it('should work for comparison operations', () => {
      expect(EntityChangeType.Created < EntityChangeType.Updated).toBe(true);
      expect(EntityChangeType.Updated < EntityChangeType.Deleted).toBe(true);
      expect(EntityChangeType.Created < EntityChangeType.Deleted).toBe(true);
    });
  });
});

describe('entityChangeTypeOptions (v3.2.0)', () => {
  describe('structure', () => {
    it('should be an array with exactly 3 options', () => {
      expect(Array.isArray(entityChangeTypeOptions)).toBe(true);
      expect(entityChangeTypeOptions).toHaveLength(3);
    });

    it('should have label and value properties for each option', () => {
      for (const option of entityChangeTypeOptions) {
        expect(option).toHaveProperty('label');
        expect(option).toHaveProperty('value');
        expect(typeof option.label).toBe('string');
        expect(typeof option.value).toBe('number');
      }
    });
  });

  describe('option values', () => {
    it('should have Created option with value 0', () => {
      const createdOption = entityChangeTypeOptions.find(
        (o) => o.label === 'Created'
      );
      expect(createdOption).toBeDefined();
      expect(createdOption?.value).toBe(EntityChangeType.Created);
    });

    it('should have Updated option with value 1', () => {
      const updatedOption = entityChangeTypeOptions.find(
        (o) => o.label === 'Updated'
      );
      expect(updatedOption).toBeDefined();
      expect(updatedOption?.value).toBe(EntityChangeType.Updated);
    });

    it('should have Deleted option with value 2', () => {
      const deletedOption = entityChangeTypeOptions.find(
        (o) => o.label === 'Deleted'
      );
      expect(deletedOption).toBeDefined();
      expect(deletedOption?.value).toBe(EntityChangeType.Deleted);
    });
  });

  describe('order', () => {
    it('should be ordered by enum value (Created, Updated, Deleted)', () => {
      expect(entityChangeTypeOptions[0].label).toBe('Created');
      expect(entityChangeTypeOptions[1].label).toBe('Updated');
      expect(entityChangeTypeOptions[2].label).toBe('Deleted');
    });

    it('should have values in ascending order', () => {
      expect(entityChangeTypeOptions[0].value).toBe(0);
      expect(entityChangeTypeOptions[1].value).toBe(1);
      expect(entityChangeTypeOptions[2].value).toBe(2);
    });
  });

  describe('usage in select components', () => {
    it('should be usable to create option elements', () => {
      const options = entityChangeTypeOptions.map((o) => ({
        key: o.value,
        text: o.label,
      }));

      expect(options).toEqual([
        { key: 0, text: 'Created' },
        { key: 1, text: 'Updated' },
        { key: 2, text: 'Deleted' },
      ]);
    });

    it('should allow finding option by value', () => {
      const findOptionByValue = (value: EntityChangeType) =>
        entityChangeTypeOptions.find((o) => o.value === value);

      expect(findOptionByValue(EntityChangeType.Created)?.label).toBe(
        'Created'
      );
      expect(findOptionByValue(EntityChangeType.Updated)?.label).toBe(
        'Updated'
      );
      expect(findOptionByValue(EntityChangeType.Deleted)?.label).toBe(
        'Deleted'
      );
    });

    it('should be usable for dropdown validation', () => {
      const isValidChangeType = (value: number): boolean =>
        entityChangeTypeOptions.some((o) => o.value === value);

      expect(isValidChangeType(0)).toBe(true);
      expect(isValidChangeType(1)).toBe(true);
      expect(isValidChangeType(2)).toBe(true);
      expect(isValidChangeType(3)).toBe(false);
      expect(isValidChangeType(-1)).toBe(false);
    });
  });

  describe('readonly nature', () => {
    it('should be a const array (readonly)', () => {
      // The type is "readonly" due to "as const"
      // We can verify the values are frozen-like by checking they match expected values
      const originalLength = entityChangeTypeOptions.length;
      expect(originalLength).toBe(3);

      // Verify all values are as expected (immutable pattern)
      expect(entityChangeTypeOptions[0]).toEqual({
        label: 'Created',
        value: 0,
      });
      expect(entityChangeTypeOptions[1]).toEqual({
        label: 'Updated',
        value: 1,
      });
      expect(entityChangeTypeOptions[2]).toEqual({
        label: 'Deleted',
        value: 2,
      });
    });
  });
});
