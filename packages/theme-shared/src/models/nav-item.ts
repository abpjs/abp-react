/**
 * Nav Item Model
 * Translated from @abp/ng.theme.shared/lib/models/nav-item.ts v3.0.0
 *
 * @since 3.0.0 - Added id property, changed permission to requiredPolicy
 */

import type { ComponentType } from 'react';

/**
 * Navigation item configuration.
 * @since 3.0.0 - Added id property, changed permission to requiredPolicy
 */
export interface NavItem {
  /**
   * Unique identifier for the nav item.
   * @since 3.0.0
   */
  id: string | number;
  /**
   * React component to render for this nav item.
   */
  component?: ComponentType<any>;
  /**
   * Raw HTML string to render (use with caution for XSS).
   */
  html?: string;
  /**
   * Action to execute when the nav item is clicked.
   */
  action?: () => void;
  /**
   * Order for sorting nav items. Lower numbers appear first.
   */
  order?: number;
  /**
   * Required policy to show this nav item.
   * @since 3.0.0 - Renamed from permission
   */
  requiredPolicy?: string;
}
