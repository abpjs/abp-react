/**
 * Tests for proxy/directories barrel export
 * @abpjs/file-management v3.2.0
 */
import { describe, it, expect } from 'vitest';
import * as directoriesExports from '../../../proxy/directories';

describe('proxy/directories barrel export', () => {
  it('should export DirectoryDescriptorService', () => {
    expect(directoriesExports.DirectoryDescriptorService).toBeDefined();
  });

  it('should have DirectoryDescriptorService as a class', () => {
    expect(typeof directoriesExports.DirectoryDescriptorService).toBe('function');
  });
});
