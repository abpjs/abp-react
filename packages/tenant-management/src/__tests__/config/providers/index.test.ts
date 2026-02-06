import { describe, it, expect } from 'vitest';
import * as providersExports from '../../../config/providers';

describe('config/providers barrel export', () => {
  describe('exported values', () => {
    it('should export configureRoutes', () => {
      expect(providersExports.configureRoutes).toBeDefined();
      expect(typeof providersExports.configureRoutes).toBe('function');
    });

    it('should export TENANT_MANAGEMENT_ROUTE_PROVIDERS', () => {
      expect(providersExports.TENANT_MANAGEMENT_ROUTE_PROVIDERS).toBeDefined();
      expect(typeof providersExports.TENANT_MANAGEMENT_ROUTE_PROVIDERS).toBe('object');
    });

    it('should export initializeTenantManagementRoutes', () => {
      expect(providersExports.initializeTenantManagementRoutes).toBeDefined();
      expect(typeof providersExports.initializeTenantManagementRoutes).toBe('function');
    });
  });

  describe('export structure', () => {
    it('should have exactly 3 exports', () => {
      const exportKeys = Object.keys(providersExports);
      expect(exportKeys).toHaveLength(3);
    });

    it('should have TENANT_MANAGEMENT_ROUTE_PROVIDERS.configureRoutes reference configureRoutes', () => {
      expect(providersExports.TENANT_MANAGEMENT_ROUTE_PROVIDERS.configureRoutes).toBe(
        providersExports.configureRoutes
      );
    });
  });

  describe('v3.0.0 providers', () => {
    it('should contain all v3.0.0 provider exports', () => {
      expect(providersExports).toHaveProperty('configureRoutes');
      expect(providersExports).toHaveProperty('TENANT_MANAGEMENT_ROUTE_PROVIDERS');
      expect(providersExports).toHaveProperty('initializeTenantManagementRoutes');
    });
  });
});
