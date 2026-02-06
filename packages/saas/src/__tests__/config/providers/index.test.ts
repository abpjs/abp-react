/**
 * Tests for SaaS Config Providers barrel export
 * @abpjs/saas v3.0.0
 */
import { describe, it, expect } from 'vitest';
import * as configProviders from '../../../config/providers';

describe('config/providers barrel export', () => {
  it('should export SAAS_ROUTE_CONFIG', () => {
    expect(configProviders.SAAS_ROUTE_CONFIG).toBeDefined();
    expect(typeof configProviders.SAAS_ROUTE_CONFIG).toBe('object');
  });

  it('should export configureRoutes', () => {
    expect(configProviders.configureRoutes).toBeDefined();
    expect(typeof configProviders.configureRoutes).toBe('function');
  });

  it('should export initializeSaasRoutes', () => {
    expect(configProviders.initializeSaasRoutes).toBeDefined();
    expect(typeof configProviders.initializeSaasRoutes).toBe('function');
  });

  it('should export SAAS_ROUTE_PROVIDERS', () => {
    expect(configProviders.SAAS_ROUTE_PROVIDERS).toBeDefined();
    expect(typeof configProviders.SAAS_ROUTE_PROVIDERS).toBe('object');
  });
});
