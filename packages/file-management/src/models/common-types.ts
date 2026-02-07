/**
 * Common types for file management
 * @since v3.2.0
 *
 * Translated from @volo/abp.ng.file-management/lib/models/common-types
 */

import type { DirectoryContentDto } from '../proxy/directories/models';

/**
 * Basic folder info (subset of DirectoryContentDto)
 */
export type FolderInfo = Pick<DirectoryContentDto, 'name' | 'id'>;

/**
 * Basic file info (same as FolderInfo)
 */
export type FileInfo = FolderInfo;
