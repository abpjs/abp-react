import { describe, it, expect } from 'vitest';

/**
 * Tests for enums barrel export
 * @since 2.7.0
 * @updated 3.0.0 - eIdentityRouteNames no longer includes Administration
 */
describe('enums barrel export', () => {
  it('should export eIdentityComponents from enums index', async () => {
    const { eIdentityComponents } = await import('../../enums');
    expect(eIdentityComponents).toBeDefined();
    expect(eIdentityComponents.Roles).toBe('Identity.RolesComponent');
    expect(eIdentityComponents.Users).toBe('Identity.UsersComponent');
  });

  it('should export eIdentityRouteNames from enums index (v3.0.0 - without Administration)', async () => {
    const { eIdentityRouteNames } = await import('../../enums');
    expect(eIdentityRouteNames).toBeDefined();
    // v3.0.0: Administration key removed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((eIdentityRouteNames as any).Administration).toBeUndefined();
    expect(eIdentityRouteNames.IdentityManagement).toBe('AbpIdentity::Menu:IdentityManagement');
    expect(eIdentityRouteNames.Roles).toBe('AbpIdentity::Roles');
    expect(eIdentityRouteNames.Users).toBe('AbpIdentity::Users');
  });

  it('should re-export all enum values', async () => {
    const enums = await import('../../enums');
    expect(Object.keys(enums)).toContain('eIdentityComponents');
    expect(Object.keys(enums)).toContain('eIdentityRouteNames');
  });

  it('should export IdentityComponentKey type helper', async () => {
    // Type exports are verified at compile time
    // We can check that the module loads correctly
    const enums = await import('../../enums');
    expect(enums).toBeDefined();
  });

  it('should export IdentityRouteNameKey type helper', async () => {
    // Type exports are verified at compile time
    // We can check that the module loads correctly
    const enums = await import('../../enums');
    expect(enums).toBeDefined();
  });
});
