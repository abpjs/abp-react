/**
 * Tests for config/providers barrel export
 * @since 3.0.0
 */
import { describe, it, expect } from 'vitest';
import * as providers from '../../../config/providers';

describe('Config Providers Barrel Export', () => {
  describe('Route Provider Exports', () => {
    it('should export TEXT_TEMPLATE_MANAGEMENT_ROUTE_CONFIG', () => {
      expect(providers.TEXT_TEMPLATE_MANAGEMENT_ROUTE_CONFIG).toBeDefined();
    });

    it('should export configureRoutes', () => {
      expect(providers.configureRoutes).toBeDefined();
      expect(typeof providers.configureRoutes).toBe('function');
    });

    it('should export initializeTextTemplateManagementRoutes', () => {
      expect(providers.initializeTextTemplateManagementRoutes).toBeDefined();
      expect(typeof providers.initializeTextTemplateManagementRoutes).toBe(
        'function',
      );
    });

    it('should export TEXT_TEMPLATE_MANAGEMENT_ROUTE_PROVIDERS', () => {
      expect(providers.TEXT_TEMPLATE_MANAGEMENT_ROUTE_PROVIDERS).toBeDefined();
    });
  });

  describe('All Expected Exports', () => {
    it('should export all route provider utilities', () => {
      const exportKeys = Object.keys(providers);
      expect(exportKeys).toContain('TEXT_TEMPLATE_MANAGEMENT_ROUTE_CONFIG');
      expect(exportKeys).toContain('configureRoutes');
      expect(exportKeys).toContain('initializeTextTemplateManagementRoutes');
      expect(exportKeys).toContain('TEXT_TEMPLATE_MANAGEMENT_ROUTE_PROVIDERS');
    });
  });
});
