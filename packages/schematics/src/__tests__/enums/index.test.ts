import { describe, it, expect } from 'vitest';

/**
 * Tests for enums barrel export
 */
describe('enums barrel export', () => {
  it('should export eBindingSourceId from enums index', async () => {
    const { eBindingSourceId } = await import('../../enums');
    expect(eBindingSourceId).toBeDefined();
    expect(eBindingSourceId.Body).toBe('Body');
  });

  it('should export Exception from enums index', async () => {
    const { Exception } = await import('../../enums');
    expect(Exception).toBeDefined();
    expect(Exception.FileNotFound).toBeDefined();
  });

  it('should export eImportKeyword from enums index', async () => {
    const { eImportKeyword } = await import('../../enums');
    expect(eImportKeyword).toBeDefined();
    expect(eImportKeyword.Default).toBe('import');
  });

  it('should export eMethodModifier from enums index', async () => {
    const { eMethodModifier } = await import('../../enums');
    expect(eMethodModifier).toBeDefined();
    expect(eMethodModifier.Public).toBe('');
  });

  it('should re-export all enum values', async () => {
    const enums = await import('../../enums');
    expect(Object.keys(enums)).toContain('eBindingSourceId');
    expect(Object.keys(enums)).toContain('Exception');
    expect(Object.keys(enums)).toContain('eImportKeyword');
    expect(Object.keys(enums)).toContain('eMethodModifier');
  });
});
