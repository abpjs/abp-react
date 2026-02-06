/**
 * Tests for Identity Pro Enums barrel export
 * @abpjs/identity-pro v3.0.0
 */
import { describe, it, expect } from 'vitest';
import * as enums from '../../enums';

describe('enums barrel export', () => {
  it('should export eIdentityComponents', () => {
    expect(enums.eIdentityComponents).toBeDefined();
    expect(typeof enums.eIdentityComponents).toBe('object');
  });

  it('should export eIdentityRouteNames', () => {
    expect(enums.eIdentityRouteNames).toBeDefined();
    expect(typeof enums.eIdentityRouteNames).toBe('object');
  });

  it('should export all expected members', () => {
    const exportedKeys = Object.keys(enums);
    expect(exportedKeys).toContain('eIdentityComponents');
    expect(exportedKeys).toContain('eIdentityRouteNames');
  });

  it('should have correct eIdentityComponents values through barrel', () => {
    expect(enums.eIdentityComponents.Claims).toBe('Identity.ClaimsComponent');
    expect(enums.eIdentityComponents.Roles).toBe('Identity.RolesComponent');
    expect(enums.eIdentityComponents.Users).toBe('Identity.UsersComponent');
  });

  it('should have correct eIdentityRouteNames values through barrel', () => {
    expect(enums.eIdentityRouteNames.IdentityManagement).toBe('AbpIdentity::Menu:IdentityManagement');
    expect(enums.eIdentityRouteNames.Roles).toBe('AbpIdentity::Roles');
    expect(enums.eIdentityRouteNames.Users).toBe('AbpIdentity::Users');
    expect(enums.eIdentityRouteNames.ClaimTypes).toBe('AbpIdentity::ClaimTypes');
    expect(enums.eIdentityRouteNames.OrganizationUnits).toBe('AbpIdentity::OrganizationUnits');
  });
});

describe('named imports from enums', () => {
  it('should support named import of eIdentityComponents', async () => {
    const { eIdentityComponents } = await import('../../enums');
    expect(eIdentityComponents.Claims).toBe('Identity.ClaimsComponent');
  });

  it('should support named import of eIdentityRouteNames', async () => {
    const { eIdentityRouteNames } = await import('../../enums');
    expect(eIdentityRouteNames.Roles).toBe('AbpIdentity::Roles');
  });

  it('should support named import of IdentityComponentKey type (compile-time check)', () => {
    // This is a compile-time check - if this compiles, the type is exported correctly
    const key: enums.IdentityComponentKey = 'Identity.ClaimsComponent';
    expect(key).toBe(enums.eIdentityComponents.Claims);
  });

  it('should support named import of IdentityRouteNameKey type (compile-time check)', () => {
    // This is a compile-time check - if this compiles, the type is exported correctly
    const key: enums.IdentityRouteNameKey = 'AbpIdentity::Roles';
    expect(key).toBe(enums.eIdentityRouteNames.Roles);
  });
});
