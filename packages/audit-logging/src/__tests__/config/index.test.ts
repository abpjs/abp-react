/**
 * Tests for config/index exports
 * @abpjs/audit-logging v3.0.0
 */
import { describe, it, expect } from 'vitest';
import * as Config from '../../config';

describe('config exports (v3.0.0)', () => {
  describe('enums exports', () => {
    it('should export eAuditLoggingPolicyNames', () => {
      expect(Config.eAuditLoggingPolicyNames).toBeDefined();
    });

    it('should export eAuditLoggingRouteNames', () => {
      expect(Config.eAuditLoggingRouteNames).toBeDefined();
    });
  });

  describe('providers exports', () => {
    it('should export configureRoutes', () => {
      expect(Config.configureRoutes).toBeDefined();
    });

    it('should export AUDIT_LOGGING_ROUTE_PROVIDERS', () => {
      expect(Config.AUDIT_LOGGING_ROUTE_PROVIDERS).toBeDefined();
    });

    it('should export bindShowDetails', () => {
      expect(Config.bindShowDetails).toBeDefined();
    });

    it('should export ENTITY_DETAILS_PROVIDERS', () => {
      expect(Config.ENTITY_DETAILS_PROVIDERS).toBeDefined();
    });

    it('should export bindShowHistory', () => {
      expect(Config.bindShowHistory).toBeDefined();
    });

    it('should export ENTITY_HISTORY_PROVIDERS', () => {
      expect(Config.ENTITY_HISTORY_PROVIDERS).toBeDefined();
    });
  });

  describe('services exports', () => {
    it('should export EntityChangeModalService', () => {
      expect(Config.EntityChangeModalService).toBeDefined();
    });
  });
});
