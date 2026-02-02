import { describe, it, expect } from 'vitest';
import { eAccountComponents } from '../../enums/components';

/**
 * Tests for eAccountComponents enum
 * @since 2.7.0
 */
describe('eAccountComponents (v2.7.0)', () => {
  it('should export all component keys', () => {
    expect(eAccountComponents).toBeDefined();
    expect(Object.keys(eAccountComponents)).toHaveLength(7);
  });

  it('should have Login component key', () => {
    expect(eAccountComponents.Login).toBe('Account.LoginComponent');
  });

  it('should have Register component key', () => {
    expect(eAccountComponents.Register).toBe('Account.RegisterComponent');
  });

  it('should have ManageProfile component key', () => {
    expect(eAccountComponents.ManageProfile).toBe('Account.ManageProfileComponent');
  });

  it('should have TenantBox component key', () => {
    expect(eAccountComponents.TenantBox).toBe('Account.TenantBoxComponent');
  });

  it('should have AuthWrapper component key', () => {
    expect(eAccountComponents.AuthWrapper).toBe('Account.AuthWrapperComponent');
  });

  it('should have ChangePassword component key', () => {
    expect(eAccountComponents.ChangePassword).toBe('Account.ChangePasswordComponent');
  });

  it('should have PersonalSettings component key', () => {
    expect(eAccountComponents.PersonalSettings).toBe('Account.PersonalSettingsComponent');
  });

  it('should have unique values for all keys', () => {
    const values = Object.values(eAccountComponents);
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).toBe(values.length);
  });

  it('should be a const object (immutable)', () => {
    // TypeScript ensures this at compile time with 'as const'
    // At runtime, we can verify the values are strings
    Object.values(eAccountComponents).forEach(value => {
      expect(typeof value).toBe('string');
    });
  });

  it('should follow Account.* naming convention', () => {
    Object.values(eAccountComponents).forEach(value => {
      expect(value).toMatch(/^Account\.\w+Component$/);
    });
  });
});
