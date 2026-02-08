/**
 * Tests for services/index exports
 * @abpjs/audit-logging v4.0.0
 *
 * @since 4.0.0 - Removed AuditLoggingService and EntityChangeService (use AuditLogsService instead)
 */
import { describe, it, expect } from 'vitest';
import * as ServicesExports from '../../services';
import { AuditLoggingStateService } from '../../services/audit-logging-state.service';
import { AuditLogsService } from '../../proxy/audit-logging/audit-logs.service';

describe('services/index exports (v4.0.0)', () => {
  describe('existing service exports', () => {
    it('should export AuditLoggingStateService', () => {
      expect(ServicesExports.AuditLoggingStateService).toBeDefined();
      expect(ServicesExports.AuditLoggingStateService).toBe(
        AuditLoggingStateService
      );
    });
  });

  describe('proxy service re-export', () => {
    it('should export AuditLogsService from proxy', () => {
      expect(ServicesExports.AuditLogsService).toBeDefined();
      expect(ServicesExports.AuditLogsService).toBe(AuditLogsService);
    });

    it('should allow using AuditLogsService from services barrel', () => {
      const mockRestService = { request: () => Promise.resolve({}) };
      const service = new ServicesExports.AuditLogsService(
        mockRestService as never
      );

      expect(service).toBeInstanceOf(AuditLogsService);
      expect(service.apiName).toBe('default');
    });
  });

  describe('removed services (v4.0.0)', () => {
    it('should no longer export AuditLoggingService', () => {
      expect(
        (ServicesExports as Record<string, unknown>).AuditLoggingService
      ).toBeUndefined();
    });

    it('should no longer export EntityChangeService', () => {
      expect(
        (ServicesExports as Record<string, unknown>).EntityChangeService
      ).toBeUndefined();
    });
  });

  describe('export completeness', () => {
    it('should export exactly 2 services', () => {
      const exportedKeys = Object.keys(ServicesExports);

      expect(exportedKeys).toContain('AuditLoggingStateService');
      expect(exportedKeys).toContain('AuditLogsService');
      expect(exportedKeys).toHaveLength(2);
    });
  });

  describe('service type verification', () => {
    it('should export AuditLoggingStateService as a class', () => {
      expect(typeof ServicesExports.AuditLoggingStateService).toBe('function');
    });

    it('should export AuditLogsService as a class', () => {
      expect(typeof ServicesExports.AuditLogsService).toBe('function');
    });
  });
});
