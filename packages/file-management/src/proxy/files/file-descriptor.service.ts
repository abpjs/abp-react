/**
 * File Descriptor Service (Proxy)
 * @since v3.2.0
 *
 * Translated from @volo/abp.ng.file-management/lib/proxy/files/file-descriptor.service
 */

import type { ListResultDto, RestService } from '@abpjs/core';
import type {
  CreateFileInput,
  FileDescriptorDto,
  FileUploadPreInfoDto,
  FileUploadPreInfoRequest,
  MoveFileInput,
  RenameFileInput,
} from './models';

/**
 * Service for managing file descriptors.
 *
 * @example
 * ```typescript
 * const service = new FileDescriptorService(restService);
 *
 * // Get a file by ID
 * const file = await service.get('file-id');
 *
 * // Get files in a directory
 * const files = await service.getList('directory-id');
 *
 * // Check file upload pre-info
 * const preInfo = await service.getPreInfo([{
 *   directoryId: 'dir-id',
 *   fileName: 'document.pdf',
 *   size: 1024,
 * }]);
 * ```
 */
export class FileDescriptorService {
  /**
   * The API name used for REST requests.
   */
  apiName = 'default';

  constructor(private restService: RestService) {}

  /**
   * Create a new file.
   * @param input - File creation input with name, content, and directory
   * @returns The created file descriptor DTO
   */
  create = (input: CreateFileInput): Promise<FileDescriptorDto> => {
    return this.restService.request<unknown, FileDescriptorDto>({
      method: 'POST',
      url: '/api/file-management/file-descriptor',
      body: input,
    });
  };

  /**
   * Delete a file by ID.
   * @param id - The ID of the file to delete
   */
  delete = (id: string): Promise<void> => {
    return this.restService.request<unknown, void>({
      method: 'DELETE',
      url: `/api/file-management/file-descriptor/${id}`,
    });
  };

  /**
   * Get a file descriptor by ID.
   * @param id - The ID of the file to retrieve
   * @returns The file descriptor DTO
   */
  get = (id: string): Promise<FileDescriptorDto> => {
    return this.restService.request<unknown, FileDescriptorDto>({
      method: 'GET',
      url: `/api/file-management/file-descriptor/${id}`,
    });
  };

  /**
   * Get file content by ID.
   * @param id - The ID of the file
   * @returns The file content as byte array
   */
  getContent = (id: string): Promise<number[]> => {
    return this.restService.request<unknown, number[]>({
      method: 'GET',
      url: `/api/file-management/file-descriptor/${id}/content`,
    });
  };

  /**
   * Get list of files in a directory.
   * @param directoryId - The directory ID (empty for root)
   * @returns List of file descriptors
   */
  getList = (directoryId: string): Promise<ListResultDto<FileDescriptorDto>> => {
    return this.restService.request<unknown, ListResultDto<FileDescriptorDto>>({
      method: 'GET',
      url: '/api/file-management/file-descriptor',
      params: directoryId ? { directoryId } : {},
    });
  };

  /**
   * Get pre-upload information for files.
   * @param input - Array of file upload info requests
   * @returns Array of pre-upload info DTOs
   */
  getPreInfo = (input: FileUploadPreInfoRequest[]): Promise<FileUploadPreInfoDto[]> => {
    return this.restService.request<unknown, FileUploadPreInfoDto[]>({
      method: 'POST',
      url: '/api/file-management/file-descriptor/pre-upload-info',
      body: input,
    });
  };

  /**
   * Move a file to a different directory.
   * @param input - Move input with file ID and new directory ID
   * @returns The updated file descriptor DTO
   */
  move = (input: MoveFileInput): Promise<FileDescriptorDto> => {
    return this.restService.request<unknown, FileDescriptorDto>({
      method: 'POST',
      url: `/api/file-management/file-descriptor/move`,
      body: input,
    });
  };

  /**
   * Rename a file.
   * @param id - The ID of the file to rename
   * @param input - Rename input with new name
   * @returns The updated file descriptor DTO
   */
  rename = (id: string, input: RenameFileInput): Promise<FileDescriptorDto> => {
    return this.restService.request<unknown, FileDescriptorDto>({
      method: 'POST',
      url: `/api/file-management/file-descriptor/${id}/rename`,
      body: input,
    });
  };
}
