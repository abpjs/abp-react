/**
 * Tests for proxy/directories/models
 * @abpjs/file-management v3.2.0
 */
import { describe, it, expect } from 'vitest';
import { FileIconType } from '../../../proxy/files/file-icon-type.enum';
import type {
  CreateDirectoryInput,
  DirectoryContentDto,
  DirectoryContentRequestInput,
  DirectoryDescriptorDto,
  DirectoryDescriptorInfoDto,
  MoveDirectoryInput,
  RenameDirectoryInput,
} from '../../../proxy/directories/models';

describe('proxy/directories/models', () => {
  describe('CreateDirectoryInput', () => {
    it('should accept input with parentId', () => {
      const input: CreateDirectoryInput = {
        parentId: 'parent-dir-123',
        name: 'Documents',
      };

      expect(input.parentId).toBe('parent-dir-123');
      expect(input.name).toBe('Documents');
    });

    it('should accept input without parentId (root level)', () => {
      const input: CreateDirectoryInput = {
        name: 'Root Folder',
      };

      expect(input.parentId).toBeUndefined();
      expect(input.name).toBe('Root Folder');
    });
  });

  describe('DirectoryContentDto', () => {
    it('should represent a directory', () => {
      const dto: DirectoryContentDto = {
        name: 'Subfolder',
        isDirectory: true,
        id: 'dir-123',
        size: 0,
        iconInfo: {
          icon: 'fa-folder',
          type: FileIconType.FontAwesome,
        },
      };

      expect(dto.isDirectory).toBe(true);
      expect(dto.size).toBe(0);
      expect(dto.iconInfo.icon).toBe('fa-folder');
    });

    it('should represent a file', () => {
      const dto: DirectoryContentDto = {
        name: 'document.pdf',
        isDirectory: false,
        id: 'file-456',
        size: 2048,
        iconInfo: {
          icon: 'fa-file-pdf',
          type: FileIconType.FontAwesome,
        },
      };

      expect(dto.isDirectory).toBe(false);
      expect(dto.size).toBe(2048);
    });

    it('should support URL-based icons', () => {
      const dto: DirectoryContentDto = {
        name: 'custom.xyz',
        isDirectory: false,
        id: 'file-789',
        size: 512,
        iconInfo: {
          icon: 'https://example.com/custom-icon.png',
          type: FileIconType.Url,
        },
      };

      expect(dto.iconInfo.type).toBe(FileIconType.Url);
      expect(dto.iconInfo.icon).toContain('https://');
    });
  });

  describe('DirectoryContentRequestInput', () => {
    it('should accept full request with all fields', () => {
      const input: DirectoryContentRequestInput = {
        filter: 'search term',
        sorting: 'name asc',
        id: 'dir-123',
      };

      expect(input.filter).toBe('search term');
      expect(input.sorting).toBe('name asc');
      expect(input.id).toBe('dir-123');
    });

    it('should accept request for root directory', () => {
      const input: DirectoryContentRequestInput = {
        filter: '',
        sorting: 'name desc',
      };

      expect(input.id).toBeUndefined();
    });

    it('should support different sorting options', () => {
      const sortingOptions = ['name asc', 'name desc', 'size asc', 'size desc'];

      sortingOptions.forEach((sorting) => {
        const input: DirectoryContentRequestInput = {
          filter: '',
          sorting,
        };
        expect(input.sorting).toBe(sorting);
      });
    });
  });

  describe('DirectoryDescriptorDto', () => {
    it('should accept full DTO with audit fields', () => {
      const dto: DirectoryDescriptorDto = {
        id: 'dir-123',
        name: 'My Documents',
        parentId: 'parent-456',
        creationTime: '2024-01-01T00:00:00Z',
        creatorId: 'user-1',
        lastModificationTime: '2024-01-15T00:00:00Z',
        lastModifierId: 'user-2',
      };

      expect(dto.id).toBe('dir-123');
      expect(dto.name).toBe('My Documents');
      expect(dto.parentId).toBe('parent-456');
    });

    it('should accept root directory without parentId', () => {
      const dto: DirectoryDescriptorDto = {
        id: 'root-dir',
        name: 'Root',
        creationTime: '2024-01-01T00:00:00Z',
      };

      expect(dto.parentId).toBeUndefined();
    });
  });

  describe('DirectoryDescriptorInfoDto', () => {
    it('should represent directory with children', () => {
      const dto: DirectoryDescriptorInfoDto = {
        id: 'dir-123',
        name: 'Parent Folder',
        parentId: 'root',
        hasChildren: true,
      };

      expect(dto.hasChildren).toBe(true);
    });

    it('should represent empty directory', () => {
      const dto: DirectoryDescriptorInfoDto = {
        id: 'dir-456',
        name: 'Empty Folder',
        hasChildren: false,
      };

      expect(dto.hasChildren).toBe(false);
      expect(dto.parentId).toBeUndefined();
    });

    it('should be usable for tree view rendering', () => {
      const treeData: DirectoryDescriptorInfoDto[] = [
        { id: '1', name: 'Root', hasChildren: true },
        { id: '2', name: 'Subfolder', parentId: '1', hasChildren: false },
      ];

      const rootItem = treeData.find((d) => !d.parentId);
      const childItem = treeData.find((d) => d.parentId === '1');

      expect(rootItem?.name).toBe('Root');
      expect(childItem?.name).toBe('Subfolder');
    });
  });

  describe('MoveDirectoryInput', () => {
    it('should accept move to specific parent', () => {
      const input: MoveDirectoryInput = {
        id: 'dir-to-move',
        newParentId: 'target-parent',
      };

      expect(input.id).toBe('dir-to-move');
      expect(input.newParentId).toBe('target-parent');
    });

    it('should accept move to root (no newParentId)', () => {
      const input: MoveDirectoryInput = {
        id: 'dir-to-move',
      };

      expect(input.newParentId).toBeUndefined();
    });
  });

  describe('RenameDirectoryInput', () => {
    it('should accept new directory name', () => {
      const input: RenameDirectoryInput = {
        name: 'Renamed Folder',
      };

      expect(input.name).toBe('Renamed Folder');
    });

    it('should accept names with spaces and special characters', () => {
      const input: RenameDirectoryInput = {
        name: 'My Projects (2024)',
      };

      expect(input.name).toBe('My Projects (2024)');
    });
  });
});
