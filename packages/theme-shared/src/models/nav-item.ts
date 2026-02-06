/**
 * Nav Item Model
 * Translated from @abp/ng.theme.shared/lib/models/nav-item.ts v3.1.0
 *
 * @since 3.0.0 - Added id property, changed permission to requiredPolicy
 * @since 3.1.0 - Changed from interface to class, added visible callback
 */

import type { ComponentType } from 'react';

/**
 * Navigation item properties interface.
 * @since 3.1.0
 */
export interface NavItemProps {
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
  /**
   * Callback to determine visibility of the nav item.
   * @since 3.1.0
   */
  visible?: () => boolean;
}

/**
 * Navigation item class.
 * @since 3.0.0 - Added id property, changed permission to requiredPolicy
 * @since 3.1.0 - Changed from interface to class, added visible callback
 */
export class NavItem implements NavItemProps {
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
  /**
   * Callback to determine visibility of the nav item.
   * @since 3.1.0
   */
  visible?: () => boolean;

  /**
   * Create a new NavItem.
   * @param props - Partial properties to initialize the nav item
   * @since 3.1.0
   */
  constructor(props: Partial<NavItemProps>) {
    this.id = props.id ?? '';
    this.component = props.component;
    this.html = props.html;
    this.action = props.action;
    this.order = props.order;
    this.requiredPolicy = props.requiredPolicy;
    this.visible = props.visible;
  }
}
