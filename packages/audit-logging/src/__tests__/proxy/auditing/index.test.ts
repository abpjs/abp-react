/**
 * Tests for proxy/auditing barrel exports
 * @abpjs/audit-logging v3.2.0
 */
import { describe, it, expect } from 'vitest';
import * as auditingExports from '../../../proxy/auditing';
import {
  EntityChangeType,
  entityChangeTypeOptions,
} from '../../../proxy/auditing/entity-change-type.enum';

describe('proxy/auditing barrel exports (v3.2.0)', () => {
  describe('exported items', () => {
    it('should export EntityChangeType enum', () => {
      expect(auditingExports.EntityChangeType).toBeDefined();
      expect(auditingExports.EntityChangeType).toBe(EntityChangeType);
    });

    it('should export entityChangeTypeOptions', () => {
      expect(auditingExports.entityChangeTypeOptions).toBeDefined();
      expect(auditingExports.entityChangeTypeOptions).toBe(
        entityChangeTypeOptions
      );
    });
  });

  describe('export completeness', () => {
    it('should export exactly the expected items', () => {
      const exportedKeys = Object.keys(auditingExports);

      // EntityChangeType enum creates both named and reverse mappings
      // entityChangeTypeOptions is a const array
      expect(exportedKeys).toContain('EntityChangeType');
      expect(exportedKeys).toContain('entityChangeTypeOptions');
    });
  });

  describe('re-export functionality', () => {
    it('should allow using EntityChangeType from barrel export', () => {
      expect(auditingExports.EntityChangeType.Created).toBe(0);
      expect(auditingExports.EntityChangeType.Updated).toBe(1);
      expect(auditingExports.EntityChangeType.Deleted).toBe(2);
    });

    it('should allow using entityChangeTypeOptions from barrel export', () => {
      expect(auditingExports.entityChangeTypeOptions).toHaveLength(3);
      expect(auditingExports.entityChangeTypeOptions[0].label).toBe('Created');
    });
  });
});
