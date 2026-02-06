import { describe, it, expect } from 'vitest';
import { eAccountComponents, eAccountRouteNames } from '../../enums';
import { eAccountRouteNames as ConfigRouteNames } from '../../config/enums';

/**
 * Tests for enums barrel export
 * @since 2.7.0
 * @updated 3.0.0 - eAccountRouteNames moved to config/enums, re-exported from enums for compatibility
 */
describe('Enums barrel export (v2.7.0, updated v3.0.0)', () => {
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

  // v3.0.0: Verify re-export from config/enums
  it('should re-export eAccountRouteNames from config/enums (v3.0.0)', () => {
    // The enum should be the same object whether imported from enums or config/enums
    expect(eAccountRouteNames).toBe(ConfigRouteNames);
  });
});
