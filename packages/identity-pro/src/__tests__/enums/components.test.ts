/**
 * Tests for Identity Pro Enums
 * @abpjs/identity-pro v2.4.0
 */
import { describe, it, expect } from 'vitest';
import { eIdentityComponents } from '../../enums';

describe('eIdentityComponents (v2.4.0)', () => {
  it('should have Claims component identifier', () => {
    expect(eIdentityComponents.Claims).toBe('Identity.ClaimsComponent');
  });

  it('should have Roles component identifier', () => {
    expect(eIdentityComponents.Roles).toBe('Identity.RolesComponent');
  });

  it('should have Users component identifier', () => {
    expect(eIdentityComponents.Users).toBe('Identity.UsersComponent');
  });

  it('should be usable as string values', () => {
    const claimsKey: string = eIdentityComponents.Claims;
    const rolesKey: string = eIdentityComponents.Roles;
    const usersKey: string = eIdentityComponents.Users;

    expect(claimsKey).toBe('Identity.ClaimsComponent');
    expect(rolesKey).toBe('Identity.RolesComponent');
    expect(usersKey).toBe('Identity.UsersComponent');
  });

  it('should be usable for component registration', () => {
    // Simulate component registration pattern
    const componentRegistry: Record<string, string> = {};
    componentRegistry[eIdentityComponents.Claims] = 'ClaimsComponent';
    componentRegistry[eIdentityComponents.Roles] = 'RolesComponent';
    componentRegistry[eIdentityComponents.Users] = 'UsersComponent';

    expect(componentRegistry['Identity.ClaimsComponent']).toBe('ClaimsComponent');
    expect(componentRegistry['Identity.RolesComponent']).toBe('RolesComponent');
    expect(componentRegistry['Identity.UsersComponent']).toBe('UsersComponent');
  });

  it('should have correct enum keys', () => {
    const keys = Object.keys(eIdentityComponents);
    expect(keys).toContain('Claims');
    expect(keys).toContain('Roles');
    expect(keys).toContain('Users');
    expect(keys).toHaveLength(3);
  });

  it('should have correct enum values', () => {
    const values = Object.values(eIdentityComponents);
    expect(values).toContain('Identity.ClaimsComponent');
    expect(values).toContain('Identity.RolesComponent');
    expect(values).toContain('Identity.UsersComponent');
    expect(values).toHaveLength(3);
  });

  it('should have unique values for each component', () => {
    const values = Object.values(eIdentityComponents);
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).toBe(values.length);
  });
});
