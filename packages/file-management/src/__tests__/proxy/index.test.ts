/**
 * Tests for proxy barrel export
 * @abpjs/file-management v3.2.0
 */
import { describe, it, expect } from 'vitest';
import * as proxyExports from '../../proxy';

describe('proxy barrel export', () => {
  describe('files exports', () => {
    it('should export FileIconType', () => {
      expect(proxyExports.FileIconType).toBeDefined();
    });

    it('should export fileIconTypeOptions', () => {
      expect(proxyExports.fileIconTypeOptions).toBeDefined();
    });

    it('should export FileDescriptorService', () => {
      expect(proxyExports.FileDescriptorService).toBeDefined();
    });
  });

  describe('directories exports', () => {
    it('should export DirectoryDescriptorService', () => {
      expect(proxyExports.DirectoryDescriptorService).toBeDefined();
    });
  });
});
