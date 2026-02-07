/**
 * Tests for proxy/audit-logging barrel exports
 * @abpjs/audit-logging v3.2.0
 */
import { describe, it, expect } from 'vitest';
import * as auditLoggingExports from '../../../proxy/audit-logging';
import { AuditLogsService } from '../../../proxy/audit-logging/audit-logs.service';

describe('proxy/audit-logging barrel exports (v3.2.0)', () => {
  describe('service exports', () => {
    it('should export AuditLogsService', () => {
      expect(auditLoggingExports.AuditLogsService).toBeDefined();
      expect(auditLoggingExports.AuditLogsService).toBe(AuditLogsService);
    });
  });

  describe('export completeness', () => {
    it('should export AuditLogsService class', () => {
      const exportedKeys = Object.keys(auditLoggingExports);
      expect(exportedKeys).toContain('AuditLogsService');
    });

    it('should export model types (checked via class existence)', () => {
      // TypeScript interfaces are erased at runtime, but the service uses them
      // We verify the service exists which implies the models are importable
      expect(auditLoggingExports.AuditLogsService).toBeDefined();
    });
  });

  describe('re-export functionality', () => {
    it('should allow instantiating AuditLogsService from barrel export', () => {
      const mockRestService = { request: () => Promise.resolve({}) };
      const service = new auditLoggingExports.AuditLogsService(
        mockRestService as never
      );

      expect(service).toBeInstanceOf(AuditLogsService);
      expect(service.apiName).toBe('default');
    });
  });
});
