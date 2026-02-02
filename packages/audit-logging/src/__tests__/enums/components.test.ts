/**
 * Tests for eAuditLoggingComponents
 * @abpjs/audit-logging v2.7.0
 */
import { describe, it, expect } from 'vitest';
import {
  eAuditLoggingComponents,
  type AuditLoggingComponentKey,
} from '../../enums/components';

describe('eAuditLoggingComponents (v2.7.0)', () => {
  describe('enum values', () => {
    it('should have AuditLogs key with correct value', () => {
      expect(eAuditLoggingComponents.AuditLogs).toBe(
        'AuditLogging.AuditLogsComponent'
      );
    });

    it('should have EntityChanges key with correct value (v2.7.0)', () => {
      expect(eAuditLoggingComponents.EntityChanges).toBe(
        'AuditLogging.EntityChangesComponent'
      );
    });
  });

  describe('enum structure', () => {
    it('should have exactly 2 keys', () => {
      const keys = Object.keys(eAuditLoggingComponents);
      expect(keys).toHaveLength(2);
    });

    it('should have all expected keys', () => {
      const keys = Object.keys(eAuditLoggingComponents);
      expect(keys).toContain('AuditLogs');
      expect(keys).toContain('EntityChanges');
    });

    it('should be immutable (const assertion)', () => {
      expect(typeof eAuditLoggingComponents).toBe('object');
      expect(eAuditLoggingComponents).not.toBeNull();
    });
  });

  describe('type safety', () => {
    it('should work with AuditLoggingComponentKey type', () => {
      const auditLogsKey: AuditLoggingComponentKey =
        eAuditLoggingComponents.AuditLogs;
      const entityChangesKey: AuditLoggingComponentKey =
        eAuditLoggingComponents.EntityChanges;

      expect(auditLogsKey).toBe('AuditLogging.AuditLogsComponent');
      expect(entityChangesKey).toBe('AuditLogging.EntityChangesComponent');
    });

    it('should preserve literal types', () => {
      const value = eAuditLoggingComponents.AuditLogs;
      expect(value).toBe('AuditLogging.AuditLogsComponent');

      const exactValue: 'AuditLogging.AuditLogsComponent' =
        eAuditLoggingComponents.AuditLogs;
      expect(exactValue).toBe('AuditLogging.AuditLogsComponent');
    });
  });

  describe('usage patterns', () => {
    it('should allow iteration over all component keys', () => {
      const allKeys = Object.values(eAuditLoggingComponents);
      expect(allKeys).toHaveLength(2);
      expect(allKeys.every((key) => key.startsWith('AuditLogging.'))).toBe(
        true
      );
    });

    it('should allow lookup by key name', () => {
      const keyName = 'EntityChanges' as keyof typeof eAuditLoggingComponents;
      const value = eAuditLoggingComponents[keyName];
      expect(value).toBe('AuditLogging.EntityChangesComponent');
    });

    it('should work in switch statements', () => {
      const getComponentLabel = (): AuditLoggingComponentKey =>
        eAuditLoggingComponents.EntityChanges;
      const componentKey = getComponentLabel();
      let label: string;

      switch (componentKey) {
        case eAuditLoggingComponents.AuditLogs:
          label = 'Audit Logs';
          break;
        case eAuditLoggingComponents.EntityChanges:
          label = 'Entity Changes';
          break;
        default:
          label = 'Unknown';
      }

      expect(label).toBe('Entity Changes');
    });

    it('should work as object keys for component registration', () => {
      const componentRegistry: Record<AuditLoggingComponentKey, boolean> = {
        [eAuditLoggingComponents.AuditLogs]: true,
        [eAuditLoggingComponents.EntityChanges]: true,
      };

      expect(
        componentRegistry[
          eAuditLoggingComponents.AuditLogs as AuditLoggingComponentKey
        ]
      ).toBe(true);
      expect(
        componentRegistry[
          eAuditLoggingComponents.EntityChanges as AuditLoggingComponentKey
        ]
      ).toBe(true);
    });
  });
});
