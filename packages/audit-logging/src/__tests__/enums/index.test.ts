/**
 * Tests for enums barrel export
 * @abpjs/audit-logging v2.7.0
 */
import { describe, it, expect } from 'vitest';
import * as enumsExports from '../../enums';
import { eAuditLoggingComponents } from '../../enums/components';
import { eEntityChangeType } from '../../enums/entity-change';
import { eAuditLoggingRouteNames } from '../../enums/route-names';

describe('enums barrel export (v2.7.0)', () => {
  describe('re-exports', () => {
    it('should export eAuditLoggingComponents', () => {
      expect(enumsExports.eAuditLoggingComponents).toBeDefined();
      expect(enumsExports.eAuditLoggingComponents).toBe(eAuditLoggingComponents);
    });

    it('should export eEntityChangeType', () => {
      expect(enumsExports.eEntityChangeType).toBeDefined();
      expect(enumsExports.eEntityChangeType).toBe(eEntityChangeType);
    });

    it('should export eAuditLoggingRouteNames', () => {
      expect(enumsExports.eAuditLoggingRouteNames).toBeDefined();
      expect(enumsExports.eAuditLoggingRouteNames).toBe(eAuditLoggingRouteNames);
    });
  });

  describe('export completeness', () => {
    it('should export all enum objects', () => {
      const exportKeys = Object.keys(enumsExports);
      expect(exportKeys).toContain('eAuditLoggingComponents');
      expect(exportKeys).toContain('eEntityChangeType');
      expect(exportKeys).toContain('eAuditLoggingRouteNames');
    });
  });
});
