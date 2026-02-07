/**
 * Tests for FileDescriptorService
 * @abpjs/file-management v3.2.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FileDescriptorService } from '../../../proxy/files/file-descriptor.service';
import type {
  CreateFileInput,
  FileDescriptorDto,
  FileUploadPreInfoRequest,
  MoveFileInput,
  RenameFileInput,
} from '../../../proxy/files/models';

describe('FileDescriptorService', () => {
  let service: FileDescriptorService;
  let mockRestService: {
    request: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockRestService = {
      request: vi.fn(),
    };
    service = new FileDescriptorService(mockRestService as any);
  });

  describe('constructor', () => {
    it('should set apiName to default', () => {
      expect(service.apiName).toBe('default');
    });
  });

  describe('create', () => {
    it('should make POST request to correct endpoint', async () => {
      const input: CreateFileInput = {
        directoryId: 'dir-123',
        name: 'test.txt',
        mimeType: 'text/plain',
        content: [72, 101, 108, 108, 111],
      };
      const expectedResponse: FileDescriptorDto = {
        id: 'file-1',
        name: 'test.txt',
        mimeType: 'text/plain',
        size: 5,
        creationTime: '2024-01-01T00:00:00Z',
      };

      mockRestService.request.mockResolvedValue(expectedResponse);

      const result = await service.create(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/file-management/file-descriptor',
        body: input,
      });
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('delete', () => {
    it('should make DELETE request with file ID', async () => {
      mockRestService.request.mockResolvedValue(undefined);

      await service.delete('file-123');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'DELETE',
        url: '/api/file-management/file-descriptor/file-123',
      });
    });
  });

  describe('get', () => {
    it('should make GET request with file ID', async () => {
      const expectedResponse: FileDescriptorDto = {
        id: 'file-123',
        name: 'document.pdf',
        mimeType: 'application/pdf',
        size: 1024,
        creationTime: '2024-01-01T00:00:00Z',
      };

      mockRestService.request.mockResolvedValue(expectedResponse);

      const result = await service.get('file-123');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/file-management/file-descriptor/file-123',
      });
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getContent', () => {
    it('should make GET request to content endpoint', async () => {
      const expectedContent = [0x25, 0x50, 0x44, 0x46];
      mockRestService.request.mockResolvedValue(expectedContent);

      const result = await service.getContent('file-123');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/file-management/file-descriptor/file-123/content',
      });
      expect(result).toEqual(expectedContent);
    });
  });

  describe('getList', () => {
    it('should make GET request with directoryId param', async () => {
      const expectedResponse = {
        items: [
          { id: 'file-1', name: 'file1.txt', mimeType: 'text/plain', size: 100, creationTime: '2024-01-01T00:00:00Z' },
          { id: 'file-2', name: 'file2.txt', mimeType: 'text/plain', size: 200, creationTime: '2024-01-01T00:00:00Z' },
        ],
      };

      mockRestService.request.mockResolvedValue(expectedResponse);

      const result = await service.getList('dir-123');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/file-management/file-descriptor',
        params: { directoryId: 'dir-123' },
      });
      expect(result).toEqual(expectedResponse);
    });

    it('should make GET request with empty params for root directory', async () => {
      mockRestService.request.mockResolvedValue({ items: [] });

      await service.getList('');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/file-management/file-descriptor',
        params: {},
      });
    });
  });

  describe('getPreInfo', () => {
    it('should make POST request with array of file info requests', async () => {
      const input: FileUploadPreInfoRequest[] = [
        { directoryId: 'dir-1', fileName: 'file1.txt', size: 100 },
        { fileName: 'file2.txt', size: 200 },
      ];
      const expectedResponse = [
        { fileName: 'file1.txt', doesExist: false, hasValidName: true },
        { fileName: 'file2.txt', doesExist: true, hasValidName: true },
      ];

      mockRestService.request.mockResolvedValue(expectedResponse);

      const result = await service.getPreInfo(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/file-management/file-descriptor/pre-upload-info',
        body: input,
      });
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('move', () => {
    it('should make POST request to move endpoint', async () => {
      const input: MoveFileInput = {
        id: 'file-123',
        newDirectoryId: 'target-dir',
      };
      const expectedResponse: FileDescriptorDto = {
        id: 'file-123',
        directoryId: 'target-dir',
        name: 'moved-file.txt',
        mimeType: 'text/plain',
        size: 100,
        creationTime: '2024-01-01T00:00:00Z',
      };

      mockRestService.request.mockResolvedValue(expectedResponse);

      const result = await service.move(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/file-management/file-descriptor/move',
        body: input,
      });
      expect(result).toEqual(expectedResponse);
    });

    it('should handle move to root (no newDirectoryId)', async () => {
      const input: MoveFileInput = { id: 'file-123' };
      mockRestService.request.mockResolvedValue({
        id: 'file-123',
        name: 'file.txt',
        mimeType: 'text/plain',
        size: 100,
        creationTime: '2024-01-01T00:00:00Z',
      });

      await service.move(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/file-management/file-descriptor/move',
        body: { id: 'file-123' },
      });
    });
  });

  describe('rename', () => {
    it('should make POST request to rename endpoint with file ID', async () => {
      const input: RenameFileInput = { name: 'new-name.txt' };
      const expectedResponse: FileDescriptorDto = {
        id: 'file-123',
        name: 'new-name.txt',
        mimeType: 'text/plain',
        size: 100,
        creationTime: '2024-01-01T00:00:00Z',
      };

      mockRestService.request.mockResolvedValue(expectedResponse);

      const result = await service.rename('file-123', input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/file-management/file-descriptor/file-123/rename',
        body: input,
      });
      expect(result).toEqual(expectedResponse);
    });
  });
});
