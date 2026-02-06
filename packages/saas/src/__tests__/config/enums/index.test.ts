/**
 * Tests for SaaS Config Enums barrel export
 * @abpjs/saas v3.0.0
 */
import { describe, it, expect } from 'vitest';
import * as configEnums from '../../../config/enums';

describe('config/enums barrel export', () => {
  it('should export eSaasPolicyNames', () => {
    expect(configEnums.eSaasPolicyNames).toBeDefined();
    expect(typeof configEnums.eSaasPolicyNames).toBe('object');
  });

  it('should export eSaasRouteNames', () => {
    expect(configEnums.eSaasRouteNames).toBeDefined();
    expect(typeof configEnums.eSaasRouteNames).toBe('object');
  });

  it('should have correct eSaasPolicyNames values', () => {
    expect(configEnums.eSaasPolicyNames.Saas).toBe('Saas.Tenants || Saas.Editions');
    expect(configEnums.eSaasPolicyNames.Tenants).toBe('Saas.Tenants');
    expect(configEnums.eSaasPolicyNames.Editions).toBe('Saas.Editions');
  });

  it('should have correct eSaasRouteNames values', () => {
    expect(configEnums.eSaasRouteNames.Saas).toBe('Saas::Menu:Saas');
    expect(configEnums.eSaasRouteNames.Tenants).toBe('Saas::Tenants');
    expect(configEnums.eSaasRouteNames.Editions).toBe('Saas::Editions');
  });
});
