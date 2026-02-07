/**
 * Manage profile tab name constants for the Account Pro module.
 * These are the localization keys used for manage profile tabs.
 * @since 3.2.0
 */
export const eAccountManageProfileTabNames = {
  /**
   * Profile picture tab name.
   */
  ProfilePicture: 'AbpAccount::ProfilePicture',

  /**
   * Change password tab name.
   */
  ChangePassword: 'AbpUi::ChangePassword',

  /**
   * Personal settings tab name.
   */
  PersonalSettings: 'AbpAccount::PersonalSettings',

  /**
   * Two-factor authentication tab name.
   */
  TwoFactor: 'AbpAccount::AccountSettingsTwoFactor',
} as const;

/**
 * Type for account manage profile tab name values
 */
export type AccountManageProfileTabName =
  (typeof eAccountManageProfileTabNames)[keyof typeof eAccountManageProfileTabNames];
