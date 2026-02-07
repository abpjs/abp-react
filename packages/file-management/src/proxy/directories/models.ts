/**
 * Directory proxy models
 * @since v3.2.0
 *
 * Translated from @volo/abp.ng.file-management/lib/proxy/directories/models
 */

import type { AuditedEntityDto } from '@abpjs/core';
import type { FileIconInfo } from '../files/models';

/**
 * Input for creating a new directory
 */
export interface CreateDirectoryInput {
  /**
   * Parent directory ID (null for root)
   */
  parentId?: string;
  /**
   * Directory name
   */
  name: string;
}

/**
 * Directory content DTO (represents both files and directories)
 */
export interface DirectoryContentDto {
  /**
   * Name of the item
   */
  name: string;
  /**
   * Whether this item is a directory
   */
  isDirectory: boolean;
  /**
   * Item ID
   */
  id: string;
  /**
   * Size in bytes (0 for directories)
   */
  size: number;
  /**
   * Icon information
   */
  iconInfo: FileIconInfo;
}

/**
 * Input for requesting directory content
 */
export interface DirectoryContentRequestInput {
  /**
   * Filter string for searching
   */
  filter: string;
  /**
   * Sorting string (e.g., "name asc", "size desc")
   */
  sorting: string;
  /**
   * Directory ID (null for root)
   */
  id?: string;
}

/**
 * Directory descriptor DTO
 */
export interface DirectoryDescriptorDto extends AuditedEntityDto<string> {
  /**
   * Directory name
   */
  name: string;
  /**
   * Parent directory ID (null for root)
   */
  parentId?: string;
}

/**
 * Directory descriptor info DTO (for tree view)
 */
export interface DirectoryDescriptorInfoDto {
  /**
   * Directory ID
   */
  id: string;
  /**
   * Directory name
   */
  name: string;
  /**
   * Parent directory ID (null for root)
   */
  parentId?: string;
  /**
   * Whether this directory has children
   */
  hasChildren: boolean;
}

/**
 * Input for moving a directory
 */
export interface MoveDirectoryInput {
  /**
   * ID of the directory to move
   */
  id: string;
  /**
   * New parent directory ID (null for root)
   */
  newParentId?: string;
}

/**
 * Input for renaming a directory
 */
export interface RenameDirectoryInput {
  /**
   * New directory name
   */
  name: string;
}
