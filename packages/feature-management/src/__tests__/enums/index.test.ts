import { describe, it, expect } from 'vitest';

/**
 * Tests for enums barrel export
 * @since 2.7.0
 */
describe('enums barrel export', () => {
  it('should export eFeatureManagementComponents from enums index', async () => {
    const { eFeatureManagementComponents } = await import('../../enums');
    expect(eFeatureManagementComponents).toBeDefined();
    expect(eFeatureManagementComponents.FeatureManagement).toBe(
      'FeatureManagement.FeatureManagementComponent'
    );
  });

  it('should re-export all components enum values', async () => {
    const enums = await import('../../enums');
    expect(Object.keys(enums)).toContain('eFeatureManagementComponents');
  });
});
