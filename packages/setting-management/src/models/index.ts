/* eslint-disable @typescript-eslint/no-namespace */
/**
 * Setting Management Models
 * Translated from @abp/ng.setting-management v3.0.0
 */

import type { ABP } from '@abpjs/core';
import type { ComponentType } from 'react';

/**
 * SettingTab interface - extends ABP.Tab with url support for backward compatibility
 *
 * In Angular v3.0.0, settings tabs use ABP.Tab which has a component property.
 * For backward compatibility, we extend it with an optional url property.
 *
 * @since 1.0.0
 * @updated 3.0.0 - Extended from ABP.Tab, component is now optional
 */
export interface SettingTab extends Omit<ABP.Tab, 'component'> {
  /** React component to render for this tab (from ABP.Tab) */
  component?: ComponentType<unknown>;
  /** URL/route for this settings tab (for URL-based navigation) */
  url?: string;
  /** Order/priority for tab sorting - default from Nav but made required for sorting */
  order: number;
}

/**
 * Setting Management namespace containing types and interfaces
 * @since 1.1.0
 * @updated 3.0.0 - Changed selectedTab type from SettingTab to ABP.Tab
 */
export namespace SettingManagement {
  /**
   * State interface for setting management
   * Tracks the currently selected setting tab
   * @since 3.0.0 - selectedTab is now optional (SettingTab | undefined)
   */
  export interface State {
    selectedTab?: SettingTab;
  }
}
