/**
 * Tests for audit-logging constants
 * @abpjs/audit-logging v0.7.2
 */
import { describe, it, expect } from 'vitest';
import { AUDIT_LOGGING_ROUTES, HTTP_METHODS, HTTP_STATUS_CODES } from '../constants';

describe('Constants', () => {
  describe('AUDIT_LOGGING_ROUTES', () => {
    it('should have routes array', () => {
      expect(AUDIT_LOGGING_ROUTES.routes).toBeDefined();
      expect(Array.isArray(AUDIT_LOGGING_ROUTES.routes)).toBe(true);
    });

    it('should have audit-logs route', () => {
      const auditLogsRoute = AUDIT_LOGGING_ROUTES.routes.find(r => r.path === 'audit-logs');
      expect(auditLogsRoute).toBeDefined();
      expect(auditLogsRoute?.name).toBe('AuditLogs');
      expect(auditLogsRoute?.requiredPolicy).toBe('AuditLogging.AuditLogs');
    });
  });

  describe('HTTP_METHODS', () => {
    it('should contain common HTTP methods', () => {
      expect(HTTP_METHODS).toContain('GET');
      expect(HTTP_METHODS).toContain('POST');
      expect(HTTP_METHODS).toContain('PUT');
      expect(HTTP_METHODS).toContain('DELETE');
      expect(HTTP_METHODS).toContain('PATCH');
    });

    it('should be an array', () => {
      expect(Array.isArray(HTTP_METHODS)).toBe(true);
      expect(HTTP_METHODS.length).toBeGreaterThan(0);
    });
  });

  describe('HTTP_STATUS_CODES', () => {
    it('should contain common status codes', () => {
      const code200 = HTTP_STATUS_CODES.find(s => s.code === 200);
      expect(code200).toBeDefined();
      expect(code200?.message).toBe('OK');

      const code404 = HTTP_STATUS_CODES.find(s => s.code === 404);
      expect(code404).toBeDefined();
      expect(code404?.message).toBe('Not Found');

      const code500 = HTTP_STATUS_CODES.find(s => s.code === 500);
      expect(code500).toBeDefined();
      expect(code500?.message).toBe('Internal Server Error');
    });

    it('should have code and message for each entry', () => {
      HTTP_STATUS_CODES.forEach(status => {
        expect(typeof status.code).toBe('number');
        expect(typeof status.message).toBe('string');
        expect(status.message.length).toBeGreaterThan(0);
      });
    });
  });
});
