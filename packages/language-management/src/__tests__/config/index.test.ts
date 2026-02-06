/**
 * Tests for Language Management Config barrel export
 * @abpjs/language-management v3.0.0
 */
import { describe, it, expect } from 'vitest';
import * as config from '../../config';

describe('config barrel export', () => {
  describe('enums exports', () => {
    it('should export eLanguageManagementPolicyNames', () => {
      expect(config.eLanguageManagementPolicyNames).toBeDefined();
      expect(config.eLanguageManagementPolicyNames.Languages).toBe('LanguageManagement.Languages');
    });

    it('should export eLanguageManagementRouteNames', () => {
      expect(config.eLanguageManagementRouteNames).toBeDefined();
      expect(config.eLanguageManagementRouteNames.Languages).toBe('LanguageManagement::Languages');
    });
  });

  describe('providers exports', () => {
    it('should export configureRoutes', () => {
      expect(config.configureRoutes).toBeDefined();
      expect(typeof config.configureRoutes).toBe('function');
    });

    it('should export initializeLanguageManagementRoutes', () => {
      expect(config.initializeLanguageManagementRoutes).toBeDefined();
      expect(typeof config.initializeLanguageManagementRoutes).toBe('function');
    });

    it('should export LANGUAGE_MANAGEMENT_ROUTE_PROVIDERS', () => {
      expect(config.LANGUAGE_MANAGEMENT_ROUTE_PROVIDERS).toBeDefined();
    });
  });
});
