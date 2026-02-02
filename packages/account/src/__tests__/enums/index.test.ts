import { describe, it, expect } from 'vitest';
import { eAccountComponents, eAccountRouteNames } from '../../enums';

/**
 * Tests for enums barrel export
 * @since 2.7.0
 */
describe('Enums barrel export (v2.7.0)', () => {
  it('should export eAccountComponents from index', () => {
    expect(eAccountComponents).toBeDefined();
    expect(eAccountComponents.Login).toBe('Account.LoginComponent');
  });

  it('should export eAccountRouteNames from index', () => {
    expect(eAccountRouteNames).toBeDefined();
    expect(eAccountRouteNames.Login).toBe('AbpAccount::Login');
  });

  it('should export all expected keys from eAccountComponents', () => {
    const expectedKeys = [
      'Login',
      'Register',
      'ManageProfile',
      'TenantBox',
      'AuthWrapper',
      'ChangePassword',
      'PersonalSettings',
    ];
    expectedKeys.forEach(key => {
      expect(eAccountComponents).toHaveProperty(key);
    });
  });

  it('should export all expected keys from eAccountRouteNames', () => {
    const expectedKeys = ['Account', 'Login', 'Register', 'ManageProfile'];
    expectedKeys.forEach(key => {
      expect(eAccountRouteNames).toHaveProperty(key);
    });
  });
});
