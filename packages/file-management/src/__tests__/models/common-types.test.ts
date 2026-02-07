/**
 * Tests for common-types
 * @abpjs/file-management v3.2.0
 */
import { describe, it, expect } from 'vitest';
import type { FolderInfo, FileInfo } from '../../models/common-types';

describe('common-types', () => {
  describe('FolderInfo', () => {
    it('should have name and id properties', () => {
      const folderInfo: FolderInfo = {
        name: 'Documents',
        id: 'folder-123',
      };

      expect(folderInfo.name).toBe('Documents');
      expect(folderInfo.id).toBe('folder-123');
    });

    it('should be a subset of DirectoryContentDto', () => {
      // FolderInfo is Pick<DirectoryContentDto, 'name' | 'id'>
      const folderInfo: FolderInfo = {
        name: 'Projects',
        id: 'folder-456',
      };

      // Should only have name and id, not other DirectoryContentDto properties
      expect(Object.keys(folderInfo)).toHaveLength(2);
      expect(Object.keys(folderInfo)).toContain('name');
      expect(Object.keys(folderInfo)).toContain('id');
    });
  });

  describe('FileInfo', () => {
    it('should have name and id properties', () => {
      const fileInfo: FileInfo = {
        name: 'document.pdf',
        id: 'file-123',
      };

      expect(fileInfo.name).toBe('document.pdf');
      expect(fileInfo.id).toBe('file-123');
    });

    it('should be equivalent to FolderInfo type', () => {
      // FileInfo = FolderInfo, both are Pick<DirectoryContentDto, 'name' | 'id'>
      const folderInfo: FolderInfo = { name: 'folder', id: '1' };
      const fileInfo: FileInfo = folderInfo; // Should be assignable

      expect(fileInfo).toEqual(folderInfo);
    });
  });

  describe('type compatibility', () => {
    it('should allow FolderInfo and FileInfo to be used interchangeably', () => {
      const items: (FolderInfo | FileInfo)[] = [
        { name: 'Folder A', id: 'folder-1' },
        { name: 'file.txt', id: 'file-1' },
        { name: 'Folder B', id: 'folder-2' },
      ];

      expect(items).toHaveLength(3);
      items.forEach((item) => {
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('id');
      });
    });

    it('should work with array map operations', () => {
      const folders: FolderInfo[] = [
        { name: 'Docs', id: '1' },
        { name: 'Images', id: '2' },
      ];

      const names = folders.map((f) => f.name);
      const ids = folders.map((f) => f.id);

      expect(names).toEqual(['Docs', 'Images']);
      expect(ids).toEqual(['1', '2']);
    });
  });
});
