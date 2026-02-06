/**
 * Route name keys for the Setting Management module config.
 * These keys are used for route localization and identification.
 *
 * @since 3.0.0
 */
export const eSettingManagementRouteNames = {
  /**
   * Settings route name key.
   * Used for the main settings management route.
   */
  Settings: 'AbpSettingManagement::Settings',
} as const;

/**
 * Type for setting management route name key values
 */
export type SettingManagementRouteNameKey =
  (typeof eSettingManagementRouteNames)[keyof typeof eSettingManagementRouteNames];
