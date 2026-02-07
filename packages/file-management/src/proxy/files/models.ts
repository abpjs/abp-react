/**
 * File proxy models
 * @since v3.2.0
 *
 * Translated from @volo/abp.ng.file-management/lib/proxy/files/models
 */

import type { AuditedEntityDto } from '@abpjs/core';
import type { FileIconType } from './file-icon-type.enum';

/**
 * Input for creating a new file
 */
export interface CreateFileInput {
  /**
   * Directory ID where the file will be created (null for root)
   */
  directoryId?: string;
  /**
   * File name
   */
  name: string;
  /**
   * MIME type of the file
   */
  mimeType: string;
  /**
   * File content as byte array
   */
  content: number[];
}

/**
 * File descriptor DTO
 */
export interface FileDescriptorDto extends AuditedEntityDto<string> {
  /**
   * Directory ID containing the file (null for root)
   */
  directoryId?: string;
  /**
   * File name
   */
  name: string;
  /**
   * MIME type of the file
   */
  mimeType: string;
  /**
   * File size in bytes
   */
  size: number;
}

/**
 * File icon information
 */
export interface FileIconInfo {
  /**
   * Icon value (FontAwesome class or URL)
   */
  icon: string;
  /**
   * Type of icon
   */
  type: FileIconType;
}

/**
 * Pre-upload file information DTO
 */
export interface FileUploadPreInfoDto {
  /**
   * File name
   */
  fileName: string;
  /**
   * Whether a file with this name already exists
   */
  doesExist: boolean;
  /**
   * Whether the file name is valid
   */
  hasValidName: boolean;
}

/**
 * Pre-upload file information request
 */
export interface FileUploadPreInfoRequest {
  /**
   * Directory ID where the file will be uploaded (null for root)
   */
  directoryId?: string;
  /**
   * File name
   */
  fileName: string;
  /**
   * File size in bytes
   */
  size: number;
}

/**
 * Input for moving a file
 */
export interface MoveFileInput {
  /**
   * ID of the file to move
   */
  id: string;
  /**
   * New directory ID (null for root)
   */
  newDirectoryId?: string;
}

/**
 * Input for renaming a file
 */
export interface RenameFileInput {
  /**
   * New file name
   */
  name: string;
}
