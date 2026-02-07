/**
 * Tests for config/enums barrel export
 * @abpjs/file-management v3.2.0
 */
import { describe, it, expect } from 'vitest';
import * as configEnumsExports from '../../../config/enums';

describe('config/enums barrel export', () => {
  it('should export eFileManagementPolicyNames', () => {
    expect(configEnumsExports.eFileManagementPolicyNames).toBeDefined();
  });

  it('should export eFileManagementRouteNames', () => {
    expect(configEnumsExports.eFileManagementRouteNames).toBeDefined();
  });

  it('should have correct policy values', () => {
    expect(configEnumsExports.eFileManagementPolicyNames.DirectoryDescriptor).toBe(
      'FileManagement.DirectoryDescriptor'
    );
  });

  it('should have correct route name values', () => {
    expect(configEnumsExports.eFileManagementRouteNames.FileManagement).toBe(
      'FileManagement::Menu:FileManagement'
    );
  });
});
