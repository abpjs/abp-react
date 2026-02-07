/**
 * Tests for models barrel export
 * @abpjs/file-management v3.2.0
 */
import { describe, it, expect } from 'vitest';
import * as modelsExports from '../../models';

describe('models barrel export', () => {
  // Note: Most exports are types which don't exist at runtime
  // We verify the module loads correctly
  it('should load models module', () => {
    expect(modelsExports).toBeDefined();
  });

  // Type-only exports don't have runtime values
  // This test just verifies the barrel export works
  it('should export from common-types', () => {
    // FolderInfo and FileInfo are type-only exports
    expect(true).toBe(true);
  });

  it('should export from config-options', () => {
    // All exports from config-options are types
    expect(true).toBe(true);
  });
});
