/**
 * Component keys for the Setting Management module.
 * These keys are used for component replacement/customization.
 * @since 2.7.0
 */
export const eSettingManagementComponents = {
  /**
   * Key for the SettingManagement component.
   * Use this to replace the default SettingLayout with a custom implementation.
   */
  SettingManagement: 'SettingManagement.SettingManagementComponent',
} as const;

/**
 * Type for setting management component key values
 */
export type SettingManagementComponentKey =
  (typeof eSettingManagementComponents)[keyof typeof eSettingManagementComponents];
