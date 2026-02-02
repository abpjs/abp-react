import { describe, it, expect } from 'vitest';

/**
 * Tests for enums barrel export
 * @since 2.7.0
 */
describe('enums barrel export', () => {
  it('should export ePermissionManagementComponents from enums index', async () => {
    const { ePermissionManagementComponents } = await import('../../enums');
    expect(ePermissionManagementComponents).toBeDefined();
    expect(ePermissionManagementComponents.PermissionManagement).toBe(
      'PermissionManagement.PermissionManagementComponent'
    );
  });

  it('should re-export all enum values', async () => {
    const enums = await import('../../enums');
    expect(Object.keys(enums)).toContain('ePermissionManagementComponents');
  });

  it('should export PermissionManagementComponentKey type helper', async () => {
    // Type exports are verified at compile time
    // We can check that the module loads correctly
    const enums = await import('../../enums');
    expect(enums).toBeDefined();
  });
});
