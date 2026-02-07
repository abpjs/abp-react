/**
 * Tests for config/providers barrel export
 * @abpjs/file-management v3.2.0
 */
import { describe, it, expect, vi } from 'vitest';
import * as providersExports from '../../../config/providers';

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  getRoutesService: vi.fn(() => ({
    add: vi.fn(),
  })),
  eLayoutType: {
    application: 'application',
  },
}));

describe('config/providers barrel export', () => {
  it('should export configureRoutes', () => {
    expect(providersExports.configureRoutes).toBeDefined();
    expect(typeof providersExports.configureRoutes).toBe('function');
  });

  it('should export FILE_MANAGEMENT_ROUTE_PROVIDERS', () => {
    expect(providersExports.FILE_MANAGEMENT_ROUTE_PROVIDERS).toBeDefined();
    expect(typeof providersExports.FILE_MANAGEMENT_ROUTE_PROVIDERS).toBe('object');
  });

  it('should export initializeFileManagementRoutes', () => {
    expect(providersExports.initializeFileManagementRoutes).toBeDefined();
    expect(typeof providersExports.initializeFileManagementRoutes).toBe('function');
  });
});
