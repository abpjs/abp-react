/**
 * Tests for Language Management Config Providers barrel export
 * @abpjs/language-management v3.0.0
 */
import { describe, it, expect } from 'vitest';
import * as configProviders from '../../../config/providers';

describe('config/providers barrel export', () => {
  it('should export configureRoutes', () => {
    expect(configProviders.configureRoutes).toBeDefined();
    expect(typeof configProviders.configureRoutes).toBe('function');
  });

  it('should export initializeLanguageManagementRoutes', () => {
    expect(configProviders.initializeLanguageManagementRoutes).toBeDefined();
    expect(typeof configProviders.initializeLanguageManagementRoutes).toBe('function');
  });

  it('should export LANGUAGE_MANAGEMENT_ROUTE_PROVIDERS', () => {
    expect(configProviders.LANGUAGE_MANAGEMENT_ROUTE_PROVIDERS).toBeDefined();
    expect(typeof configProviders.LANGUAGE_MANAGEMENT_ROUTE_PROVIDERS).toBe('object');
  });

  it('should have configureRoutes in LANGUAGE_MANAGEMENT_ROUTE_PROVIDERS', () => {
    expect(configProviders.LANGUAGE_MANAGEMENT_ROUTE_PROVIDERS.configureRoutes).toBe(
      configProviders.configureRoutes
    );
  });
});
