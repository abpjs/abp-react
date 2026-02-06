import { describe, it, expect } from 'vitest';
import { eAccountRouteNames } from '../../config/enums/route-names';

/**
 * Tests for eAccountRouteNames enum
 * @since 2.7.0
 * @updated 3.0.0 - Moved from enums to config/enums
 */
describe('eAccountRouteNames (v2.7.0, moved to config in v3.0.0)', () => {
  it('should export all route name keys', () => {
    expect(eAccountRouteNames).toBeDefined();
    expect(Object.keys(eAccountRouteNames)).toHaveLength(4);
  });

  it('should have Account route name', () => {
    expect(eAccountRouteNames.Account).toBe('AbpAccount::Menu:Account');
  });

  it('should have Login route name', () => {
    expect(eAccountRouteNames.Login).toBe('AbpAccount::Login');
  });

  it('should have Register route name', () => {
    expect(eAccountRouteNames.Register).toBe('AbpAccount::Register');
  });

  it('should have ManageProfile route name', () => {
    expect(eAccountRouteNames.ManageProfile).toBe('AbpAccount::ManageYourProfile');
  });

  it('should have unique values for all keys', () => {
    const values = Object.values(eAccountRouteNames);
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).toBe(values.length);
  });

  it('should be a const object (immutable)', () => {
    // TypeScript ensures this at compile time with 'as const'
    // At runtime, we can verify the values are strings
    Object.values(eAccountRouteNames).forEach(value => {
      expect(typeof value).toBe('string');
    });
  });

  it('should follow AbpAccount:: naming convention for localization keys', () => {
    Object.values(eAccountRouteNames).forEach(value => {
      expect(value).toMatch(/^AbpAccount::/);
    });
  });
});
