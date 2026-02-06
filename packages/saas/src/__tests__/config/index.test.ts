/**
 * Tests for SaaS Config barrel export
 * @abpjs/saas v3.0.0
 */
import { describe, it, expect } from 'vitest';
import * as config from '../../config';

describe('config barrel export', () => {
  describe('enums exports', () => {
    it('should export eSaasPolicyNames', () => {
      expect(config.eSaasPolicyNames).toBeDefined();
      expect(config.eSaasPolicyNames.Saas).toBe('Saas.Tenants || Saas.Editions');
    });

    it('should export eSaasRouteNames', () => {
      expect(config.eSaasRouteNames).toBeDefined();
      expect(config.eSaasRouteNames.Saas).toBe('Saas::Menu:Saas');
    });
  });

  describe('providers exports', () => {
    it('should export SAAS_ROUTE_CONFIG', () => {
      expect(config.SAAS_ROUTE_CONFIG).toBeDefined();
      expect(config.SAAS_ROUTE_CONFIG.path).toBe('/saas');
    });

    it('should export configureRoutes', () => {
      expect(config.configureRoutes).toBeDefined();
      expect(typeof config.configureRoutes).toBe('function');
    });

    it('should export initializeSaasRoutes', () => {
      expect(config.initializeSaasRoutes).toBeDefined();
      expect(typeof config.initializeSaasRoutes).toBe('function');
    });

    it('should export SAAS_ROUTE_PROVIDERS', () => {
      expect(config.SAAS_ROUTE_PROVIDERS).toBeDefined();
      expect(config.SAAS_ROUTE_PROVIDERS.useFactory).toBe(config.configureRoutes);
    });
  });
});
