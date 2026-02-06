/**
 * Setting tab name keys for the Account module config.
 * These keys are used for setting tab localization and identification.
 *
 * @since 3.0.0
 */
export const eAccountSettingTabNames = {
  /**
   * Account settings tab name key.
   */
  Account: 'AbpAccount::Menu:Account',
} as const;

/**
 * Type for account setting tab name key values
 */
export type AccountSettingTabNameKey =
  (typeof eAccountSettingTabNames)[keyof typeof eAccountSettingTabNames];
