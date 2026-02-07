/**
 * Tests for proxy/files/models
 * @abpjs/file-management v3.2.0
 */
import { describe, it, expect } from 'vitest';
import { FileIconType } from '../../../proxy/files/file-icon-type.enum';
import type {
  CreateFileInput,
  FileDescriptorDto,
  FileIconInfo,
  FileUploadPreInfoDto,
  FileUploadPreInfoRequest,
  MoveFileInput,
  RenameFileInput,
} from '../../../proxy/files/models';

describe('proxy/files/models', () => {
  describe('CreateFileInput', () => {
    it('should accept valid input with all fields', () => {
      const input: CreateFileInput = {
        directoryId: 'dir-123',
        name: 'document.pdf',
        mimeType: 'application/pdf',
        content: [0x25, 0x50, 0x44, 0x46], // PDF header bytes
      };

      expect(input.directoryId).toBe('dir-123');
      expect(input.name).toBe('document.pdf');
      expect(input.mimeType).toBe('application/pdf');
      expect(input.content).toHaveLength(4);
    });

    it('should accept input without directoryId (root)', () => {
      const input: CreateFileInput = {
        name: 'readme.txt',
        mimeType: 'text/plain',
        content: [72, 101, 108, 108, 111], // "Hello"
      };

      expect(input.directoryId).toBeUndefined();
      expect(input.name).toBe('readme.txt');
    });

    it('should accept empty content array', () => {
      const input: CreateFileInput = {
        name: 'empty.txt',
        mimeType: 'text/plain',
        content: [],
      };

      expect(input.content).toHaveLength(0);
    });
  });

  describe('FileDescriptorDto', () => {
    it('should accept valid DTO with all fields', () => {
      const dto: FileDescriptorDto = {
        id: 'file-456',
        directoryId: 'dir-123',
        name: 'image.png',
        mimeType: 'image/png',
        size: 1024,
        creationTime: '2024-01-01T00:00:00Z',
        creatorId: 'user-1',
        lastModificationTime: '2024-01-02T00:00:00Z',
        lastModifierId: 'user-2',
      };

      expect(dto.id).toBe('file-456');
      expect(dto.name).toBe('image.png');
      expect(dto.size).toBe(1024);
    });

    it('should accept DTO without optional fields', () => {
      const dto: FileDescriptorDto = {
        id: 'file-789',
        name: 'data.json',
        mimeType: 'application/json',
        size: 256,
        creationTime: '2024-01-01T00:00:00Z',
      };

      expect(dto.directoryId).toBeUndefined();
      expect(dto.creatorId).toBeUndefined();
    });
  });

  describe('FileIconInfo', () => {
    it('should accept FontAwesome icon', () => {
      const iconInfo: FileIconInfo = {
        icon: 'fa-file-pdf',
        type: FileIconType.FontAwesome,
      };

      expect(iconInfo.icon).toBe('fa-file-pdf');
      expect(iconInfo.type).toBe(FileIconType.FontAwesome);
    });

    it('should accept URL icon', () => {
      const iconInfo: FileIconInfo = {
        icon: 'https://example.com/icon.png',
        type: FileIconType.Url,
      };

      expect(iconInfo.icon).toBe('https://example.com/icon.png');
      expect(iconInfo.type).toBe(FileIconType.Url);
    });
  });

  describe('FileUploadPreInfoDto', () => {
    it('should represent file that exists with valid name', () => {
      const dto: FileUploadPreInfoDto = {
        fileName: 'existing.txt',
        doesExist: true,
        hasValidName: true,
      };

      expect(dto.fileName).toBe('existing.txt');
      expect(dto.doesExist).toBe(true);
      expect(dto.hasValidName).toBe(true);
    });

    it('should represent new file with invalid name', () => {
      const dto: FileUploadPreInfoDto = {
        fileName: 'invalid<name>.txt',
        doesExist: false,
        hasValidName: false,
      };

      expect(dto.doesExist).toBe(false);
      expect(dto.hasValidName).toBe(false);
    });
  });

  describe('FileUploadPreInfoRequest', () => {
    it('should accept valid request with directoryId', () => {
      const request: FileUploadPreInfoRequest = {
        directoryId: 'dir-123',
        fileName: 'upload.pdf',
        size: 2048,
      };

      expect(request.directoryId).toBe('dir-123');
      expect(request.fileName).toBe('upload.pdf');
      expect(request.size).toBe(2048);
    });

    it('should accept request without directoryId (root upload)', () => {
      const request: FileUploadPreInfoRequest = {
        fileName: 'root-file.txt',
        size: 512,
      };

      expect(request.directoryId).toBeUndefined();
    });
  });

  describe('MoveFileInput', () => {
    it('should accept move to specific directory', () => {
      const input: MoveFileInput = {
        id: 'file-123',
        newDirectoryId: 'target-dir',
      };

      expect(input.id).toBe('file-123');
      expect(input.newDirectoryId).toBe('target-dir');
    });

    it('should accept move to root (no newDirectoryId)', () => {
      const input: MoveFileInput = {
        id: 'file-456',
      };

      expect(input.newDirectoryId).toBeUndefined();
    });
  });

  describe('RenameFileInput', () => {
    it('should accept new file name', () => {
      const input: RenameFileInput = {
        name: 'renamed-file.txt',
      };

      expect(input.name).toBe('renamed-file.txt');
    });

    it('should accept name with special characters', () => {
      const input: RenameFileInput = {
        name: 'file (copy).txt',
      };

      expect(input.name).toBe('file (copy).txt');
    });
  });
});
