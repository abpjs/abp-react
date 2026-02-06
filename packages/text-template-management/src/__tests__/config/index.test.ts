/**
 * Tests for config barrel export
 * @since 3.0.0
 */
import { describe, it, expect } from 'vitest';
import * as config from '../../config';

describe('Config Barrel Export', () => {
  describe('Enums Exports', () => {
    it('should export eTextTemplateManagementPolicyNames', () => {
      expect(config.eTextTemplateManagementPolicyNames).toBeDefined();
    });

    it('should export eTextTemplateManagementRouteNames', () => {
      expect(config.eTextTemplateManagementRouteNames).toBeDefined();
    });
  });

  describe('Providers Exports', () => {
    it('should export TEXT_TEMPLATE_MANAGEMENT_ROUTE_CONFIG', () => {
      expect(config.TEXT_TEMPLATE_MANAGEMENT_ROUTE_CONFIG).toBeDefined();
    });

    it('should export configureRoutes', () => {
      expect(config.configureRoutes).toBeDefined();
    });

    it('should export initializeTextTemplateManagementRoutes', () => {
      expect(config.initializeTextTemplateManagementRoutes).toBeDefined();
    });

    it('should export TEXT_TEMPLATE_MANAGEMENT_ROUTE_PROVIDERS', () => {
      expect(config.TEXT_TEMPLATE_MANAGEMENT_ROUTE_PROVIDERS).toBeDefined();
    });
  });

  describe('All Expected Exports', () => {
    it('should have all config exports available at top level', () => {
      const exportKeys = Object.keys(config);
      expect(exportKeys.length).toBeGreaterThanOrEqual(6);
    });
  });
});
