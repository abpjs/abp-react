/**
 * Directory Descriptor Service (Proxy)
 * @since v3.2.0
 *
 * Translated from @volo/abp.ng.file-management/lib/proxy/directories/directory-descriptor.service
 */

import type { ListResultDto, PagedResultDto, RestService } from '@abpjs/core';
import type {
  CreateDirectoryInput,
  DirectoryContentDto,
  DirectoryContentRequestInput,
  DirectoryDescriptorDto,
  DirectoryDescriptorInfoDto,
  MoveDirectoryInput,
  RenameDirectoryInput,
} from './models';

/**
 * Service for managing directory descriptors.
 *
 * @example
 * ```typescript
 * const service = new DirectoryDescriptorService(restService);
 *
 * // Create a new directory
 * const newDir = await service.create({
 *   name: 'Documents',
 *   parentId: null,
 * });
 *
 * // Get directory content
 * const content = await service.getContent({
 *   filter: '',
 *   sorting: 'name asc',
 *   id: 'parent-dir-id',
 * });
 *
 * // Get subdirectories for tree view
 * const children = await service.getList('parent-dir-id');
 * ```
 */
export class DirectoryDescriptorService {
  /**
   * The API name used for REST requests.
   */
  apiName = 'default';

  constructor(private restService: RestService) {}

  /**
   * Create a new directory.
   * @param input - Directory creation input with name and parent
   * @returns The created directory descriptor DTO
   */
  create = (input: CreateDirectoryInput): Promise<DirectoryDescriptorDto> => {
    return this.restService.request<unknown, DirectoryDescriptorDto>({
      method: 'POST',
      url: '/api/file-management/directory-descriptor',
      body: input,
    });
  };

  /**
   * Delete a directory by ID.
   * @param id - The ID of the directory to delete
   */
  delete = (id: string): Promise<void> => {
    return this.restService.request<unknown, void>({
      method: 'DELETE',
      url: `/api/file-management/directory-descriptor/${id}`,
    });
  };

  /**
   * Get a directory descriptor by ID.
   * @param id - The ID of the directory to retrieve
   * @returns The directory descriptor DTO
   */
  get = (id: string): Promise<DirectoryDescriptorDto> => {
    return this.restService.request<unknown, DirectoryDescriptorDto>({
      method: 'GET',
      url: `/api/file-management/directory-descriptor/${id}`,
    });
  };

  /**
   * Get directory content (files and subdirectories).
   * @param input - Content request with filter, sorting, and directory ID
   * @returns Paginated result of directory content
   */
  getContent = (
    input: DirectoryContentRequestInput
  ): Promise<PagedResultDto<DirectoryContentDto>> => {
    return this.restService.request<unknown, PagedResultDto<DirectoryContentDto>>({
      method: 'GET',
      url: '/api/file-management/directory-descriptor/content',
      params: input as unknown as Record<string, unknown>,
    });
  };

  /**
   * Get list of subdirectories (for tree view).
   * @param parentId - Parent directory ID (empty for root)
   * @returns List of directory descriptor info DTOs
   */
  getList = (parentId: string): Promise<ListResultDto<DirectoryDescriptorInfoDto>> => {
    return this.restService.request<unknown, ListResultDto<DirectoryDescriptorInfoDto>>({
      method: 'GET',
      url: '/api/file-management/directory-descriptor',
      params: parentId ? { parentId } : {},
    });
  };

  /**
   * Move a directory to a different parent.
   * @param input - Move input with directory ID and new parent ID
   * @returns The updated directory descriptor DTO
   */
  move = (input: MoveDirectoryInput): Promise<DirectoryDescriptorDto> => {
    return this.restService.request<unknown, DirectoryDescriptorDto>({
      method: 'POST',
      url: '/api/file-management/directory-descriptor/move',
      body: input,
    });
  };

  /**
   * Rename a directory.
   * @param id - The ID of the directory to rename
   * @param input - Rename input with new name
   * @returns The updated directory descriptor DTO
   */
  rename = (id: string, input: RenameDirectoryInput): Promise<DirectoryDescriptorDto> => {
    return this.restService.request<unknown, DirectoryDescriptorDto>({
      method: 'POST',
      url: `/api/file-management/directory-descriptor/${id}/rename`,
      body: input,
    });
  };
}
