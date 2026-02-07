/**
 * File Management route names
 * @since v3.2.0
 *
 * Translated from @volo/abp.ng.file-management/config/enums/route-names
 */

/**
 * Route names for file management module
 */
export const eFileManagementRouteNames = {
  /**
   * File management route name
   */
  FileManagement: 'FileManagement::Menu:FileManagement',
} as const;

export type eFileManagementRouteNames =
  (typeof eFileManagementRouteNames)[keyof typeof eFileManagementRouteNames];
