/**
 * Setting tab provider for Account module.
 * Provides setting tab configuration for the account settings.
 *
 * @since 3.0.0
 */
import { ABP, getSettingTabsService, SettingTabsService } from '@abpjs/core';
import { eAccountSettingTabNames } from '../enums/setting-tab-names';

/**
 * Options for configuring account setting tabs.
 * @since 3.0.0
 */
export interface AccountSettingTabOptions {
  /**
   * The component to render for the account settings tab.
   */
  component: ABP.Tab['component'];
}

/**
 * Configures the account module setting tabs.
 * Returns a function that adds the setting tabs to the SettingTabsService.
 *
 * @param settingTabs - The SettingTabsService instance to add tabs to
 * @param options - Configuration options including the component to render
 * @returns A function that adds the account setting tabs when called
 *
 * @example
 * ```typescript
 * import { AccountSettingsComponent } from './components/AccountSettings';
 *
 * const settingTabs = getSettingTabsService();
 * const addTabs = configureSettingTabs(settingTabs, {
 *   component: AccountSettingsComponent
 * });
 * addTabs();
 * ```
 */
export function configureSettingTabs(
  settingTabs: SettingTabsService,
  options: AccountSettingTabOptions
): () => void {
  return () => {
    settingTabs.add([
      {
        name: eAccountSettingTabNames.Account,
        order: 100,
        requiredPolicy: 'Volo.Account.SettingManagement',
        component: options.component,
      },
    ]);
  };
}

/**
 * Account setting tab providers configuration object.
 * Use this to configure account setting tabs in your application.
 *
 * @example
 * ```typescript
 * import { AccountSettingsComponent } from './components/AccountSettings';
 *
 * // In your app initialization:
 * const settingTabs = getSettingTabsService();
 * const addTabs = ACCOUNT_SETTING_TAB_PROVIDERS.configureSettingTabs(
 *   settingTabs,
 *   { component: AccountSettingsComponent }
 * );
 * addTabs();
 * ```
 */
export const ACCOUNT_SETTING_TAB_PROVIDERS = {
  configureSettingTabs,
};

// Re-export getSettingTabsService for convenience
export { getSettingTabsService };
