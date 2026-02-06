/* eslint-disable @typescript-eslint/no-namespace */
/**
 * Setting Management Models
 * Translated from @abp/ng.setting-management v1.1.0
 */

import type { SettingTab } from '@abpjs/theme-shared';

// Re-export SettingTab from theme-shared
export type { SettingTab } from '@abpjs/theme-shared';

/**
 * Setting Management namespace containing types and interfaces
 * @since 1.1.0
 */
export namespace SettingManagement {
  /**
   * State interface for setting management
   * Tracks the currently selected setting tab
   */
  export interface State {
    selectedTab: SettingTab | null;
  }
}
