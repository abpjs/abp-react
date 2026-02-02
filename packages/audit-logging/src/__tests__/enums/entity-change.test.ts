/**
 * Tests for eEntityChangeType
 * @abpjs/audit-logging v2.7.0
 */
import { describe, it, expect } from 'vitest';
import { eEntityChangeType } from '../../enums/entity-change';

describe('eEntityChangeType (v2.7.0)', () => {
  describe('enum values', () => {
    it('should have Created with value 0', () => {
      expect(eEntityChangeType.Created).toBe(0);
    });

    it('should have Updated with value 1', () => {
      expect(eEntityChangeType.Updated).toBe(1);
    });

    it('should have Deleted with value 2', () => {
      expect(eEntityChangeType.Deleted).toBe(2);
    });
  });

  describe('enum structure', () => {
    it('should have exactly 3 named keys', () => {
      // TypeScript numeric enums have both key->value and value->key mappings
      const namedKeys = Object.keys(eEntityChangeType).filter(
        (key) => isNaN(Number(key))
      );
      expect(namedKeys).toHaveLength(3);
    });

    it('should have all expected keys', () => {
      const namedKeys = Object.keys(eEntityChangeType).filter(
        (key) => isNaN(Number(key))
      );
      expect(namedKeys).toContain('Created');
      expect(namedKeys).toContain('Updated');
      expect(namedKeys).toContain('Deleted');
    });

    it('should support reverse mapping (value to key)', () => {
      expect(eEntityChangeType[0]).toBe('Created');
      expect(eEntityChangeType[1]).toBe('Updated');
      expect(eEntityChangeType[2]).toBe('Deleted');
    });
  });

  describe('type safety', () => {
    it('should work with eEntityChangeType type annotation', () => {
      const created: eEntityChangeType = eEntityChangeType.Created;
      const updated: eEntityChangeType = eEntityChangeType.Updated;
      const deleted: eEntityChangeType = eEntityChangeType.Deleted;

      expect(created).toBe(0);
      expect(updated).toBe(1);
      expect(deleted).toBe(2);
    });

    it('should be usable as numeric values', () => {
      const value: number = eEntityChangeType.Updated;
      expect(value).toBe(1);
      expect(typeof value).toBe('number');
    });
  });

  describe('usage patterns', () => {
    it('should work in switch statements', () => {
      const getChangeTypeLabel = (type: eEntityChangeType): string => {
        switch (type) {
          case eEntityChangeType.Created:
            return 'Created';
          case eEntityChangeType.Updated:
            return 'Updated';
          case eEntityChangeType.Deleted:
            return 'Deleted';
          default:
            return 'Unknown';
        }
      };

      expect(getChangeTypeLabel(eEntityChangeType.Created)).toBe('Created');
      expect(getChangeTypeLabel(eEntityChangeType.Updated)).toBe('Updated');
      expect(getChangeTypeLabel(eEntityChangeType.Deleted)).toBe('Deleted');
    });

    it('should work for filtering entity changes', () => {
      const entityChanges = [
        { id: '1', changeType: eEntityChangeType.Created },
        { id: '2', changeType: eEntityChangeType.Updated },
        { id: '3', changeType: eEntityChangeType.Deleted },
        { id: '4', changeType: eEntityChangeType.Updated },
      ];

      const createdChanges = entityChanges.filter(
        (c) => c.changeType === eEntityChangeType.Created
      );
      const updatedChanges = entityChanges.filter(
        (c) => c.changeType === eEntityChangeType.Updated
      );
      const deletedChanges = entityChanges.filter(
        (c) => c.changeType === eEntityChangeType.Deleted
      );

      expect(createdChanges).toHaveLength(1);
      expect(updatedChanges).toHaveLength(2);
      expect(deletedChanges).toHaveLength(1);
    });

    it('should work for comparison operations', () => {
      expect(eEntityChangeType.Created < eEntityChangeType.Updated).toBe(true);
      expect(eEntityChangeType.Updated < eEntityChangeType.Deleted).toBe(true);
      expect(eEntityChangeType.Created < eEntityChangeType.Deleted).toBe(true);
    });

    it('should allow iterating over all change types', () => {
      const allTypes = [
        eEntityChangeType.Created,
        eEntityChangeType.Updated,
        eEntityChangeType.Deleted,
      ];

      expect(allTypes).toEqual([0, 1, 2]);
    });
  });
});
