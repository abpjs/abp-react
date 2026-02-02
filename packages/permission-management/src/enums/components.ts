/**
 * Component keys for the Permission Management module.
 * These keys are used for component replacement/customization.
 * @since 2.7.0
 */
export const ePermissionManagementComponents = {
  /**
   * Key for the PermissionManagement component.
   * Use this to replace the default PermissionManagementModal with a custom implementation.
   */
  PermissionManagement: 'PermissionManagement.PermissionManagementComponent',
} as const;

/**
 * Type for permission management component key values
 */
export type PermissionManagementComponentKey =
  (typeof ePermissionManagementComponents)[keyof typeof ePermissionManagementComponents];
