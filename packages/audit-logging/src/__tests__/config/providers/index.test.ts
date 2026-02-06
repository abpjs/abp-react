/**
 * Tests for config/providers/index exports
 * @abpjs/audit-logging v3.0.0
 */
import { describe, it, expect } from 'vitest';
import * as ConfigProviders from '../../../config/providers';

describe('config/providers exports (v3.0.0)', () => {
  describe('entity-details.provider exports', () => {
    it('should export bindShowDetails', () => {
      expect(ConfigProviders.bindShowDetails).toBeDefined();
      expect(typeof ConfigProviders.bindShowDetails).toBe('function');
    });

    it('should export ENTITY_DETAILS_PROVIDERS', () => {
      expect(ConfigProviders.ENTITY_DETAILS_PROVIDERS).toBeDefined();
    });
  });

  describe('entity-history.provider exports', () => {
    it('should export bindShowHistory', () => {
      expect(ConfigProviders.bindShowHistory).toBeDefined();
      expect(typeof ConfigProviders.bindShowHistory).toBe('function');
    });

    it('should export ENTITY_HISTORY_PROVIDERS', () => {
      expect(ConfigProviders.ENTITY_HISTORY_PROVIDERS).toBeDefined();
    });
  });

  describe('route.provider exports', () => {
    it('should export configureRoutes', () => {
      expect(ConfigProviders.configureRoutes).toBeDefined();
      expect(typeof ConfigProviders.configureRoutes).toBe('function');
    });

    it('should export AUDIT_LOGGING_ROUTE_PROVIDERS', () => {
      expect(ConfigProviders.AUDIT_LOGGING_ROUTE_PROVIDERS).toBeDefined();
    });

    it('should export initializeAuditLoggingRoutes', () => {
      expect(ConfigProviders.initializeAuditLoggingRoutes).toBeDefined();
      expect(typeof ConfigProviders.initializeAuditLoggingRoutes).toBe('function');
    });

    it('should export getRoutesService', () => {
      expect(ConfigProviders.getRoutesService).toBeDefined();
      expect(typeof ConfigProviders.getRoutesService).toBe('function');
    });
  });

  describe('EntityChangeModalService export', () => {
    it('should export EntityChangeModalService', () => {
      expect(ConfigProviders.EntityChangeModalService).toBeDefined();
    });
  });
});
