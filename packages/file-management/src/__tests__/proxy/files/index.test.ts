/**
 * Tests for proxy/files barrel export
 * @abpjs/file-management v3.2.0
 */
import { describe, it, expect } from 'vitest';
import * as filesExports from '../../../proxy/files';

describe('proxy/files barrel export', () => {
  it('should export FileIconType enum', () => {
    expect(filesExports.FileIconType).toBeDefined();
    expect(filesExports.FileIconType.FontAwesome).toBe(0);
    expect(filesExports.FileIconType.Url).toBe(1);
  });

  it('should export fileIconTypeOptions', () => {
    expect(filesExports.fileIconTypeOptions).toBeDefined();
    expect(filesExports.fileIconTypeOptions).toHaveLength(2);
  });

  it('should export FileDescriptorService', () => {
    expect(filesExports.FileDescriptorService).toBeDefined();
  });
});
