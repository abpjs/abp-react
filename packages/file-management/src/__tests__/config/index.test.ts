/**
 * Tests for config barrel export
 * @abpjs/file-management v3.2.0
 */
import { describe, it, expect, vi } from 'vitest';
import * as configExports from '../../config';

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  getRoutesService: vi.fn(() => ({
    add: vi.fn(),
  })),
  eLayoutType: {
    application: 'application',
  },
}));

describe('config barrel export', () => {
  describe('enums exports', () => {
    it('should export eFileManagementPolicyNames', () => {
      expect(configExports.eFileManagementPolicyNames).toBeDefined();
    });

    it('should export eFileManagementRouteNames', () => {
      expect(configExports.eFileManagementRouteNames).toBeDefined();
    });
  });

  describe('providers exports', () => {
    it('should export configureRoutes', () => {
      expect(configExports.configureRoutes).toBeDefined();
    });

    it('should export FILE_MANAGEMENT_ROUTE_PROVIDERS', () => {
      expect(configExports.FILE_MANAGEMENT_ROUTE_PROVIDERS).toBeDefined();
    });

    it('should export initializeFileManagementRoutes', () => {
      expect(configExports.initializeFileManagementRoutes).toBeDefined();
    });
  });
});
