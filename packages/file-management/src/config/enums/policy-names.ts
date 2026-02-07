/**
 * File Management policy names
 * @since v3.2.0
 *
 * Translated from @volo/abp.ng.file-management/config/enums/policy-names
 */

/**
 * Policy names for file management permissions
 */
export const eFileManagementPolicyNames = {
  /**
   * Base directory descriptor permission
   */
  DirectoryDescriptor: 'FileManagement.DirectoryDescriptor',
  /**
   * Create directory permission
   */
  DirectoryDescriptorCreate: 'FileManagement.DirectoryDescriptor.Create',
  /**
   * Delete directory permission
   */
  DirectoryDescriptorDelete: 'FileManagement.DirectoryDescriptor.Delete',
  /**
   * Update directory permission
   */
  DirectoryDescriptorUpdate: 'FileManagement.DirectoryDescriptor.Update',
  /**
   * Base file descriptor permission
   */
  FileDescriptor: 'FileManagement.FileDescriptor',
  /**
   * Create file permission
   */
  FileDescriptorCreate: 'FileManagement.FileDescriptor.Create',
  /**
   * Delete file permission
   */
  FileDescriptorDelete: 'FileManagement.FileDescriptor.Delete',
  /**
   * Update file permission
   */
  FileDescriptorUpdate: 'FileManagement.FileDescriptor.Update',
} as const;

export type eFileManagementPolicyNames =
  (typeof eFileManagementPolicyNames)[keyof typeof eFileManagementPolicyNames];
