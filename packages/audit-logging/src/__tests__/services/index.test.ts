/**
 * Tests for services/index exports
 * @abpjs/audit-logging v3.2.0
 */
import { describe, it, expect } from 'vitest';
import * as ServicesExports from '../../services';
import { AuditLoggingStateService } from '../../services/audit-logging-state.service';
import { AuditLoggingService } from '../../services/audit-logging.service';
import { EntityChangeService } from '../../services/entity-change.service';
import { AuditLogsService } from '../../proxy/audit-logging/audit-logs.service';

describe('services/index exports (v3.2.0)', () => {
  describe('existing service exports', () => {
    it('should export AuditLoggingStateService', () => {
      expect(ServicesExports.AuditLoggingStateService).toBeDefined();
      expect(ServicesExports.AuditLoggingStateService).toBe(
        AuditLoggingStateService
      );
    });

    it('should export AuditLoggingService', () => {
      expect(ServicesExports.AuditLoggingService).toBeDefined();
      expect(ServicesExports.AuditLoggingService).toBe(AuditLoggingService);
    });

    it('should export EntityChangeService', () => {
      expect(ServicesExports.EntityChangeService).toBeDefined();
      expect(ServicesExports.EntityChangeService).toBe(EntityChangeService);
    });
  });

  describe('v3.2.0 proxy service re-export', () => {
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

  describe('export completeness', () => {
    it('should export all 4 services', () => {
      const exportedKeys = Object.keys(ServicesExports);

      expect(exportedKeys).toContain('AuditLoggingStateService');
      expect(exportedKeys).toContain('AuditLoggingService');
      expect(exportedKeys).toContain('EntityChangeService');
      expect(exportedKeys).toContain('AuditLogsService');
    });
  });

  describe('service type verification', () => {
    it('should export AuditLoggingStateService as a class', () => {
      expect(typeof ServicesExports.AuditLoggingStateService).toBe('function');
    });

    it('should export AuditLoggingService as a class', () => {
      expect(typeof ServicesExports.AuditLoggingService).toBe('function');
    });

    it('should export EntityChangeService as a class', () => {
      expect(typeof ServicesExports.EntityChangeService).toBe('function');
    });

    it('should export AuditLogsService as a class', () => {
      expect(typeof ServicesExports.AuditLogsService).toBe('function');
    });
  });
});
