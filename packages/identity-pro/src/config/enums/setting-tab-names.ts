/**
 * Identity Setting Tab Names
 * Setting tab names for the Identity module settings.
 * @since 3.0.0
 */

/**
 * Identity setting tab names enum.
 * Used for settings panel tab configuration.
 * @since 3.0.0
 */
export const eIdentitySettingTabNames = {
  IdentityManagement: 'AbpIdentity::Menu:IdentityManagement',
} as const;

/**
 * Type for identity setting tab name values
 */
export type IdentitySettingTabNameKey =
  (typeof eIdentitySettingTabNames)[keyof typeof eIdentitySettingTabNames];
