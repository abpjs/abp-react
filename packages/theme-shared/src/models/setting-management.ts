/**
 * Setting management models for theme-shared
 * Translated from @abp/ng.theme.shared v0.9.0
 */

/**
 * Represents a settings tab in the settings management UI.
 */
export interface SettingTab {
  /** Display name of the tab */
  name: string;
  /** Order/priority for tab sorting */
  order: number;
  /** Required policy to view this tab */
  requiredPolicy?: string;
  /** URL/route for this settings tab */
  url?: string;
}
