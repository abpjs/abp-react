/**
 * Tests for DirectoryDescriptorService
 * @abpjs/file-management v3.2.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DirectoryDescriptorService } from '../../../proxy/directories/directory-descriptor.service';
import type {
  CreateDirectoryInput,
  DirectoryContentRequestInput,
  DirectoryDescriptorDto,
  MoveDirectoryInput,
  RenameDirectoryInput,
} from '../../../proxy/directories/models';

describe('DirectoryDescriptorService', () => {
  let service: DirectoryDescriptorService;
  let mockRestService: {
    request: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockRestService = {
      request: vi.fn(),
    };
    service = new DirectoryDescriptorService(mockRestService as any);
  });

  describe('constructor', () => {
    it('should set apiName to default', () => {
      expect(service.apiName).toBe('default');
    });
  });

  describe('create', () => {
    it('should make POST request to correct endpoint', async () => {
      const input: CreateDirectoryInput = {
        parentId: 'parent-123',
        name: 'New Folder',
      };
      const expectedResponse: DirectoryDescriptorDto = {
        id: 'dir-1',
        name: 'New Folder',
        parentId: 'parent-123',
        creationTime: '2024-01-01T00:00:00Z',
      };

      mockRestService.request.mockResolvedValue(expectedResponse);

      const result = await service.create(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/file-management/directory-descriptor',
        body: input,
      });
      expect(result).toEqual(expectedResponse);
    });

    it('should create directory at root level', async () => {
      const input: CreateDirectoryInput = { name: 'Root Folder' };
      mockRestService.request.mockResolvedValue({
        id: 'dir-root',
        name: 'Root Folder',
        creationTime: '2024-01-01T00:00:00Z',
      });

      await service.create(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/file-management/directory-descriptor',
        body: { name: 'Root Folder' },
      });
    });
  });

  describe('delete', () => {
    it('should make DELETE request with directory ID', async () => {
      mockRestService.request.mockResolvedValue(undefined);

      await service.delete('dir-123');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'DELETE',
        url: '/api/file-management/directory-descriptor/dir-123',
      });
    });
  });

  describe('get', () => {
    it('should make GET request with directory ID', async () => {
      const expectedResponse: DirectoryDescriptorDto = {
        id: 'dir-123',
        name: 'My Folder',
        parentId: 'parent-456',
        creationTime: '2024-01-01T00:00:00Z',
      };

      mockRestService.request.mockResolvedValue(expectedResponse);

      const result = await service.get('dir-123');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/file-management/directory-descriptor/dir-123',
      });
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getContent', () => {
    it('should make GET request to content endpoint with params', async () => {
      const input: DirectoryContentRequestInput = {
        filter: 'search',
        sorting: 'name asc',
        id: 'dir-123',
      };
      const expectedResponse = {
        items: [
          { id: 'item-1', name: 'Subfolder', isDirectory: true, size: 0, iconInfo: { icon: 'fa-folder', type: 0 } },
          { id: 'item-2', name: 'file.txt', isDirectory: false, size: 100, iconInfo: { icon: 'fa-file', type: 0 } },
        ],
        totalCount: 2,
      };

      mockRestService.request.mockResolvedValue(expectedResponse);

      const result = await service.getContent(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/file-management/directory-descriptor/content',
        params: input,
      });
      expect(result).toEqual(expectedResponse);
    });

    it('should get content for root directory', async () => {
      const input: DirectoryContentRequestInput = {
        filter: '',
        sorting: 'name asc',
      };
      mockRestService.request.mockResolvedValue({ items: [], totalCount: 0 });

      await service.getContent(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/file-management/directory-descriptor/content',
        params: input,
      });
    });
  });

  describe('getList', () => {
    it('should make GET request with parentId param', async () => {
      const expectedResponse = {
        items: [
          { id: 'dir-1', name: 'Folder 1', parentId: 'parent-123', hasChildren: true },
          { id: 'dir-2', name: 'Folder 2', parentId: 'parent-123', hasChildren: false },
        ],
      };

      mockRestService.request.mockResolvedValue(expectedResponse);

      const result = await service.getList('parent-123');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/file-management/directory-descriptor',
        params: { parentId: 'parent-123' },
      });
      expect(result).toEqual(expectedResponse);
    });

    it('should make GET request with empty params for root', async () => {
      mockRestService.request.mockResolvedValue({ items: [] });

      await service.getList('');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/file-management/directory-descriptor',
        params: {},
      });
    });
  });

  describe('move', () => {
    it('should make POST request to move endpoint', async () => {
      const input: MoveDirectoryInput = {
        id: 'dir-123',
        newParentId: 'target-parent',
      };
      const expectedResponse: DirectoryDescriptorDto = {
        id: 'dir-123',
        name: 'Moved Folder',
        parentId: 'target-parent',
        creationTime: '2024-01-01T00:00:00Z',
      };

      mockRestService.request.mockResolvedValue(expectedResponse);

      const result = await service.move(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/file-management/directory-descriptor/move',
        body: input,
      });
      expect(result).toEqual(expectedResponse);
    });

    it('should move to root (no newParentId)', async () => {
      const input: MoveDirectoryInput = { id: 'dir-123' };
      mockRestService.request.mockResolvedValue({
        id: 'dir-123',
        name: 'Folder',
        creationTime: '2024-01-01T00:00:00Z',
      });

      await service.move(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/file-management/directory-descriptor/move',
        body: { id: 'dir-123' },
      });
    });
  });

  describe('rename', () => {
    it('should make POST request to rename endpoint with directory ID', async () => {
      const input: RenameDirectoryInput = { name: 'New Name' };
      const expectedResponse: DirectoryDescriptorDto = {
        id: 'dir-123',
        name: 'New Name',
        creationTime: '2024-01-01T00:00:00Z',
      };

      mockRestService.request.mockResolvedValue(expectedResponse);

      const result = await service.rename('dir-123', input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/file-management/directory-descriptor/dir-123/rename',
        body: input,
      });
      expect(result).toEqual(expectedResponse);
    });
  });
});
