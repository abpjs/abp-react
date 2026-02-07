/**
 * Tests for proxy barrel exports
 * @abpjs/audit-logging v3.2.0
 */
import { describe, it, expect } from 'vitest';
import * as proxyExports from '../../proxy';
import { AuditLogsService } from '../../proxy/audit-logging/audit-logs.service';
import {
  EntityChangeType,
  entityChangeTypeOptions,
} from '../../proxy/auditing/entity-change-type.enum';

describe('proxy barrel exports (v3.2.0)', () => {
  describe('audit-logging subpackage exports', () => {
    it('should export AuditLogsService', () => {
      expect(proxyExports.AuditLogsService).toBeDefined();
      expect(proxyExports.AuditLogsService).toBe(AuditLogsService);
    });
  });

  describe('auditing subpackage exports', () => {
    it('should export EntityChangeType enum', () => {
      expect(proxyExports.EntityChangeType).toBeDefined();
      expect(proxyExports.EntityChangeType).toBe(EntityChangeType);
    });

    it('should export entityChangeTypeOptions', () => {
      expect(proxyExports.entityChangeTypeOptions).toBeDefined();
      expect(proxyExports.entityChangeTypeOptions).toBe(entityChangeTypeOptions);
    });
  });

  describe('export completeness', () => {
    it('should export all expected items from both subpackages', () => {
      const exportedKeys = Object.keys(proxyExports);

      // From audit-logging
      expect(exportedKeys).toContain('AuditLogsService');

      // From auditing
      expect(exportedKeys).toContain('EntityChangeType');
      expect(exportedKeys).toContain('entityChangeTypeOptions');
    });
  });

  describe('cross-subpackage functionality', () => {
    it('should allow using EntityChangeType with AuditLogsService types', () => {
      // This verifies that the proxy exports work together
      expect(proxyExports.EntityChangeType.Created).toBe(0);
      expect(proxyExports.EntityChangeType.Updated).toBe(1);
      expect(proxyExports.EntityChangeType.Deleted).toBe(2);

      const mockRestService = { request: () => Promise.resolve({}) };
      const service = new proxyExports.AuditLogsService(
        mockRestService as never
      );
      expect(service).toBeInstanceOf(AuditLogsService);
    });

    it('should allow using entityChangeTypeOptions for UI components', () => {
      const options = proxyExports.entityChangeTypeOptions;
      expect(options).toHaveLength(3);

      // Verify values match EntityChangeType enum
      expect(options[0].value).toBe(proxyExports.EntityChangeType.Created);
      expect(options[1].value).toBe(proxyExports.EntityChangeType.Updated);
      expect(options[2].value).toBe(proxyExports.EntityChangeType.Deleted);
    });
  });

  describe('usage patterns', () => {
    it('should support destructured imports from proxy', () => {
      const { AuditLogsService, EntityChangeType, entityChangeTypeOptions } =
        proxyExports;

      expect(AuditLogsService).toBeDefined();
      expect(EntityChangeType).toBeDefined();
      expect(entityChangeTypeOptions).toBeDefined();
    });

    it('should support selective imports', () => {
      // Just verify the exports exist
      expect(proxyExports.AuditLogsService).toBeDefined();
      expect(proxyExports.EntityChangeType).toBeDefined();
    });
  });
});
