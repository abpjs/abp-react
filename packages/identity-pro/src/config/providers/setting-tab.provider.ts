/**
 * Identity Setting Tab Provider
 * Provides setting tab configuration for the Identity module.
 * @since 3.0.0
 */

import { type ComponentType } from 'react';
import { getSettingTabsService, type SettingTabsService } from '@abpjs/core';
import { eIdentitySettingTabNames } from '../enums/setting-tab-names';

/**
 * Identity setting tab configuration metadata.
 * This is the configuration used to create the setting tab.
 */
export interface IdentitySettingTabConfig {
  name: string;
  requiredPolicy: string;
  order: number;
}

/**
 * Default identity setting tab configuration metadata.
 * Contains the metadata for the Identity settings tab.
 */
export const IDENTITY_SETTING_TAB_CONFIG: IdentitySettingTabConfig = {
  name: eIdentitySettingTabNames.IdentityManagement,
  requiredPolicy: 'AbpIdentity.SettingManagement',
  order: 1,
};

/**
 * Placeholder component for identity settings.
 * In a full implementation, this would be replaced with the actual settings component.
 */
const IdentitySettingsPlaceholder: ComponentType<unknown> = () => null;

/**
 * Configures identity setting tabs using the provided SettingTabsService.
 * @param settingTabs - The SettingTabsService instance to configure tabs with
 * @param component - Optional component to render for the tab (defaults to placeholder)
 * @returns A function that adds identity setting tabs when called
 */
export function configureSettingTabs(
  settingTabs: SettingTabsService,
  component: ComponentType<unknown> = IdentitySettingsPlaceholder
): () => void {
  return () => {
    settingTabs.add([
      {
        name: IDENTITY_SETTING_TAB_CONFIG.name,
        requiredPolicy: IDENTITY_SETTING_TAB_CONFIG.requiredPolicy,
        order: IDENTITY_SETTING_TAB_CONFIG.order,
        component,
      },
    ]);
  };
}

/**
 * Initializes identity setting tabs using the global SettingTabsService.
 * Convenience function that uses the global SettingTabsService singleton.
 * @param component - Optional component to render for the tab
 * @returns A function that adds identity setting tabs when called
 */
export function initializeIdentitySettingTabs(
  component?: ComponentType<unknown>
): () => void {
  const settingTabs = getSettingTabsService();
  return configureSettingTabs(settingTabs, component);
}

/**
 * Identity setting tab providers object.
 * Can be used for DI-style configuration.
 */
export const IDENTITY_SETTING_TAB_PROVIDERS = {
  configureSettingTabs,
};
