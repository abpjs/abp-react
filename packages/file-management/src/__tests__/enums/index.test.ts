/**
 * Tests for enums barrel export
 * @abpjs/file-management v3.2.0
 */
import { describe, it, expect } from 'vitest';
import * as enumsExports from '../../enums';

describe('enums barrel export', () => {
  it('should export eFileManagementComponents', () => {
    expect(enumsExports.eFileManagementComponents).toBeDefined();
  });

  it('should have correct FolderContent value', () => {
    expect(enumsExports.eFileManagementComponents.FolderContent).toBe(
      'FileManagement.FolderContentComponent'
    );
  });
});
