/**
 * File Management component keys for replacement/customization
 * @since v3.2.0
 *
 * Translated from @volo/abp.ng.file-management/lib/enums/components
 */

/**
 * Component keys for file management module
 */
export const eFileManagementComponents = {
  /**
   * Folder content component key
   */
  FolderContent: 'FileManagement.FolderContentComponent',
} as const;

export type eFileManagementComponents =
  (typeof eFileManagementComponents)[keyof typeof eFileManagementComponents];
